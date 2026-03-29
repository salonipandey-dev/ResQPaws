import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formOtp, setFormOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const maskedEmail = useMemo(() => email.replace(/(.{2}).+(@.+)/, "$1****$2"), [email]);

  const requestOtp = (event) => {
    event.preventDefault();
    setError("");

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setOtp(code);
    setStep(2);
    setSuccess(`Demo reset code generated for ${maskedEmail || email.trim().toLowerCase()}: ${code}`);
  };

  const reset = (event) => {
    event.preventDefault();
    setError("");

    if (formOtp !== otp) {
      setError("Invalid OTP.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = resetPassword(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess("Password reset successful. Redirecting to login.");
    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <section className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p className="mt-1 text-sm text-slate-600">Reset using your authorized registered email.</p>

      {step === 1 ? (
        <form className="mt-4 space-y-3" onSubmit={requestOtp}>
          <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full rounded-lg bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700" type="submit">Send Reset Code</button>
        </form>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={reset}>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="6-digit OTP" value={formOtp} onChange={(e) => setFormOtp(e.target.value)} required />
          <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <button className="w-full rounded-lg bg-brand-600 px-3 py-2 font-semibold text-white hover:bg-brand-700" type="submit">Reset Password</button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="mt-3 text-sm text-emerald-600">{success}</p> : null}
    </section>
  );
}
