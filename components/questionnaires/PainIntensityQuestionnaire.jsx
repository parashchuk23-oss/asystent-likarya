'use client';

import { useState } from 'react';
import { calculatePainIntensity } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const numericOptions = Array.from({ length: 11 }, (_item, value) => ({
  value,
  label: `${value}`,
}));

const questions = [
  { key: 'currentPain', text: 'Біль зараз за шкалою 0-10', options: numericOptions },
  { key: 'averagePain', text: 'Середній біль за останній тиждень за шкалою 0-10', options: numericOptions },
  { key: 'worstPain', text: 'Найсильніший біль за останній тиждень за шкалою 0-10', options: numericOptions },
];

const initialAnswers = {
  currentPain: 0,
  averagePain: 0,
  worstPain: 0,
};

function buildCopyText(result) {
  return (
    `Оцінка інтенсивності болю: зараз ${result.currentPain}/10, середній біль ${result.averagePain}/10, ` +
    `найсильніший біль ${result.worstPain}/10. ${result.category} ${result.interpretation}`
  );
}

function NumberScale({ question, value, onChange }) {
  return (
    <div className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
      <label className="text-base font-semibold leading-6 text-slate-900" htmlFor={`pain-${question.key}`}>
        {question.text}
      </label>
      <input
        id={`pain-${question.key}`}
        type="number"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(question.key, event.target.value)}
        className="mt-3 w-full rounded-md border border-slate-300 px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <p className="mt-2 text-sm text-slate-500">0 — болю немає, 10 — найсильніший можливий біль.</p>
    </div>
  );
}

export default function PainIntensityQuestionnaire() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  function handleChange(questionKey, value) {
    const numericValue = Math.min(10, Math.max(0, Number(value || 0)));
    setAnswers((current) => ({
      ...current,
      [questionKey]: numericValue,
    }));
    setResult(null);
    setCopyStatus('');
  }

  function handleCalculate() {
    setResult(calculatePainIntensity(answers));
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
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Інтенсивність болю — NRS / VAS 0-10</p>
        <p className="mt-2">
          Коротка оцінка інтенсивності болю зараз, у середньому та в найгірший період за
          останній тиждень.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {questions.map((question) => (
          <NumberScale
            key={question.key}
            question={question}
            value={answers[question.key]}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton />
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">Результат</p>
        <p className="mt-1 text-3xl font-semibold text-blue-800">
          {result ? `${result.highestPain}/10` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.category || 'Натисніть “Розрахувати” після заповнення полів.'}
        </p>
        {result ? <p className="mt-2 leading-6">{result.interpretation}</p> : null}
      </div>

      {result ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
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

      <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Оцінка інтенсивності болю є допоміжною. Вона не визначає причину болю і має
        інтерпретуватися разом з основним діагнозом, анамнезом, оглядом та функціональним
        впливом болю.
      </p>

      <PrintableQuestionnaire
        title="Інтенсивність болю"
        instruction="Оцініть біль за шкалою 0-10."
        questions={questions}
        options={numericOptions}
        answers={answers}
        result={result}
        scoreLabel="Найвищий бал"
      />
    </div>
  );
}
