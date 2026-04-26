"use client";
import { MapPin } from "lucide-react";
export default function NgoMap() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-semibold">Live map — Mumbai</p>
      <div className="mt-4 relative aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40">
        <div className="absolute inset-0 bg-grid opacity-20" />
        {[{x:30,y:40},{x:65,y:25},{x:50,y:60},{x:80,y:70},{x:18,y:75}].map((p,i)=>(
          <div key={i} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-60" /><span className="relative h-3 w-3 rounded-full bg-primary" /></span>
          </div>
        ))}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-xl border border-border p-3 text-xs flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" /> 5 active cases</div>
      </div>
    </div>
  );
}
