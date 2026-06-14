'use client';

import { useState } from 'react';
import { calculateCha2ds2Vasc } from '../../utils/calculations';

const initialFormData = {
  heartFailure: false,
  hypertension: false,
  age75OrOlder: false,
  diabetes: false,
  strokeTiaThromboembolism: false,
  vascularDisease: false,
  age65To74: false,
  femaleSex: false,
};

const fields = [
  { key: 'heartFailure', label: 'Серцева недостатність', points: 1 },
  { key: 'hypertension', label: 'Гіпертензія', points: 1 },
  { key: 'age75OrOlder', label: 'Вік ≥75', points: 2 },
  { key: 'diabetes', label: 'Цукровий діабет', points: 1 },
  { key: 'strokeTiaThromboembolism', label: 'Інсульт/ТІА/тромбоемболія в анамнезі', points: 2 },
  { key: 'vascularDisease', label: 'Судинне захворювання', points: 1 },
  { key: 'age65To74', label: 'Вік 65-74', points: 1 },
  { key: 'femaleSex', label: 'Жіноча стать', points: 1 },
];

function CheckboxField({ label, points, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
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

export default function Cha2ds2VascCalculator() {
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
    setResult(calculateCha2ds2Vasc(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b-2 border-blue-100 pb-2">
        <h2 className="text-base font-semibold text-blue-700">CHA₂DS₂-VASc</h2>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Про шкалу CHA₂DS₂-VASc</p>
        <p className="mt-2">
          CHA₂DS₂-VASc використовується для оцінки ризику інсульту та системної емболії у
          пацієнтів із фібриляцією передсердь.
        </p>
        <p className="mt-2">
          Шкала допомагає лікарю орієнтовно визначити тромбоемболічний ризик і обговорити
          доцільність антикоагулянтної терапії.
        </p>
        <p className="mt-2">
          Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
        </p>
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

      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">Сума балів</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Натисніть “Розрахувати” після вибору факторів.'}
        </p>
        <p className="mt-2 text-slate-700">
          Рішення щодо антикоагуляції приймає лікар з урахуванням клінічного контексту.
        </p>
      </div>
    </article>
  );
}
