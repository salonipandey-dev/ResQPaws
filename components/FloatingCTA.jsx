'use client';
import Link from 'next/link';
import { Siren } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingCTA() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link href="/report">
        <button className="relative group">
          <span className="absolute inset-0 rounded-full bg-[#ff7a00] animate-ping opacity-30" />
          <span className="relative flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white font-semibold shadow-2xl shadow-orange-500/40 group-hover:scale-105 transition">
            <Siren className="w-5 h-5" /> Emergency
          </span>
        </button>
      </Link>
    </motion.div>
  );
}
