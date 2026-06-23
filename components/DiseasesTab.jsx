'use client';

import { useState } from 'react';
import { hypertensionDisease } from '../data/diseases/hypertension';
import DiseaseTemplateCard from './diseases/DiseaseTemplateCard';

const diseases = [hypertensionDisease];

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

export default function DiseasesTab() {
  const [activeDiseaseId, setActiveDiseaseId] = useState(diseases[0].id);
  const [diagnosisText, setDiagnosisText] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const activeDisease = diseases.find((disease) => disease.id === activeDiseaseId) ?? diseases[0];

  function appendDiagnosis(fragment) {
    const normalizedFragment = fragment.trim();
    if (!normalizedFragment) return;

    setDiagnosisText((current) => {
      const normalizedCurrent = current.trim();
      if (!normalizedCurrent) return normalizedFragment;
      return `${normalizedCurrent}\n${normalizedFragment}`;
    });
  }

  async function copyDiagnosis() {
    const copiedToClipboard = await writeClipboardText(diagnosisText);
    if (!copiedToClipboard) {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2200);
      return;
    }

    setCopyError(false);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div>
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Клінічні шаблони
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Хвороби</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Довідкові блоки для швидкого формулювання діагнозу та рекомендацій. Текст призначений
          для редагування лікарем перед копіюванням у заключення.
        </p>
      </header>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                Робоче поле
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Загальний діагноз</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Додавайте фрагменти з різних хвороб. Порядок, первинність і фінальне формулювання
                лікар редагує самостійно.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDiagnosisText('')}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-700"
            >
              Очистити
            </button>
          </div>

          <textarea
            value={diagnosisText}
            onChange={(event) => setDiagnosisText(event.target.value)}
            rows={14}
            placeholder="Тут зʼявляться додані фрагменти діагнозу. Текст можна редагувати вручну."
            className="mt-4 min-h-[320px] w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={copyDiagnosis}
              disabled={!diagnosisText.trim()}
              className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {copied ? 'Скопійовано' : 'Скопіювати діагноз'}
            </button>
            {copyError ? (
              <p className="text-xs font-medium text-rose-600">
                Не вдалося скопіювати автоматично. Виділіть текст вручну.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Новий фрагмент додається нижче, не стираючи попередній.
              </p>
            )}
          </div>
        </aside>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Хвороби
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {diseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  onClick={() => setActiveDiseaseId(disease.id)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    activeDiseaseId === disease.id
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
                  }`}
                >
                  {disease.title}
                </button>
              ))}
            </div>
          </div>

          <DiseaseTemplateCard disease={activeDisease} onAddDiagnosis={appendDiagnosis} />
        </section>
      </section>
    </div>
  );
}
