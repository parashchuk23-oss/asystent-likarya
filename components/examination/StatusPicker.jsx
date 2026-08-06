import {
  implementedExaminationStatuses,
  plannedExaminationStatuses,
} from '../../data/examination/statusRegistry';

export default function StatusPicker({ selectedStatuses, onAddStatus }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Оберіть статуси</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">Оберіть статуси для огляду</h3>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {implementedExaminationStatuses.map((status) => {
          const isSelected = selectedStatuses.includes(status.id);

          return (
            <button
              key={status.id}
              type="button"
              onClick={() => onAddStatus(status.id)}
              disabled={isSelected}
              className={`rounded-md border px-3 py-3 text-left transition ${
                isSelected
                  ? 'border-teal-200 bg-teal-50 text-teal-800'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50'
              }`}
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{status.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{status.description}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-blue-700">{isSelected ? '✓' : '+'}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Наступні шаблони</p>
        <div className="grid gap-2 md:grid-cols-2">
          {plannedExaminationStatuses.map((status) => (
            <div key={status.id} className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-3">
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-semibold text-slate-500">{status.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">{status.description}</span>
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                  незабаром
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
