'use client';

import { useState } from 'react';
import { calculateGad7 } from '../../utils/calculations';

const questions = [
  'Відчуття нервозності, тривоги або напруження',
  'Неможливість зупинити або контролювати хвилювання',
  'Надмірне хвилювання з різних приводів',
  'Труднощі з розслабленням',
  'Неспокій, важко сидіти спокійно',
  'Легка дратівливість',
  'Страх, що може статися щось жахливе',
];

const options = [
  { value: 0, label: 'Ніколи' },
  { value: 1, label: 'Кілька днів' },
  { value: 2, label: 'Більше половини днів' },
  { value: 3, label: 'Майже щодня' },
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = 0;
  return answers;
}, {});

export default function Gad7Questionnaire({ showIntro = true }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);

  function handleChange(questionKey, value) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: Number(value),
    }));
    setResult(null);
  }

  function handleCalculate() {
    setResult(calculateGad7(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      {showIntro ? (
        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Про GAD-7</p>
          <p className="mt-2">
            GAD-7 використовується для скринінгової оцінки симптомів генералізованої тривоги
            за останні 2 тижні.
          </p>
          <p className="mt-2">
            Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question} className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
            <p className="text-sm font-semibold text-slate-900">{question}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {options.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name={`gad7-q${index}`}
                    value={option.value}
                    checked={answers[`q${index}`] === option.value}
                    onChange={(event) => handleChange(`q${index}`, event.target.value)}
                    className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
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
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">Сума балів</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після заповнення опитувальника.'}
        </p>
      </div>
    </div>
  );
}
