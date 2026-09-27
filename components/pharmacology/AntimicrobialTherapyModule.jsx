'use client';

import { useMemo, useState } from 'react';
import {
  antimicrobialConditions,
  antimicrobialGeneralRules,
  antimicrobialSpecializedStandardSource,
  antimicrobialStandardSource,
  awareGroups,
} from '../../data/antimicrobial/primaryCareStandard';
import {
  inpatientConditions,
  inpatientGeneralNotes,
  inpatientSafetyChecklist,
  inpatientStandardSource,
} from '../../data/antimicrobial/specializedCareStandard';
import {
  antibioticAwareOptions,
  antibioticGroups,
  antibioticReferenceSource,
} from '../../data/antimicrobial/antibioticReference';

const sections = [
  { id: 'conditions', label: 'Клінічні стани' },
  { id: 'antibiotics', label: 'Антибіотики' },
  { id: 'aware', label: 'AWaRe' },
  { id: 'rules', label: 'Загальні правила' },
  { id: 'documentation', label: 'Обґрунтування призначення' },
];

const inpatientSections = [
  { id: 'conditions', label: 'Стаціонарні стани' },
  { id: 'antibiotics', label: 'Антибіотики' },
];

const awareTone = {
  access: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  watch: 'border-amber-200 bg-amber-50 text-amber-800',
  reserve: 'border-rose-200 bg-rose-50 text-rose-800',
};

function AntibioticReference() {
  const [query, setQuery] = useState('');
  const [aware, setAware] = useState('all');
  const [route, setRoute] = useState('all');
  const [openGroup, setOpenGroup] = useState(null);
  const [openDrug, setOpenDrug] = useState(null);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('uk-UA');
    return antibioticGroups.map((group) => {
      const drugs = group.drugs.filter((item) => {
        const searchable = `${item.name} ${item.atc} ${group.title} ${item.scenarios.join(' ')}`.toLocaleLowerCase('uk-UA');
        const matchesQuery = !normalized || searchable.includes(normalized);
        const matchesAware = aware === 'all' || item.aware === aware;
        const matchesRoute = route === 'all' || item.routes.includes(route);
        return matchesQuery && matchesAware && matchesRoute;
      });
      return { ...group, drugs };
    }).filter((group) => group.drugs.length);
  }, [aware, query, route]);

  const resultCount = filteredGroups.reduce((sum, group) => sum + group.drugs.length, 0);

  return (
    <div>
      <div className="rounded-md border border-teal-200 bg-teal-50/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Довідник за МНН</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">Антибіотики за фармакологічними групами</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Клас, ATC-код, національна AWaRe-категорія, клінічні сценарії, ниркова корекція, TDM та перехід із в/в на per os за наказом МОЗ №1328. Дози залишаються у картках конкретних захворювань, тому що універсального режиму для препарату не існує.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Пошук антибіотика або групи</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Наприклад: цефтриаксон, карбапенеми, сепсис"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">AWaRe</span>
          <select value={aware} onChange={(event) => setAware(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm">
            {antibioticAwareOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Шлях введення</span>
          <select value={route} onChange={(event) => setRoute(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm">
            <option value="all">Усі шляхи</option>
            <option value="per os">Per os</option>
            <option value="в/в">Внутрішньовенно</option>
            <option value="в/м">Внутрішньом’язово</option>
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-slate-500">Знайдено препаратів: {resultCount}</p>
      <div className="mt-5 space-y-3">
        {filteredGroups.map((group) => {
          const groupOpen = openGroup === group.id;
          return (
            <section key={group.id} className={`overflow-hidden rounded-md border bg-white ${groupOpen ? 'border-teal-500 shadow-sm' : 'border-teal-200'}`}>
              <button
                type="button"
                onClick={() => {
                  setOpenGroup((current) => current === group.id ? null : group.id);
                  setOpenDrug(null);
                }}
                aria-expanded={groupOpen}
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-teal-50/50 sm:px-5"
              >
                <span>
                  <span className="block font-semibold text-slate-950">{group.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">{group.description}</span>
                  <span className="mt-2 block text-xs font-semibold text-teal-700">{group.drugs.length} препаратів</span>
                </span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl ${groupOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`} aria-hidden="true">{groupOpen ? '−' : '+'}</span>
              </button>

              {groupOpen ? (
                <div className="border-t border-teal-200 px-4 py-5 sm:px-5">
                  <details className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">Безпека групи</summary>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {group.safety.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </details>

                  <div className="space-y-2">
                    {group.drugs.map((item) => {
                      const drugOpen = openDrug === item.id;
                      return (
                        <article key={item.id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => setOpenDrug((current) => current === item.id ? null : item.id)}
                            aria-expanded={drugOpen}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
                          >
                            <span>
                              <span className="font-semibold text-slate-950">{item.name}</span>
                              <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>ATC {item.atc}</span>
                                <span className={`rounded-full border px-2 py-0.5 font-semibold uppercase ${awareTone[item.aware]}`}>{item.aware}</span>
                                <span>{item.routes.join(' · ')}</span>
                                {item.tdm ? <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">TDM</span> : null}
                              </span>
                            </span>
                            <span className="text-xl text-slate-500" aria-hidden="true">{drugOpen ? '−' : '+'}</span>
                          </button>

                          {drugOpen ? (
                            <div className="border-t border-slate-200 px-4 py-4 text-sm leading-6 text-slate-700">
                              <h5 className="font-semibold text-slate-900">Де наведений у стандарті</h5>
                              <ul className="mt-1 space-y-1">{item.scenarios.map((scenario) => <li key={scenario}>• {scenario}</li>)}</ul>
                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {item.renal ? <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3"><strong>CrCl:</strong> {item.renal}</div> : null}
                                {item.obesity ? <div className="rounded-md border border-violet-100 bg-violet-50/60 p-3"><strong>Ожиріння:</strong> {item.obesity}</div> : null}
                                {item.stepDown ? <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-3"><strong>В/в → per os:</strong> {item.stepDown}</div> : null}
                                {item.note ? <div className="rounded-md border border-amber-100 bg-amber-50/60 p-3"><strong>Важливо:</strong> {item.note}</div> : null}
                              </div>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>
          );
        })}
        {!filteredGroups.length ? <p className="rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-600">За цими параметрами препаратів не знайдено.</p> : null}
      </div>

      <aside className="mt-6 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        AWaRe-категорії відтворено за національною адаптацією ВООЗ 2025 у наказі №1328. Категорія не замінює показання, антибіотикограму або локальний протокол. Перед застосуванням перевірте офіційну інструкцію конкретного препарату.
      </aside>
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Джерело:{' '}
        <a href={antibioticReferenceSource.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">{antibioticReferenceSource.label}</a>.
      </p>
    </div>
  );
}

function ConditionCard({ condition, isOpen, onToggle }) {
  const panelId = `antimicrobial-${condition.id}`;
  const regimens = condition.treatmentRegimens ?? condition.adultRegimens;

  return (
    <article className={`overflow-hidden rounded-md border bg-white ${isOpen ? 'border-teal-500 shadow-sm' : 'border-teal-200'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-teal-50/50 sm:px-5"
      >
        <span>
          <span className="block font-semibold text-slate-950">{condition.title}</span>
          <span className="mt-1 block text-sm leading-5 text-slate-600">{condition.routine}</span>
        </span>
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl ${isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`} aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-teal-200 px-4 py-5 sm:px-5">
          <h4 className="text-sm font-semibold text-slate-900">Коли розглядати</h4>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
            {condition.criteria.map((item) => <li key={item}>• {item}</li>)}
          </ul>

          {condition.decisionGroups?.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {condition.decisionGroups.map((group) => (
                <section key={group.title} className={`rounded-md border px-4 py-4 ${group.tone === 'amber' ? 'border-amber-200 bg-amber-50' : 'border-teal-200 bg-teal-50/60'}`}>
                  <h4 className="text-sm font-semibold text-slate-900">{group.title}</h4>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {group.items.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          ) : null}

          {regimens.length ? (
            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-4">
              <h4 className="text-sm font-semibold text-slate-900">{condition.regimenTitle ?? 'Режими для дорослих зі стандарту'}</h4>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {regimens.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              {condition.duration ? <p className="mt-3 text-sm font-medium text-slate-800">Тривалість: {condition.duration}</p> : null}
            </div>
          ) : null}

          {condition.safetyNotes?.length ? (
            <div className="mt-4 border-l-4 border-rose-400 bg-rose-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <strong>Важливо:</strong>
              <ul className="mt-1 space-y-1">
                {condition.safetyNotes.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          ) : null}

          {condition.pediatricNote ? (
            <p className="mt-4 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <strong>Діти:</strong> {condition.pediatricNote}
            </p>
          ) : null}

          {condition.source ? (
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Джерело:{' '}
              <a href={condition.source.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">
                {condition.source.label}
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ClinicalConditions() {
  const [query, setQuery] = useState('');
  const [openCondition, setOpenCondition] = useState(null);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('uk-UA');
    if (!normalized) return antimicrobialConditions;
    return antimicrobialConditions.filter((condition) =>
      `${condition.title} ${condition.routine}`.toLocaleLowerCase('uk-UA').includes(normalized),
    );
  }, [query]);

  return (
    <div>
      <label className="block max-w-2xl">
        <span className="mb-2 block text-sm font-semibold text-slate-800">Пошук клінічного стану</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Наприклад: фарингіт, пневмонія, рана"
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <p className="mt-3 text-sm text-slate-500">Клінічних станів: {filtered.length}</p>
      <div className="mt-5 space-y-3">
        {filtered.map((condition) => (
          <ConditionCard
            key={condition.id}
            condition={condition}
            isOpen={openCondition === condition.id}
            onToggle={() => setOpenCondition((current) => current === condition.id ? null : condition.id)}
          />
        ))}
      </div>
    </div>
  );
}

function InpatientReference() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openCondition, setOpenCondition] = useState(null);
  const categories = useMemo(
    () => ['all', ...new Set(inpatientConditions.map((condition) => condition.category))],
    [],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('uk-UA');
    return inpatientConditions.filter((condition) => {
      const matchesCategory = category === 'all' || condition.category === category;
      const searchable = `${condition.title} ${condition.category} ${condition.summary} ${condition.firstChoice.join(' ')} ${(condition.secondChoice ?? []).join(' ')}`
        .toLocaleLowerCase('uk-UA');
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  return (
    <div>
      <div className="rounded-md border border-blue-200 bg-blue-50/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Спеціалізована та стаціонарна допомога</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">Стаціонарний довідник антимікробної терапії</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Емпіричні режими для дорослих із додатка 4 стандарту МОЗ. Довідник допомагає звірити стартову схему, тривалість і ключові застереження, але не враховує автоматично локальний антибіограм, результати посівів або індивідуальну корекцію дози.
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-500">{inpatientStandardSource.code} · {inpatientStandardSource.order}</p>
      </div>

      <section className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-5">
        <h4 className="font-semibold text-slate-950">Перед першою дозою</h4>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 lg:grid-cols-2">
          {inpatientSafetyChecklist.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Пошук стану або препарату</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Наприклад: сепсис, менінгіт, піперацилін"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Система / група станів</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm">
            {categories.map((item) => <option key={item} value={item}>{item === 'all' ? 'Усі категорії' : item}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-slate-500">Клінічних сценаріїв: {filtered.length}</p>
      <div className="mt-5 space-y-3">
        {filtered.map((condition) => {
          const isOpen = openCondition === condition.id;
          const panelId = `inpatient-antimicrobial-${condition.id}`;
          return (
            <article key={condition.id} className={`overflow-hidden rounded-md border bg-white ${isOpen ? 'border-blue-500 shadow-sm' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setOpenCondition((current) => current === condition.id ? null : condition.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-blue-50/40 sm:px-5"
              >
                <span>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">{condition.category}</span>
                  <span className="mt-1 block font-semibold text-slate-950">{condition.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">{condition.summary}</span>
                </span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xl ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="border-t border-blue-100 px-4 py-5 sm:px-5">
                  <section className="rounded-md border border-teal-200 bg-teal-50/60 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">Режим зі стандарту</h4>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {condition.firstChoice.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </section>

                  {condition.secondChoice?.length ? (
                    <section className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-4">
                      <h4 className="text-sm font-semibold text-slate-900">Другий вибір / окремі умови</h4>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                        {condition.secondChoice.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </section>
                  ) : null}

                  <p className="mt-4 text-sm font-medium leading-6 text-slate-800"><strong>Орієнтовна тривалість:</strong> {condition.duration}</p>
                  {condition.notes.length ? (
                    <ul className="mt-3 space-y-2 border-l-4 border-rose-400 bg-rose-50 px-4 py-3 text-sm leading-6 text-slate-700">
                      {condition.notes.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
        {!filtered.length ? <p className="rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-600">За цим запитом сценаріїв не знайдено.</p> : null}
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-5">
        <h4 className="font-semibold text-slate-950">Межі довідника</h4>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {inpatientGeneralNotes.map((item) => <li key={item}>• {item}</li>)}
        </ul>
        <a href={inpatientStandardSource.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-blue-700 underline underline-offset-2">
          Відкрити повний офіційний стандарт ↗
        </a>
      </section>
    </div>
  );
}

function AwareReference() {
  const toneClasses = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {awareGroups.map((group) => (
        <article key={group.id} className={`rounded-md border p-5 ${toneClasses[group.tone]}`}>
          <p className="text-xs font-bold uppercase tracking-[0.16em]">{group.title}</p>
          <h3 className="mt-1 text-lg font-semibold">{group.label}</h3>
          <p className="mt-3 text-sm leading-6 opacity-80">{group.description}</p>
          {group.medicines.length ? (
            <ul className="mt-4 space-y-2 text-sm">
              {group.medicines.map((medicine) => <li key={medicine}>• {medicine}</li>)}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function GeneralRules() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {antimicrobialGeneralRules.map((rule, index) => (
        <article key={rule.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Крок {index + 1}</p>
          <h3 className="mt-1 font-semibold text-slate-950">{rule.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{rule.text}</p>
        </article>
      ))}
    </div>
  );
}

function DocumentationGenerator() {
  const [conditionId, setConditionId] = useState('');
  const [criteria, setCriteria] = useState('');
  const [regimen, setRegimen] = useState('');
  const [duration, setDuration] = useState('');
  const [review, setReview] = useState('через 48–72 години');
  const selected = antimicrobialConditions.find((condition) => condition.id === conditionId);

  const generatedText = [
    selected ? `Клінічний стан: ${selected.title}.` : '',
    criteria.trim() ? `Обґрунтування антибактеріальної терапії: ${criteria.trim()}.` : '',
    regimen.trim() ? `Призначення: ${regimen.trim()}.` : '',
    duration.trim() ? `Очікувана тривалість: ${duration.trim()}.` : '',
    review.trim() ? `Перегляд терапії: ${review.trim()}.` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-md border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Клінічний стан</span>
          <select value={conditionId} onChange={(event) => setConditionId(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="">Оберіть стан</option>
            {antimicrobialConditions.map((condition) => <option key={condition.id} value={condition.id}>{condition.title}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Критерії призначення</span>
          <textarea value={criteria} onChange={(event) => setCriteria(event.target.value)} rows={3} placeholder="Задокументуйте клінічні критерії" className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">МНН, доза, форма, кратність і шлях введення</span>
          <textarea value={regimen} onChange={(event) => setRegimen(event.target.value)} rows={3} placeholder="Заповнюється лікарем після перевірки показань та інструкції" className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">Тривалість</span>
            <input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Наприклад: 5 діб" className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-800">Наступний перегляд</span>
            <input value={review} onChange={(event) => setReview(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
          </label>
        </div>
      </div>

      <div className="rounded-md border border-teal-200 bg-teal-50/50 p-5">
        <h3 className="font-semibold text-slate-950">Текст для документації</h3>
        <textarea
          readOnly
          value={generatedText}
          rows={12}
          placeholder="Заповніть поля — тут з’явиться структурований текст. Дані не надсилаються на сервер і не зберігаються після закриття сторінки."
          className="mt-4 w-full rounded-md border border-teal-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800"
        />
        <button
          type="button"
          disabled={!generatedText}
          onClick={() => navigator.clipboard?.writeText(generatedText)}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Копіювати текст
        </button>
      </div>
    </div>
  );
}

export default function AntimicrobialTherapyModule() {
  const [careLevel, setCareLevel] = useState('primary');
  const [activeSection, setActiveSection] = useState('conditions');
  const visibleSections = careLevel === 'primary' ? sections : inpatientSections;

  const selectCareLevel = (level) => {
    setCareLevel(level);
    setActiveSection('conditions');
  };

  return (
    <section>
      <div className="rounded-md border border-teal-200 bg-teal-50/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Клінічний довідник</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">Антимікробна терапія</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Окремі навігатори для первинної та стаціонарної допомоги за чинними стандартами МОЗ. Вони допомагають звірити показання, режим, тривалість і документацію, але не призначають антибіотик автоматично.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Рівень медичної допомоги">
        <button
          type="button"
          onClick={() => selectCareLevel('primary')}
          className={`rounded-md border px-4 py-4 text-left transition ${careLevel === 'primary' ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100' : 'border-slate-200 bg-white hover:border-teal-300'}`}
        >
          <span className="block font-semibold text-slate-950">Первинна допомога</span>
          <span className="mt-1 block text-sm text-slate-600">Амбулаторні клінічні стани та режими</span>
        </button>
        <button
          type="button"
          onClick={() => selectCareLevel('inpatient')}
          className={`rounded-md border px-4 py-4 text-left transition ${careLevel === 'inpatient' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:border-blue-300'}`}
        >
          <span className="block font-semibold text-slate-950">Стаціонарна допомога</span>
          <span className="mt-1 block text-sm text-slate-600">Тяжкі інфекції, сепсис і парентеральні режими</span>
        </button>
      </div>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Розділи антимікробної терапії">
        {visibleSections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${activeSection === section.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700'}`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {careLevel === 'primary' && activeSection === 'conditions' ? <ClinicalConditions /> : null}
        {activeSection === 'antibiotics' ? <AntibioticReference /> : null}
        {careLevel === 'primary' && activeSection === 'aware' ? <AwareReference /> : null}
        {careLevel === 'primary' && activeSection === 'rules' ? <GeneralRules /> : null}
        {careLevel === 'primary' && activeSection === 'documentation' ? <DocumentationGenerator /> : null}
        {careLevel === 'inpatient' && activeSection === 'conditions' ? <InpatientReference /> : null}
      </div>

      <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        Не використовуйте довідник як автоматичне призначення. Перед терапією перевірте алергії, вагітність, вік, масу тіла, функцію нирок і печінки, взаємодії, локальну резистентність та офіційну інструкцію.
        {careLevel === 'primary' ? ' Педіатричні суперечності стандарту навмисно не автоматизовані.' : ' Стаціонарні режими потребують мікробіологічного контролю, щоденної оцінки та корекції за клінічною відповіддю.'}
      </aside>

      <div className="mt-5 space-y-2 text-xs leading-5 text-slate-500">
        <p>
          <strong>Первинна медична допомога:</strong>{' '}
          <a href={antimicrobialStandardSource.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">
            {antimicrobialStandardSource.code} · {antimicrobialStandardSource.title}
          </a>
          . Клінічні картки цього модуля спираються саме на цей стандарт.
        </p>
        <p>
          <strong>Спеціалізована медична допомога:</strong>{' '}
          <a href={antimicrobialSpecializedStandardSource.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline underline-offset-2">
            {antimicrobialSpecializedStandardSource.code} · {antimicrobialSpecializedStandardSource.title}
          </a>
          . Стаціонарні режими винесено в окремий рівень довідника та не змішано з амбулаторними картками.
        </p>
        <p>{antimicrobialSpecializedStandardSource.order}.</p>
      </div>
    </section>
  );
}
