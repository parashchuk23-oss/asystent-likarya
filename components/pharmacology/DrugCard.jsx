'use client';

const detailSections = [
  { key: 'practicalUse', title: 'Коли зручно застосовувати' },
  { key: 'advantages', title: 'Переваги' },
  { key: 'cautions', title: 'Застереження' },
  { key: 'monitoring', title: 'Що контролювати' },
  { key: 'notes', title: 'Практичні примітки' },
];

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
        <span className="min-w-0">
          <span className="block text-base font-semibold text-slate-950">{drug.ukrainianName}</span>
          <span className="mt-1 block text-sm text-slate-500">
            {drug.internationalName} · {drug.usualDose} · {drug.frequency}
          </span>
        </span>
        <span className="shrink-0 text-xl leading-none text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-slate-200 px-4 py-5 sm:px-5">
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-600">МНН</dt>
              <dd className="mt-1 text-slate-950">{drug.internationalName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Латинська назва</dt>
              <dd className="mt-1 text-slate-950">{drug.latinName}</dd>
            </div>
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
              <dt className="font-semibold text-slate-600">Період напіввиведення</dt>
              <dd className="mt-1 text-slate-950">{drug.halfLife}</dd>
            </div>
          </dl>

          <div className="mt-5 border-l-4 border-sky-400 bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
            <span className="font-semibold text-slate-900">Орієнтовний вплив на АТ. </span>
            {drug.approximateBpReduction}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {detailSections.map((section) => (
              <section key={section.key}>
                <h4 className="text-sm font-semibold text-slate-950">{section.title}</h4>
                <ul className="mt-2 space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                  {drug[section.key].map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
