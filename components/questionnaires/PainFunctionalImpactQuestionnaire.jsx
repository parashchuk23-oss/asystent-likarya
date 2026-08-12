'use client';

import { useState } from 'react';
import { calculatePainFunctionalImpact } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const options = Array.from({ length: 11 }, (_item, value) => ({
  value,
  label: `${value}`,
}));

const questions = [
  'Сон',
  'Ходьба або пересування',
  'Звичайна фізична активність',
  'Самообслуговування',
  'Робота або навчання',
  'Настрій',
  'Соціальна активність або побутові справи',
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = 0;
  return answers;
}, {});

function buildCopyText(result) {
  return (
    `Функціональний вплив болю: середній бал ${result.average}/10, сума ${result.score} із 70. ` +
    `${result.category} ${result.interpretation}`
  );
}

function ImpactField({ question, index, value, onChange }) {
  return (
    <label className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
      <span className="block text-base font-semibold leading-6 text-slate-900">
        {index + 1}. {question}
      </span>
      <input
        type="number"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(`q${index}`, event.target.value)}
        className="mt-3 w-full rounded-md border border-slate-300 px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
      <span className="mt-2 block text-sm text-slate-500">
        0 — не заважає, 10 — максимально заважає.
      </span>
    </label>
  );
}

export default function PainFunctionalImpactQuestionnaire() {
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
    setResult(calculatePainFunctionalImpact(answers));
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
        <p className="font-semibold text-slate-900">Функціональний вплив болю</p>
        <p className="mt-2">
          Спрощений практичний модуль для оцінки того, як біль впливає на сон, рух,
          самообслуговування, роботу, настрій і побут.
        </p>
        <p className="mt-2">
          Це не офіційний BPI short form і не замінює ліцензований Brief Pain Inventory.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {questions.map((question, index) => (
          <ImpactField
            key={question}
            question={question}
            index={index}
            value={answers[`q${index}`]}
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
          {result ? `${result.average}/10` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.category || 'Натисніть “Розрахувати” після заповнення пунктів.'}
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
        Результат є допоміжною оцінкою функціонального впливу болю. Він не визначає причину
        болю, тип болю або показання до лікування. Остаточне рішення приймає лікар.
      </p>

      <PrintableQuestionnaire
        title="Функціональний вплив болю"
        instruction="Оцініть, наскільки біль заважає кожній сфері від 0 до 10."
        questions={questions}
        options={options}
        answers={answers}
        result={result}
        scoreLabel="Середній бал"
      />
    </div>
  );
}
