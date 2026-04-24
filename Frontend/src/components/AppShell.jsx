import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ children }) {
  const { session, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-800">ResQ</span>
            <span className="text-brand-600">Paws</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium">
            <NavLink to="/" className="hover:text-brand-600">Home</NavLink>
            <NavLink to="/report" className="hover:text-brand-600">Report</NavLink>
            <NavLink to="/ngo" className="hover:text-brand-600">NGO Dashboard</NavLink>
            <NavLink to="/user" className="hover:text-brand-600">User Dashboard</NavLink>
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 hover:border-brand-500 hover:text-brand-700"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="rounded-lg bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
