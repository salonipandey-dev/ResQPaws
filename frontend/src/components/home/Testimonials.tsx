"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const T = [
  { name: "Aarav Mehta", role: "Volunteer, Mumbai", text: "I reported a hit-and-run pup at 2 AM. Within 11 minutes, two volunteers were there. The app is genuinely magic.", img: "https://i.pravatar.cc/120?img=12" },
  { name: "Priya Sharma", role: "Founder, PawCare NGO", text: "ResQPaws cut our case intake time by 70%. The AI severity scoring helps us triage like a hospital ER.", img: "https://i.pravatar.cc/120?img=47" },
  { name: "Rahul Iyer", role: "Vet, Bengaluru", text: "Beautiful product. The dashboard for vets is the cleanest medical UI I have ever used. Bravo.", img: "https://i.pravatar.cc/120?img=33" },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Loved by rescuers</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">Real stories. Real paws saved.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {T.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-card transition"
            >
              <Quote className="h-7 w-7 text-primary/60" />
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">“{t.text}”</p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                <img src={t.img} className="h-10 w-10 rounded-full object-cover" alt={t.name} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
