export default function StatusTimeline({ statusFlow, status }) {
  const index = statusFlow.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {statusFlow.map((step, idx) => {
        const active = idx <= index;
        return (
          <div key={step} className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {step.replaceAll("_", " ")}
            </span>
            {idx < statusFlow.length - 1 ? <span className="text-slate-300">-</span> : null}
          </div>
        );
      })}
    </div>
  );
}
