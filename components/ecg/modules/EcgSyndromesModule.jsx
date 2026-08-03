'use client';

import { useMemo, useState } from 'react';
import { ecgSyndromes } from '../../../data/ecg/ecgSyndromes';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const cardBaseClass = 'rounded-lg border border-slate-200 bg-white p-4';

function ListBlock({ title, items, tone = 'slate' }) {
  const toneClasses = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    blue: 'border-blue-100 bg-blue-50 text-blue-900',
    amber: 'border-amber-100 bg-amber-50 text-amber-900',
    red: 'border-red-100 bg-red-50 text-red-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${toneClasses[tone] || toneClasses.slate}`}>
      <h4 className="text-sm font-bold text-slate-950">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EcgImageBlock({ syndrome }) {
  if (!syndrome.image) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
        <div>
          <p className="text-sm font-bold text-slate-800">Фото ЕКГ буде додано після перевірки ліцензії</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Критерії та клінічне значення вже доступні. Для навчального прикладу відкрийте джерело нижче.
          </p>
        </div>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img
        src={syndrome.image.src}
        alt={syndrome.image.alt}
        className="h-auto w-full bg-white object-contain"
        loading="lazy"
      />
      <figcaption className="space-y-1 border-t border-slate-200 p-3 text-xs leading-relaxed text-slate-600">
        <p>{syndrome.image.attribution}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a className="font-semibold text-blue-700 hover:text-blue-900" href={syndrome.image.sourceUrl} target="_blank" rel="noreferrer">
            Джерело зображення
          </a>
          <a className="font-semibold text-blue-700 hover:text-blue-900" href={syndrome.image.licenseUrl} target="_blank" rel="noreferrer">
            Ліцензія
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

export default function EcgSyndromesModule() {
  const categories = useMemo(
    () => ['Усі', ...Array.from(new Set(ecgSyndromes.map((syndrome) => syndrome.category)))],
    [],
  );
  const [activeCategory, setActiveCategory] = useState('Усі');
  const [activeId, setActiveId] = useState(ecgSyndromes[0]?.id || '');
  const filteredSyndromes = useMemo(
    () => ecgSyndromes.filter((syndrome) => activeCategory === 'Усі' || syndrome.category === activeCategory),
    [activeCategory],
  );
  const activeSyndrome = ecgSyndromes.find((syndrome) => syndrome.id === activeId) || filteredSyndromes[0] || ecgSyndromes[0];

  const chooseCategory = (category) => {
    setActiveCategory(category);
    const first = ecgSyndromes.find((syndrome) => category === 'Усі' || syndrome.category === category);
    if (first) setActiveId(first.id);
  };

  return (
    <EcgModuleShell
      eyebrow="ЕКГ синдроми"
      title="Архів ЕКГ-патернів"
      description="Приклади ЕКГ, критерії, клінічне значення та наступний крок для швидкого навчального перегляду."
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => chooseCategory(category)}
            className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
              activeCategory === category
                ? 'border-teal-300 bg-teal-50 text-teal-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-2">
          {filteredSyndromes.map((syndrome) => (
            <button
              key={syndrome.id}
              type="button"
              onClick={() => setActiveId(syndrome.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                activeSyndrome.id === syndrome.id
                  ? 'border-teal-300 bg-teal-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{syndrome.category}</p>
              <h4 className="mt-2 text-base font-bold text-slate-950">{syndrome.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{syndrome.summary}</p>
            </button>
          ))}
        </div>

        <section className={cardBaseClass}>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{activeSyndrome.category}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">{activeSyndrome.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{activeSyndrome.summary}</p>
              <div className="mt-4">
                <EcgImageBlock syndrome={activeSyndrome} />
              </div>
            </div>

            <div className="grid gap-3">
              <ListBlock title="ЕКГ-критерії" items={activeSyndrome.criteria} />
              <ListBlock title="Клінічне значення" items={activeSyndrome.clinicalSignificance} tone="blue" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <ListBlock title="Диференційний ряд" items={activeSyndrome.differential} />
            <ListBlock title="Наступний крок" items={activeSyndrome.nextSteps} tone="blue" />
            <ListBlock title="Коли діяти негайно" items={activeSyndrome.urgent} tone="red" />
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-bold text-slate-950">Джерела</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {activeSyndrome.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:border-blue-200 hover:bg-blue-50"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <p className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        Зображення додаються тільки після перевірки ліцензії. Якщо безпечного зображення немає, картка працює як текстовий клінічний довідник із посиланням на навчальне джерело.
      </p>
      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
