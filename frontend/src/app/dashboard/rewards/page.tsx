"use client";
import { Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";
import { authApi, getApiErrorMessage, rewardsApi } from "@/services/api";
import { toast } from "sonner";

type Reward = {
  _id: string;
  points: number;
  reason: string;
};

const BADGES = ["First Report", "Quick Responder", "Reliable Reporter", "Community Support"];

export default function RewardsPage() {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    Promise.all([authApi.me(), rewardsApi.list()]).then(([meResp, rewardResp]) => {
      setPoints(meResp.data.user?.rescuePoints || 0);
      setRewards(rewardResp.data.data || []);
    }).catch((error) => {
      toast.error(getApiErrorMessage(error));
    });
  }, []);

  const progress = useMemo(() => Math.min(100, Math.round((points / 500) * 100)), [points]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-8 text-primary-foreground shadow-glow">
        <p className="text-sm opacity-90">Reward Points</p>
        <p className="font-display text-5xl font-extrabold mt-1">{points} <span className="text-2xl font-bold opacity-80">pts</span></p>
        <p className="mt-2 text-sm opacity-90">Earn points on verified rescue actions.</p>
        <Progress value={progress} className="mt-4 h-2 bg-white/20" />
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
        <p className="font-semibold flex items-center gap-2"><Gift className="h-4 w-4 text-primary" /> Latest rewards</p>
        <div className="mt-4 space-y-2 text-sm">
          {rewards.length === 0 && <p className="text-muted-foreground">No rewards earned yet.</p>}
          {rewards.slice(0, 5).map((reward) => (
            <div key={reward._id} className="rounded-lg border border-border p-3 flex justify-between">
              <span className="capitalize">{String(reward.reason).replaceAll("_", " ")}</span>
              <span className="font-semibold">+{reward.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
