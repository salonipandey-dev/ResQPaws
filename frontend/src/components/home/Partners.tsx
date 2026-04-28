"use client";
import { motion } from "framer-motion";
import { homeContent } from "@/data/content";

export function Partners() {
  return (
    <section className="py-14 border-y border-border bg-background">
      <div className="container">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{homeContent.partnerHeading}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {homeContent.partnerCards.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center h-12 rounded-xl bg-muted/40 text-muted-foreground font-semibold hover:text-foreground hover:bg-muted transition"
            >
              {label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
