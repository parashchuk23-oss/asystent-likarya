'use client';

import { useMemo, useState } from 'react';
import DrugCard from './DrugCard';

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase('uk-UA');
}

export default function DrugClassSection({ classId, eyebrow, title, description, drugs }) {
  const [query, setQuery] = useState('');
  const [openDrug, setOpenDrug] = useState(null);

  const filteredDrugs = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);
    if (!normalizedQuery) return drugs;

    return drugs.filter((drug) =>
      [drug.internationalName, drug.ukrainianName, ...drug.tradeNames].some((name) =>
        normalizeSearchValue(name).includes(normalizedQuery),
      ),
    );
  }, [drugs, query]);

  return (
    <section className="mt-6">
      <div className="border-b border-blue-100 pb-4">
        <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <label className="mt-5 block max-w-xl">
        <span className="mb-2 block text-sm font-semibold text-slate-800">Пошук препарату</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="МНН, українська або торгова назва"
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <p className="mt-3 text-sm text-slate-500">
        Знайдено: {filteredDrugs.length} із {drugs.length}
      </p>

      {filteredDrugs.length ? (
        <section className="mt-6" aria-labelledby={`${classId}-cards-title`}>
          <h4 id={`${classId}-cards-title`} className="mb-3 text-base font-semibold text-slate-950">
            Препарати
          </h4>
          <div className="space-y-3">
            {filteredDrugs.map((drug) => (
              <DrugCard
                key={drug.internationalName}
                drug={drug}
                isOpen={openDrug === drug.internationalName}
                onToggle={() =>
                  setOpenDrug((current) =>
                    current === drug.internationalName ? null : drug.internationalName,
                  )
                }
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          За цим запитом препаратів не знайдено.
        </div>
      )}
    </section>
  );
}
