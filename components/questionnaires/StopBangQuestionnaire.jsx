'use client';

import { useState } from 'react';
import { calculateStopBang } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const questions = [
  { key: 'snoring', text: 'Гучне хропіння' },
  { key: 'tired', text: 'Денна втома або сонливість' },
  { key: 'observedApnea', text: 'Хтось помічав зупинки дихання уві сні' },
  { key: 'pressure', text: 'Підвищений артеріальний тиск або лікування гіпертензії' },
  { key: 'bmi', text: 'ІМТ >35 кг/м²' },
  { key: 'age', text: 'Вік >50 років' },
  { key: 'neck', text: 'Велика окружність шиї' },
  { key: 'gender', text: 'Чоловіча стать' },
];

const options = [
  { value: 0, label: 'Ні' },
  { value: 1, label: 'Так' },
];

const initialAnswers = questions.reduce((answers, question) => {
  answers[question.key] = 0;
  return answers;
}, {});

export default function StopBangQuestionnaire() {
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
    setResult(calculateStopBang(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про STOP-Bang</p>
        <p className="mt-2">
          STOP-Bang використовується для скринінгу ризику обструктивного апное сну.
        </p>
        <p className="mt-2">
          Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.key} className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
            <p className="text-sm font-semibold text-slate-900">{question.text}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {options.map((option) => (
                <label key={option.label} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name={`stopbang-${question.key}`}
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
        <p className="text-slate-600">Сума балів</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після заповнення опитувальника.'}
        </p>
      </div>

      <PrintableQuestionnaire
        title="STOP-Bang"
        instruction="Позначте відповідь “Так” або “Ні” для кожного пункту."
        questions={questions}
        options={options}
      />
    </div>
  );
}
