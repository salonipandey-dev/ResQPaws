"use client";
import { motion } from "framer-motion";

const LOGOS = ["PawCare", "AnimalAid", "StreetVet", "FurFriends", "HopeShelter", "RescueOps", "WildHaven", "CityPaws"];

export function Partners() {
  return (
    <section className="py-14 border-y border-border bg-background">
      <div className="container">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Trusted by 540+ NGO partners</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {LOGOS.map((l, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-center h-12 rounded-xl bg-muted/40 text-muted-foreground font-display font-semibold tracking-tight hover:text-foreground hover:bg-muted transition"
            >
              {l}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
