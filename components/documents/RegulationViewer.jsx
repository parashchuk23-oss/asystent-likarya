'use client';

import { useMemo, useState } from 'react';
import RegulationSearch from './RegulationSearch';
import RegulationSection from './RegulationSection';

const normalize = (value) => value.toLowerCase().trim();

export default function RegulationViewer({ regulation }) {
  const [query, setQuery] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('all');

  const directions = useMemo(
    () => Array.from(new Set(regulation.criteria.map((block) => block.direction))).sort((a, b) => a.localeCompare(b, 'uk')),
    [regulation.criteria],
  );

  const filteredCriteria = useMemo(() => {
    const normalizedQuery = normalize(query);

    return regulation.criteria.filter((block) => {
      const matchesDirection = selectedDirection === 'all' || block.direction === selectedDirection;
      const haystack = normalize([block.name, block.direction, block.decisionType, ...block.criteria, ...(block.notes || [])].join(' '));
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesDirection && matchesQuery;
    });
  }, [query, regulation.criteria, selectedDirection]);

  return (
    <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
      <aside className="xl:sticky xl:top-4 xl:self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Зміст</p>
          <nav className="mt-3 max-h-[70vh] space-y-1 overflow-auto pr-1">
            {regulation.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {section.title}
                <span
                  className={`ml-2 text-xs ${
                    section.status === 'structured' ? 'text-teal-600' : section.status === 'planned' ? 'text-slate-400' : 'text-blue-500'
                  }`}
                >
                  {section.status === 'structured' ? 'додано' : section.status === 'planned' ? 'у черзі' : 'довідка'}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Наказ МОЗ №{regulation.number}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{regulation.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{regulation.status}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <p>
              <span className="font-bold text-slate-800">Перевірено:</span> {regulation.lastChecked}
            </p>
            <p>
              <span className="font-bold text-slate-800">Версія структури:</span> {regulation.dataStructureVersion}
            </p>
          </div>
        </section>

        <RegulationSearch
          directions={directions}
          query={query}
          selectedDirection={selectedDirection}
          onQueryChange={setQuery}
          onDirectionChange={setSelectedDirection}
        />

        <section id="general-principles" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-950">Як застосовувати критерії</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Відповідність критеріям обґрунтовує доцільність стаціонарного лікування, але не є автоматичним
            приписом госпіталізувати. Остаточне рішення приймає лікар з урахуванням клінічної картини.
          </p>
        </section>

        <section className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            Остаточне рішення щодо госпіталізації приймається лікарем з урахуванням клінічного стану пацієнта.
          </p>
        </section>

        <section id="hospital-interventions" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-950">Втручання в умовах стаціонару</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Розділ включає респіраторну підтримку, парентеральну терапію з моніторингом, інвазивний або
            безперервний фізіологічний моніторинг, процедури під седацією / анестезією та післяпроцедурні
            стани з підвищеним ризиком. Деталізацію цього розділу буде додано наступним етапом.
          </p>
        </section>

        {regulation.sections
          .filter((section) => section.status === 'structured')
          .map((section) => {
            const sectionCriteria = filteredCriteria.filter((block) => block.sectionId === section.id);
            if (sectionCriteria.length === 0) return null;

            return (
              <div key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Розділ {section.pdfSection}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{section.title}</h3>
                </div>
                {sectionCriteria.map((block) => (
                  <RegulationSection key={block.id} block={block} />
                ))}
              </div>
            );
          })}

        {filteredCriteria.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
            За цим пошуком критерії не знайдені.
          </div>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-950">Джерело</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Критерії структуровано з офіційного PDF наказу МОЗ України №{regulation.number}. Текст у модулі скорочено
            до практичних пунктів для вибору лікарем; за потреби звіряйте формулювання з оригінальним документом.
          </p>
        </section>
      </div>
    </div>
  );
}
