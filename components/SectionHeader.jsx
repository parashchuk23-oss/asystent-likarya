export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-blue-100 pb-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-xl ring-1 ring-blue-100">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-slate-950">{title}</h2>
        {subtitle && <p className="text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}
