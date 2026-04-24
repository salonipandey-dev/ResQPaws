'use client';
import { motion } from 'framer-motion';
import { MapPin, Clock, User } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import StatusTracker from './StatusTracker';

export default function ReportCard({ report, onAction, actionLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 dark:border-neutral-700 shadow-[0_8px_40px_rgba(255,122,0,0.08)] hover:shadow-[0_20px_60px_rgba(255,122,0,0.18)] transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={report.image} alt={report.animal} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3"><SeverityBadge level={report.severity} /></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-mono font-semibold text-[#ff7a00]">#{report.id}</div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.time}</span>
        </div>
        <h3 className="font-semibold text-lg mb-1">{report.animal}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">{report.description}</p>
        <div className="mb-4"><StatusTracker current={report.status} /></div>
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
          <span className="text-xs text-neutral-500 flex items-center gap-1"><User className="w-3 h-3" />{report.reporter}</span>
          {onAction && (
            <button onClick={() => onAction(report)} className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white text-xs font-semibold shadow hover:opacity-90">
              {actionLabel || 'View'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
