'use client';

import { useMemo, useState } from 'react';
import {
  antimicrobialConditions,
  antimicrobialGeneralRules,
  antimicrobialSpecializedStandardSource,
  antimicrobialStandardSource,
  awareGroups,
} from '../../data/antimicrobial/primaryCareStandard';

const sections = [
  { id: 'conditions', label: 'Клінічні стани' },
  { id: 'aware', label: 'AWaRe' },
  { id: 'rules', label: 'Загальні правила' },
  { id: 'documentation', label: 'Обґрунтування призначення' },
];

function ConditionCard({ condition, isOpen, onToggle }) {
  const panelId = `antimicrobial-${condition.id}`;

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

          {condition.adultRegimens.length ? (
            <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-4">
              <h4 className="text-sm font-semibold text-slate-900">Режими для дорослих зі стандарту</h4>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {condition.adultRegimens.map((item) => <li key={item}>• {item}</li>)}
              </ul>
              {condition.duration ? <p className="mt-3 text-sm font-medium text-slate-800">Тривалість: {condition.duration}</p> : null}
            </div>
          ) : null}

          {condition.pediatricNote ? (
            <p className="mt-4 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <strong>Діти:</strong> {condition.pediatricNote}
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
  const [activeSection, setActiveSection] = useState('conditions');

  return (
    <section>
      <div className="rounded-md border border-teal-200 bg-teal-50/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Первинна медична допомога</p>
        <h3 className="mt-1 text-xl font-semibold text-slate-950">Антимікробна терапія</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Практичний навігатор за чинним стандартом МОЗ. Він допомагає перевірити показання, режим для дорослого, AWaRe-категорію та обов’язкову документацію, але не призначає антибіотик автоматично.
        </p>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {antimicrobialStandardSource.code} · {antimicrobialStandardSource.order}
        </p>
      </div>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Розділи антимікробної терапії">
        {sections.map((section) => (
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
        {activeSection === 'conditions' ? <ClinicalConditions /> : null}
        {activeSection === 'aware' ? <AwareReference /> : null}
        {activeSection === 'rules' ? <GeneralRules /> : null}
        {activeSection === 'documentation' ? <DocumentationGenerator /> : null}
      </div>

      <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        Не використовуйте довідник як автоматичне призначення. Перед терапією перевірте алергії, вагітність, вік, масу тіла, функцію нирок і печінки, взаємодії, локальну резистентність та офіційну інструкцію. Педіатричні суперечності стандарту навмисно не автоматизовані.
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
          . Використовуйте для випадків, що виходять за межі первинної допомоги; її режими не включені до амбулаторних карток вище.
        </p>
        <p>{antimicrobialSpecializedStandardSource.order}.</p>
      </div>
    </section>
  );
}
