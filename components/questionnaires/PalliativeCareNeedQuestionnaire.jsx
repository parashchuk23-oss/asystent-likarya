'use client';

import { useMemo, useState } from 'react';
import { palliativeCareAdultCriteria, palliativeCareSource } from '../../data/palliativeCareCriteria';
import { evaluatePalliativeCareNeed } from '../../utils/calculations';
import { PrintQuestionnaireButton } from './PrintableQuestionnaire';

function toggleItem(items, item) {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

function buildConclusionText(group, selectedScaleCriteria, selectedClinicalCriteria, result) {
  const scaleText = selectedScaleCriteria.map((item) => `- ${item}`).join('\n');
  const clinicalText = selectedClinicalCriteria.map((item) => `- ${item}`).join('\n');

  if (!group) {
    return 'Оберіть основне захворювання або стан пацієнта для формування висновку.';
  }

  const resultText = result?.isConfirmed
    ? 'За результатами оцінки пацієнт відповідає критеріям визначення пацієнта, який потребує паліативної допомоги.'
    : 'За зазначеними даними критерії визначення пацієнта, який потребує паліативної допомоги, не підтверджені.';

  return [
    `Проведено оцінку потреби в паліативній допомозі відповідно до критеріїв наказу МОЗ України №1308 від 04.06.2020.`,
    '',
    `Основне захворювання/стан: ${group.title}.`,
    `Нормативна умова групи: ${group.condition}`,
    '',
    'Встановлені критерії захворювання / функціональної оцінки:',
    scaleText || '- не зазначено',
    '',
    'Виявлені клінічні ознаки / показники:',
    clinicalText || '- не зазначено',
    '',
    resultText,
  ].join('\n');
}

function CheckItem({ checked, label, onChange }) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm leading-5 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

export default function PalliativeCareNeedQuestionnaire() {
  const [groupId, setGroupId] = useState('');
  const [selectedScaleCriteria, setSelectedScaleCriteria] = useState([]);
  const [selectedClinicalCriteria, setSelectedClinicalCriteria] = useState([]);
  const [result, setResult] = useState(null);
  const [copyText, setCopyText] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const selectedGroup = useMemo(
    () => palliativeCareAdultCriteria.find((group) => group.id === groupId) || null,
    [groupId]
  );

  function resetResult() {
    setResult(null);
    setCopyText('');
    setCopyStatus('');
  }

  function handleGroupChange(event) {
    setGroupId(event.target.value);
    setSelectedScaleCriteria([]);
    setSelectedClinicalCriteria([]);
    resetResult();
  }

  function handleScaleToggle(item) {
    setSelectedScaleCriteria((current) => toggleItem(current, item));
    resetResult();
  }

  function handleClinicalToggle(item) {
    setSelectedClinicalCriteria((current) => toggleItem(current, item));
    resetResult();
  }

  function handleCalculate() {
    const evaluation = evaluatePalliativeCareNeed({
      selectedGroup,
      selectedScaleCriteria,
      selectedClinicalCriteria,
    });

    setResult(evaluation);
    setCopyText(buildConclusionText(selectedGroup, selectedScaleCriteria, selectedClinicalCriteria, evaluation));
    setCopyStatus('');
  }

  function handleClear() {
    setGroupId('');
    setSelectedScaleCriteria([]);
    setSelectedClinicalCriteria([]);
    setResult(null);
    setCopyText('');
    setCopyStatus('');
  }

  async function handleCopy() {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus('Висновок скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const resultClassName =
    result?.status === 'confirmed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : result?.status === 'not-confirmed'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-blue-100 bg-blue-50 text-blue-900';

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-950">Оцінка потреби в паліативній допомозі</p>
        <p className="mt-2">
          Оберіть основне захворювання або стан пацієнта. Програма покаже відповідні
          критерії наказу МОЗ №1308 і перевірить нормативну умову для дорослого пацієнта.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
        <label className="block text-sm font-semibold text-slate-800" htmlFor="palliative-care-group">
          Основне захворювання / група станів
        </label>
        <select
          id="palliative-care-group"
          value={groupId}
          onChange={handleGroupChange}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Оберіть групу</option>
          {palliativeCareAdultCriteria.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>

        {selectedGroup ? (
          <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            {selectedGroup.condition}
          </p>
        ) : null}
      </section>

      {selectedGroup ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
                  Ліва колонка додатка 2
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  Захворювання / оцінка за шкалою
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                Обрано: {selectedScaleCriteria.length}
              </span>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {selectedGroup.scaleCriteria.map((criterion) => (
                <CheckItem
                  key={criterion}
                  label={criterion}
                  checked={selectedScaleCriteria.includes(criterion)}
                  onChange={() => handleScaleToggle(criterion)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
                  Права колонка додатка 2
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  Клінічні ознаки / показники
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  selectedClinicalCriteria.length >= 5
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {selectedClinicalCriteria.length}/5
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              За додатком 2 потрібно обрати не менше 5 клінічних ознак / показників.
            </p>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {selectedGroup.clinicalCriteria.map((criterion) => (
                <CheckItem
                  key={criterion}
                  label={criterion}
                  checked={selectedClinicalCriteria.includes(criterion)}
                  onChange={() => handleClinicalToggle(criterion)}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Оцінити
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      {result ? (
        <section className={`rounded-lg border p-4 ${resultClassName}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] opacity-80">Результат</p>
          <h3 className="mt-1 text-xl font-semibold">{result.title}</h3>
          <p className="mt-2 text-sm leading-6">{result.message}</p>

          {result.missingItems.length > 0 ? (
            <div className="mt-3 rounded-md border border-white/70 bg-white/60 p-3 text-sm leading-6">
              <p className="font-semibold">Що ще потрібно для підтвердження:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {copyText ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
          <p className="font-semibold text-slate-950">Текст для копіювання</p>
          <textarea
            value={copyText}
            onChange={(event) => setCopyText(event.target.value)}
            className="mt-3 min-h-72 w-full rounded-md border border-slate-300 p-4 text-sm leading-6 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
            >
              Скопіювати висновок
            </button>
            {copyStatus ? <span className="text-sm text-slate-600">{copyStatus}</span> : null}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Нормативна база</p>
        <p className="mt-2">
          {palliativeCareSource.order} “{palliativeCareSource.title}”. Чинна редакція:{' '}
          {palliativeCareSource.revisionDate}. Актуальність перевірено:{' '}
          {palliativeCareSource.checkedAt}.
        </p>
        <a
          href={palliativeCareSource.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          Відкрити офіційний документ
        </a>
      </section>

      <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Модуль є допоміжним інструментом для лікаря. Він не встановлює діагноз і не
        замінює клінічне рішення, оцінку стану пацієнта та чинні нормативні вимоги.
      </p>
    </div>
  );
}
