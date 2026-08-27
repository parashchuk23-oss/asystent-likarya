'use client';

export default function VaccinationResultCard({ title, tone = 'slate', items, emptyText }) {
  const toneClass = {
    teal: 'border-teal-300 bg-teal-50 text-teal-900',
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    slate: 'border-slate-200 bg-white text-slate-900',
  }[tone];

  return (
    <section className={`rounded-lg border p-4 ${toneClass}`}>
      <h3 className="text-base font-bold">{title}</h3>
      {items?.length ? (
        <div className="mt-3 space-y-3">
          {items.map((item, index) => (
            <div key={`${item.vaccineId || item.id || item.title}-${index}`} className="rounded-md border border-white/70 bg-white/75 p-3">
              <p className="font-semibold text-slate-950">{item.title}</p>
              {item.reason ? <p className="mt-1 text-sm leading-5 text-slate-600">{item.reason}</p> : null}
              {item.nextStep ? <p className="mt-1 text-sm leading-5 text-slate-600">{item.nextStep}</p> : null}
              {item.reasons ? (
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  Чому актуально: {item.reasons.join(', ')}.
                </p>
              ) : null}
              {item.warning ? <p className="mt-1 text-sm font-semibold text-amber-700">{item.warning}</p> : null}
              {item.ageLabel ? (
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {item.ageLabel}; {item.type}
                  {item.doseNumber ? `, доза ${item.doseNumber}` : ''}.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm leading-6 text-slate-600">{emptyText}</p>
      )}
    </section>
  );
}
