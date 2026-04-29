"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage, rescueApi } from "@/services/api";
import { toast } from "sonner";

type RescueCase = {
  _id: string;
  caseId: string;
  animalType: string;
  urgencyLevel: string;
  status: string;
  location?: { coordinates?: number[] };
};

const tone: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive",
  high: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  medium: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  low: "bg-muted text-muted-foreground",
};

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [cases, setCases] = useState<RescueCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rescueApi.history().then(({ data }) => {
      setCases(data.data || []);
    }).catch((error) => {
      toast.error(getApiErrorMessage(error));
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return cases;
    const q = query.toLowerCase();
    return cases.filter((item) => item.caseId?.toLowerCase().includes(q) || item.animalType?.toLowerCase().includes(q));
  }, [cases, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by case ID, animal..." className="pl-9" /></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="text-sm text-muted-foreground">Loading cases...</div>}
        {!loading && filtered.length === 0 && <div className="text-sm text-muted-foreground">No matching rescue reports found.</div>}
        {filtered.map((c) => (
          <div key={c._id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <p className="font-semibold capitalize">{c.animalType}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${tone[c.urgencyLevel] || tone.low}`}>{c.urgencyLevel}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.caseId || c._id}</p>
            <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 grid place-items-center text-primary"><MapPin className="h-8 w-8" /></div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">{c.location?.coordinates ? `${c.location.coordinates[1]}, ${c.location.coordinates[0]}` : "Location saved"}</span>
              <Badge variant="secondary">{c.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
