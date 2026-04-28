"use client";
import { motion } from "framer-motion";
import { Camera, MapPinned, HeartHandshake, BellRing } from "lucide-react";

const STEPS = [
  { icon: Camera, title: "Report Clearly", desc: "Upload a photo and short description so responders can assess the situation." },
  { icon: BellRing, title: "Team Alert", desc: "Nearby NGOs and volunteers receive the case with location and severity context." },
  { icon: MapPinned, title: "Track Progress", desc: "Follow status updates from report received to in-progress and resolved." },
  { icon: HeartHandshake, title: "Support Recovery", desc: "Stay informed and continue supporting your local rescue community." },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">How it works</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">From report to rescue support in 4 clear steps.</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-card hover:-translate-y-1 transition-all"
            >
              <div className="absolute -top-3 left-6 h-7 w-7 grid place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-glow">{i + 1}</div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-4 group-hover:scale-110 transition">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
