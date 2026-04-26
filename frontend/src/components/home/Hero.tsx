"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://images.pexels.com/photos/7474353/pexels-photo-7474353.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-warm" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.06] mask-fade-b" />
      <div className="container pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              24/7 Emergency Rescue Network
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.05]">
              Help <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">injured animals</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"><path d="M2 9C66 3 134 3 298 9" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/></svg>
              </span> fast.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-balance">
              Spot a wounded paw? Snap a photo. Our AI dispatches the nearest NGO, vet or volunteer in minutes — every second counts.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full text-base h-12 px-6 shadow-glow">
                <Link href="/dashboard/report">Report Animal Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-base h-12 px-6 border-foreground/15">
                <Link href="/dashboard/track">Track Existing Report</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-9 w-9 rounded-full ring-2 ring-background overflow-hidden">
                    <img src={`https://i.pravatar.cc/80?img=${i+10}`} alt="rescuer" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  <span className="ml-1 text-sm font-semibold">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Trusted by 12,000+ rescuers across 40+ cities</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[5/6] rounded-[2rem] overflow-hidden shadow-card ring-1 ring-border">
              <Image src={HERO_IMG} alt="Volunteer holding a rescued dog" fill priority className="object-cover" sizes="(min-width:1024px) 600px, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-10 sm:-left-8 sm:top-16 bg-card/95 backdrop-blur-xl rounded-2xl shadow-card border border-border p-4 w-56"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center text-primary">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg response</p>
                  <p className="text-xl font-bold">8 min</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 bottom-12 sm:-right-8 sm:bottom-16 bg-card/95 backdrop-blur-xl rounded-2xl shadow-card border border-border p-4 w-60"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-emerald-500/15 grid place-items-center text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Live rescues today</p>
                  <p className="text-xl font-bold">127 <span className="text-xs font-medium text-emerald-600">↑ 12%</span></p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute right-4 top-4 bg-card/95 backdrop-blur-xl rounded-full pl-2 pr-3 py-1.5 border border-border shadow-soft flex items-center gap-2"
            >
              <span className="flex h-2 w-2"><span className="animate-ping absolute h-2 w-2 rounded-full bg-primary opacity-75" /><span className="relative h-2 w-2 rounded-full bg-primary" /></span>
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Mumbai • 3 active</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
