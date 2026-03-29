import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initial = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
  confirmPassword: ""
};

export default function SignupPage() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await signup({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      password: form.password,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess("Account created successfully.");
    const role = result.session?.role;
    setTimeout(() => navigate(role === "citizen" ? "/user" : "/ngo"), 500);
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <p className="mt-1 text-sm text-slate-600">Register as User, NGO, or Volunteer.</p>

      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input type="email" className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
          <option value="user">User</option>
          <option value="ngo">NGO</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <input type="password" className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        <input type="password" className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} required />

        <div className="md:col-span-2">
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
        </div>

        <button
          className="md:col-span-2 rounded-lg bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </section>
  );
}
