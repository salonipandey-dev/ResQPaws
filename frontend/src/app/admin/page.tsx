"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, Building2, ShieldCheck, Users2 } from "lucide-react";

const K = [
  { l: "Total users", v: "12,540", i: Users2 },
  { l: "Active NGOs", v: "540", i: Building2 },
  { l: "Cases this month", v: "3,892", i: Activity },
  { l: "Trust score", v: "98.3%", i: ShieldCheck },
];
const P = [{ name: "Healed", v: 78 }, { name: "In progress", v: 14 }, { name: "Critical", v: 8 }];
const COLORS = ["hsl(var(--primary))", "hsl(38 92% 60%)", "hsl(var(--destructive))"];

export default function AdminOverview() {
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
        <p className="font-semibold">Outcome distribution</p>
        <div className="h-72 mt-4"><ResponsiveContainer>
          <PieChart><Pie data={P} dataKey="v" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>{P.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer></div>
      </div>
    </div>
  );
}
