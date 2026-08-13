'use client';

import { useMemo, useState } from 'react';
import DrugCard from './DrugCard';

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase('uk-UA');
}

export default function DrugClassSection({
  classId,
  eyebrow,
  title,
  description,
  drugs,
  query,
  isOpen,
  onToggle,
  children,
}) {
  const [openDrug, setOpenDrug] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);

  const filteredDrugs = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);
    if (!normalizedQuery) return drugs;

    return drugs.filter((drug) =>
      [drug.internationalName, drug.ukrainianName, ...drug.tradeNames].some((name) =>
        normalizeSearchValue(name).includes(normalizedQuery),
      ),
    );
  }, [drugs, query]);

  const panelId = `${classId}-panel`;
  const notesId = `${classId}-clinical-notes`;
  const countLabel = query.trim()
    ? `${filteredDrugs.length} із ${drugs.length}`
    : `${drugs.length} препаратів`;

  return (
    <section
      className={`overflow-hidden rounded-md border bg-white transition ${
        isOpen
          ? 'border-teal-300 bg-teal-50/20 shadow-sm shadow-teal-100/70'
          : 'border-teal-200/80 shadow-sm shadow-slate-200/60 hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-teal-50/40 sm:px-5"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-teal-700">{eyebrow}</span>
          <span className={`mt-1 block text-base font-semibold sm:text-lg ${isOpen ? 'text-teal-900' : 'text-slate-950'}`}>{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{countLabel}</span>
        </span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl leading-none transition ${
            isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
          }`}
          aria-hidden="true"
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-teal-200/80 bg-white px-4 py-5 sm:px-5">
          <p className="max-w-4xl text-sm leading-6 text-slate-600">{description}</p>

          {filteredDrugs.length ? (
            <div className="mt-5 space-y-3">
              {filteredDrugs.map((drug) => {
                const drugId = drug.id ?? drug.internationalName;

                return (
                  <DrugCard
                    key={drugId}
                    drug={drug}
                    isOpen={openDrug === drugId}
                    onToggle={() =>
                      setOpenDrug((current) => (current === drugId ? null : drugId))
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center text-sm text-slate-600">
              У цьому класі немає препаратів за поточним запитом.
            </div>
          )}

          <div className="mt-5 border-t border-teal-100 pt-4">
            <button
              type="button"
              onClick={() => setNotesOpen((current) => !current)}
              aria-expanded={notesOpen}
              aria-controls={notesId}
              className="flex w-full items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-800 transition hover:bg-teal-50/50"
            >
              <span>Клінічні застереження та моніторинг</span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-lg leading-none transition ${
                  notesOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                }`}
                aria-hidden="true"
              >
                {notesOpen ? '−' : '+'}
              </span>
            </button>

            {notesOpen ? (
              <div id={notesId} className="mt-3 text-sm leading-6 text-slate-600">
                {children}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
