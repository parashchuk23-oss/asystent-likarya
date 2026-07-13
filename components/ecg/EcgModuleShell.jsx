export default function EcgModuleShell({ eyebrow, title, description, children }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">{eyebrow}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p> : null}
      </div>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </article>
  );
}
