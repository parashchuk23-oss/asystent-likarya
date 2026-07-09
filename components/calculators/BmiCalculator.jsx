'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import {
  calculateBMI,
  calculateTargetWeightRange,
  getBMICategory,
  getBMIRecommendations,
  getCardiometabolicRisk,
  getWaistRisk,
} from '../../utils/calculations';

const initialFormData = {
  weight: '',
  height: '',
  sex: '',
  waist: '',
};

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function InfoList({ title, items }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SexSegmentedControl({ value, onChange }) {
  const options = [
    { value: 'male', label: 'Чоловік' },
    { value: 'female', label: 'Жінка' },
  ];

  return (
    <div className="grid h-[50px] grid-cols-2 rounded-md border border-slate-300 bg-white p-1 shadow-sm shadow-slate-100">
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
    const bmiCategory = getBMICategory(bmi);
    const targetWeight = calculateTargetWeightRange(formData.height, formData.weight);
    const waistRisk = getWaistRisk(formData.sex, formData.waist);
    const cardiometabolicRisk = getCardiometabolicRisk(bmi, waistRisk);
    const recommendations = getBMIRecommendations(bmi, waistRisk);

    setResult({
      bmi,
      bmiCategory,
      targetWeight,
      waistRisk,
      cardiometabolicRisk,
      recommendations,
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">Оцінка маси тіла</h2>
        <p className="mt-1">
          ІМТ, цільова вага, окружність талії та кардіометаболічний ризик.
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

        <FormField label="Стать" hint="необов’язково">
          <SexSegmentedControl
            value={formData.sex}
            onChange={(value) => handleChange('sex', value)}
          />
        </FormField>

        <FormField label="Окружність талії" hint="см, необов’язково">
          <input
            type="number"
            value={formData.waist}
            onChange={(event) => handleChange('waist', event.target.value)}
            className={inputClass}
            placeholder="92"
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

      {result ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
              <p className="text-slate-600">ІМТ</p>
              <p className="text-3xl font-semibold text-blue-800">{result.bmi}</p>
              <p className="mt-2">
                <span className="font-semibold">Категорія:</span> {result.bmiCategory}
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-900">
              <p className="font-semibold">Орієнтовна цільова вага</p>
              <p className="mt-2 text-slate-700">
                ІМТ 18.5–24.9: {result.targetWeight.normalRange}
              </p>
              <p className="mt-1 text-slate-700">
                Маса для ІМТ 25: {result.targetWeight.weightForBmi25}
              </p>
              {result.targetWeight.reductionToBmi25 && (
                <p className="mt-1 text-slate-700">
                  Орієнтовне зниження маси до ІМТ 25: {result.targetWeight.reductionToBmi25}
                </p>
              )}
            </div>

            <div
              className={`rounded-md border p-4 text-sm ${
                result.cardiometabolicRisk?.className || 'border-slate-200 bg-white text-slate-800'
              }`}
            >
              <p className="font-semibold">Кардіометаболічний ризик</p>
              <p className="mt-2 text-2xl font-semibold">
                {result.cardiometabolicRisk?.marker} {result.cardiometabolicRisk?.label}
              </p>
              <p className="mt-2 text-sm leading-6">
                Оцінка базується на ІМТ
                {result.waistRisk ? ' та окружності талії.' : '. Додайте окружність талії для точнішої оцінки.'}
              </p>
            </div>
          </div>

          {result.waistRisk && (
            <div className="rounded-md border border-teal-100 bg-teal-50/60 p-4 text-sm text-slate-800">
              <p className="font-semibold">Окружність талії</p>
              <p className="mt-2">Інтерпретація: {result.waistRisk.label}.</p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <InfoList title="Що перевірити додатково" items={result.recommendations.additionalChecks} />
            <InfoList title="Що обговорити з пацієнтом" items={result.recommendations.patientDiscussion} />
          </div>

          {result.recommendations.needsAdditionalAssessment && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
              <p className="font-semibold">Коли потрібна додаткова оцінка</p>
              <p className="mt-2">{result.recommendations.additionalAssessmentText}</p>
            </div>
          )}

          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Пов’язані інструменти</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['SCORE2', 'ШКФ', 'FINDRISK', 'Цілі ЛПНЩ у SCORE2'].map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
            Оцінка маси тіла є допоміжним інструментом. ІМТ не враховує склад тіла,
            м’язову масу та індивідуальні особливості пацієнта. Остаточна клінічна
            оцінка проводиться лікарем з урахуванням анамнезу, супутніх захворювань,
            лабораторних показників та загального стану пацієнта.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          Введіть зріст і масу тіла, за потреби додайте стать та окружність талії, потім
          натисніть “Розрахувати”.
        </div>
      )}
    </>
  );
}
