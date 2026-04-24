import { CheckCircle2, Circle } from 'lucide-react';

const STAGES = ['Reported', 'Verified', 'NGO Accepted', 'On the Way', 'Rescued'];

export default function StatusTracker({ current = 'Reported', compact = false }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'} w-full`}>
      {STAGES.map((s, i) => {
        const done = i <= idx;
        const active = i === idx;
        return (
          <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center transition-all ${
                  done
                    ? 'bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] shadow-md shadow-orange-500/40'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                } ${active ? 'ring-4 ring-orange-200 animate-pulse' : ''}`}
              >
                {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-neutral-400" />}
              </div>
              {!compact && (
                <span className={`mt-1 text-[10px] font-medium whitespace-nowrap ${done ? 'text-[#ff7a00]' : 'text-neutral-400'}`}>{s}</span>
              )}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full ${done ? 'bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f]' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
