"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { authApi, getApiErrorMessage } from "@/services/api";
import { saveToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showPw, setShowPw] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      setLoading(true);
      const { data } = await authApi.adminLogin({ email, password });
      if (data.user?.role !== "admin") {
        toast.error("Not an admin account.");
        return;
      }
      saveToken(data.token);
      toast.success("Welcome, admin");
      router.push("/admin");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-5">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to user sign in
        </Link>
        <div className="flex items-center gap-2"><Logo /><ThemeToggle /></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-center">Admin sign in</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Restricted area. Authorized personnel only.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required placeholder="admin@resqpaws.com" className="mt-1.5" autoComplete="username" />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input name="password" type={showPw ? "text" : "password"} required placeholder="••••••••" className="mt-1.5 pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full h-11">
              {loading ? "Signing in..." : "Sign in as admin"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Failed attempts are logged. Need access? Contact a system administrator.
          </p>
        </motion.div>
      </div>
    </main>
  );
}