'use client';

import { useState } from 'react';
import { calculateH2fpef } from '../../utils/calculations';

const initialFormData = {
  obesity: false,
  multipleAntihypertensives: false,
  atrialFibrillation: false,
  pulmonaryHypertension: false,
  ageOver60: false,
  elevatedFillingPressure: false,
};

const fields = [
  { key: 'obesity', label: 'BMI >30 кг/м²', points: 2 },
  { key: 'multipleAntihypertensives', label: '≥2 антигіпертензивні препарати', points: 1 },
  { key: 'atrialFibrillation', label: 'Фібриляція передсердь', points: 3 },
  {
    key: 'pulmonaryHypertension',
    label: 'Систолічний тиск у легеневій артерії >35 мм рт. ст.',
    points: 1,
  },
  { key: 'ageOver60', label: 'Вік >60 років', points: 1 },
  { key: 'elevatedFillingPressure', label: "E/e' >9", points: 1 },
];

function CheckboxField({ label, points, checked, onChange }) {
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
      <span className="shrink-0 text-slate-500">+{points}</span>
    </label>
  );
}

export default function H2fpefCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    setResult(calculateH2fpef(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        Допомагає оцінити ймовірність серцевої недостатності зі збереженою фракцією
        викиду у пацієнтів із незрозумілою задишкою.
      </div>

      <div className="grid gap-3">
        {fields.map((field) => (
          <CheckboxField
            key={field.key}
            label={field.label}
            points={field.points}
            checked={formData[field.key]}
            onChange={(value) => handleChange(field.key, value)}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
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

      <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">H2FPEF Score</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після вибору факторів.'}
        </p>
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
        H2FPEF є допоміжним інструментом для оцінки ймовірності HFpEF у пацієнтів із
        задишкою та не замінює клінічне рішення лікаря.
      </div>

      <section className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700">
        <h3 className="font-semibold text-slate-900">Клінічне застосування</h3>
        <p className="mt-2">
          Шкала поєднує клінічні та ехокардіографічні ознаки, які використовують при
          обстеженні пацієнтів із задишкою. Вищий бал означає більшу ймовірність HFpEF;
          проміжний результат потребує подальшої клінічної оцінки.
        </p>
      </section>
    </>
  );
}
