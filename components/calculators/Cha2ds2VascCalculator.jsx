'use client';

import { useState } from 'react';
import { calculateCha2ds2Vasc } from '../../utils/calculations';

const initialFormData = {
  age: '',
  sex: '',
  heartFailure: false,
  hypertension: false,
  diabetes: false,
  strokeTiaThromboembolism: false,
  vascularDisease: false,
};

const fields = [
  { key: 'heartFailure', label: 'Серцева недостатність', points: 1 },
  { key: 'hypertension', label: 'Гіпертензія', points: 1 },
  { key: 'diabetes', label: 'Цукровий діабет', points: 1 },
  { key: 'strokeTiaThromboembolism', label: 'Інсульт/ТІА/тромбоемболія в анамнезі', points: 2 },
  { key: 'vascularDisease', label: 'Судинне захворювання', points: 1 },
];

function getInterpretation(score, sex) {
  if ((sex === 'male' && score === 0) || (sex === 'female' && score === 1)) {
    return 'Низький ризик за CHA₂DS₂-VASc. Періодично переглядайте фактори ризику.';
  }

  if ((sex === 'male' && score === 1) || (sex === 'female' && score === 2)) {
    return 'Проміжний ризик. Потрібна індивідуальна оцінка користі та ризику антикоагуляції.';
  }

  return 'Підвищений ризик. Розгляньте антикоагуляцію відповідно до клінічного контексту та чинної настанови.';
}

function CheckboxField({ label, points, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
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
  const age = Number(formData.age);
  const canCalculate = Number.isInteger(age) && age >= 18 && age <= 120 && Boolean(formData.sex);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!canCalculate) return;

    const score = calculateCha2ds2Vasc({
      ...formData,
      age75OrOlder: age >= 75,
      age65To74: age >= 65 && age < 75,
      femaleSex: formData.sex === 'female',
    });

    setResult({
      ...score,
      interpretation: getInterpretation(score.score, formData.sex),
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p>
          Допомагає оцінити ризик інсульту та системної емболії у пацієнтів із
          фібриляцією передсердь.
        </p>
        <p className="mt-2">
          Результат дає орієнтир щодо тромбоемболічного ризику та доцільності
          антикоагулянтної терапії.
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-800">
          <span className="mb-1.5 block">Вік</span>
          <input
            type="number"
            min="18"
            max="120"
            step="1"
            value={formData.age}
            onChange={(event) => handleChange('age', event.target.value)}
            placeholder="Наприклад, 72"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm font-medium text-slate-800">
          <span className="mb-1.5 block">Стать</span>
          <select
            value={formData.sex}
            onChange={(event) => handleChange('sex', event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Оберіть стать</option>
            <option value="male">Чоловік</option>
            <option value="female">Жінка</option>
          </select>
        </label>
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
          disabled={!canCalculate}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
        >
          Розрахувати
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
      </div>

      <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">Сума балів</p>
        <p className="text-3xl font-semibold text-blue-800">{result?.score ?? '—'}</p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.interpretation || 'Введіть вік, оберіть стать і позначте фактори ризику.'}
        </p>
        <p className="mt-2 text-slate-700">
          Рішення щодо антикоагуляції приймає лікар з урахуванням клінічного контексту.
        </p>
      </div>
    </>
  );
}
