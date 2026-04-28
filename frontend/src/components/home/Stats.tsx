"use client";
import { motion } from "framer-motion";
import { homeContent } from "@/data/content";

export function Stats() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-8 md:p-12 text-primary-foreground shadow-glow relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeContent.features.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/20 bg-white/10 p-4"
              >
                <p className="font-semibold text-base">{item.title}</p>
                <p className="mt-1 text-xs text-white/85">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
