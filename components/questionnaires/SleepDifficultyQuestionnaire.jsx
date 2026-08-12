'use client';

import { useState } from 'react';
import { calculateSleepDifficultyScreening } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const options = [
  { value: 0, label: 'немає' },
  { value: 1, label: 'легко' },
  { value: 2, label: 'помірно' },
  { value: 3, label: 'значно' },
  { value: 4, label: 'дуже значно' },
];

const questions = [
  'Труднощі із засинанням',
  'Пробудження вночі або поверхневий сон',
  'Раннє пробудження без можливості знову заснути',
  'Незадоволеність якістю сну',
  'Вплив сну на денну активність, увагу або працездатність',
  'Занепокоєння або напруження через сон',
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = 0;
  return answers;
}, {});

function buildCopyText(result) {
  return (
    `Скринінг порушення сну: ${result.score} із 24 балів. ${result.category} ` +
    result.interpretation
  );
}

function QuestionCard({ question, index, value, onChange }) {
  return (
    <div className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
      <p className="text-base font-semibold leading-6 text-slate-900">
        {index + 1}. {question}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-5">
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
              name={`sleep-q${index}`}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(`q${index}`, event.target.value)}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function SleepDifficultyQuestionnaire() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  function handleChange(questionKey, value) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: Number(value),
    }));
    setResult(null);
    setCopyStatus('');
  }

  function handleCalculate() {
    setResult(calculateSleepDifficultyScreening(answers));
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
        <p className="font-semibold text-slate-900">Скринінг порушення сну</p>
        <p className="mt-2">
          Короткий модуль за основними доменами безсоння: засинання, підтримання сну,
          раннє пробудження, якість сну та денний вплив.
        </p>
        <p className="mt-2">
          Це не офіційна електронна версія ISI і не замінює ліцензований Insomnia Severity
          Index.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
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
          {result ? `${result.score} із 24` : '—'}
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
        Результат є допоміжною клінічною підказкою. Безсоння оцінюється з урахуванням
        тривалості симптомів, режиму сну, болю, тривоги, депресивних симптомів, апное сну,
        ліків, кофеїну, алкоголю та соматичного стану.
      </p>

      <PrintableQuestionnaire
        title="Скринінг порушення сну"
        instruction="Оцініть кожен пункт за останні 2-4 тижні."
        questions={questions}
        options={options}
        answers={answers}
        result={result}
      />
    </div>
  );
}
