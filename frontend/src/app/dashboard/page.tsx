"use client";
import { motion } from "framer-motion";
import { Activity, Award, FilePlus2, MapPinned, PawPrint } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const KPIS = [
  { label: "Reports Submitted", value: 0, icon: FilePlus2 },
  { label: "Cases In Progress", value: 0, icon: Activity },
  { label: "Cases Resolved", value: 0, icon: PawPrint },
  { label: "Reward Points Earned", value: 0, icon: Award },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 md:p-8 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Dashboard</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-1">Your rescue activity will appear here.</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary" className="rounded-full"><Link href="/dashboard/report"><FilePlus2 className="h-4 w-4 mr-1" /> Report an Animal</Link></Button>
          <Button asChild size="sm" variant="ghost" className="rounded-full text-white hover:bg-white/15"><Link href="/dashboard/track"><MapPinned className="h-4 w-4 mr-1" /> Track My Report</Link></Button>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-5 hover:shadow-card transition">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><k.icon className="h-5 w-5" /></div>
            <p className="mt-4 font-display text-3xl font-bold">{k.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Recent activity</p>
          <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No reports yet. Submit your first rescue report to begin tracking activity.
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Progress</p>
          <p className="text-xs text-muted-foreground">Complete reports and follow-ups to earn points.</p>
          <Progress value={0} className="mt-4 h-2" />
        </div>
      </div>
    </div>
  );
}
