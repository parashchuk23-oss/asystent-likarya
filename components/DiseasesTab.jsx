'use client';

import { useState } from 'react';
import { hypertensionDisease } from '../data/diseases/hypertension';
import { ihdDisease } from '../data/diseases/ihd';
import { heartFailureDisease } from '../data/diseases/heartFailure';
import { atrialFibrillationDisease } from '../data/diseases/atrialFibrillation';
import DiseaseTemplateCard from './diseases/DiseaseTemplateCard';

const diseases = [
  hypertensionDisease,
  ihdDisease,
  heartFailureDisease,
  atrialFibrillationDisease,
];

const recommendationSections = [
  { key: 'labs', label: 'Лабораторні' },
  { key: 'instrumental', label: 'Інструментальні' },
  { key: 'consultations', label: 'Консультації' },
];

function addUniqueItems(target, items = []) {
  items.forEach((item) => {
    if (!target.some((currentItem) => currentItem.id === item.id)) {
      target.push(item);
    }
  });
}

function inferDiseaseIdsFromDiagnosis(text) {
  const normalizedText = text.toLowerCase();
  const inferredIds = [];

  if (
    normalizedText.includes('гіпертонічна хвороба') ||
    normalizedText.includes('артеріальна гіпертензія')
  ) {
    inferredIds.push('hypertension');
  }

  if (normalizedText.includes('іхс') || normalizedText.includes('стенокарді')) {
    inferredIds.push('ihd');
  }

  if (normalizedText.includes('серцева недостатність')) {
    inferredIds.push('heartFailure');
  }

  if (normalizedText.includes('фібриляція передсердь')) {
    inferredIds.push('atrialFibrillation');
  }

  return inferredIds;
}

function formatRecommendationText(groups) {
  const labsText = groups.labs.map((item) => item.text).join(', ');
  const instrumentalText = groups.instrumental.map((item) => item.text).join(', ');
  const consultationsText = groups.consultations.map((item) => item.text).join(', ');
  const lifestyleText = groups.lifestyle.map((item) => `- ${item.text};`).join('\n');
  const medicationsText = groups.medications.map((item) => `- ${item.text};`).join('\n');

  return `Рекомендації:

1. Дообстеження
Лабораторні: ${labsText || 'за клінічними показами'}.
Інструментальні: ${instrumentalText || 'за клінічними показами'}.
Консультації: ${consultationsText || 'за клінічними показами'}.

2. Спосіб життя
${lifestyleText || '- індивідуальні рекомендації щодо способу життя;'}

3. Медикаментозна терапія
${medicationsText || '- визначити індивідуально з урахуванням клінічного стану пацієнта;'}`;
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

export default function DiseasesTab() {
  const [diagnosisText, setDiagnosisText] = useState('');
  const [icdDiagnosisText, setIcdDiagnosisText] = useState('');
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState([]);
  const [generatedRecommendationsText, setGeneratedRecommendationsText] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedIcd, setCopiedIcd] = useState(false);
  const [copiedGeneratedRecommendations, setCopiedGeneratedRecommendations] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [icdCopyError, setIcdCopyError] = useState(false);
  const [generatedRecommendationsCopyError, setGeneratedRecommendationsCopyError] = useState(false);
  const [activeDiseaseId, setActiveDiseaseId] = useState(diseases[0].id);

  const activeDisease = diseases.find((disease) => disease.id === activeDiseaseId) ?? diseases[0];

  function appendDiagnosis(fragment, icd10Fragment = '', diseaseId = '') {
    const normalizedFragment = fragment.trim();
    if (!normalizedFragment) return;

    setDiagnosisText((current) => {
      const normalizedCurrent = current.trim();
      if (!normalizedCurrent) return normalizedFragment;
      return `${normalizedCurrent}\n${normalizedFragment}`;
    });

    if (diseaseId) {
      setSelectedDiseaseIds((currentIds) => {
        if (currentIds.includes(diseaseId)) return currentIds;
        return [...currentIds, diseaseId];
      });
    }

    const normalizedIcd10Fragment = icd10Fragment.trim();
    if (!normalizedIcd10Fragment) return;

    setIcdDiagnosisText((current) => {
      const normalizedCurrent = current.trim();
      if (!normalizedCurrent) return normalizedIcd10Fragment;
      return `${normalizedCurrent}\n${normalizedIcd10Fragment}`;
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

  async function copyIcdDiagnosis() {
    const copiedToClipboard = await writeClipboardText(icdDiagnosisText);
    if (!copiedToClipboard) {
      setIcdCopyError(true);
      window.setTimeout(() => setIcdCopyError(false), 2200);
      return;
    }

    setIcdCopyError(false);
    setCopiedIcd(true);
    window.setTimeout(() => setCopiedIcd(false), 1600);
  }

  function generateRecommendations() {
    const diseaseIdsFromText = inferDiseaseIdsFromDiagnosis(diagnosisText);
    const uniqueDiseaseIds = [...new Set([...selectedDiseaseIds, ...diseaseIdsFromText])];
    const groupedItems = {
      labs: [],
      instrumental: [],
      consultations: [],
      lifestyle: [],
      medications: [],
    };

    uniqueDiseaseIds.forEach((diseaseId) => {
      const disease = diseases.find((item) => item.id === diseaseId);
      const recommendationGroups = disease?.recommendationGroups;
      if (!recommendationGroups) return;

      recommendationSections.forEach((section) => {
        addUniqueItems(groupedItems[section.key], recommendationGroups[section.key]);
      });
      addUniqueItems(groupedItems.lifestyle, recommendationGroups.lifestyle);
      addUniqueItems(groupedItems.medications, recommendationGroups.medications);
    });

    setGeneratedRecommendationsText(formatRecommendationText(groupedItems));
  }

  async function copyGeneratedRecommendations() {
    const copiedToClipboard = await writeClipboardText(generatedRecommendationsText);
    if (!copiedToClipboard) {
      setGeneratedRecommendationsCopyError(true);
      window.setTimeout(() => setGeneratedRecommendationsCopyError(false), 2200);
      return;
    }

    setGeneratedRecommendationsCopyError(false);
    setCopiedGeneratedRecommendations(true);
    window.setTimeout(() => setCopiedGeneratedRecommendations(false), 1600);
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

      <div className="mt-5 flex flex-wrap gap-2">
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

      <section className="mt-6 grid items-start gap-5 xl:grid-cols-2">
        <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {activeDisease.category}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">{activeDisease.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{activeDisease.summary}</p>
          </header>

          <div className="p-5">
            <div className="rounded-lg border border-slate-200">
              <details open>
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-950">
                  Діагностичні орієнтири
                </summary>
                <ul className="space-y-2 border-t border-slate-100 p-4 text-sm leading-6 text-slate-600">
                  {activeDisease.diagnosticCriteria.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </article>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <DiseaseTemplateCard disease={activeDisease} onAddDiagnosis={appendDiagnosis} />
        </section>
      </section>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
            onClick={() => {
              setDiagnosisText('');
              setIcdDiagnosisText('');
              setSelectedDiseaseIds([]);
              setGeneratedRecommendationsText('');
            }}
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

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                Кодування
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Діагноз за МКХ-10</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                МКХ-10 формується як довідкова підказка.
              </p>
            </div>
          </div>

          <textarea
            value={icdDiagnosisText}
            onChange={(event) => setIcdDiagnosisText(event.target.value)}
            rows={7}
            placeholder="Тут зʼявляться коди МКХ-10 для доданих діагнозів."
            className="mt-4 min-h-[180px] w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={copyIcdDiagnosis}
              disabled={!icdDiagnosisText.trim()}
              className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {copiedIcd ? 'Скопійовано' : 'Скопіювати МКХ-10'}
            </button>
            {icdCopyError ? (
              <p className="text-xs font-medium text-rose-600">
                Не вдалося скопіювати автоматично. Виділіть текст вручну.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                Шаблон для редагування
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">Рекомендації</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Список формується з доданих діагнозів і прибирає однакові пункти.
              </p>
            </div>
            <button
              type="button"
              onClick={generateRecommendations}
              disabled={!diagnosisText.trim()}
              className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Сформувати рекомендації
            </button>
          </div>

          <textarea
            value={generatedRecommendationsText}
            onChange={(event) => setGeneratedRecommendationsText(event.target.value)}
            rows={12}
            placeholder="Тут зʼявиться зведений шаблон рекомендацій після натискання кнопки."
            className="mt-4 min-h-[260px] w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={copyGeneratedRecommendations}
              disabled={!generatedRecommendationsText.trim()}
              className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {copiedGeneratedRecommendations ? 'Скопійовано' : 'Скопіювати рекомендації'}
            </button>
            {generatedRecommendationsCopyError ? (
              <p className="text-xs font-medium text-rose-600">
                Не вдалося скопіювати автоматично. Виділіть текст вручну.
              </p>
            ) : null}
          </div>
        </div>
      </section>

    </div>
  );
}
