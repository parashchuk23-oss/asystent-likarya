'use client';

import { useState } from 'react';
import { calculateStressPerceptionScreening } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const options = [
  { value: 0, label: 'ніколи' },
  { value: 1, label: 'рідко' },
  { value: 2, label: 'іноді' },
  { value: 3, label: 'часто' },
  { value: 4, label: 'майже завжди' },
];

const questions = [
  'Ви відчували, що події виходять з-під контролю',
  'Вам було важко впоратися з кількістю справ або вимог',
  'Ви відчували напруження через непередбачувані ситуації',
  'Вам було важко розслабитися після напруженого дня',
  'Стрес впливав на сон, апетит або самопочуття',
  'Стрес заважав роботі, навчанню або повсякденним справам',
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = 0;
  return answers;
}, {});

function buildCopyText(result) {
  return (
    `Скринінг сприйнятого стресу: ${result.score} із 24 балів. ${result.category} ` +
    result.interpretation
  );
}

function VerticalOptionList({ name, selectedValue, onChange }) {
  return (
    <div className="mt-2 space-y-1">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex w-fit cursor-pointer items-center gap-2 text-base font-medium leading-6 transition ${
            selectedValue === option.value ? 'text-blue-800' : 'text-slate-600 hover:text-blue-700'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(event) => onChange(event.target.value)}
            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function StressPerceptionQuestionnaire() {
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
    setResult(calculateStressPerceptionScreening(answers));
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
        <p className="font-semibold text-slate-900">Скринінг сприйнятого стресу</p>
        <p className="mt-2">
          Коротка оцінка суб’єктивного впливу стресу на контроль, напруження, сон,
          самопочуття та повсякденне функціонування.
        </p>
        <p className="mt-2">
          Це не офіційна електронна версія PSS-10 і не замінює ліцензовану шкалу Perceived
          Stress Scale.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question}
            className="rounded-md border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-100/60"
          >
            <p className="text-sm font-semibold leading-6 text-slate-900">
              {index + 1}. {question}
            </p>
            <VerticalOptionList
              name={`stress-q${index}`}
              selectedValue={answers[`q${index}`]}
              onChange={(value) => handleChange(`q${index}`, value)}
            />
          </div>
        ))}
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
          {result ? `${result.score} із 24` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.category || 'Натисніть “Розрахувати” після заповнення пунктів.'}
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
        Результат не встановлює діагноз і не замінює клінічну оцінку. Стрес потрібно
        інтерпретувати разом із тривогою, депресивними симптомами, болем, сном,
        кардіометаболічними факторами та соціальним контекстом.
      </p>

      <PrintableQuestionnaire
        title="Скринінг сприйнятого стресу"
        instruction="Оцініть, як часто ці стани турбували протягом останнього місяця."
        questions={questions}
        options={options}
        answers={answers}
        result={result}
      />
    </div>
  );
}
