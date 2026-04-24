'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import { ANALYTICS } from '@/data/mockData';
import { Users, Building2, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs text-[#ff7a00] font-semibold tracking-widest uppercase">Admin Analytics</div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Platform <span className="text-gradient-orange">Performance</span></h1>
          <p className="text-neutral-600 mt-1">Real-time overview of rescues, NGOs and response metrics.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 my-8">
          <StatCard icon={Users} label="Total Users" value="12,484" trend="8%" />
          <StatCard icon={Building2} label="NGOs" value="52" trend="2 new" />
          <StatCard icon={TrendingUp} label="Success Rate" value="93.4%" trend="1.2%" />
          <StatCard icon={Clock} label="Avg Response" value="8m 12s" />
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-[0_10px_40px_rgba(255,122,0,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Rescue Reports per Day</h3>
              <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff7a00]" /> Reports</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff9a2f]" /> Rescued</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ANALYTICS.perDay}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7a00" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#ff7a00" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9a2f" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ff9a2f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ffedd5' }} />
                <Area type="monotone" dataKey="reports" stroke="#ff7a00" fill="url(#g1)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="rescued" stroke="#ff9a2f" fill="url(#g2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Critical Cases</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ANALYTICS.severity} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {ANALYTICS.severity.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-lg">
            <h3 className="font-bold text-lg mb-4">NGO Performance</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ANALYTICS.ngoPerf} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={110} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="success" fill="#ff7a00" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border border-white/60 shadow-lg">
            <h3 className="font-bold text-lg mb-4">City Heatmap</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 49 }).map((_, i) => {
                const v = Math.random();
                const intensity = v > 0.85 ? 'bg-red-500' : v > 0.7 ? 'bg-[#ff7a00]' : v > 0.5 ? 'bg-[#ff9a2f]' : v > 0.3 ? 'bg-orange-200' : 'bg-orange-50';
                return <div key={i} className={`aspect-square rounded-md ${intensity} hover:scale-110 transition`} />;
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>Low activity</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-orange-50"/>
                <div className="w-3 h-3 rounded bg-orange-200"/>
                <div className="w-3 h-3 rounded bg-[#ff9a2f]"/>
                <div className="w-3 h-3 rounded bg-[#ff7a00]"/>
                <div className="w-3 h-3 rounded bg-red-500"/>
              </div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
