'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import ReportCard from '@/components/ReportCard';
import { REPORTS } from '@/data/mockData';
import { Activity, CheckCircle2, Clock3, Zap, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

const TABS = ['Dashboard', 'Active Cases', 'Completed', 'Analytics'];
const FILTERS = ['All', 'Urgent', 'Nearby Only', 'Completed'];

export default function NGOPage() {
  const [tab, setTab] = useState('Active Cases');
  const [filter, setFilter] = useState('All');

  let list = REPORTS;
  if (filter === 'Urgent') list = list.filter(r => r.severity === 'Critical');
  if (filter === 'Completed') list = list.filter(r => r.status === 'Rescued');

  const accept = (r) => toast.success(`Case #${r.id} accepted. Dispatching your team now.`);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-xs text-[#ff7a00] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-pulse" /> LIVE · Paws & Hearts Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">NGO <span className="text-gradient-orange">Command Center</span></h1>
          <p className="text-neutral-600 mt-1">Respond to nearby rescue requests and track your team’s impact.</p>
        </motion.div>

        <div className="mt-6 flex gap-1 p-1 bg-white/60 backdrop-blur rounded-full border border-white/60 w-fit overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${tab === t ? 'bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white shadow' : 'text-neutral-600'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-4 my-6">
          <StatCard icon={Activity} label="Today’s Cases" value={12} trend="8%" />
          <StatCard icon={CheckCircle2} label="Completed" value={8} trend="12%" />
          <StatCard icon={Clock3} label="Avg. Response" value="8m" />
          <StatCard icon={Zap} label="Response Rate" value="93%" trend="3%" />
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Incoming Cases</h2>
              <div className="flex gap-2 text-xs items-center">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-full font-semibold ${filter === f ? 'bg-[#ff7a00] text-white' : 'bg-white border border-neutral-200'}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {list.map(r => <ReportCard key={r.id} report={r} onAction={accept} actionLabel="Accept Case" />)}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white/80 backdrop-blur rounded-3xl p-5 border border-white/60 shadow-lg">
              <h3 className="font-bold mb-3">Team Status</h3>
              <div className="space-y-3">
                {[{n:'Ravi',s:'On rescue',c:'bg-amber-500'},{n:'Neha',s:'Available',c:'bg-emerald-500'},{n:'Arjun',s:'Available',c:'bg-emerald-500'},{n:'Dr. Priya',s:'At clinic',c:'bg-blue-500'}].map(t => (
                  <div key={t.n} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center text-white text-xs font-bold">{t.n[0]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{t.n}</div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${t.c}`}/>{t.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] text-white rounded-3xl p-5 shadow-xl shadow-orange-500/30">
              <div className="text-xs text-white/80">This month</div>
              <div className="text-4xl font-extrabold mt-1">98</div>
              <div className="text-sm">Animals rescued by your team</div>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-[82%] bg-white" /></div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
