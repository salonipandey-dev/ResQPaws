import { createContext, useContext, useMemo, useState } from "react";
import {
  addRewards,
  createReport,
  getReports,
  getStatusFlow,
  getUserReward,
  updateReportStatus
} from "../services/storage";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [reports, setReports] = useState(getReports());

  const refreshReports = () => setReports(getReports());

  const submitReport = (payload) => {
    const report = createReport(payload);
    if (payload.createdBy?.email) {
      addRewards(payload.createdBy.email, 10);
    }
    refreshReports();
    return report;
  };

  const progressReport = (reportId) => {
    const flow = getStatusFlow();
    const report = reports.find((item) => item.id === reportId);
    if (!report) return null;

    const index = flow.indexOf(report.status);
    const nextStatus = flow[Math.min(index + 1, flow.length - 1)];
    const updated = updateReportStatus(reportId, nextStatus);
    refreshReports();
    return updated;
  };

  const getReward = (email) => getUserReward(email);

  const value = useMemo(
    () => ({ reports, submitReport, progressReport, refreshReports, getReward, statusFlow: getStatusFlow() }),
    [reports]
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
