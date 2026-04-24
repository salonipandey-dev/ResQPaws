'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, AlertTriangle, Send, Heart, Shield, Zap, Users, Star, ArrowRight, PawPrint, MapPin, Clock, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import { IMAGES, TESTIMONIALS, NGOS } from '@/data/mockData';
import { useEffect, useState } from 'react';

function Counter({ end, suffix = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1500;
    const step = Math.max(1, Math.ceil(end / (dur / 16)));
    const t = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(t); }
      setN(start);
    }, 16);
    return () => clearInterval(t);
  }, [end]);
  return <span>{n}{suffix}</span>;
}

export default function LandingPage() {
  const [liveRescues, setLiveRescues] = useState(125);
  useEffect(() => {
    const t = setInterval(() => setLiveRescues((n) => n + (Math.random() > 0.6 ? 1 : 0)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-10 md:pt-16">
          <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center pb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-[#ff7a00] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-pulse" />
                24/7 Emergency Rescue Network
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Help <span className="text-gradient-orange">Injured Animals</span> Fast!
              </h1>
              <p className="mt-5 text-lg text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                Report stray animals in need instantly. A rescue volunteer reaches them in minutes — tracked live, end-to-end.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/report">
                  <button className="group flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-xl shadow-orange-500/30 hover:scale-105 transition">
                    <AlertTriangle className="w-4 h-4" /> Report Animal Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </Link>
                <Link href="/track">
                  <button className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 font-semibold hover:border-[#ff7a00] transition">
                    Track Existing Report
                  </button>
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[IMAGES.happyDog, IMAGES.bandana, IMAGES.volunteer].map((s, i) => (
                    <img key={i} src={s} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#ff7a00] text-[#ff7a00]" />)}</div>
                  <p className="text-xs text-neutral-500 mt-0.5">Loved by 12,000+ volunteers</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-500/20 animate-float">
                <img src={IMAGES.hero} alt="Rescue" className="w-full h-[460px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/50 to-transparent" />
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="absolute -bottom-5 -left-5 bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-xl w-56 border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 grid place-items-center">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Live Rescues</div>
                    <div className="text-xl font-bold text-[#ff7a00]">{liveRescues} today</div>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-neutral-800 rounded-2xl p-3 shadow-xl border border-neutral-100 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 grid place-items-center">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-500">Avg. Response</div>
                    <div className="text-sm font-bold">8 minutes</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FEATURE STEPS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-[#ff7a00] font-semibold text-sm tracking-widest uppercase">How it works</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3">Report a rescue in <span className="text-gradient-orange">3 simple steps</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: 'Click Photo', desc: 'Snap a clear photo or short video of the injured animal and its surroundings.' },
              { icon: AlertTriangle, title: 'Select Urgency', desc: 'Choose Low, Medium or Critical so rescuers prioritise correctly.' },
              { icon: Send, title: 'Submit Report', desc: 'Nearest verified NGO is notified instantly with live location.' }
            ].map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-neutral-700 shadow-[0_10px_40px_rgba(255,122,0,0.08)] hover:shadow-[0_20px_60px_rgba(255,122,0,0.2)] transition-all overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100/50 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative">
                  <div className="text-6xl font-extrabold text-orange-100 absolute top-0 right-0">0{i+1}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center shadow-lg shadow-orange-500/30 mb-5">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] p-10 md:p-14 shadow-2xl shadow-orange-500/30">
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
            <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/10" />
            <div className="relative grid md:grid-cols-3 gap-8 text-white">
              {[
                { v: 125, s: '+', l: 'Animals Rescued' },
                { v: 24, s: '/7', l: 'Emergency Response' },
                { v: 50, s: '+', l: 'NGOs Connected' }
              ].map((x, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center md:text-left">
                  <div className="text-5xl md:text-6xl font-extrabold"><Counter end={x.v} suffix={x.s} /></div>
                  <div className="mt-2 text-white/90 font-medium">{x.l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <img src={IMAGES.volunteer} alt="Volunteer" className="rounded-3xl shadow-2xl shadow-orange-500/20 w-full h-[480px] object-cover" />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-2xl w-56">
                <div className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Success rate</div>
                <div className="text-3xl font-bold text-gradient-orange">93.4%</div>
                <div className="mt-2 h-1.5 bg-neutral-100 rounded-full overflow-hidden"><div className="h-full w-[93%] bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f]" /></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#ff7a00] font-semibold text-sm tracking-widest uppercase">Why Choose Us</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">Built for <span className="text-gradient-orange">speed, trust and transparency</span></h2>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Lightning-Fast Dispatch', desc: 'Geo-routed to the nearest NGO with auto-priority scoring.' },
                  { icon: Shield, title: 'Verified Rescuers', desc: 'Every NGO on the network is ID-verified and track-rated.' },
                  { icon: Users, title: 'Community Powered', desc: 'Report, track and celebrate every rescue together.' },
                  { icon: Heart, title: 'End-to-End Tracking', desc: 'Follow each animal from report to full recovery.' }
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 bg-white/60 dark:bg-neutral-800/60 backdrop-blur p-4 rounded-2xl border border-white/60 dark:border-neutral-700">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#ff7a00] grid place-items-center shrink-0">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{f.title}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-14">
            <span className="text-[#ff7a00] font-semibold text-sm tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3">Loved by <span className="text-gradient-orange">rescue heroes</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl p-7 border border-white/60 dark:border-neutral-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#ff7a00] text-[#ff7a00]" />)}</div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5">“{t.text}”</p>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center text-xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NGO PARTNERS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-14">
            <span className="text-[#ff7a00] font-semibold text-sm tracking-widest uppercase">Our Partners</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3">Trusted <span className="text-gradient-orange">NGO network</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {NGOS.map((n) => (
              <div key={n.name} className="bg-white/80 dark:bg-neutral-800/60 backdrop-blur rounded-2xl p-5 border border-white/60 dark:border-neutral-700 text-center hover:shadow-xl hover:-translate-y-1 transition">
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-100 text-[#ff7a00] grid place-items-center mb-3"><PawPrint className="w-6 h-6" /></div>
                <div className="font-bold text-sm">{n.name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{n.city}</div>
                <div className="text-xs text-[#ff7a00] font-semibold mt-2">{n.rescues} rescues</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 bg-white border border-orange-100 shadow-2xl shadow-orange-500/10 text-center">
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-orange-100" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-amber-100" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-[#ff7a00] px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                <Phone className="w-3 h-3" /> Emergency Hotline Active
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">See an animal in distress?</h2>
              <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">Every second matters. Report now and a verified NGO will be dispatched within minutes.</p>
              <Link href="/report">
                <button className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-xl shadow-orange-500/30 hover:scale-105 transition">
                  <AlertTriangle className="w-5 h-5" /> Report an Emergency
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
