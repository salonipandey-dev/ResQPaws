const colorMap = {
  regular: "bg-slate-200 text-slate-700",
  urgent: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700"
};

export default function UrgencyPill({ value }) {
  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : "Regular";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colorMap[value] || colorMap.regular}`}>{label}</span>;
}
