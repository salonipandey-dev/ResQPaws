'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import { USER, IMAGES } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Star, Heart, Zap, Medal, Share2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const share = (where) => toast.success(`Shared on ${where}!`);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] p-8 md:p-10 text-white shadow-2xl shadow-orange-500/30">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/10" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-white grid place-items-center shadow-xl overflow-hidden">
              <img src={IMAGES.happyDog} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-0.5 rounded-full text-xs font-semibold">
                <Medal className="w-3 h-3" /> Hero Volunteer
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{USER.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-white/90 text-sm"><Mail className="w-3 h-3" />{USER.email}</div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(USER.stars) ? 'fill-white text-white' : 'text-white/40'}`} />)}<span className="ml-1 text-sm font-bold">{USER.stars}</span></div>
                <div className="h-4 w-px bg-white/30" />
                <div className="text-sm"><span className="font-bold text-lg">{USER.points}</span> Rescue Points</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => share('LinkedIn')} className="px-4 py-2.5 rounded-full bg-white text-[#ff7a00] font-semibold text-sm flex items-center gap-2 shadow"><Share2 className="w-4 h-4" /> LinkedIn</button>
              <button onClick={() => share('WhatsApp')} className="px-4 py-2.5 rounded-full bg-white/20 border border-white/40 font-semibold text-sm flex items-center gap-2">WhatsApp</button>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <StatCard icon={Heart} label="Animals Helped" value={USER.helped} trend="4 this week" />
          <StatCard icon={Zap} label="Fast Reporter Badge" value="🥇 Gold" />
          <StatCard icon={Medal} label="Hero Volunteer" value="Level 5" />
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Badges Collected</h3>
            <div className="flex flex-wrap gap-3">
              {USER.badges.map((b) => (
                <div key={b} className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-[#ff7a00] font-semibold text-sm flex items-center gap-2">
                  <Medal className="w-4 h-4" /> {b}
                </div>
              ))}
              <div className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-400 font-semibold text-sm">+ 4 locked</div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold">Progress to Legend</span>
                <span className="text-[#ff7a00] font-bold">78%</span>
              </div>
              <div className="h-2 bg-orange-100 rounded-full overflow-hidden"><div className="h-full w-[78%] bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f]" /></div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { t: 'Reported stray puppy near HSR', time: '2h ago', pts: '+50' },
                { t: 'Rescued critical case RP-1019', time: 'Yesterday', pts: '+120' },
                { t: 'Earned Weekend Warrior badge', time: '2 days ago', pts: '+200' },
                { t: 'Reached Level 5 — Hero', time: '1 week ago', pts: '+300' }
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-neutral-100 last:border-0">
                  <div>
                    <div className="text-sm font-semibold">{a.t}</div>
                    <div className="text-xs text-neutral-500">{a.time}</div>
                  </div>
                  <span className="text-[#ff7a00] font-bold text-sm">{a.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
