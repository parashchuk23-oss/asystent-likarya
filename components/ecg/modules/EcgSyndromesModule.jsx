'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ecgSyndromes } from '../../../data/ecg/ecgSyndromes';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

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

function EcgImageBlock({ syndrome, onOpenImage }) {
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
      <button
        type="button"
        onClick={() => onOpenImage(syndrome)}
        className="group block w-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Відкрити зображення на весь екран: ${syndrome.title}`}
      >
        <img
          src={syndrome.image.src}
          alt={syndrome.image.alt}
          className="h-auto w-full bg-white object-contain transition group-hover:opacity-95"
          loading="lazy"
        />
      </button>
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
  const [openId, setOpenId] = useState(null);
  const [selectedImageSyndrome, setSelectedImageSyndrome] = useState(null);
  const buttonRefs = useRef({});
  const pendingScrollIdRef = useRef(null);
  const filteredSyndromes = useMemo(
    () => ecgSyndromes.filter((syndrome) => activeCategory === 'Усі' || syndrome.category === activeCategory),
    [activeCategory],
  );

  useEffect(() => {
    if (!openId || pendingScrollIdRef.current !== openId) return;

    pendingScrollIdRef.current = null;
    window.requestAnimationFrame(() => {
      buttonRefs.current[openId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [openId]);

  useEffect(() => {
    if (!selectedImageSyndrome) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedImageSyndrome(null);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selectedImageSyndrome]);

  const chooseCategory = (category) => {
    setActiveCategory(category);
    setOpenId(null);
  };

  const toggleSyndrome = (id) => {
    if (openId !== id) {
      pendingScrollIdRef.current = id;
    }
    setOpenId((current) => (current === id ? null : id));
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

      <div className="space-y-4">
        {filteredSyndromes.map((syndrome) => {
          const isOpen = openId === syndrome.id;
          const isCompactImage = syndrome.id === 'brugada';

          return (
            <article
              key={syndrome.id}
              className={`rounded-lg border bg-white shadow-sm shadow-slate-200/60 transition ${
                isOpen ? 'border-teal-200 ring-1 ring-teal-100' : 'border-slate-200/80'
              }`}
            >
            <button
              ref={(element) => {
                buttonRefs.current[syndrome.id] = element;
              }}
              type="button"
              onClick={() => toggleSyndrome(syndrome.id)}
              className="scroll-mt-4 flex w-full items-center justify-between gap-4 rounded-lg p-5 text-left transition hover:bg-teal-50/50"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{syndrome.category}</span>
                <span className="mt-2 block text-base font-bold tracking-tight text-slate-950">{syndrome.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-500">{syndrome.summary}</span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-semibold text-blue-700">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen ? (
              <div className="border-t border-slate-100 p-5">
                {isCompactImage ? (
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                    <div>
                      <EcgImageBlock syndrome={syndrome} onOpenImage={setSelectedImageSyndrome} />
                    </div>

                    <div className="grid gap-3">
                      <ListBlock title="ЕКГ-критерії" items={syndrome.criteria} />
                      <ListBlock title="Клінічне значення" items={syndrome.clinicalSignificance} tone="blue" />
                    </div>
                  </div>
                ) : (
                  <>
                    <EcgImageBlock syndrome={syndrome} onOpenImage={setSelectedImageSyndrome} />
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <ListBlock title="ЕКГ-критерії" items={syndrome.criteria} />
                      <ListBlock title="Клінічне значення" items={syndrome.clinicalSignificance} tone="blue" />
                    </div>
                  </>
                )}

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <ListBlock title="Диференційний ряд" items={syndrome.differential} />
                  <ListBlock title="Наступний крок" items={syndrome.nextSteps} tone="blue" />
                  <ListBlock title="Коли діяти негайно" items={syndrome.urgent} tone="red" />
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-sm font-bold text-slate-950">Джерела</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {syndrome.sources.map((source) => (
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
              </div>
            ) : null}
          </article>
          );
        })}
      </div>

      <p className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        Зображення додаються тільки після перевірки ліцензії. Якщо безпечного зображення немає, картка працює як текстовий клінічний довідник із посиланням на навчальне джерело.
      </p>
      <EcgDisclaimer />
      {selectedImageSyndrome?.image ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Перегляд зображення: ${selectedImageSyndrome.title}`}
          onClick={() => setSelectedImageSyndrome(null)}
        >
          <div
            className="flex max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-slate-950">{selectedImageSyndrome.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{selectedImageSyndrome.image.attribution}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImageSyndrome(null)}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Закрити
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3">
              <img
                src={selectedImageSyndrome.image.src}
                alt={selectedImageSyndrome.image.alt}
                className="mx-auto max-h-[82vh] w-auto max-w-full bg-white object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </EcgModuleShell>
  );
}
