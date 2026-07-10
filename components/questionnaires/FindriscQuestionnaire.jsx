'use client';

import { Fragment, useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateBMI, calculateFindrisc } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

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

const initialHelperData = {
  sex: '',
  weight: '',
  height: '',
  waist: '',
};

function parsePositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getFindriscBmiScore(weight, height) {
  const bmi = calculateBMI(weight, height);
  const numericBmi = parsePositiveNumber(bmi);

  if (numericBmi === null) return null;
  if (numericBmi < 25) return 0;
  if (numericBmi <= 30) return 1;
  return 3;
}

function getFindriscWaistScore(sex, waist) {
  const numericWaist = parsePositiveNumber(waist);

  if (!sex || numericWaist === null) return null;

  if (sex === 'male') {
    if (numericWaist < 94) return 0;
    if (numericWaist <= 102) return 3;
    return 4;
  }

  if (sex === 'female') {
    if (numericWaist < 80) return 0;
    if (numericWaist <= 88) return 3;
    return 4;
  }

  return null;
}

function SexSegmentedControl({ value, onChange }) {
  const options = [
    { value: 'male', label: 'Чоловік' },
    { value: 'female', label: 'Жінка' },
  ];

  return (
    <div className="grid h-[42px] grid-cols-2 rounded-md border border-slate-300 bg-white p-1 shadow-sm shadow-slate-100">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(isSelected ? '' : option.value)}
            className={`rounded px-3 text-sm font-semibold transition ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FindriscQuestionnaire({ showIntro = true }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [helperData, setHelperData] = useState(initialHelperData);
  const [result, setResult] = useState(null);

  function handleChange(questionKey, value) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: Number(value),
    }));
    setResult(null);
  }

  function handleHelperChange(field, value) {
    const nextHelperData = {
      ...helperData,
      [field]: value,
    };
    const bmiScore = getFindriscBmiScore(nextHelperData.weight, nextHelperData.height);
    const waistScore = getFindriscWaistScore(nextHelperData.sex, nextHelperData.waist);

    setHelperData(nextHelperData);
    setAnswers((current) => ({
      ...current,
      ...(bmiScore !== null ? { bmi: bmiScore } : {}),
      ...(waistScore !== null ? { waist: waistScore } : {}),
    }));
    setResult(null);
  }

  function handleCalculate() {
    setResult(calculateFindrisc(answers));
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setHelperData(initialHelperData);
    setResult(null);
  }

  const calculatedBmi = calculateBMI(helperData.weight, helperData.height);
  const hasCalculatedBmi = Boolean(calculatedBmi);

  function renderHelperBlock() {
    return (
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Автоматичний розрахунок ІМТ і талії</p>
        <p className="mt-1">
          Цей блок потрібен лише для автоматичного заповнення FINDRISC і не друкується у бланку.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField label="Стать">
            <SexSegmentedControl
              value={helperData.sex}
              onChange={(value) => handleHelperChange('sex', value)}
            />
          </FormField>

          <FormField label="Маса тіла" hint="кг">
            <input
              type="number"
              value={helperData.weight}
              onChange={(event) => handleHelperChange('weight', event.target.value)}
              className={inputClass}
              placeholder="86"
              min="1"
              step="0.1"
            />
          </FormField>

          <FormField label="Зріст" hint="см">
            <input
              type="number"
              value={helperData.height}
              onChange={(event) => handleHelperChange('height', event.target.value)}
              className={inputClass}
              placeholder="170"
              min="1"
              step="0.1"
            />
          </FormField>

          <FormField label="Окружність талії" hint="см">
            <input
              type="number"
              value={helperData.waist}
              onChange={(event) => handleHelperChange('waist', event.target.value)}
              className={inputClass}
              placeholder="92"
              min="1"
              step="0.1"
            />
          </FormField>
        </div>
        <p className="text-xs text-slate-500">
          {hasCalculatedBmi
            ? `Розрахований ІМТ: ${calculatedBmi} кг/м². Відповіді “ІМТ” та “Окружність талії” можна змінити вручну, якщо потрібно.`
            : 'Після введення маси тіла та зросту програма автоматично вибере категорію ІМТ.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showIntro ? (
        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Про FINDRISC</p>
          <p className="mt-2">
            FINDRISC використовується для орієнтовної оцінки ризику розвитку цукрового
            діабету 2 типу протягом наступних років.
          </p>
          <p className="mt-2">
            Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        {questions.map((question) => (
          <Fragment key={question.key}>
            <div className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
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
            {question.key === 'age' ? renderHelperBlock() : null}
          </Fragment>
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
        title="FINDRISC"
        instruction="Оберіть один варіант відповіді в кожному пункті."
        questions={questions}
      />
    </div>
  );
}
