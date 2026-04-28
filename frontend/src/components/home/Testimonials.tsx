"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { homeContent } from "@/data/content";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Community feedback</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">Real experiences from everyday responders.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {homeContent.testimonials.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-card transition"
            >
              <Quote className="h-7 w-7 text-primary/60" />
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">"{text}"</p>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-sm font-semibold">Community Member</p>
                <p className="text-xs text-muted-foreground">Verified submission</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
