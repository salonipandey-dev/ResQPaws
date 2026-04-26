"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const R = [
  { id: "#2391", a: "Indie Dog", l: "Andheri W", s: "Critical", t: "2m ago" },
  { id: "#2390", a: "Stray Cat", l: "Powai", s: "Serious", t: "15m ago" },
  { id: "#2389", a: "Crow", l: "Versova", s: "Minor", t: "31m ago" },
  { id: "#2386", a: "Cow", l: "Goregaon", s: "Stable", t: "1h ago" },
  { id: "#2384", a: "Puppy", l: "Bandra", s: "Critical", t: "2h ago" },
];
export default function NgoCases() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 flex items-center justify-between">
        <p className="font-semibold">Active cases</p>
        <Button size="sm" className="rounded-full">Assign rescuer</Button>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Animal</TableHead><TableHead>Location</TableHead><TableHead>Severity</TableHead><TableHead>Reported</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>{R.map(r => (
          <TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell className="font-medium">{r.a}</TableCell><TableCell>{r.l}</TableCell><TableCell><Badge variant={r.s==="Critical"?"destructive":"secondary"}>{r.s}</Badge></TableCell><TableCell className="text-muted-foreground">{r.t}</TableCell><TableCell><Button size="sm" variant="ghost" className="rounded-full">View</Button></TableCell></TableRow>
        ))}</TableBody>
      </Table>
    </div>
  );
}
