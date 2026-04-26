"use client";
import { Activity, ListChecks, ShieldCheck, Users2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const K = [
  { l: "Active cases", v: "23", i: ListChecks },
  { l: "Volunteers", v: "148", i: Users2 },
  { l: "Healed today", v: "12", i: ShieldCheck },
  { l: "Response avg", v: "7m", i: Activity },
];
const D = Array.from({ length: 14 }).map((_, i) => ({ d: i+1, v: 4 + Math.round(Math.sin(i)*4 + Math.random()*5) }));

export default function NgoOverview() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {K.map(k => (
          <div key={k.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><k.i className="h-5 w-5" /></div>
            <p className="mt-4 font-display text-3xl font-bold">{k.v}</p>
            <p className="text-xs text-muted-foreground">{k.l}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">Cases over last 14 days</p>
        <div className="h-72 mt-4">
          <ResponsiveContainer>
            <AreaChart data={D}>
              <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
