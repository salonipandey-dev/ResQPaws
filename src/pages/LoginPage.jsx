import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const result = login({ ...form, role });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(result.message || "Login successful.");
    const target = location.state?.from?.pathname || (role === "user" ? "/user" : "/ngo");
    setTimeout(() => navigate(target), 500);
  };

  return (
    <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Use registered account credentials to continue.</p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {[
          { label: "User", value: "user" },
          { label: "NGO / Volunteer", value: "ngo" }
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setRole(tab.value)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${role === tab.value ? "bg-white text-brand-700 shadow" : "text-slate-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <button type="submit" className="w-full rounded-lg bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700">Login</button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link className="text-brand-700 hover:underline" to="/forgot-password">Forgot password?</Link>
        <Link className="text-brand-700 hover:underline" to="/signup">Create account</Link>
      </div>
    </section>
  );
}
