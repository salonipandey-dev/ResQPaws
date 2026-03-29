import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createCaseApi, deleteCaseApi, fetchCasesApi, fetchRewardsApi, updateCaseApi, updateCaseStatusApi } from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

const STATUS_FLOW = ["reported", "verified", "accepted", "on_the_way", "rescued", "closed"];

function toUiUrgency(level) {
  if (level === "critical") return "critical";
  if (level === "high") return "urgent";
  return "regular";
}

function fromUiUrgency(level) {
  if (level === "critical") return "critical";
  if (level === "urgent") return "high";
  return "medium";
}

function normalizeCase(item) {
  const coordinates = item?.location?.coordinates || [];
  const lat = coordinates[1];
  const lng = coordinates[0];
  const reporterId =
    typeof item?.reportedBy === "string" ? item.reportedBy : item?.reportedBy?._id;

  return {
    id: item._id,
    createdAt: item.createdAt,
    status: item.status,
    urgency: toUiUrgency(item.urgencyLevel),
    condition: `${item.animalType || "Animal"} rescue case`,
    details: item.description,
    location: item.address || (lat && lng ? `${lat}, ${lng}` : item.city || "Unknown"),
    media: item.media || [],
    createdBy: {
      userId: reporterId || "",
      name: item.reportedBy?.name || "Reporter",
      email: item.reportedBy?.email || "",
      phone: item.contactPhone || "",
    },
    raw: item,
  };
}

function buildReward(session, reports, rewardEvents) {
  const ownReports = reports.filter((r) => r.createdBy?.email && r.createdBy.email === session?.email);
  const points = session?.rescuePoints || 0;
  const reportsCount = ownReports.length;
  const latestBadge = rewardEvents?.[0]?.badgeName || session?.badges?.[session.badges.length - 1]?.name || "Bronze";

  return {
    points,
    reports: reportsCount,
    badge: latestBadge,
  };
}

export function DataProvider({ children }) {
  const { token, session } = useAuth();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState("");
  const [rewardEvents, setRewardEvents] = useState([]);

  const refreshReports = async () => {
    if (!token) {
      setReports([]);
      return [];
    }

    setLoadingReports(true);
    setReportsError("");

    try {
      const result = await fetchCasesApi(token);
      const normalized = (result.data || []).map(normalizeCase);
      setReports(normalized);
      return normalized;
    } catch (error) {
      setReportsError(error.message || "Unable to load reports.");
      return [];
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    refreshReports();
  }, [token]);

  useEffect(() => {
    const loadRewards = async () => {
      if (!token || !session?.userId) {
        setRewardEvents([]);
        return;
      }

      try {
        const result = await fetchRewardsApi(token, session.userId);
        setRewardEvents(result.data || []);
      } catch {
        setRewardEvents([]);
      }
    };

    loadRewards();
  }, [token, session?.userId]);

  const submitReport = async (payload) => {
    if (!token) {
      return { ok: false, message: "Please log in before submitting a report." };
    }

    try {
      const result = await createCaseApi(token, {
        animalType: payload.animalType,
        description: payload.description,
        urgencyLevel: fromUiUrgency(payload.urgency),
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        city: payload.city,
        state: payload.state,
      });

      await refreshReports();
      return { ok: true, report: normalizeCase(result.data), raw: result.data };
    } catch (error) {
      return { ok: false, message: error.message || "Could not submit report." };
    }
  };

  const updateReport = async (reportId, payload) => {
    if (!token) {
      return { ok: false, message: "Please log in first." };
    }

    try {
      const result = await updateCaseApi(token, reportId, payload);
      await refreshReports();
      return { ok: true, report: normalizeCase(result.data) };
    } catch (error) {
      return { ok: false, message: error.message || "Unable to update case details." };
    }
  };

  const deleteReport = async (reportId) => {
    if (!token) {
      return { ok: false, message: "Please log in first." };
    }

    try {
      await deleteCaseApi(token, reportId);
      await refreshReports();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Unable to delete case." };
    }
  };

  const progressReport = async (reportId) => {
    if (!token) {
      return { ok: false, message: "Please log in first." };
    }

    const report = reports.find((item) => item.id === reportId);
    if (!report) {
      return { ok: false, message: "Report not found." };
    }

    const index = STATUS_FLOW.indexOf(report.status);
    const nextStatus = STATUS_FLOW[Math.min(index + 1, STATUS_FLOW.length - 1)];

    if (!nextStatus || nextStatus === report.status) {
      return { ok: false, message: "Case is already at final stage." };
    }

    try {
      await updateCaseStatusApi(token, reportId, {
        status: nextStatus,
        note: `Updated from dashboard to ${nextStatus}`,
      });
      await refreshReports();
      return { ok: true, nextStatus };
    } catch (error) {
      return { ok: false, message: error.message || "Unable to update case status." };
    }
  };

  const getReward = () => buildReward(session, reports, rewardEvents);

  const value = useMemo(
    () => ({
      reports,
      loadingReports,
      reportsError,
      submitReport,
      updateReport,
      deleteReport,
      progressReport,
      refreshReports,
      getReward,
      statusFlow: STATUS_FLOW,
    }),
    [reports, loadingReports, reportsError, session, rewardEvents]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
