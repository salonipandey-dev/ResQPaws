"use client";
import { Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const BADGES = ["First Report", "Quick Responder", "Reliable Reporter", "Community Support"];

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-8 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Reward Points</p>
        <p className="font-display text-5xl font-extrabold mt-1">0 <span className="text-2xl font-bold opacity-80">pts</span></p>
        <p className="mt-2 text-sm opacity-90">You will start earning after verified case updates.</p>
        <Progress value={0} className="mt-4 h-2 bg-white/20" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">Badge Journey</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((name) => (
            <div key={name} className="rounded-2xl border border-border bg-muted/30 text-muted-foreground p-4 text-center text-xs font-medium">
              {name}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Redeem rewards</p>
        <div className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          Reward redemption will unlock as partner programs are added.
        </div>
      </div>
    </div>
  );
}
