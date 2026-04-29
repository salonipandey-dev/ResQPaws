"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function LoginPage() {
  const [role, setRole] = React.useState("user");
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const [loadingRegister, setLoadingRegister] = React.useState(false);
  const [showLoginPw, setShowLoginPw] = React.useState(false);
  const [showRegPw, setShowRegPw] = React.useState(false);

  const [regEmail, setRegEmail] = React.useState("");
  const [regPw, setRegPw] = React.useState("");
  const router = useRouter();

  const routeByRole = (roleValue: string) => ROLES.find((r) => r.id === roleValue)?.route || "/dashboard";
  const emailValid = !regEmail || EMAIL_RE.test(regEmail);
  const strength = getPasswordStrength(regPw);
  const passwordOk = strength.score >= 4;

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      setLoadingLogin(true);
      const { data } = await authApi.login({ email, password });
      if (data.user?.role === "admin") {
        toast.error("Use the admin sign-in page for admin accounts.");
        return;
      }
      saveToken(data.token);
      toast.success("Login successful");
      router.push(routeByRole(data.user?.role || role));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingLogin(false);
    }
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValid) return toast.error("Please enter a valid email.");
    if (!passwordOk) return toast.error("Password must include upper, lower, number, symbol and 8+ chars.");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    try {
      setLoadingRegister(true);
      const normalizedRole = role === "volunteer" ? "user" : role;
      const { data } = await authApi.register({
        name,
        email,
        password,
        role: normalizedRole as "user" | "ngo",
      });
      saveToken(data.token);
      toast.success("Account created successfully");
      router.push(routeByRole(data.user?.role || role));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2"><Logo /><ThemeToggle /></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-muted-foreground">Sign in to save more lives today.</p>

            <div className="mt-6">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">I am a</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`group rounded-xl border p-3 text-xs font-medium transition ${role === r.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"}`}
                  >
                    <r.icon className="h-4 w-4 mx-auto mb-1" />
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="login" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
                <TabsTrigger value="login" className="rounded-full">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-full">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-5">
                <form onSubmit={onLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" placeholder="you@email.com" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input name="password" type={showLoginPw ? "text" : "password"} placeholder="••••••••" required className="mt-1.5 pr-10" />
                      <button type="button" onClick={() => setShowLoginPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Remember me</label>
                    <Link href="/forgot-password" className="text-primary hover:underline">Forgot?</Link>
                  </div>
                  <Button type="submit" disabled={loadingLogin} className="w-full rounded-full h-11 shadow-glow">
                    {loadingLogin ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-5">
                <form onSubmit={onRegister} className="space-y-4">
                  <div>
                    <Label>Full name</Label>
                    <Input name="name" placeholder="Jane Doe" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
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
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showRegPw ? "text" : "password"}
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                        value={regPw}
                        onChange={(e) => setRegPw(e.target.value)}
                        className="mt-1.5 pr-10"
                      />
                      <button type="button" onClick={() => setShowRegPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showRegPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {regPw && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : "bg-muted"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Strength: <span className="font-medium text-foreground">{strength.label}</span></p>
                      </div>
                    )}
                    <p className="mt-1.5 text-xs text-muted-foreground">Use 8+ characters with uppercase, lowercase, a number and a symbol.</p>
                  </div>
                  <Button type="submit" disabled={loadingRegister} className="w-full rounded-full h-11 shadow-glow">
                    {loadingRegister ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>Protected by industry-grade encryption.</span>
              <Link href="/admin-login" className="inline-flex items-center gap-1 text-primary hover:underline">
                <ShieldCheck className="h-3 w-3" /> Admin sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden bg-secondary">
        <Image src="https://images.pexels.com/photos/4083266/pexels-photo-4083266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900" alt="Rescued puppy" fill priority className="object-cover" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-10 text-white">
          <p className="font-display text-4xl font-bold leading-tight max-w-md">"Reporting took 30 seconds. Saving Bruno took the rest of my life."</p>
          <p className="mt-3 text-white/80">- Mira, Volunteer Rescuer</p>
        </div>
      </div>
    </main>
  );
}