import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { session } = useAuth();

  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        <div className="space-y-4">
          <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Emergency Animal Rescue Platform</p>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">Report injured or stray animals faster with coordinated response</h1>
          <p className="text-sm text-slate-600 md:text-base">
            ResQPaws connects citizens, NGOs, and volunteers with live reporting, status tracking, and AI-assisted guidance.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/report" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Report Emergency</Link>
            <Link to="/ngo" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:border-brand-500 hover:text-brand-700">NGO Dashboard</Link>
          </div>
          <p className="text-xs text-slate-500">Logged in as: {session ? `${session.name} (${session.role})` : "Not logged in"}</p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <h2 className="text-lg font-bold">Synopsis-Aligned Frontend Modules</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- Role-based auth UI (User, NGO, Volunteer)</li>
            <li>- Forgot/reset password flow</li>
            <li>- Rescue case reporting with media + location fields</li>
            <li>- AI severity + first-aid guidance panel</li>
            <li>- Lifecycle tracking: Reported to Closed</li>
            <li>- Rewards and impact sharing cards</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
