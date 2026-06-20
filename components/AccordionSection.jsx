export default function AccordionSection({ id, title, subtitle, isOpen, onToggle, children }) {
  const panelId = `${id}-panel`;

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white transition ${
        isOpen
          ? 'border-blue-200 shadow-sm shadow-slate-200/60'
          : 'border-slate-200/80'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
      >
        <span className="min-w-0">
          <span className="block text-base font-semibold text-slate-950">{title}</span>
          {subtitle ? (
            <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-2xl leading-none text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-slate-200 p-4 sm:p-5">
          {children}
        </div>
      ) : null}
    </article>
  );
}
