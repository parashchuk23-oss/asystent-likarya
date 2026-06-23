'use client';

import { useEffect, useMemo, useState } from 'react';

function getInitialConstructorState(disease) {
  return {
    stage: disease.diagnosisConstructor?.stages?.[1]?.value ?? '',
    grade: disease.diagnosisConstructor?.grades?.[1]?.value ?? '',
    risk: disease.diagnosisConstructor?.risks?.[2]?.value ?? '',
    targetOrganDamage: [],
    comorbidities: [],
    additionalText: '',
  };
}

function buildFullTemplate(disease) {
  const diagnosisBlock = disease.diagnosisExamples
    .map((example) => `${example.title}:\n${example.text}`)
    .join('\n\n');

  return `${disease.title}

Діагностичні орієнтири:
${disease.diagnosticCriteria.map((item) => `- ${item}`).join('\n')}

Приклади формулювання діагнозу:
${diagnosisBlock}

${disease.recommendationTemplate}`;
}

function buildDiagnosisFromState(state) {
  const baseParts = [state.stage, state.grade, state.risk].filter(Boolean);
  const detailParts = [
    ...state.targetOrganDamage,
    ...state.comorbidities,
    state.additionalText.trim(),
  ].filter(Boolean);

  const base = `Гіпертонічна хвороба ${baseParts.join(', ')}.`;
  if (!detailParts.length) return base;

  return `${base} ${detailParts.join('. ')}.`;
}

async function writeClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  }
}

export default function DiseaseTemplateCard({ disease }) {
  const [copiedKey, setCopiedKey] = useState('');
  const [copyError, setCopyError] = useState(false);
  const [constructorState, setConstructorState] = useState(() =>
    getInitialConstructorState(disease),
  );
  const [diagnosisDraft, setDiagnosisDraft] = useState('');

  const fullTemplate = useMemo(() => buildFullTemplate(disease), [disease]);
  const constructedDiagnosis = useMemo(
    () => buildDiagnosisFromState(constructorState),
    [constructorState],
  );

  useEffect(() => {
    setDiagnosisDraft(constructedDiagnosis);
  }, [constructedDiagnosis]);

  function updateConstructorValue(field, value) {
    setConstructorState((current) => ({ ...current, [field]: value }));
  }

  function toggleConstructorItem(field, value) {
    setConstructorState((current) => {
      const currentValues = current[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return { ...current, [field]: nextValues };
    });
  }

  async function copyText(key, text) {
    const copied = await writeClipboardText(text);
    if (!copied) {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2200);
      return;
    }

    setCopyError(false);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(''), 1600);
  }

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {disease.category}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">{disease.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{disease.summary}</p>
          </div>
          <button
            type="button"
            onClick={() => copyText('all', fullTemplate)}
            className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:w-auto"
          >
            {copiedKey === 'all' ? 'Скопійовано' : 'Скопіювати все'}
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section>
          <h4 className="text-sm font-semibold text-slate-950">Діагностичні орієнтири</h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {disease.diagnosticCriteria.map((item) => (
              <li key={item} className="rounded-md border border-slate-100 bg-white px-3 py-2">
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-5 text-sm font-semibold text-slate-950">Що уточнити для діагнозу</h4>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {disease.constructorFields.map((item) => (
              <li key={item} className="rounded-md bg-slate-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-950">Конструктор діагнозу</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Стадія</span>
              <select
                value={constructorState.stage}
                onChange={(event) => updateConstructorValue('stage', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.stages.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Ступінь</span>
              <select
                value={constructorState.grade}
                onChange={(event) => updateConstructorValue('grade', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.grades.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Ризик</span>
              <select
                value={constructorState.risk}
                onChange={(event) => updateConstructorValue('risk', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.risks.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-semibold text-slate-600">
                Ураження органів-мішеней
              </legend>
              <div className="mt-2 space-y-2">
                {disease.diagnosisConstructor.targetOrganDamage.map((item) => (
                  <label
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={constructorState.targetOrganDamage.includes(item)}
                      onChange={() => toggleConstructorItem('targetOrganDamage', item)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold text-slate-600">Супутні стани</legend>
              <div className="mt-2 space-y-2">
                {disease.diagnosisConstructor.comorbidities.map((item) => (
                  <label
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={constructorState.comorbidities.includes(item)}
                      onChange={() => toggleConstructorItem('comorbidities', item)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">
              Додатково вручну
            </span>
            <input
              type="text"
              value={constructorState.additionalText}
              onChange={(event) => updateConstructorValue('additionalText', event.target.value)}
              placeholder="Наприклад: ГЛШ за даними ЕхоКГ, ХХН G2 A1"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Сформований діагноз
                </p>
                <textarea
                  value={diagnosisDraft}
                  onChange={(event) => setDiagnosisDraft(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={() => copyText('constructed-diagnosis', diagnosisDraft)}
                className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
              >
                {copiedKey === 'constructed-diagnosis' ? 'Скопійовано' : 'Скопіювати діагноз'}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-950">Приклади діагнозу</h4>
            <p className="text-xs text-slate-500">Кожен приклад копіюється окремо.</p>
          </div>

          <div className="mt-3 space-y-3">
            {disease.diagnosisExamples.map((example, index) => (
              <div key={example.title} className="rounded-md border border-slate-200 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {example.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(`diagnosis-example-${index}`, example.text)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                  >
                    {copiedKey === `diagnosis-example-${index}` ? 'Скопійовано' : 'Скопіювати'}
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-800">
                  {example.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="border-t border-slate-100 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-950">Шаблон рекомендацій</h4>
            {copyError ? (
              <p className="mt-1 text-xs font-medium text-rose-600">
                Не вдалося скопіювати автоматично. Виділіть текст вручну.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => copyText('recommendations', disease.recommendationTemplate)}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            {copiedKey === 'recommendations' ? 'Скопійовано' : 'Скопіювати рекомендації'}
          </button>
        </div>
        <div className="mt-3 max-h-[420px] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">
            {disease.recommendationTemplate}
          </pre>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-amber-50 px-5 py-4 text-sm leading-6 text-slate-700">
        <p>{disease.disclaimer}</p>
        <p className="mt-2 text-xs text-slate-500">{disease.sourceNote}</p>
      </footer>
    </article>
  );
}
