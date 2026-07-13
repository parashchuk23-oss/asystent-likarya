const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
};

export default function EcgResultCard({ title, value, description, tone = 'neutral' }) {
  return (
    <div className={`rounded-lg border p-4 ${toneClasses[tone] || toneClasses.neutral}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {description ? <p className="mt-2 text-sm leading-relaxed opacity-90">{description}</p> : null}
    </div>
  );
}
