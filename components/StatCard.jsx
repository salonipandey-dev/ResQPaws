'use client';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'orange' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white/80 dark:bg-neutral-800/60 backdrop-blur rounded-2xl p-5 border border-white/60 dark:border-neutral-700 shadow-[0_8px_32px_rgba(255,122,0,0.06)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center shadow-md shadow-orange-500/30">
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        {trend && <span className="text-xs font-semibold text-emerald-600">↑ {trend}</span>}
      </div>
      <div className="text-2xl md:text-3xl font-bold">{value}</div>
      <div className="text-sm text-neutral-500 mt-1">{label}</div>
    </motion.div>
  );
}
