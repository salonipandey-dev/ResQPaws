"use client";
import { motion } from "framer-motion";
import { Activity, Award, FilePlus2, MapPinned, PawPrint, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const KPIS = [
  { label: "Reports filed", value: 42, icon: FilePlus2, trend: "+12%" },
  { label: "Active cases", value: 5, icon: Activity, trend: "–2%" },
  { label: "Lives saved", value: 31, icon: PawPrint, trend: "+18%" },
  { label: "Karma points", value: 2_410, icon: Award, trend: "+240" },
];

const CHART = [
  { d: "Mon", v: 4 }, { d: "Tue", v: 7 }, { d: "Wed", v: 5 }, { d: "Thu", v: 9 },
  { d: "Fri", v: 12 }, { d: "Sat", v: 8 }, { d: "Sun", v: 6 },
];

const ACTIVITY = [
  { t: "Case #2381", s: "Healed", d: "2h ago", c: "text-emerald-600" },
  { t: "Case #2389", s: "In transit", d: "5h ago", c: "text-amber-600" },
  { t: "New report", s: "Submitted", d: "yesterday", c: "text-primary" },
  { t: "Case #2375", s: "Closed", d: "2 days ago", c: "text-emerald-600" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 md:p-8 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Today</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">You’ve helped 31 paws find safety 🐕</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary" className="rounded-full"><Link href="/dashboard/report"><FilePlus2 className="h-4 w-4 mr-1" /> New report</Link></Button>
          <Button asChild size="sm" variant="ghost" className="rounded-full text-white hover:bg-white/15"><Link href="/dashboard/track"><MapPinned className="h-4 w-4 mr-1" /> Track cases</Link></Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 hover:shadow-card transition">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><k.icon className="h-5 w-5" /></div>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" />{k.trend}</span>
            </div>
            <p className="mt-4 font-display text-3xl font-bold">{k.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">Weekly rescues</p>
              <p className="text-xs text-muted-foreground">Cases reported in your network</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Recent activity</p>
          <div className="mt-4 space-y-3">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center"><PawPrint className="h-4 w-4" /></div>
                <div className="flex-1"><p className="text-sm font-medium">{a.t}</p><p className={`text-xs ${a.c}`}>{a.s}</p></div>
                <span className="text-xs text-muted-foreground">{a.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">Karma progress</p>
        <p className="text-xs text-muted-foreground">410 / 1000 to your next badge</p>
        <Progress value={41} className="mt-4 h-2" />
      </div>
    </div>
  );
}
