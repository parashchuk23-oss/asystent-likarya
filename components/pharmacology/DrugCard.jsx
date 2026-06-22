'use client';

export default function DrugCard({ drug, isOpen, onToggle }) {
  const panelId = `drug-${drug.internationalName.toLowerCase()}`;

  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
      >
        <span className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,2.8fr)] sm:items-start">
          <span className="block">
            <span className="block text-base font-semibold text-slate-950">{drug.ukrainianName}</span>
            <span className="mt-1 block text-sm text-slate-500">{drug.internationalName}</span>
          </span>
          <span className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <span>
              <span className="block text-xs font-semibold text-slate-500">Звичайна доза</span>
              <span className="mt-1 block text-sm text-slate-800">{drug.usualDose}</span>
            </span>
            <span>
              <span className="block text-xs font-semibold text-slate-500">Кратність</span>
              <span className="mt-1 block text-sm text-slate-800">{drug.frequency}</span>
            </span>
            <span className="col-span-2 sm:col-span-1">
              <span className="block text-xs font-semibold text-slate-500">Напіввиведення</span>
              <span className="mt-1 block text-sm text-slate-800">{drug.halfLife}</span>
            </span>
          </span>
        </span>
        <span className="shrink-0 text-xl leading-none text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-slate-200 px-4 py-5 sm:px-5">
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-semibold text-slate-600">Торгові назви, приклади</dt>
              <dd className="mt-1 text-slate-950">{drug.tradeNames.join(', ')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Звичайна доза</dt>
              <dd className="mt-1 text-slate-950">{drug.usualDose}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Максимальна доза</dt>
              <dd className="mt-1 text-slate-950">{drug.maxDose}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Кратність</dt>
              <dd className="mt-1 text-slate-950">{drug.frequency}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Період напіввиведення</dt>
              <dd className="mt-1 text-slate-950">{drug.halfLife}</dd>
            </div>
          </dl>

          {drug.approximateBpReduction ? (
            <div className="mt-5 border-l-4 border-sky-400 bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <span className="font-semibold text-slate-900">Орієнтовне зниження САТ: </span>
              {drug.approximateBpReduction}
            </div>
          ) : null}

          <section className="mt-5">
            <h4 className="text-sm font-semibold text-slate-950">Що відрізняє препарат</h4>
            <p className="mt-2 text-sm leading-6 text-slate-700">{drug.distinctiveFeatures}</p>
          </section>
        </div>
      ) : null}
    </article>
  );
}
