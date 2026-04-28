"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/data/content";

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 -z-10 gradient-warm" />
          <div className="absolute inset-0 -z-10 bg-grid opacity-[0.05]" />
          <PawPrint className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">{homeContent.cta.headline}</h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{homeContent.cta.subheadline}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full h-12 px-6 shadow-glow">
              <Link href="/login">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
