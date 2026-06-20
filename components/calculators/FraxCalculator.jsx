'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateFractureRisk } from '../../utils/calculations';

const initialFormData = {
  age: '',
  sex: '',
  weight: '',
  height: '',
  previousFracture: false,
  parentalHipFracture: false,
  currentSmoking: false,
  glucocorticoids: false,
  rheumatoidArthritis: false,
  secondaryOsteoporosis: false,
  alcoholThreeOrMore: false,
  femoralNeckTScore: '',
};

const riskFields = [
  { key: 'previousFracture', label: 'Попередній перелом у дорослому віці' },
  { key: 'parentalHipFracture', label: 'Перелом стегна у батьків' },
  { key: 'currentSmoking', label: 'Поточне куріння' },
  { key: 'glucocorticoids', label: 'Глюкокортикоїди' },
  { key: 'rheumatoidArthritis', label: 'Ревматоїдний артрит' },
  { key: 'secondaryOsteoporosis', label: 'Вторинний остеопороз' },
  { key: 'alcoholThreeOrMore', label: 'Алкоголь ≥3 одиниці/день' },
];

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
      <span className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>{label}</span>
      </span>
      <span className="shrink-0 text-slate-500">Так</span>
    </label>
  );
}

export default function FraxCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const isCalculateEnabled =
    hasPositiveNumber(formData.age) &&
    hasPositiveNumber(formData.weight) &&
    hasPositiveNumber(formData.height) &&
    Boolean(formData.sex);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!isCalculateEnabled) return;
    setResult(calculateFractureRisk(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        Структурує основні клінічні фактори ризику остеопоротичних переломів, але не
        розраховує офіційну 10-річну ймовірність FRAX.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Вік" hint="років" required>
          <input
            type="number"
            value={formData.age}
            onChange={(event) => handleChange('age', event.target.value)}
            className={inputClass}
            placeholder="65"
            min="1"
            step="1"
          />
        </FormField>

        <FormField label="Стать" required>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'female', label: 'Жінка' },
              { value: 'male', label: 'Чоловік' },
            ].map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-md border px-3 py-2.5 text-center text-sm font-semibold transition ${
                  formData.sex === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-blue-200'
                }`}
              >
                <input
                  type="radio"
                  name="fracture-risk-sex"
                  value={option.value}
                  checked={formData.sex === option.value}
                  onChange={(event) => handleChange('sex', event.target.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Маса тіла" hint="кг" required>
          <input
            type="number"
            value={formData.weight}
            onChange={(event) => handleChange('weight', event.target.value)}
            className={inputClass}
            placeholder="70"
            min="1"
            step="0.1"
          />
        </FormField>

        <FormField label="Зріст" hint="см" required>
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

      <div className="grid gap-3 border-t border-slate-100 pt-5">
        {riskFields.map((field) => (
          <CheckboxField
            key={field.key}
            label={field.label}
            checked={formData[field.key]}
            onChange={(value) => handleChange(field.key, value)}
          />
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <FormField label="T-score шийки стегна" hint="необов’язково">
          <input
            type="number"
            value={formData.femoralNeckTScore}
            onChange={(event) => handleChange('femoralNeckTScore', event.target.value)}
            className={inputClass}
            placeholder="-2.5"
            step="0.1"
          />
        </FormField>
        <p className="-mt-2 text-xs leading-relaxed text-slate-500">
          T-score буде показано в результаті, але не змінюватиме категорію без офіційного
          алгоритму FRAX.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
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

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
          <p className="text-slate-600">Клінічні фактори</p>
          <p className="text-3xl font-semibold text-blue-800">{result?.factorCount ?? '—'}</p>
        </div>
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
          <p className="text-slate-600">BMI</p>
          <p className="text-3xl font-semibold text-blue-800">{result?.bmi ?? '—'}</p>
        </div>
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
          <p className="text-slate-600">T-score</p>
          <p className="text-3xl font-semibold text-blue-800">{result?.tScore ?? '—'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p>
          <span className="font-semibold">Орієнтовний рівень ризику:</span>{' '}
          {result?.interpretation || 'Заповніть обов’язкові поля та натисніть “Розрахувати”.'}
        </p>
        <p className="mt-2 text-slate-700">
          Для точного розрахунку 10-річного ризику використовуйте офіційний FRAX або
          локально валідований інструмент.
        </p>
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
        Цей модуль не є офіційним FRAX-розрахунком, а лише структуровано оцінює основні
        фактори ризику остеопоротичних переломів.
      </div>

      <section className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700">
        <h3 className="font-semibold text-slate-900">Клінічне застосування</h3>
        <p className="mt-2">
          Модуль використовують для первинного структурування факторів, пов’язаних із
          ризиком остеопоротичних переломів. Вищий рівень означає більшу кількість
          клінічних факторів і потребу в точнішій оцінці, але не замінює клінічне рішення.
        </p>
      </section>
    </>
  );
}
