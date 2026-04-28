"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Stethoscope, Siren } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { emergencyContent } from "@/data/content";

export function EmergencyModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const iconMap = [Siren, Phone, Stethoscope, MapPin];
  const toneMap = [
    "bg-destructive text-destructive-foreground",
    "bg-primary text-primary-foreground",
    "bg-emerald-500 text-white",
    "bg-amber-500 text-white",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-glow">
        <div className="bg-gradient-to-br from-destructive/15 via-orange-100/50 to-transparent dark:from-destructive/30 dark:via-orange-900/30 p-6 border-b border-border">
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-2xl bg-destructive text-destructive-foreground grid place-items-center shadow-glow relative">
              <Siren className="h-7 w-7" />
              <span className="absolute inset-0 rounded-2xl bg-destructive/40 animate-pulse-ring" />
            </div>
            <DialogTitle className="text-center text-2xl font-display">{emergencyContent.title}</DialogTitle>
            <DialogDescription className="text-center">{emergencyContent.subtitle}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-3">
          {emergencyContent.items.map((it, i) => {
            const Icon = iconMap[i] || Siren;
            return (
              <motion.div key={it.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={it.href} onClick={() => onOpenChange(false)} className="group block rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-card transition-all">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center ${toneMap[i] || toneMap[0]} shadow-soft`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-semibold">{it.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{it.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="px-5 pb-5">
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
