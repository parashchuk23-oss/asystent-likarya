'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateBMI } from '../../utils/calculations';

const initialFormData = {
  weight: '',
  height: '',
};

function getBmiInterpretation(bmi) {
  const numericBmi = Number(bmi);

  if (!numericBmi) return 'Введіть вагу та зріст для розрахунку ІМТ.';
  if (numericBmi < 18.5) return 'Недостатня маса тіла.';
  if (numericBmi < 25) return 'Нормальна маса тіла.';
  if (numericBmi < 30) return 'Надлишкова маса тіла.';
  if (numericBmi < 35) return 'Ожиріння I ступеня.';
  if (numericBmi < 40) return 'Ожиріння II ступеня.';
  return 'Ожиріння III ступеня.';
}

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

export default function BmiCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const isCalculateEnabled = hasPositiveNumber(formData.weight) && hasPositiveNumber(formData.height);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!isCalculateEnabled) return;

    const bmi = calculateBMI(formData.weight, formData.height);
    setResult({
      bmi,
      interpretation: getBmiInterpretation(bmi),
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про калькулятор BMI (ІМТ)</p>
        <p className="mt-2">
          BMI, або індекс маси тіла, використовується для орієнтовної оцінки співвідношення
          маси тіла та зросту.
        </p>
        <p className="mt-2">
          У кардіології ІМТ допомагає швидко оцінити надлишкову масу тіла як фактор
          серцево-судинного ризику.
        </p>
        <p className="mt-2">
          Калькулятор є допоміжним інструментом і не замінює клінічне рішення лікаря.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Маса тіла" hint="кг">
          <input
            type="number"
            value={formData.weight}
            onChange={(event) => handleChange('weight', event.target.value)}
            className={inputClass}
            placeholder="75"
            min="1"
            step="0.1"
          />
        </FormField>

        <FormField label="Зріст" hint="см">
          <input
            type="number"
            value={formData.height}
            onChange={(event) => handleChange('height', event.target.value)}
            className={inputClass}
            placeholder="170"
            min="1"
            step="0.1"
          />
        </FormField>
      </div>

      <div className="mt-1 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!isCalculateEnabled}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
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

      <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">ІМТ</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.bmi || '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після введення даних.'}
        </p>
      </div>
    </>
  );
}
