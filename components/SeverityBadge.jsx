export default function SeverityBadge({ level }) {
  const map = {
    Critical: 'bg-red-100 text-red-700 ring-red-200',
    Medium: 'bg-amber-100 text-amber-700 ring-amber-200',
    Low: 'bg-emerald-100 text-emerald-700 ring-emerald-200'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${map[level] || map.Low}`}>
      {level === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {level}
    </span>
  );
}
