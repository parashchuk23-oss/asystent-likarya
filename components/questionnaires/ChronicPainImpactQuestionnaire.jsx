'use client';

import { useState } from 'react';
import { calculateGcpsR } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const painFrequencyOptions = [
  { value: 'none', label: 'не було болю' },
  { value: 'some', label: 'деякі дні' },
  { value: 'most', label: 'більшість днів' },
  { value: 'every', label: 'щодня' },
];

const activityLimitationOptions = [
  { value: 'none', label: 'не обмежував' },
  { value: 'some', label: 'деякі дні' },
  { value: 'most', label: 'більшість днів' },
  { value: 'every', label: 'щодня' },
];

const numericOptions = Array.from({ length: 11 }, (_item, value) => ({
  value,
  label: `${value}`,
}));

const printQuestions = [
  {
    key: 'painFrequency',
    text: 'Як часто біль був присутній протягом останніх 3 місяців?',
    options: painFrequencyOptions,
  },
  {
    key: 'activityLimitation',
    text: 'Як часто біль обмежував життя або роботу протягом останніх 3 місяців?',
    options: activityLimitationOptions,
  },
  {
    key: 'pain',
    text: 'Наскільки сильним був біль у середньому?',
    options: numericOptions,
  },
  {
    key: 'enjoyment',
    text: 'Наскільки біль заважав отримувати задоволення від життя?',
    options: numericOptions,
  },
  {
    key: 'activity',
    text: 'Наскільки біль заважав повсякденній активності?',
    options: numericOptions,
  },
];

const initialAnswers = {
  painFrequency: 'some',
  activityLimitation: 'none',
  pain: 0,
  enjoyment: 0,
  activity: 0,
};

function buildCopyText(result) {
  return (
    `GCPS-R / PEG: ${result.grade}, PEG ${result.pegAverage}/10. ${result.category} ` +
    result.interpretation
  );
}

function RadioList({ name, options, value, onChange }) {
  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
            value === option.value
              ? 'border-blue-300 bg-blue-50 text-blue-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(event) => onChange(event.target.value)}
            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        type="number"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 px-4 py-2.5 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <span className="mt-1 block text-xs text-slate-500">0 — не заважав, 10 — максимально.</span>
    </label>
  );
}

export default function ChronicPainImpactQuestionnaire() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  function updateAnswer(key, value) {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
    setResult(null);
    setCopyStatus('');
  }

  function updateNumber(key, value) {
    const numericValue = Math.min(10, Math.max(0, Number(value || 0)));
    updateAnswer(key, numericValue);
  }

  function handleCalculate() {
    setResult(calculateGcpsR(answers));
    setCopyStatus('');
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
    setCopyStatus('');
  }

  async function handleCopyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(buildCopyText(result));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Хронічний біль — GCPS-R / PEG</p>
        <p className="mt-2">
          Коротка оцінка частоти болю, функціонального впливу та середнього PEG-показника.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-100/60">
          <p className="text-sm font-semibold text-slate-900">
            Як часто біль був присутній протягом останніх 3 місяців?
          </p>
          <RadioList
            name="gcps-pain-frequency"
            options={painFrequencyOptions}
            value={answers.painFrequency}
            onChange={(value) => updateAnswer('painFrequency', value)}
          />
        </div>

        <div className="rounded-md border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-100/60">
          <p className="text-sm font-semibold text-slate-900">
            Як часто біль обмежував життя або роботу?
          </p>
          <RadioList
            name="gcps-activity-limitation"
            options={activityLimitationOptions}
            value={answers.activityLimitation}
            onChange={(value) => updateAnswer('activityLimitation', value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-100/60">
        <p className="text-sm font-semibold text-slate-900">PEG 0-10</p>
        <div className="mt-2 grid gap-3 lg:grid-cols-3">
          <NumberField
            label="Біль у середньому"
            value={answers.pain}
            onChange={(value) => updateNumber('pain', value)}
          />
          <NumberField
            label="Задоволення від життя"
            value={answers.enjoyment}
            onChange={(value) => updateNumber('enjoyment', value)}
          />
          <NumberField
            label="Повсякденна активність"
            value={answers.activity}
            onChange={(value) => updateNumber('activity', value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton />
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-900">
        <p className="text-slate-600">Результат</p>
        <p className="mt-1 text-3xl font-semibold text-blue-800">
          {result ? `${result.grade}` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">PEG:</span>{' '}
          {result ? `${result.pegAverage}/10` : 'Натисніть “Розрахувати”.'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span> {result?.category || '—'}
        </p>
        {result ? <p className="mt-2 leading-6">{result.interpretation}</p> : null}
      </div>

      {result ? (
        <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Текст для медичної документації</p>
          <p className="mt-2 leading-6">{buildCopyText(result)}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopyResult}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
            >
              Скопіювати результат
            </button>
            {copyStatus ? <span className="text-sm text-slate-600">{copyStatus}</span> : null}
          </div>
        </div>
      ) : null}

      <p className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
        GCPS-R / PEG допомагає структуровано оцінити вплив хронічного болю, але не встановлює
        причину болю та не замінює клінічну оцінку лікаря.
      </p>

      <PrintableQuestionnaire
        title="Хронічний біль — GCPS-R / PEG"
        instruction="Оцініть частоту болю та вплив на життя за останні 3 місяці."
        questions={printQuestions}
        answers={answers}
        result={result}
        scoreLabel="PEG"
      />
    </div>
  );
}
