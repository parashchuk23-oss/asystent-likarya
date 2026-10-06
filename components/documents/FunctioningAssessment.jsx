'use client';

import { useMemo, useState } from 'react';
import { functioningCategories, respiratoryAssessmentSections } from '../../data/functioning/respiratoryAssessment';
import { order774EntryCount, order774Source, searchOrder774 } from '../../data/rehabilitation/order774Search';

const searchExamples = [
  { code: 'G35', title: 'Розсіяний склероз' },
  { code: 'I69', title: 'Наслідки інсульту' },
  { code: 'M17', title: 'Гонартроз' },
  { code: 'S72', title: 'Перелом стегнової кістки' },
];

function Detail({ title, children }) {
  return <div><p className="font-bold text-slate-900">{title}</p><div className="mt-1">{children}</div></div>;
}

function RespiratoryToolCard({ tool, onOpenQuestionnaire }) {
  const [isOpen, setIsOpen] = useState(false);
  const category = functioningCategories[tool.category];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls={`respiratory-tool-${tool.id}`} className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-slate-50">
        <div>
          <h4 className="text-base font-bold text-slate-950">{tool.name}</h4>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>{category.icon} {category.label}</span>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div id={`respiratory-tool-${tool.id}`} className="space-y-4 border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
          <Detail title="Що вимірює">{tool.measures}</Detail>
          {tool.indications && <Detail title="Основні показання">{tool.indications}</Detail>}
          <Detail title="Що документує для функціональної оцінки">{tool.documents}</Detail>
          {tool.metrics && <Detail title="Основні показники"><ul className="list-disc space-y-1 pl-5">{tool.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></Detail>}
          {tool.protocol && <Detail title="Як виконати">{tool.protocol}</Detail>}
          {tool.interpretation && <Detail title="Інтерпретація">{tool.interpretation}</Detail>}
          <Detail title="Обмеження">{tool.limitations}</Detail>
          {tool.licenseNotice && <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-semibold text-amber-900">{tool.licenseNotice}</div>}
          <div><p className="font-bold text-slate-900">Джерело</p><a href={tool.source.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">{tool.source.label}</a></div>
          {tool.questionnaireId && onOpenQuestionnaire && <button type="button" onClick={() => onOpenQuestionnaire(tool.questionnaireId)} className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 sm:w-auto">{tool.actionLabel || 'Провести тест →'}</button>}
        </div>
      )}
    </article>
  );
}

function RespiratoryAssessment({ onOpenQuestionnaire }) {
  const section = respiratoryAssessmentSections[0];
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{section.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{section.title}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{section.description}</p>
      </div>
      <div className="grid gap-3">
        {section.tools.map((tool) => <RespiratoryToolCard key={tool.id} tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />)}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{section.note}</p>
    </section>
  );
}

function AssistiveProductCard({ product }) {
  const pages = product.pageStart === product.pageEnd ? `стор. ${product.pageStart}` : `стор. ${product.pageStart}–${product.pageEnd}`;
  return (
    <article className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="text-base font-bold leading-6 text-slate-950">{product.productName}</h3>
      <p className="mt-0.5 text-xs leading-5 text-slate-500">{product.classification}</p>
      <div className="mt-3 grid gap-x-6 gap-y-3 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Показання</h4>
          <p className="mt-1 text-sm leading-5 text-slate-700">{product.indications}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Протипоказання</h4>
          <p className="mt-1 text-sm leading-5 text-slate-700">{product.contraindications}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-700"><span className="font-bold text-slate-900">Перевірити:</span> функціональну потребу в засобі та відсутність наведених протипоказань.</p>
      <a href={order774Source.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-blue-700 underline underline-offset-2">Наказ №774/2691, {pages}</a>
    </article>
  );
}

export default function FunctioningAssessment({ onOpenQuestionnaire }) {
  const [mode, setMode] = useState('diagnosis');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const products = useMemo(() => searchOrder774(submittedQuery), [submittedQuery]);
  const searched = Boolean(submittedQuery);

  function submit(event) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setVisibleCount(12);
  }

  function selectDiagnosis(item) {
    setQuery(`${item.code} — ${item.title}`);
    setSubmittedQuery(item.code);
    setVisibleCount(12);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => setMode('diagnosis')} className={`rounded-xl border p-4 text-left transition ${mode === 'diagnosis' ? 'border-teal-400 bg-teal-50 text-teal-950' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-slate-50'}`}>
          <span className="block font-bold">Засоби за діагнозом / МКХ</span>
          <span className="mt-1 block text-sm">Пошук по всьому переліку наказу №774/2691</span>
        </button>
        <button type="button" onClick={() => setMode('respiratory')} className={`rounded-xl border p-4 text-left transition ${mode === 'respiratory' ? 'border-teal-400 bg-teal-50 text-teal-950' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-slate-50'}`}>
          <span className="block font-bold">Дихальна система</span>
          <span className="mt-1 block text-sm">Дослідження, ХОЗЛ, астма та функціональні тести</span>
        </button>
      </div>

      {mode === 'diagnosis' ? <>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Реабілітаційні засоби</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Пошук засобів за діагнозом або кодом МКХ-10</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Введіть код МКХ-10 або назву діагнозу. Пошук працює локально по {order774EntryCount} позиціях офіційного переліку.</p>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="rehabilitation-diagnosis" className="sr-only">Діагноз або код МКХ-10</label>
          <input id="rehabilitation-diagnosis" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Наприклад: G35, M17.1 або розсіяний склероз" autoComplete="off" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          <button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800">Знайти засоби</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {searchExamples.map((item) => (
            <button key={item.code} type="button" onClick={() => selectDiagnosis(item)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50">
              {item.code} — {item.title}
            </button>
          ))}
        </div>
      </section>

      {!searched && <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm leading-6 text-slate-600">Введіть код МКХ-10 або назву діагнозу — результат з’явиться одразу після пошуку.</section>}

      {searched && products.length === 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
          <h3 className="font-bold text-slate-950">Збігів у наказі не знайдено</h3>
          <p className="mt-1">Перевірте код МКХ-10 або введіть коротшу офіційну назву діагнозу.</p>
        </section>
      )}

      {searched && products.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-950">Знайдено: {products.length}</h3>
            <p className="text-xs text-slate-500">Нормативна відповідність за наказом №774/2691</p>
          </div>
          {products.slice(0, visibleCount).map((product) => <AssistiveProductCard key={product.id} product={product} />)}
          {visibleCount < products.length && <button type="button" onClick={() => setVisibleCount((count) => count + 12)} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50">Показати ще {Math.min(12, products.length - visibleCount)}</button>}
        </section>
      )}

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Важливо</p>
          <p className="mt-1">Діагноз лише звужує нормативний перелік і не є автоматичним призначенням. Конкретний засіб визначають після індивідуального функціонального оцінювання та перевірки чинної редакції документа.</p>
        </section>
      </> : <RespiratoryAssessment onOpenQuestionnaire={onOpenQuestionnaire} />}
    </div>
  );
}
