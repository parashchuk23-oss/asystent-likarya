'use client';

import { useState } from 'react';
import { calculateHasBled } from '../../utils/calculations';

const initialFormData = {
  hypertension: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  strokeHistory: false,
  bleedingHistory: false,
  labileInr: false,
  ageOver65: false,
  drugs: false,
  alcohol: false,
};

const fields = [
  { key: 'hypertension', label: 'Гіпертензія' },
  { key: 'abnormalRenalFunction', label: 'Порушення функції нирок' },
  { key: 'abnormalLiverFunction', label: 'Порушення функції печінки' },
  { key: 'strokeHistory', label: 'Інсульт в анамнезі' },
  { key: 'bleedingHistory', label: 'Кровотеча в анамнезі' },
  { key: 'labileInr', label: 'Лабільне МНВ' },
  { key: 'ageOver65', label: 'Вік >65' },
  { key: 'drugs', label: 'Препарати, що підвищують ризик кровотеч' },
  { key: 'alcohol', label: 'Алкоголь' },
];

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
      <span className="shrink-0 text-slate-500">+1</span>
    </label>
  );
}

export default function HasBledCalculator() {
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
    setResult(calculateHasBled(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про шкалу HAS-BLED</p>
        <p className="mt-2">
          HAS-BLED використовується для орієнтовної оцінки ризику кровотеч у пацієнтів із
          фібриляцією передсердь, особливо перед або під час антикоагулянтної терапії.
        </p>
        <p className="mt-2">
          Результат допомагає виявити фактори, які можна коригувати: артеріальний тиск,
          взаємодії препаратів, алкоголь, контроль МНВ та інші ризики.
        </p>
        <p className="mt-2">
          Калькулятор є допоміжним інструментом і не замінює клінічне рішення лікаря.
        </p>
      </div>

      <div className="grid gap-3">
        {fields.map((field) => (
          <CheckboxField
            key={field.key}
            label={field.label}
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
        <p className="text-slate-600">Сума балів</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після вибору факторів.'}
        </p>
        <p className="mt-2 text-slate-700">
          Високий HAS-BLED не є автоматичною причиною не призначати антикоагулянт, а
          вказує на потребу корекції модифікованих факторів ризику.
        </p>
      </div>
    </>
  );
}
