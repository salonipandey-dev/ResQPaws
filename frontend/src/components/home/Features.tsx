"use client";
import { motion } from "framer-motion";
import { Brain, Clock, Users, Shield, Map, Award } from "lucide-react";
import { homeContent } from "@/data/content";

const ICONS = [Brain, Clock, Users, Map, Shield, Award];

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Why choose us</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">Built for reliable rescue response.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {homeContent.features.map((f, i) => {
            const Icon = ICONS[i] || Brain;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-orange-400 text-primary-foreground grid place-items-center mb-4 shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
