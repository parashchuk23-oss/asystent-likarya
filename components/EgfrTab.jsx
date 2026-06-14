'use client';

import { useState } from 'react';
import FormField from './FormField';
import { inputClass } from './formStyles';
import {
  calculateCKDEPI,
  calculateCockcroftGault,
  getACategory,
  getKDIGORisk,
} from '../utils/calculations';

const initialFormData = {
  age: '',
  sex: '',
  creatinine: '',
  creatinineUnit: 'umolL',
  weight: '',
  acr: '',
};

const additionalChecks = [
  {
    title: 'ACR сечі',
    description: 'Для оцінки пошкодження клубочків.',
  },
  {
    title: 'Загальний аналіз сечі',
    description: 'Для виявлення гематурії та інших патологічних змін.',
  },
  {
    title: 'Калій',
    description: 'Для безпечного призначення ІАПФ, БРА, АМКР.',
  },
  {
    title: 'Натрій',
    description: 'Для оцінки водно-електролітного балансу.',
  },
  {
    title: 'Контроль креатиніну в динаміці',
    description: 'Для оцінки прогресування ураження нирок.',
  },
];

const kdigoColorClasses = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-900',
  orange: 'border-orange-200 bg-orange-50 text-orange-900',
  red: 'border-red-200 bg-red-50 text-red-900',
};

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <FormField label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

function SexCheckboxes({ value, onChange }) {
  return (
    <FormField label="Стать">
      <div className="grid gap-2 sm:grid-cols-2">
        <CheckboxField
          label="Чоловіча"
          checked={value === 'male'}
          onChange={(checked) => onChange(checked ? 'male' : '')}
        />

        <CheckboxField
          label="Жіноча"
          checked={value === 'female'}
          onChange={(checked) => onChange(checked ? 'female' : '')}
        />
      </div>
    </FormField>
  );
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function canCalculateRenalFunction(data) {
  return hasPositiveNumber(data.age) && hasValue(data.sex) && hasPositiveNumber(data.creatinine);
}

export default function EgfrTab() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const isCalculateEnabled = canCalculateRenalFunction(formData);
  const actionButtonClass =
    'w-full rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:w-auto';

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!isCalculateEnabled) return;

    const ckdEpi = calculateCKDEPI(formData);
    const cockcroftGault = calculateCockcroftGault(formData);
    const acr = getACategory(formData.acr);
    const kdigoRisk = getKDIGORisk(ckdEpi?.category, acr?.category);

    setResult({
      ckdEpi,
      cockcroftGault,
      acr,
      kdigoRisk,
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,28rem)_minmax(0,32rem)]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b-2 border-blue-100 pb-2">
          <h2 className="text-base font-semibold text-blue-700">Ниркова функція</h2>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">CKD-EPI 2021</h3>

          <FormField label="Вік">
            <input
              type="number"
              value={formData.age}
              onChange={(event) => handleChange('age', event.target.value)}
              className={inputClass}
              placeholder="60"
              min="1"
            />
          </FormField>

          <SexCheckboxes value={formData.sex} onChange={(value) => handleChange('sex', value)} />

          <FormField label="Креатинін">
            <input
              type="number"
              value={formData.creatinine}
              onChange={(event) => handleChange('creatinine', event.target.value)}
              className={inputClass}
              placeholder={formData.creatinineUnit === 'umolL' ? '90' : '1.0'}
              min="0"
              step="0.1"
            />
          </FormField>

          <SelectField
            label="Одиниці креатиніну"
            value={formData.creatinineUnit}
            onChange={(value) => handleChange('creatinineUnit', value)}
            options={[
              { value: 'umolL', label: 'мкмоль/л' },
              { value: 'mgDl', label: 'мг/дл' },
            ]}
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Cockcroft-Gault</h3>

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
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Альбумінурія</h3>

          <FormField label="ACR" hint="мг/г">
            <input
              type="number"
              value={formData.acr}
              onChange={(event) => handleChange('acr', event.target.value)}
              className={inputClass}
              placeholder="25"
              min="0"
              step="0.1"
            />
          </FormField>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!isCalculateEnabled}
            className={actionButtonClass}
          >
            Розрахувати
          </button>

          <button type="button" onClick={handleClear} className={actionButtonClass}>
            Очистити
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b-2 border-blue-100 pb-2">
          <h2 className="text-base font-semibold text-blue-700">Результат</h2>
        </div>

        {result ? (
          <div className="space-y-4 text-sm leading-relaxed text-slate-900">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-slate-600">ШКФ CKD-EPI 2021</p>
              <p className="text-3xl font-semibold text-blue-800">
                {result.ckdEpi.egfr} мл/хв/1,73 м²
              </p>
              <p className="mt-2">
                <span className="font-semibold">Категорія G:</span> {result.ckdEpi.category}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Інтерпретація:</span> {result.ckdEpi.interpretation}
              </p>
            </div>

            {result.cockcroftGault && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p>
                  <span className="font-semibold">CrCl Cockcroft-Gault:</span>{' '}
                  {result.cockcroftGault.crCl} мл/хв
                </p>
              </div>
            )}

            {result.acr && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p>
                  <span className="font-semibold">ACR:</span> {result.acr.value} мг/г
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Категорія A:</span> {result.acr.category}
                </p>
                <p className="mt-1">{result.acr.interpretation}</p>
              </div>
            )}

            {result.kdigoRisk && (
              <div
                className={`rounded-lg border p-4 font-semibold ${
                  kdigoColorClasses[result.kdigoRisk.color]
                }`}
              >
                {result.kdigoRisk.marker} Згідно KDIGO ризик прогресування ХХН та серцево-судинних
                подій є {result.kdigoRisk.level.toLowerCase()}.
              </div>
            )}

            <div>
              <p className="font-semibold">Що перевірити додатково:</p>
              <ul className="mt-2 space-y-2">
                {additionalChecks.map((check) => (
                  <li key={check.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold">✓ {check.title}</p>
                    <p className="mt-1 text-slate-600">{check.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Заповніть вік, стать і креатинін, щоб розрахувати ниркову функцію.
          </p>
        )}
      </section>
    </div>
  );
}
