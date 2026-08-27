'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import {
  calculateBMI,
  calculateWeightLossGoal,
  getBMICategory,
  getBMIRecommendations,
  getCardiometabolicRisk,
  getWaistCategory,
  getWaistRisk,
} from '../../utils/calculations';

const initialFormData = {
  weight: '',
  height: '',
  sex: '',
  waist: '',
};

const bmiCategoryTranslations = {
  'Недостатня маса тіла.': 'Underweight.',
  'Нормальна маса тіла.': 'Normal body weight.',
  'Надмірна маса тіла.': 'Overweight.',
  'Ожиріння I ступеня.': 'Obesity class I.',
  'Ожиріння II ступеня.': 'Obesity class II.',
  'Ожиріння III ступеня.': 'Obesity class III.',
};

const waistCategoryTranslations = {
  'в межах цільового діапазону': 'within the target range',
  підвищена: 'increased',
  'значно підвищена': 'substantially increased',
};

const riskTranslations = {
  'нижчий': 'lower',
  'підвищений': 'increased',
  'високий': 'high',
  'дуже високий': 'very high',
};

const additionalChecks = [
  'Blood pressure',
  'HbA1c or fasting plasma glucose',
  'Lipid profile',
  'ALT / AST',
  'Creatinine and eGFR',
  'Urine ACR if diabetes, hypertension, or CKD is present',
];

const patientDiscussion = [
  'A 5-10% weight reduction may provide clinically meaningful benefit.',
  'Regular physical activity.',
  'Eating habits and total caloric intake.',
  'Sleep, stress, and alcohol intake.',
  'Follow-up of body weight and waist circumference over time.',
];

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function translateTargetWeightText(goal) {
  if (!goal) return '';

  if (goal.percent && goal.lossKg && goal.targetWeightKg && goal.weeks) {
    return (
      `Current body weight is ${goal.targetWeightKg + goal.lossKg} kg; the initial goal is to lose about ${goal.lossKg} kg, ` +
      `to approximately ${goal.targetWeightKg} kg over ${goal.weeks} weeks. Even modest weight reduction may improve blood pressure, ` +
      'glucose, lipids, and cardiometabolic risk.'
    );
  }

  return goal.text
    .replace('Поточний ІМТ відповідає недостатній масі тіла. Зниження маси тіла не рекомендоване; доцільно оцінити харчування, можливі причини втрати ваги та безпечну корекцію маси тіла з лікарем.', 'The current BMI is in the underweight range. Weight loss is not recommended; consider nutritional assessment, possible causes of weight loss, and safe weight correction with a clinician.')
    .replace('Поточний ІМТ відповідає нормальній масі тіла. Спеціальне зниження маси тіла за ІМТ не потрібне; доцільно підтримувати стабільну вагу, регулярну фізичну активність і контроль окружності талії в динаміці.', 'The current BMI is in the normal range. Weight loss based on BMI is not needed; maintaining stable weight, regular physical activity, and waist follow-up may be appropriate.');
}

function InfoList({ title, items }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TextInfo({ title, children }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

function SexSegmentedControl({ value, onChange }) {
  const options = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <div className="grid h-[38px] grid-cols-2 rounded-md border border-slate-300 bg-white p-1 shadow-sm shadow-slate-100">
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

export default function BmiCalculatorEnglish() {
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
    const waistRisk = getWaistRisk(formData.sex, formData.waist);

    setResult({
      bmi,
      bmiCategory: bmiCategoryTranslations[getBMICategory(bmi)] || getBMICategory(bmi),
      weightLossGoal: calculateWeightLossGoal(formData.weight, bmi),
      waistCategory: getWaistCategory(formData.sex, formData.waist),
      waistRisk,
      cardiometabolicRisk: getCardiometabolicRisk(bmi, waistRisk),
      recommendations: getBMIRecommendations(bmi, waistRisk),
    });
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          ← Ukrainian interface
        </a>

        <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">Clinical calculator</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Body Weight Assessment</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            BMI, target weight, waist circumference, and cardiometabolic-risk orientation for clinical use.
          </p>
        </section>

        <section className="mt-4 rounded-lg border border-teal-300 bg-white p-4 shadow-sm shadow-slate-200/60">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Body weight" hint="kg" className="mb-0">
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

            <FormField label="Height" hint="cm" className="mb-0">
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

            <FormField label="Sex" hint="optional" className="mb-0">
              <SexSegmentedControl value={formData.sex} onChange={(value) => handleChange('sex', value)} />
            </FormField>

            <FormField label="Waist circumference" hint="cm, optional" className="mb-0">
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

          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!isCalculateEnabled}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
            >
              Calculate
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
            >
              Clear
            </button>
          </div>

          {result ? (
            <div className="mt-3 space-y-3">
              <div className="grid items-stretch gap-3 lg:grid-cols-3">
                <div className="h-full rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-slate-900">
                  <p className="text-slate-600">BMI</p>
                  <p className="text-3xl font-semibold text-blue-800">{result.bmi}</p>
                  <p className="mt-2">
                    <span className="font-semibold">Category:</span> {result.bmiCategory}
                  </p>
                </div>

                <div className="h-full rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-900">
                  <p className="font-semibold">Waist circumference</p>
                  {result.waistCategory ? (
                    <>
                      <p className="mt-2 text-slate-700">Value: {formData.waist} cm</p>
                      <p className="mt-1 text-slate-700">
                        Category:{' '}
                        <span className="font-semibold">
                          {waistCategoryTranslations[result.waistCategory.label] || result.waistCategory.label}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-slate-700">
                      Add sex and waist circumference for interpretation.
                    </p>
                  )}
                  <div className="mt-2 border-t border-slate-100 pt-2 text-xs leading-5 text-slate-500">
                    <p>Reference cut-offs:</p>
                    <p>men: &lt;94 cm, 94-101 cm, ≥102 cm</p>
                    <p>women: &lt;80 cm, 80-87 cm, ≥88 cm</p>
                  </div>
                </div>

                <div
                  className={`h-full rounded-md border p-3 text-sm ${
                    result.cardiometabolicRisk?.className || 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <p className="font-semibold">Cardiometabolic risk</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {result.cardiometabolicRisk?.marker}{' '}
                    {riskTranslations[result.cardiometabolicRisk?.label] || result.cardiometabolicRisk?.label}
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    This orientation is based on BMI
                    {result.waistRisk ? ' and waist circumference.' : '. Add waist circumference for a more complete assessment.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                <InfoList title="Additional checks" items={additionalChecks} />
                <TextInfo title="Approximate initial weight goal">
                  <p>{translateTargetWeightText(result.weightLossGoal)}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Time estimate uses an approximate pace of 0.75 kg per week.
                  </p>
                </TextInfo>
                <InfoList title="Discuss with the patient" items={patientDiscussion} />
              </div>

              {result.recommendations.needsAdditionalAssessment && (
                <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm leading-6 text-orange-900">
                  <p className="font-semibold">When to consider additional assessment</p>
                  <p className="mt-2">
                    Consider additional clinical assessment of cardiometabolic risk, comorbidities, and treatment options
                    according to current clinical recommendations.
                  </p>
                </div>
              )}

              <p className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
                Body weight assessment is a supportive tool. BMI does not account for body composition, muscle mass,
                and individual patient characteristics. Final clinical assessment should be made by a clinician using
                history, comorbidities, laboratory results, and the patient’s overall condition.
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-slate-700">
              Enter height and body weight, optionally add sex and waist circumference, then press “Calculate”.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
