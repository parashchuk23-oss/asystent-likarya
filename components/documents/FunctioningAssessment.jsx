'use client';

import { useMemo, useState } from 'react';
import { getVerifiedAssistiveProductsByIcdCode } from '../../data/rehabilitation/assistiveProducts';

const supportedDiagnoses = [
  { code: 'G35', title: 'Розсіяний склероз', aliases: ['g35', 'розсіяний склероз', 'множинний склероз'] },
  { code: 'I69', title: 'Наслідки цереброваскулярної хвороби', aliases: ['i69', 'наслідки інсульту', 'інсульт', 'цереброваскулярна хвороба'] },
];

function resolveDiagnosis(value) {
  const query = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!query) return null;
  const codeMatch = query.toUpperCase().match(/^(G35|I69(?:\.[0-9A-Z]+)?)/);
  if (codeMatch) {
    const baseCode = codeMatch[1].startsWith('I69') ? 'I69' : 'G35';
    return { ...supportedDiagnoses.find((item) => item.code === baseCode), enteredCode: codeMatch[1] };
  }
  const diagnosis = supportedDiagnoses.find((item) => item.aliases.some((alias) => query.includes(alias)));
  return diagnosis ? { ...diagnosis, enteredCode: diagnosis.code } : null;
}

function ProductList({ title, items, tone }) {
  const classes = tone === 'rose'
    ? 'border-rose-200 bg-rose-50 text-rose-950'
    : 'border-emerald-200 bg-emerald-50 text-emerald-950';
  return (
    <section className={`rounded-lg border p-4 ${classes}`}>
      <h4 className="font-bold">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm leading-6">
        {items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">•</span><span>{item}</span></li>)}
      </ul>
    </section>
  );
}

function AssistiveProductCard({ product }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{product.category}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-950">{product.productName}</h3>
      <p className="mt-1 text-xs font-semibold text-slate-500">{product.classification}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ProductList title="Показання для розгляду" items={product.indications} tone="emerald" />
        <ProductList title="Протипоказання / коли не рекомендувати" items={product.contraindications} tone="rose" />
      </div>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-bold">Що має підтвердити лікар</p>
        <p className="mt-1">{product.evidenceNeeded}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.sources.map((source) => (
          <a key={`${product.id}-${source.id}`} href={source.officialUrl} target="_blank" rel="noreferrer" className="rounded-md bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 underline decoration-blue-200 underline-offset-2">
            №{source.actNumber}: {source.section}
          </a>
        ))}
      </div>
    </article>
  );
}

export default function FunctioningAssessment() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const diagnosis = useMemo(() => resolveDiagnosis(submittedQuery), [submittedQuery]);
  const products = useMemo(() => getVerifiedAssistiveProductsByIcdCode(diagnosis?.enteredCode), [diagnosis]);
  const searched = Boolean(submittedQuery);

  function submit(event) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  function selectDiagnosis(item) {
    setQuery(`${item.code} — ${item.title}`);
    setSubmittedQuery(item.code);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Реабілітаційні засоби</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Пошук засобів за діагнозом або кодом МКХ-10</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Введіть код або назву діагнозу. Програма покаже лише засоби, для яких відповідність вручну перевірена за чинними нормативними документами.</p>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="rehabilitation-diagnosis" className="sr-only">Діагноз або код МКХ-10</label>
          <input id="rehabilitation-diagnosis" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Наприклад: G35, I69.3 або наслідки інсульту" autoComplete="off" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          <button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800">Знайти засоби</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {supportedDiagnoses.map((item) => (
            <button key={item.code} type="button" onClick={() => selectDiagnosis(item)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50">
              {item.code} — {item.title}
            </button>
          ))}
        </div>
      </section>

      {!searched && <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm leading-6 text-slate-600">Результат з’явиться після введення діагнозу. Зараз перевірені пілотні маршрути для G35 та I69.x.</section>}

      {searched && !diagnosis && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <h3 className="font-bold">Для цього діагнозу ще немає перевіреної відповідності</h3>
          <p className="mt-1">Не показуємо неперевірені засоби. Спробуйте код G35 або I69.x.</p>
        </section>
      )}

      {diagnosis && (
        <section className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Знайдений діагноз</p>
            <h3 className="mt-1 text-lg font-bold">{diagnosis.enteredCode} — {diagnosis.title}</h3>
            <p className="mt-2 text-sm leading-6">Код МКХ звужує перелік, але не призначає засіб автоматично. Потрібно підтвердити наведені функціональні показання та виключити протипоказання.</p>
          </div>
          {products.length > 0
            ? products.map((product) => <AssistiveProductCard key={product.id} product={product} />)
            : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">Для цього коду немає засобів із завершеною ручною нормативною перевіркою.</div>}
        </section>
      )}

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-bold">Важливо</p>
        <p className="mt-1">Результат є довідковим переліком для клінічного розгляду. Конкретний вид засобу та маршрут забезпечення визначаються після індивідуального функціонального оцінювання відповідно до чинної редакції нормативних документів.</p>
      </section>
    </div>
  );
}
