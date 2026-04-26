"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const H = Array.from({length: 8}).map((_,i)=>({ id: `#23${20+i}`, a: ["Dog","Cat","Puppy","Cow","Crow"][i%5], l: ["Andheri","Bandra","Powai"][i%3], r: "Healed", d: `${i+1}d ago` }));
export default function NgoHistory() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5"><p className="font-semibold">Closed cases</p></div>
      <Table><TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Animal</TableHead><TableHead>Location</TableHead><TableHead>Result</TableHead><TableHead>Closed</TableHead></TableRow></TableHeader><TableBody>
        {H.map(r => <TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell>{r.a}</TableCell><TableCell>{r.l}</TableCell><TableCell><span className="text-emerald-600 text-sm">{r.r}</span></TableCell><TableCell className="text-muted-foreground">{r.d}</TableCell></TableRow>)}
      </TableBody></Table>
    </div>
  );
}
