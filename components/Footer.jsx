import Link from 'next/link';
import { PawPrint, Heart, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-32 bg-gradient-to-br from-[#1f1f1f] to-[#2a1a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl">ResQPaws</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              A citizen-powered rescue network helping injured and stray animals get emergency care instantly.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><Link href="/report" className="hover:text-[#ff9a2f]">Report Animal</Link></li>
              <li><Link href="/track" className="hover:text-[#ff9a2f]">Track Report</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#ff9a2f]">Dashboard</Link></li>
              <li><Link href="/ngo" className="hover:text-[#ff9a2f]">For NGOs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>About</li><li>Blog</li><li>Careers</li><li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Get the app</h4>
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#ff7a00] transition"><Instagram className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#ff7a00] transition"><Twitter className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#ff7a00] transition"><Facebook className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center hover:bg-[#ff7a00] transition"><Mail className="w-4 h-4" /></div>
            </div>
            <p className="text-xs text-neutral-500">24/7 Emergency Hotline:<br/><span className="text-[#ff9a2f] font-semibold">+91 1800-RESCUE</span></p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-neutral-500">© 2025 ResQPaws. Made with <Heart className="w-3 h-3 inline text-[#ff7a00] fill-current" /> for every paw.</p>
          <p className="text-xs text-neutral-500">Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}
