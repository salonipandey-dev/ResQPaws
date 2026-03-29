import { useMemo, useState } from "react";
import StatusTimeline from "../components/StatusTimeline";
import UrgencyPill from "../components/UrgencyPill";
import { useData } from "../context/DataContext";

function matchFilter(report, filter) {
  if (filter === "all") return true;
  if (filter === "urgent") return ["urgent", "critical"].includes(report.urgency);
  if (filter === "completed") return ["rescued", "closed"].includes(report.status);
  if (filter === "nearby") return Boolean(report.location);
  return true;
}

export default function NgoDashboardPage() {
  const { reports, progressReport, statusFlow, loadingReports, reportsError } = useData();
  const [filter, setFilter] = useState("all");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");

  const visible = useMemo(() => reports.filter((report) => matchFilter(report, filter)), [reports, filter]);

  const handleProgress = async (report) => {
    setActionError("");
    setBusyId(report.id);
    const result = await progressReport(report.id);
    setBusyId("");

    if (!result.ok) {
      setActionError(result.message);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">NGO / Volunteer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Verify, accept, and progress cases in real-time.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "All Cases"],
            ["urgent", "Urgent"],
            ["nearby", "Nearby"],
            ["completed", "Completed"]
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${filter === key ? "bg-brand-600 text-white" : "border border-slate-300 text-slate-700"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loadingReports ? <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">Loading cases...</div> : null}
      {reportsError ? <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{reportsError}</div> : null}
      {actionError ? <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{actionError}</div> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((report) => (
          <article key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">{report.condition || "Rescue Case"}</h2>
              <UrgencyPill value={report.urgency} />
            </div>

            <p className="mt-1 text-sm text-slate-600">{report.id} | {report.location}</p>
            <p className="mt-2 text-sm text-slate-700">{report.details}</p>

            <div className="mt-3">
              <StatusTimeline statusFlow={statusFlow} status={report.status} />
            </div>

            <button
              type="button"
              onClick={() => handleProgress(report)}
              disabled={report.status === "closed" || busyId === report.id}
              className="mt-4 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {busyId === report.id ? "Updating..." : report.status === "closed" ? "Case Closed" : "Move To Next Stage"}
            </button>
          </article>
        ))}
      </div>

      {!loadingReports && visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">No cases match this filter.</div>
      ) : null}
    </section>
  );
}
