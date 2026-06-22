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
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-teal-700">{eyebrow}</span>
          <span className="mt-1 block text-base font-semibold text-slate-950 sm:text-lg">{title}</span>
          <span className="mt-1 block text-sm text-slate-500">{countLabel}</span>
        </span>
        <span className="shrink-0 text-xl leading-none text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-slate-200 px-4 py-5 sm:px-5">
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

          <div className="mt-5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setNotesOpen((current) => !current)}
              aria-expanded={notesOpen}
              aria-controls={notesId}
              className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-slate-800"
            >
              <span>Клінічні застереження та моніторинг</span>
              <span className="shrink-0 text-lg leading-none text-teal-700" aria-hidden="true">
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
