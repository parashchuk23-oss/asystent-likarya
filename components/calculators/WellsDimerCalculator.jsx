'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateAgeAdjustedDimer, calculateWellsPe } from '../../utils/calculations';

const initialFormData = {
  clinicalDvtSigns: false,
  peMoreLikely: false,
  heartRateOver100: false,
  immobilizationOrSurgery: false,
  previousDvtPe: false,
  hemoptysis: false,
  activeCancer: false,
  age: '',
  dimer: '',
  dimerUnit: 'ngMlFeu',
};

const fields = [
  { key: 'clinicalDvtSigns', label: 'Клінічні ознаки ТГВ', points: 3 },
  {
    key: 'peMoreLikely',
    label: 'Альтернативний діагноз менш ймовірний, ніж ТЕЛА',
    points: 3,
  },
  { key: 'heartRateOver100', label: 'ЧСС >100/хв', points: 1.5 },
  {
    key: 'immobilizationOrSurgery',
    label: 'Іммобілізація ≥3 днів або операція за останні 4 тижні',
    points: 1.5,
  },
  { key: 'previousDvtPe', label: 'Попередній ТГВ/ТЕЛА', points: 1.5 },
  { key: 'hemoptysis', label: 'Кровохаркання', points: 1 },
  { key: 'activeCancer', label: 'Активне онкологічне захворювання', points: 1 },
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

function getDimerExplanation(wellsResult, dimerResult) {
  if (!dimerResult) {
    return 'Введіть вік і значення D-димеру, щоб порівняти його з віковим порогом.';
  }

  if (wellsResult.score > 4) {
    return 'За Wells PE ТЕЛА ймовірна. D-димер не використовується для самостійного виключення ТЕЛА.';
  }

  if (dimerResult.exceedsThreshold) {
    return 'За умови малоймовірної ТЕЛА значення перевищує віковий поріг і не дозволяє виключити ТЕЛА лише за D-димером.';
  }

  return 'За умови малоймовірної ТЕЛА значення не перевищує віковий поріг і може підтримувати виключення ТЕЛА в межах валідованого діагностичного алгоритму.';
}

export default function WellsDimerCalculator() {
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
    const wells = calculateWellsPe(formData);
    const dimer = calculateAgeAdjustedDimer(formData);

    setResult({
      wells,
      dimer,
      dimerExplanation: getDimerExplanation(wells, dimer),
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        Поєднує двохрівневу оцінку клінічної ймовірності ТЕЛА за Wells PE з порівнянням
        D-димеру та вікового порогу.
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

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
        <FormField label="Вік" hint="років">
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

        <FormField label="D-димер">
          <input
            type="number"
            value={formData.dimer}
            onChange={(event) => handleChange('dimer', event.target.value)}
            className={inputClass}
            placeholder="500"
            min="0"
            step="0.1"
          />
        </FormField>

        <FormField label="Одиниці D-димеру">
          <select
            value={formData.dimerUnit}
            onChange={(event) => handleChange('dimerUnit', event.target.value)}
            className={inputClass}
          >
            <option value="ngMlFeu">нг/мл FEU</option>
            <option value="mcgLFeu">мкг/л FEU</option>
          </select>
        </FormField>
      </div>

      <div className="mt-1 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
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

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
          <p className="text-slate-600">Wells PE</p>
          <p className="text-3xl font-semibold text-blue-800">{result?.wells.score ?? '—'}</p>
          <p className="mt-2">
            <span className="font-semibold">Інтерпретація:</span>{' '}
            {result?.wells.interpretation || 'Натисніть “Розрахувати” після вибору факторів.'}
          </p>
        </div>

        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
          <p className="text-slate-600">Віковий поріг D-димеру</p>
          <p className="text-3xl font-semibold text-blue-800">
            {result?.dimer ? `${result.dimer.threshold} ${result.dimer.unitLabel}` : '—'}
          </p>
          {result?.dimer ? (
            <p className="mt-2 font-semibold">
              Введений D-димер {result.dimer.exceedsThreshold ? 'перевищує' : 'не перевищує'} поріг.
            </p>
          ) : null}
          <p className="mt-2 text-slate-700">
            {result?.dimerExplanation || 'Введіть вік і D-димер для порівняння з порогом.'}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
        Алгоритм не застосовується при високій клінічній ймовірності без подальшої
        діагностичної оцінки. Остаточне рішення щодо КТ-ангіографії, УЗД вен або іншої
        тактики приймає лікар.
      </div>

      <section className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700">
        <h3 className="font-semibold text-slate-900">Клінічне застосування</h3>
        <p className="mt-2">
          Wells PE використовують для оцінки передтестової ймовірності легеневої емболії.
          Віковий поріг D-димеру може підвищити специфічність тесту в пацієнтів старше 50
          років із невисокою клінічною ймовірністю, але не замінює діагностичну тактику лікаря.
        </p>
      </section>
    </>
  );
}
