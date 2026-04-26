"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import Link from "next/link";

const CASES = [
  { id: "#2391", animal: "Indie Dog", loc: "Andheri", sev: "Critical", status: "Dispatched", eta: "6 min" },
  { id: "#2390", animal: "Stray Cat", loc: "Powai", sev: "Serious", status: "In transit", eta: "12 min" },
  { id: "#2387", animal: "Puppy", loc: "Bandra", sev: "Stable", status: "At vet", eta: "—" },
  { id: "#2384", animal: "Crow", loc: "Versova", sev: "Minor", status: "Healed", eta: "—" },
];
const tone: Record<string,string> = { Critical: "bg-destructive/15 text-destructive", Serious: "bg-amber-500/15 text-amber-700 dark:text-amber-400", Stable: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", Minor: "bg-muted text-muted-foreground" };

export default function TrackPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by case ID, animal…" className="pl-9" /></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CASES.map(c => (
          <Link key={c.id} href="#" className="rounded-2xl border border-border bg-card p-5 hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{c.animal}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tone[c.sev]}`}>{c.sev}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.id}</p>
            <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 grid place-items-center text-primary"><MapPin className="h-8 w-8" /></div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">{c.loc}</span>
              <Badge variant="secondary">{c.status} • {c.eta}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
