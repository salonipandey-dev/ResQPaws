import { useMemo } from "react";
import { Link } from "react-router-dom";
import StatusTimeline from "../components/StatusTimeline";
import UrgencyPill from "../components/UrgencyPill";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export default function UserDashboardPage() {
  const { session } = useAuth();
  const { reports, statusFlow, getReward, loadingReports, reportsError } = useData();

  const myReports = useMemo(() => {
    if (!session?.email) return reports;
    return reports.filter((report) => report.createdBy?.email === session.email);
  }, [reports, session?.email]);

  const reward = getReward();
  const rescued = myReports.filter((r) => r.status === "rescued" || r.status === "closed").length;

  const shareText = encodeURIComponent(
    `I have contributed ${reward.reports} rescue reports on ResQPaws and earned ${reward.points} points (${reward.badge} badge).`
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">My Rescue Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Track progress across all stages from reported to closed.</p>
        </div>

        {loadingReports ? <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">Loading reports...</div> : null}
        {reportsError ? <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">{reportsError}</div> : null}

        {!loadingReports && myReports.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">No reports found yet.</div>
        ) : null}

        {myReports.map((report) => (
          <article key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">{report.condition || "Rescue Case"}</h2>
              <UrgencyPill value={report.urgency} />
            </div>
            <p className="mt-1 text-sm text-slate-600">ID: {report.id} | Location: {report.location}</p>
            <p className="mt-2 text-sm text-slate-700">{report.details}</p>
            <div className="mt-3">
              <StatusTimeline statusFlow={statusFlow} status={report.status} />
            </div>
          </article>
        ))}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-bold">My Stats</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>Total Reports: <strong>{myReports.length}</strong></p>
            <p>Rescued/Closed: <strong>{rescued}</strong></p>
            <p>Pending: <strong>{myReports.length - rescued}</strong></p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-bold">Rewards & Achievements</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>Points: <strong>{reward.points}</strong></p>
            <p>Reports: <strong>{reward.reports}</strong></p>
            <p>Badge: <strong>{reward.badge}</strong></p>
          </div>
          <div className="mt-4 space-y-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold hover:border-brand-500 hover:text-brand-700"
            >
              Share on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(decodeURIComponent(shareText))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:border-brand-500 hover:text-brand-700"
            >
              Copy LinkedIn Impact Text
            </button>
          </div>
        </div>

        <Link to="/report" className="block rounded-lg bg-brand-600 px-4 py-2 text-center font-semibold text-white hover:bg-brand-700">
          + Report New Animal
        </Link>
      </aside>
    </section>
  );
}
