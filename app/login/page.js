'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [tab, setTab] = useState('user');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(`Welcome back! Logged in as ${tab === 'user' ? 'User' : 'NGO / Volunteer'}`);
      setLoading(false);
      router.push(tab === 'user' ? '/dashboard' : '/ngo');
    }, 900);
  };

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left visual */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-between text-white h-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white grid place-items-center">
              <PawPrint className="w-5 h-5 text-[#ff7a00]" />
            </div>
            <span className="font-bold text-xl">ResQPaws</span>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Every rescue begins with a single click.</h1>
            <p className="mt-4 text-white/90 text-lg">Join 12,000+ reporters and 50+ NGOs building India’s largest emergency animal rescue network.</p>
            <div className="mt-8 flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold">125+</div>
                <div className="text-sm text-white/80">Rescues today</div>
              </div>
              <div className="h-10 w-px bg-white/30" />
              <div>
                <div className="text-3xl font-bold">8 min</div>
                <div className="text-sm text-white/80">Avg. response</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/70">© 2025 ResQPaws · Built with love for every paw</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-[#fffaf7]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link href="/" className="md:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ResQPaws</span>
          </Link>
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-orange-500/10 border border-orange-100">
            <h2 className="text-2xl font-bold">Welcome back 🐾</h2>
            <p className="text-sm text-neutral-500 mt-1">Sign in to continue saving lives.</p>

            <div className="mt-6 grid grid-cols-2 gap-1 p-1 bg-orange-50 rounded-full">
              <button onClick={() => setTab('user')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === 'user' ? 'bg-white shadow text-[#ff7a00]' : 'text-neutral-500'}`}>
                <User className="w-4 h-4" /> User Login
              </button>
              <button onClick={() => setTab('ngo')}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === 'ngo' ? 'bg-white shadow text-[#ff7a00]' : 'text-neutral-500'}`}>
                <Building2 className="w-4 h-4" /> NGO / Volunteer
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-600">Email</label>
                <div className="mt-1 flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 focus-within:border-[#ff7a00] focus-within:ring-4 focus-within:ring-orange-100 transition">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <input type="email" required defaultValue={tab === 'user' ? 'aarav@resqpaws.in' : 'rescue@pawsandhearts.org'} className="flex-1 bg-transparent py-3 text-sm focus:outline-none" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600">Password</label>
                <div className="mt-1 flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 focus-within:border-[#ff7a00] focus-within:ring-4 focus-within:ring-orange-100 transition">
                  <Lock className="w-4 h-4 text-neutral-400" />
                  <input type="password" required defaultValue="rescue123" className="flex-1 bg-transparent py-3 text-sm focus:outline-none" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-500">
                  <input type="checkbox" className="accent-[#ff7a00]" /> Remember me
                </label>
                <button type="button" className="text-[#ff7a00] font-semibold hover:underline">Forgot Password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition disabled:opacity-60">
                {loading ? 'Signing in…' : <>Login <ArrowRight className="w-4 h-4" /></>}
              </button>
              <button type="button" className="w-full py-3.5 rounded-full bg-white border border-neutral-200 font-semibold hover:border-[#ff7a00] transition">Create Account</button>
            </form>
            <p className="mt-6 text-xs text-center text-neutral-500">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
