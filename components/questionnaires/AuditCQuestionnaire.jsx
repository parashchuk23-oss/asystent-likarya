'use client';

import { useState } from 'react';
import { calculateAuditC } from '../../utils/calculations';

const questions = [
  {
    key: 'frequency',
    text: 'Як часто ви вживаєте алкоголь?',
    options: [
      { value: 0, label: 'Ніколи' },
      { value: 1, label: 'Раз на місяць або рідше' },
      { value: 2, label: '2-4 рази на місяць' },
      { value: 3, label: '2-3 рази на тиждень' },
      { value: 4, label: '4 або більше разів на тиждень' },
    ],
  },
  {
    key: 'quantity',
    text: 'Скільки стандартних порцій алкоголю ви зазвичай вживаєте за день?',
    options: [
      { value: 0, label: '1-2' },
      { value: 1, label: '3-4' },
      { value: 2, label: '5-6' },
      { value: 3, label: '7-9' },
      { value: 4, label: '10 або більше' },
    ],
  },
  {
    key: 'binge',
    text: 'Як часто ви вживаєте 6 або більше порцій алкоголю за один раз?',
    options: [
      { value: 0, label: 'Ніколи' },
      { value: 1, label: 'Рідше ніж раз на місяць' },
      { value: 2, label: 'Щомісяця' },
      { value: 3, label: 'Щотижня' },
      { value: 4, label: 'Щодня або майже щодня' },
    ],
  },
];

const initialAnswers = questions.reduce((answers, question) => {
  answers[question.key] = 0;
  return answers;
}, {});

export default function AuditCQuestionnaire() {
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
    setResult(calculateAuditC(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про AUDIT-C</p>
        <p className="mt-2">
          AUDIT-C використовується для короткого скринінгу ризикованого вживання алкоголю.
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
                    name={`auditc-${question.key}`}
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
