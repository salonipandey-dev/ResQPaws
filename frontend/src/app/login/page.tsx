"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ArrowLeft, Building2, Eye, EyeOff, ShieldCheck, User, Users } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { authApi, getApiErrorMessage } from "@/services/api";
import { saveToken } from "@/lib/auth";

const ROLES = [
  { id: "user", label: "User", icon: User, route: "/dashboard" },
  { id: "ngo", label: "NGO", icon: Building2, route: "/ngo" },
  { id: "volunteer", label: "Volunteer", icon: Users, route: "/dashboard" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = ["bg-destructive", "bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-600"];
  return { score, label: labels[score], color: colors[score] };
}

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("login");
  const [role, setRole] = React.useState("user");
  const [loading, setLoading] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);

  const [regEmail, setRegEmail] = React.useState("");
  const [regPw, setRegPw] = React.useState("");

  const routeByRole = (r: string) => ROLES.find((x) => x.id === r)?.route || "/dashboard";
  const emailValid = !regEmail || EMAIL_RE.test(regEmail);
  const strength = getPasswordStrength(regPw);
  const passwordOk = strength.score >= 4;

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      setLoading(true);
      const { data } = await authApi.login({ email, password });
      if (data.user?.role === "admin") {
        toast.error("Use the admin sign-in page for admin accounts.");
        return;
      }
      saveToken(data.token);
      toast.success("Welcome back!");
      router.push(routeByRole(data.user?.role || role));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValid) return toast.error("Please enter a valid email.");
    if (!passwordOk) return toast.error("Use 8+ chars with upper, lower, number and symbol.");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      setLoading(true);
      const normalizedRole = role === "volunteer" ? "user" : role;
      const { data } = await authApi.register({
        name,
        email,
        password,
        role: normalizedRole as "user" | "ngo",
      });
      saveToken(data.token);
      toast.success("Account created. Welcome aboard!");
      router.push(routeByRole(data.user?.role || role));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-3">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 grid lg:grid-cols-12 items-center gap-8 px-6 pb-10 md:px-10">
        {/* Form column */}
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border bg-card/80 backdrop-blur shadow-xl p-6 sm:p-8">
              {/* Heading */}
              <div className="text-center">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {mode === "login" ? "Sign in to save more lives today." : "Join the rescue community in 30 seconds."}
                </p>
              </div>

              {/* Mode switcher */}
              <div className="mt-6 grid grid-cols-2 rounded-full bg-muted p-1 text-sm">
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`relative h-9 rounded-full font-medium transition-colors ${
                      mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="auth-mode-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative">{m === "login" ? "Sign in" : "Register"}</span>
                  </button>
                ))}
              </div>

              {/* Role selector */}
              <div className="mt-5">
                <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">I am a</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`rounded-xl border px-2 py-3 text-xs font-medium transition ${
                        role === r.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <r.icon className="h-4 w-4 mx-auto mb-1" />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forms */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {mode === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={onLogin}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="li-email">Email</Label>
                        <Input id="li-email" name="email" type="email" placeholder="you@email.com" required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="li-pw">Password</Label>
                        <div className="relative mt-1.5">
                          <Input
                            id="li-pw"
                            name="password"
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <label className="inline-flex items-center gap-2 text-muted-foreground">
                          <input type="checkbox" className="accent-primary" /> Remember me
                        </label>
                        <Link href="/forgot-password" className="text-primary hover:underline">
                          Forgot?
                        </Link>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full">
                        {loading ? "Signing in..." : "Sign in"}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={onRegister}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="rg-name">Full name</Label>
                        <Input id="rg-name" name="name" placeholder="Jane Doe" required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="rg-email">Email</Label>
                        <Input
                          id="rg-email"
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                          required
                          className="mt-1.5"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          aria-invalid={!emailValid}
                        />
                        {!emailValid && <p className="text-xs text-destructive mt-1">Enter a valid email address.</p>}
                      </div>
                      <div>
                        <Label htmlFor="rg-pw">Password</Label>
                        <div className="relative mt-1.5">
                          <Input
                            id="rg-pw"
                            name="password"
                            type={showPw ? "text" : "password"}
                            placeholder="At least 8 characters"
                            required
                            minLength={8}
                            value={regPw}
                            onChange={(e) => setRegPw(e.target.value)}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {regPw && (
                          <div className="mt-2">
                            <div className="flex gap-1">
                              {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-colors ${
                                    i < strength.score ? strength.color : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Strength: <span className="font-medium text-foreground">{strength.label}</span>
                            </p>
                          </div>
                        )}
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          Use 8+ chars with upper, lower, a number and a symbol.
                        </p>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full h-11 rounded-full">
                        {loading ? "Creating account..." : "Create account"}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Protected by industry-grade encryption.</span>
                <Link href="/admin-login" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ShieldCheck className="h-3 w-3" /> Admin sign in
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image column - smaller, hidden below lg */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border"
          >
            <Image
              src="https://images.pexels.com/photos/4083266/pexels-photo-4083266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900"
              alt="Rescued puppy"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 0vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 text-white">
              <p className="font-display text-lg sm:text-xl font-semibold leading-snug">
                "Reporting took 30 seconds. Saving Bruno took the rest of my life."
              </p>
              <p className="mt-2 text-xs text-white/80">— Mira, Volunteer Rescuer</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}