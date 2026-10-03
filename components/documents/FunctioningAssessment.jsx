'use client';

import { useEffect, useMemo, useState } from 'react';
import { functioningCategories, respiratoryAssessmentSections } from '../../data/functioning/respiratoryAssessment';
import {
  assistiveProductVerificationNotice,
  rehabilitationEvidenceCategories,
  rehabilitationPilotRoutes,
} from '../../data/rehabilitation/pilotRoutes';
import { getVerifiedAssistiveProducts } from '../../data/rehabilitation/assistiveProducts';

function Detail({ title, children }) {
  return <div><p className="font-bold text-slate-900">{title}</p><div className="mt-1">{children}</div></div>;
}

function ToolCard({ tool, onOpenQuestionnaire }) {
  const [isOpen, setIsOpen] = useState(false);
  const category = functioningCategories[tool.category];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls={`tool-${tool.id}`} className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-slate-50">
        <div><h4 className="text-base font-bold text-slate-950">{tool.name}</h4><span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>{category.icon} {category.label}</span></div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div id={`tool-${tool.id}`} className="space-y-4 border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
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

function NumericField({ label, value, onChange, unit = 'с' }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label}
      <span className="mt-1 flex items-center gap-2">
        <input type="number" min="0" step="0.01" inputMode="decimal" value={value || ''} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
        <span className="text-slate-500">{unit}</span>
      </span>
    </label>
  );
}

function ProtocolFields({ assessment, result = {}, onChange }) {
  function update(key, value) { onChange({ ...result, [key]: value }); }

  if (assessment.protocolType === 'single-time') {
    return <NumericField label="Час виконання" value={result.time} onChange={(value) => update('time', value)} unit={assessment.resultUnit} />;
  }
  if (assessment.protocolType === 'walk-speed') {
    const speed = Number(result.time) > 0 && Number(result.distance) > 0 ? (Number(result.distance) / Number(result.time)).toFixed(2) : '';
    return <div className="grid gap-3 sm:grid-cols-2"><NumericField label="Оцінювана відстань" value={result.distance} onChange={(value) => update('distance', value)} unit="м" /><NumericField label="Час проходження" value={result.time} onChange={(value) => update('time', value)} unit="с" />{speed && <p className="sm:col-span-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-teal-900">Швидкість ходьби: {speed} м/с</p>}</div>;
  }
  if (assessment.protocolType === 'two-trial-time') {
    const values = [Number(result.trial1), Number(result.trial2)].filter((value) => value > 0);
    const average = values.length === 2 ? ((values[0] + values[1]) / 2).toFixed(2) : '';
    return <div className="grid gap-3 sm:grid-cols-2"><NumericField label="Спроба 1" value={result.trial1} onChange={(value) => update('trial1', value)} unit={assessment.resultUnit} /><NumericField label="Спроба 2" value={result.trial2} onChange={(value) => update('trial2', value)} unit={assessment.resultUnit} />{average && <p className="sm:col-span-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-teal-900">Середній час: {average} с</p>}</div>;
  }
  if (assessment.protocolType === 'bilateral-time') {
    const rightValues = [Number(result.right1), Number(result.right2)].filter((value) => value > 0);
    const leftValues = [Number(result.left1), Number(result.left2)].filter((value) => value > 0);
    const rightAverage = rightValues.length === 2 ? ((rightValues[0] + rightValues[1]) / 2).toFixed(2) : '';
    const leftAverage = leftValues.length === 2 ? ((leftValues[0] + leftValues[1]) / 2).toFixed(2) : '';
    return <div className="grid gap-3 sm:grid-cols-2"><NumericField label="Права рука — спроба 1" value={result.right1} onChange={(value) => update('right1', value)} /><NumericField label="Права рука — спроба 2" value={result.right2} onChange={(value) => update('right2', value)} /><NumericField label="Ліва рука — спроба 1" value={result.left1} onChange={(value) => update('left1', value)} /><NumericField label="Ліва рука — спроба 2" value={result.left2} onChange={(value) => update('left2', value)} />{(rightAverage || leftAverage) && <p className="sm:col-span-2 rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-teal-900">Середній час: права рука — {rightAverage || 'не завершено'} с; ліва рука — {leftAverage || 'не завершено'} с</p>}</div>;
  }
  return null;
}

function AssessmentCard({ assessment, onOpenQuestionnaire, result, onResultChange }) {
  const category = rehabilitationEvidenceCategories[assessment.category];
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h5 className="font-bold text-slate-950">{assessment.name}</h5><p className="mt-1 text-sm leading-6 text-slate-600">{assessment.measures}</p></div>
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>{category.icon} {category.label}</span>
      </div>
      {assessment.licenseNotice && <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-950">{assessment.licenseNotice}</p>}
      {assessment.source && <a href={assessment.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-blue-700 underline decoration-blue-200 underline-offset-2">{assessment.source.label}</a>}
      {assessment.questionnaireId && onOpenQuestionnaire && <button type="button" onClick={() => onOpenQuestionnaire(assessment.questionnaireId)} className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto">Провести тест →</button>}
      {assessment.implementation === 'protocol' && <div className="mt-4 border-t border-slate-200 pt-4"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-teal-800">Внести результат</p><ProtocolFields assessment={assessment} result={result} onChange={onResultChange} /><p className="mt-3 text-xs leading-5 text-slate-500">Результат документується без автоматичного визначення норми, тяжкості або юридичного статусу.</p></div>}
    </article>
  );
}

function formatProtocolResult(assessment, result) {
  if (!result) return '';
  if (assessment.protocolType === 'single-time' && Number(result.time) > 0) return `${assessment.resultLabel}: ${result.time} ${assessment.resultUnit}`;
  if (assessment.protocolType === 'walk-speed' && Number(result.time) > 0 && Number(result.distance) > 0) return `${assessment.resultLabel}: ${result.distance} м за ${result.time} с, швидкість ${(Number(result.distance) / Number(result.time)).toFixed(2)} м/с`;
  if (assessment.protocolType === 'two-trial-time' && Number(result.trial1) > 0 && Number(result.trial2) > 0) return `${assessment.resultLabel}: ${result.trial1} с і ${result.trial2} с, середній час ${((Number(result.trial1) + Number(result.trial2)) / 2).toFixed(2)} с`;
  if (assessment.protocolType === 'bilateral-time') {
    const right = [Number(result.right1), Number(result.right2)].filter((value) => value > 0);
    const left = [Number(result.left1), Number(result.left2)].filter((value) => value > 0);
    if (!right.length && !left.length) return '';
    return `${assessment.resultLabel}: права рука — ${right.length === 2 ? `${((right[0] + right[1]) / 2).toFixed(2)} с (середнє)` : 'оцінювання не завершено'}, ліва рука — ${left.length === 2 ? `${((left[0] + left[1]) / 2).toFixed(2)} с (середнє)` : 'оцінювання не завершено'}`;
  }
  return '';
}

function buildDraft(route, diagnosis, selectedDomains, protocolResults, assistiveProducts) {
  const domains = route.domains.filter((domain) => selectedDomains.includes(domain.id));
  if (!domains.length) return '';
  const assessments = domains.flatMap((domain) => domain.assessments.map((item) => item.name)).filter((name, index, values) => values.indexOf(name) === index);
  const measuredResults = domains.flatMap((domain) => domain.assessments.map((assessment) => formatProtocolResult(assessment, protocolResults[assessment.id]))).filter(Boolean);
  return [
    `Діагноз: ${diagnosis.code} — ${diagnosis.title}.`,
    `Потребують об’єктивізації такі функціональні домени: ${domains.map((domain) => domain.title.toLowerCase()).join(', ')}.`,
    `Для документування можуть бути використані: ${assessments.join(', ')}.`,
    measuredResults.length ? `Внесені результати: ${measuredResults.join('; ')}.` : 'Кількісні результати функціональних тестів ще не внесено.',
    domains.map((domain) => domain.rehabilitationNeed).join(' '),
    assistiveProducts.length ? `Нормативно перевірені категорії ДЗР, які можна розглянути після підтвердження функціональних умов: ${assistiveProducts.map((product) => product.productName).join(', ')}. Це не є призначенням.` : 'Для обраних доменів у MVP ще немає вручну перевіреної нормативної відповідності ДЗР.',
    'Категорії допоміжних засобів реабілітації не визначаються лише за кодом МКХ. Остаточна потреба, конкретний вид ДЗР і маршрут забезпечення встановлюються після індивідуального функціонального та/або реабілітаційного оцінювання відповідно до чинного порядку.',
  ].join('\n\n');
}

function DiagnosisRoute({ onOpenQuestionnaire }) {
  const [routeId, setRouteId] = useState(rehabilitationPilotRoutes[0].id);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [copied, setCopied] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [protocolResults, setProtocolResults] = useState({});
  const [icdCode, setIcdCode] = useState(rehabilitationPilotRoutes[0].code);
  const route = rehabilitationPilotRoutes.find((item) => item.id === routeId) || rehabilitationPilotRoutes[0];
  const selected = route.domains.filter((domain) => selectedDomains.includes(domain.id));
  const diagnosis = route.icdOptions
    ? route.icdOptions.find((item) => item.code === icdCode) || { code: route.code, title: 'підкод не уточнено' }
    : { code: route.code, title: route.title };
  const assistiveProducts = useMemo(() => getVerifiedAssistiveProducts(route.id, selectedDomains), [route.id, selectedDomains]);
  const draft = useMemo(() => buildDraft(route, diagnosis, selectedDomains, protocolResults, assistiveProducts), [route, diagnosis, selectedDomains, protocolResults, assistiveProducts]);

  useEffect(() => {
    setDraftText(draft);
  }, [draft]);

  function selectRoute(nextId) {
    const nextRoute = rehabilitationPilotRoutes.find((item) => item.id === nextId) || rehabilitationPilotRoutes[0];
    setRouteId(nextId);
    setIcdCode(nextRoute.icdOptions ? '' : nextRoute.code);
    setSelectedDomains([]);
    setProtocolResults({});
    setCopied(false);
  }
  function toggleDomain(domainId) {
    setSelectedDomains((current) => current.includes(domainId) ? current.filter((id) => id !== domainId) : [...current, domainId]);
    setCopied(false);
  }
  async function copyDraft() {
    if (!draftText || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(draftText);
    setCopied(true);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <label htmlFor="rehabilitation-route" className="text-sm font-bold text-slate-950">Діагноз / код МКХ</label>
        <select id="rehabilitation-route" value={route.id} onChange={(event) => selectRoute(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 sm:max-w-xl">
          {rehabilitationPilotRoutes.map((item) => <option key={item.id} value={item.id}>{item.code} — {item.title}</option>)}
        </select>
        <h3 className="mt-5 text-xl font-bold text-slate-950">{route.code} — {route.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{route.description}</p>
        <p className="mt-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold leading-6 text-blue-950">{route.codeNotice}</p>
        {route.icdOptions && <div className="mt-4"><label htmlFor="rehabilitation-icd-subcode" className="text-sm font-bold text-slate-950">Уточнений підкод МКХ</label><select id="rehabilitation-icd-subcode" value={icdCode} onChange={(event) => { setIcdCode(event.target.value); setCopied(false); }} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"><option value="" disabled>Оберіть підкод</option>{route.icdOptions.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.title}</option>)}</select>{route.classificationSource && <a href={route.classificationSource.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-blue-700 underline">{route.classificationSource.label}</a>}</div>}
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-slate-950">1. Що потрібно оцінити</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">Позначте домени, які потребують документування. Це список для оцінки, а не підтвердження порушення.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {route.domains.map((domain) => {
            const checked = selectedDomains.includes(domain.id);
            return (
              <label key={domain.id} className={`cursor-pointer rounded-lg border p-4 transition ${checked ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-300'}`}>
                <span className="flex items-start gap-3"><input type="checkbox" checked={checked} onChange={() => toggleDomain(domain.id)} className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600" /><span><span className="block font-bold text-slate-950">{domain.title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{domain.prompt}</span></span></span>
              </label>
            );
          })}
        </div>
      </section>

      {selected.length > 0 && <>
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div><h3 className="text-lg font-bold text-slate-950">2. Як об’єктивізувати</h3><p className="mt-1 text-sm leading-6 text-slate-600">Інструменти не стають нормативними критеріями, якщо цього прямо не встановлює законодавство.</p></div>
          {selected.map((domain) => <div key={domain.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"><h4 className="font-bold text-slate-950">{domain.title}</h4><div className="mt-3 grid gap-3 lg:grid-cols-2">{domain.assessments.map((assessment) => <AssessmentCard key={assessment.id} assessment={assessment} onOpenQuestionnaire={onOpenQuestionnaire} result={protocolResults[assessment.id]} onResultChange={(result) => setProtocolResults((current) => ({ ...current, [assessment.id]: result }))} />)}</div></div>)}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-950">3. Можливі реабілітаційні потреби</h3>
          <div className="mt-3 space-y-3">{selected.map((domain) => <article key={domain.id} className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950"><p className="font-bold">{domain.title}</p><p className="mt-1">{domain.rehabilitationNeed}</p><p className="mt-1 text-xs font-semibold">Хто оцінює: {domain.assessor}</p></article>)}</div>
        </section>

        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-blue-950">4. {assistiveProductVerificationNotice.title}</h3><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${rehabilitationEvidenceCategories.normative.classes}`}>🔵 Нормативний рівень</span></div>
          <p className="mt-2 text-sm leading-6 text-blue-950">{assistiveProductVerificationNotice.text}</p>
          {assistiveProducts.length > 0 ? <div className="mt-4 space-y-3">{assistiveProducts.map((product) => <article key={product.id} className="rounded-lg border border-blue-200 bg-white p-4 text-sm leading-6 text-slate-700"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{product.category}</p><h4 className="mt-1 font-bold text-slate-950">{product.productName}</h4><p className="mt-1 text-xs font-semibold text-slate-500">{product.classification}</p></div><span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900">🔵 Перевірено</span></div><div className="mt-4 grid gap-3 lg:grid-cols-2"><Detail title="Нормативна умова">{product.normativeCondition}</Detail><Detail title="Що потрібно підтвердити">{product.evidenceNeeded}</Detail><Detail title="Хто оцінює">{product.assessedBy}</Detail><Detail title="Хто підбирає / призначає">{product.selectedBy}</Detail><Detail title="Документ">{product.formedDocument}</Detail></div><div className="mt-4 flex flex-wrap gap-2">{product.sources.map((source) => <a key={`${product.id}-${source.id}`} href={source.officialUrl} target="_blank" rel="noreferrer" className="rounded-md bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 underline">№{source.actNumber}: {source.section}</a>)}</div></article>)}</div> : <p className="mt-4 rounded-md border border-dashed border-blue-300 bg-white px-3 py-3 text-sm font-semibold text-blue-950">Для обраних доменів немає позиції, яка пройшла повну ручну нормативну перевірку. Непідтверджені засоби не показуються.</p>}
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-amber-950">5. Чого не вистачає</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950"><li>✓ Діагноз і функціональні домени обрано.</li>{route.icdOptions && <li>{icdCode ? `✓ Уточнено підкод ${icdCode}.` : '⚠ Підкод I69 ще не уточнено.'}</li>}<li>{Object.values(protocolResults).some((result) => Object.values(result).some((value) => Number(value) > 0)) ? '✓ Внесено щонайменше один кількісний результат.' : '⚠ Кількісні результати запропонованих тестів ще не внесено.'}</li><li>⚠ Функціональне порушення має бути підтверджене клінічно.</li><li>{assistiveProducts.length ? '✓ Для обраного домену є вручну перевірена нормативна відповідність ДЗР; індивідуальну потребу ще потрібно оцінити.' : '⚠ Для обраного домену нормативна відповідність ДЗР у MVP ще не підтверджена.'}</li></ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-950">Чернетка функціонального заключення</h3><p className="mt-1 text-sm text-slate-600">Клінічна чернетка, а не рішення ЕКОПФО чи призначення ДЗР.</p></div><button type="button" onClick={copyDraft} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">{copied ? 'Скопійовано' : 'Копіювати'}</button></div>
          <textarea value={draftText} onChange={(event) => { setDraftText(event.target.value); setCopied(false); }} rows={12} className="mt-4 w-full rounded-md border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-800" />
        </section>
      </>}
    </div>
  );
}

function RespiratoryAssessment({ onOpenQuestionnaire }) {
  const section = respiratoryAssessmentSections[0];
  return <section className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5"><div className="mb-5"><h3 className="text-lg font-bold text-slate-950">{section.title}</h3><p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{section.description}</p></div><div className="grid gap-3">{section.tools.map((tool) => <ToolCard key={tool.id} tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />)}</div><p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{section.note}</p></section>;
}

export default function FunctioningAssessment({ onOpenQuestionnaire }) {
  const [mode, setMode] = useState('diagnosis');
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Оцінювання функціонування</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Функціональне оцінювання та реабілітаційні потреби</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">Перехід від діагнозу до документування конкретних функціональних порушень, способів їх об’єктивізації та можливої потреби в оцінюванні фахівцями з реабілітації.</p><div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">Це не калькулятор групи інвалідності. Інструмент не встановлює інвалідність, не замінює експертну або мультидисциплінарну реабілітаційну команду і не створює автоматичного права на ДЗР.</div></section>
      <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setMode('diagnosis')} className={`rounded-lg border p-4 text-left ${mode === 'diagnosis' ? 'border-blue-300 bg-blue-50 text-blue-950' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><span className="block font-bold">За діагнозом / МКХ</span><span className="mt-1 block text-sm">Пілотні маршрути G35 та I69.x</span></button><button type="button" onClick={() => setMode('respiratory')} className={`rounded-lg border p-4 text-left ${mode === 'respiratory' ? 'border-blue-300 bg-blue-50 text-blue-950' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><span className="block font-bold">Дихальна система</span><span className="mt-1 block text-sm">Чинний каталог досліджень та інструментів</span></button></div>
      {mode === 'diagnosis' ? <DiagnosisRoute onOpenQuestionnaire={onOpenQuestionnaire} /> : <RespiratoryAssessment onOpenQuestionnaire={onOpenQuestionnaire} />}
      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600"><h3 className="font-bold text-slate-950">Як користуватися</h3><p className="mt-1">Поєднуйте клінічні об’єктивні докази з інструментами, що безпосередньо описують фізичну спроможність або повсякденне функціонування. Остаточну інтерпретацію виконує лікар з урахуванням клінічного контексту та чинної редакції нормативних документів.</p></section>
    </div>
  );
}
