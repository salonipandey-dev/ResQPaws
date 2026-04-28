"use client";
import { MapPin } from "lucide-react";

export default function NgoMap() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-semibold">Rescue coverage map</p>
      <div className="mt-4 relative aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-xl border border-border p-3 text-xs flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Live case locations appear here when active reports are available.
        </div>
      </div>
    </div>
  );
}
