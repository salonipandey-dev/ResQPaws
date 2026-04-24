'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
import ReportCard from '@/components/ReportCard';
import StatCard from '@/components/StatCard';
import { REPORTS, USER } from '@/data/mockData';
import { FileText, CheckCircle2, Clock3, Activity, Bookmark, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = {
    total: REPORTS.length,
    rescued: REPORTS.filter(r => r.status === 'Rescued').length,
    pending: REPORTS.filter(r => r.status !== 'Rescued').length
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back, <span className="text-gradient-orange">{USER.name.split(' ')[0]}</span> 👋</h1>
            <p className="text-neutral-600 mt-1">Here’s what’s happening with your rescue reports today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile" className="px-4 py-2.5 rounded-full bg-white border border-neutral-200 text-sm font-medium flex items-center gap-2 hover:border-[#ff7a00]">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/" className="px-4 py-2.5 rounded-full bg-white border border-neutral-200 text-sm font-medium flex items-center gap-2 hover:border-[#ff7a00]">
              <LogOut className="w-4 h-4" /> Logout
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Reports" value={stats.total} trend="18%" />
          <StatCard icon={CheckCircle2} label="Rescued" value={stats.rescued} trend="22%" />
          <StatCard icon={Clock3} label="Pending" value={stats.pending} />
          <StatCard icon={Activity} label="Rescue Points" value={USER.points} trend="120" />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">My Reports</h2>
              <div className="flex gap-2 text-xs">
                {['All', 'Active', 'Completed'].map((t, i) => (
                  <button key={t} className={`px-3 py-1.5 rounded-full font-semibold ${i === 0 ? 'bg-[#ff7a00] text-white' : 'bg-white border border-neutral-200'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {REPORTS.map(r => <ReportCard key={r.id} report={r} onAction={() => {}} actionLabel="Track" />)}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] text-white rounded-3xl p-6 shadow-xl shadow-orange-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 grid place-items-center text-2xl">🏆</div>
                <div>
                  <div className="text-xs text-white/80">Your impact</div>
                  <div className="font-bold text-xl">Level 5 — Hero</div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-white" />
              </div>
              <p className="text-xs text-white/80 mt-2">{1240}/1600 pts to level 6</p>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl p-5 border border-white/60 shadow-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Bookmark className="w-4 h-4 text-[#ff7a00]" /> Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: '/track', label: 'Track Reports' },
                  { href: '/report', label: 'New Report' },
                  { href: '/ngo', label: 'Active Cases' },
                  { href: '/profile', label: 'My Profile' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 text-sm font-medium">
                    {l.label}<span className="text-[#ff7a00]">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-3xl p-5 border border-white/60 shadow-lg">
              <h3 className="font-bold mb-3">Active Cases</h3>
              <div className="space-y-3">
                {REPORTS.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">#{r.id} · {r.animal}</div>
                      <div className="text-[10px] text-neutral-500">{r.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
