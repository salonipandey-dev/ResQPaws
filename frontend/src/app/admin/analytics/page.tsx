"use client";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const A = Array.from({length:12}).map((_,i)=>({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], v: 200 + Math.round(Math.random()*400+i*30) }));
export default function AdminAnalytics() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-border bg-card p-6"><p className="font-semibold">Monthly rescues</p>
        <div className="h-72 mt-3"><ResponsiveContainer><BarChart data={A}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/><XAxis dataKey="m" fontSize={11} stroke="hsl(var(--muted-foreground))"/><YAxis fontSize={11} stroke="hsl(var(--muted-foreground))"/><Tooltip /><Bar dataKey="v" fill="hsl(var(--primary))" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6"><p className="font-semibold">Growth</p>
        <div className="h-72 mt-3"><ResponsiveContainer><LineChart data={A}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/><XAxis dataKey="m" fontSize={11} stroke="hsl(var(--muted-foreground))"/><YAxis fontSize={11} stroke="hsl(var(--muted-foreground))"/><Tooltip /><Line dataKey="v" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))" }} /></LineChart></ResponsiveContainer></div>
      </div>
    </div>
  );
}
