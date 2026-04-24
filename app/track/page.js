'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';
import { REPORTS } from '@/data/mockData';
import StatusTracker from '@/components/StatusTracker';
import SeverityBadge from '@/components/SeverityBadge';

const TIMELINE = ['Reported', 'Verified', 'NGO Accepted', 'On the Way', 'Rescued'];

export default function TrackPage() {
  const [query, setQuery] = useState('RP-1021');
  const [result, setResult] = useState(REPORTS[0]);

  const search = (e) => {
    e.preventDefault();
    const found = REPORTS.find(r => r.id.toLowerCase() === query.toLowerCase()) || REPORTS[0];
    setResult(found);
  };

  const idx = TIMELINE.indexOf(result.status);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold">Track a <span className="text-gradient-orange">Rescue Report</span></h1>
          <p className="text-neutral-600 mt-2">Enter a Report ID or mobile number to see live status.</p>
        </motion.div>

        <form onSubmit={search} className="max-w-2xl mx-auto flex gap-2 bg-white rounded-full border border-orange-200 shadow-xl shadow-orange-500/10 p-2">
          <div className="flex items-center gap-2 flex-1 px-4">
            <Search className="w-4 h-4 text-neutral-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="RP-XXXX or mobile" className="flex-1 py-3 bg-transparent text-sm outline-none" />
          </div>
          <button className="px-6 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-lg shadow-orange-500/30">Track</button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 grid md:grid-cols-[1.2fr_1fr] gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-[0_10px_40px_rgba(255,122,0,0.08)]">
              <div className="relative h-56">
                <img src={result.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3"><SeverityBadge level={result.severity} /></div>
                <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#ff7a00]">#{result.id}</div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold">{result.animal} • {result.location}</h2>
                <p className="text-sm text-neutral-600 mt-2">{result.description}</p>
                <div className="mt-5 space-y-4">
                  {TIMELINE.map((s, i) => {
                    const done = i <= idx;
                    return (
                      <div key={s} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${done ? 'bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] text-white' : 'bg-neutral-100 text-neutral-400'} ${i === idx ? 'ring-4 ring-orange-200 animate-pulse' : ''}`}>{i+1}</div>
                        <div className="flex-1">
                          <div className={`font-semibold ${done ? '' : 'text-neutral-400'}`}>{s}</div>
                          <div className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {done ? `${(idx-i)*18 + 4} min ago` : 'Pending'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur rounded-3xl p-5 border border-white/60 shadow-lg">
                <h3 className="font-bold mb-3">Live Map</h3>
                <div className="rounded-2xl h-64 bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 30% 40%, #ff7a00 1px, transparent 2px), radial-gradient(circle at 70% 70%, #ff9a2f 1px, transparent 2px)', backgroundSize: '20px 20px'}} />
                  <motion.div animate={{ x: [0, 100, 60, 40, 0], y: [0, 40, 80, 60, 0] }} transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-16 left-10 w-10 h-10 rounded-full bg-[#ff7a00] grid place-items-center shadow-xl shadow-orange-500/40">
                    🚑
                  </motion.div>
                  <div className="absolute bottom-6 right-8 w-10 h-10 rounded-full bg-red-500 grid place-items-center animate-pulse shadow-xl">🐶</div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur rounded-xl p-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold"><MapPin className="w-3 h-3 text-[#ff7a00]" />{result.location}</span>
                      <span className="text-emerald-600 font-semibold">2.3 km · 6 min</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] text-white rounded-3xl p-5 shadow-xl">
                <div className="text-xs text-white/80">Rescuer assigned</div>
                <div className="text-lg font-bold">Ravi Kumar · Paws & Hearts</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-white/80">ETA</div>
                  <div className="font-bold">6 minutes</div>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-full bg-white text-[#ff7a00] font-semibold flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call Rescuer</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
