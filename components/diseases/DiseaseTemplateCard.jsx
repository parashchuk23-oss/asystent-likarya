'use client';

import { useMemo, useState } from 'react';

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

  const fullTemplate = useMemo(() => buildFullTemplate(disease), [disease]);

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
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-950">Приклади діагнозу</h4>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'diagnoses',
                  disease.diagnosisExamples.map((example) => example.text).join('\n\n'),
                )
              }
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              {copiedKey === 'diagnoses' ? 'Скопійовано' : 'Скопіювати'}
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {disease.diagnosisExamples.map((example) => (
              <div key={example.title} className="rounded-md border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {example.title}
                </p>
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
