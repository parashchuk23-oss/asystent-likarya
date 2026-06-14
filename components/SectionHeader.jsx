export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b-2 border-blue-100 pb-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <h2 className="text-base font-semibold text-blue-700">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
