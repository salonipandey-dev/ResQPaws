"use client";
import { motion, useInView } from "framer-motion";
import * as React from "react";

const STATS = [
  { value: 48230, suffix: "+", label: "Animals rescued" },
  { value: 12500, suffix: "+", label: "Active rescuers" },
  { value: 540, suffix: "+", label: "NGO partners" },
  { value: 8, suffix: " min", label: "Avg response time" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    let start = 0; const dur = 1400; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(start + (to - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export function Stats() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="rounded-3xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-8 md:p-12 text-primary-foreground shadow-glow relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm md:text-base text-white/85">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
