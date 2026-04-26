"use client";
import { Award, Crown, Gift, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const BADGES = [
  { n: "First Rescue", earned: true, icon: Award },
  { n: "10 Saved", earned: true, icon: Trophy },
  { n: "Night Owl", earned: true, icon: Crown },
  { n: "50 Saved", earned: false, icon: Trophy },
  { n: "Vet Ally", earned: false, icon: Award },
  { n: "100 Saved", earned: false, icon: Crown },
];
const PERKS = [
  { p: "PetSmart — 20% off", c: 500 },
  { p: "Café Gato — Free coffee", c: 200 },
  { p: "VetCare — Free checkup", c: 1500 },
];
export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-8 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Karma balance</p>
        <p className="font-display text-5xl font-extrabold mt-1">2,410 <span className="text-2xl font-bold opacity-80">pts</span></p>
        <p className="mt-2 text-sm opacity-90">Rank #243 of 12,500 rescuers</p>
        <Progress value={65} className="mt-4 h-2 bg-white/20" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">Badges</p>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BADGES.map(b => (
            <div key={b.n} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${b.earned ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground opacity-60"}`}>
              <b.icon className="h-6 w-6" /><p className="text-[10px] font-medium text-center px-1">{b.n}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Redeem perks</p>
        <div className="mt-4 space-y-2">
          {PERKS.map(p => (
            <div key={p.p} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50">
              <p className="text-sm">{p.p}</p>
              <span className="text-sm font-semibold text-primary">{p.c} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
