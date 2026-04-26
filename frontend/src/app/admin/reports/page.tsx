"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const R = Array.from({length:6}).map((_,i)=>({ id: `RPT-${1000+i}`, t: ["Spam","Fake report","Abuse","Other"][i%4], by: ["@aanya","@karan","@mira"][i%3], s: ["Open","Resolved"][i%2] }));
export default function AdminReports() {
  return (<div className="rounded-2xl border border-border bg-card overflow-hidden"><div className="p-5"><p className="font-semibold">Moderation reports</p></div>
    <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>By</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
      {R.map(r=><TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell>{r.t}</TableCell><TableCell>{r.by}</TableCell><TableCell><span className={r.s==="Open"?"text-amber-600":"text-emerald-600"}>{r.s}</span></TableCell></TableRow>)}
    </TableBody></Table></div>);
}
