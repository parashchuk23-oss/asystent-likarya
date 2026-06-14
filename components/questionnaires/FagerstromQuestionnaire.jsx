'use client';

import { useState } from 'react';
import { calculateFagerstrom } from '../../utils/calculations';

const questions = [
  {
    key: 'firstCigarette',
    text: 'Через скільки часу після пробудження ви викурюєте першу сигарету?',
    options: [
      { value: 3, label: 'Протягом 5 хвилин' },
      { value: 2, label: '6-30 хвилин' },
      { value: 1, label: '31-60 хвилин' },
      { value: 0, label: 'Після 60 хвилин' },
    ],
  },
  {
    key: 'forbiddenPlaces',
    text: 'Чи важко вам утриматися від куріння в місцях, де це заборонено?',
    options: [
      { value: 1, label: 'Так' },
      { value: 0, label: 'Ні' },
    ],
  },
  {
    key: 'hardestCigarette',
    text: 'Від якої сигарети найважче відмовитися?',
    options: [
      { value: 1, label: 'Від першої ранкової' },
      { value: 0, label: 'Від будь-якої іншої' },
    ],
  },
  {
    key: 'cigarettesPerDay',
    text: 'Скільки сигарет на день ви викурюєте?',
    options: [
      { value: 0, label: '10 або менше' },
      { value: 1, label: '11-20' },
      { value: 2, label: '21-30' },
      { value: 3, label: '31 або більше' },
    ],
  },
  {
    key: 'morningSmoking',
    text: 'Чи курите частіше в перші години після пробудження?',
    options: [
      { value: 1, label: 'Так' },
      { value: 0, label: 'Ні' },
    ],
  },
  {
    key: 'smokeWhenIll',
    text: 'Чи курите, коли хворі й більшу частину дня перебуваєте в ліжку?',
    options: [
      { value: 1, label: 'Так' },
      { value: 0, label: 'Ні' },
    ],
  },
];

const initialAnswers = questions.reduce((answers, question) => {
  answers[question.key] = 0;
  return answers;
}, {});

export default function FagerstromQuestionnaire() {
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
    setResult(calculateFagerstrom(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про тест Fagerström</p>
        <p className="mt-2">
          Тест Fagerström використовується для орієнтовної оцінки фізичної нікотинової
          залежності у курців.
        </p>
        <p className="mt-2">
          Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.key} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">{question.text}</p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => (
                <label key={option.label} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name={`fagerstrom-${question.key}`}
                    value={option.value}
                    checked={answers[question.key] === option.value}
                    onChange={(event) => handleChange(question.key, event.target.value)}
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
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
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
