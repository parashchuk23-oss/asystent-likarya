'use client';

import { useState } from 'react';
import { calculateFindrisc } from '../../utils/calculations';

const questions = [
  {
    key: 'age',
    text: 'Вік',
    options: [
      { value: 0, label: 'До 45 років' },
      { value: 2, label: '45-54 роки' },
      { value: 3, label: '55-64 роки' },
      { value: 4, label: 'Понад 64 роки' },
    ],
  },
  {
    key: 'bmi',
    text: 'ІМТ',
    options: [
      { value: 0, label: '<25 кг/м²' },
      { value: 1, label: '25-30 кг/м²' },
      { value: 3, label: '>30 кг/м²' },
    ],
  },
  {
    key: 'waist',
    text: 'Окружність талії',
    options: [
      { value: 0, label: 'Нижче порогового рівня' },
      { value: 3, label: 'Помірно підвищена' },
      { value: 4, label: 'Виражено підвищена' },
    ],
  },
  {
    key: 'activity',
    text: 'Фізична активність щонайменше 30 хв щодня',
    options: [
      { value: 0, label: 'Так' },
      { value: 2, label: 'Ні' },
    ],
  },
  {
    key: 'vegetables',
    text: 'Щоденне вживання овочів, фруктів або ягід',
    options: [
      { value: 0, label: 'Так' },
      { value: 1, label: 'Ні' },
    ],
  },
  {
    key: 'bloodPressureTreatment',
    text: 'Прийом препаратів від підвищеного артеріального тиску',
    options: [
      { value: 0, label: 'Ні' },
      { value: 2, label: 'Так' },
    ],
  },
  {
    key: 'highGlucose',
    text: 'Колись виявляли підвищену глюкозу крові',
    options: [
      { value: 0, label: 'Ні' },
      { value: 5, label: 'Так' },
    ],
  },
  {
    key: 'familyDiabetes',
    text: 'Цукровий діабет у родичів',
    options: [
      { value: 0, label: 'Ні' },
      { value: 3, label: 'Так, у родичів другого ступеня' },
      { value: 5, label: 'Так, у батьків, дітей, братів або сестер' },
    ],
  },
];

const initialAnswers = questions.reduce((answers, question) => {
  answers[question.key] = 0;
  return answers;
}, {});

export default function FindriscQuestionnaire() {
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
    setResult(calculateFindrisc(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про FINDRISC</p>
        <p className="mt-2">
          FINDRISC використовується для орієнтовної оцінки ризику розвитку цукрового
          діабету 2 типу протягом наступних років.
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
                    name={`findrisc-${question.key}`}
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
