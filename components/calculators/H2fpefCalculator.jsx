'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateHeartFailureHfpEfAssessment } from '../../utils/calculations';

const initialFormData = {
  age: '',
  height: '',
  weight: '',
  antihypertensiveCount: '',
  atrialFibrillation: false,
  pasp: '',
  eOverEPrime: '',
  heartFailureRiskFactors: false,
  structuralHeartDiseaseOrBiomarkers: false,
  heartFailureSymptoms: false,
  refractorySymptoms: false,
  symptomsAtRest: false,
  symptomsWithLessThanOrdinaryActivity: false,
  symptomsWithOrdinaryActivity: false,
};

const accAhaQuestions = [
  {
    key: 'heartFailureRiskFactors',
    title: 'Є фактори ризику СН',
    description: 'АГ, ЦД, ожиріння, ІХС, кардіотоксична терапія або сімейна кардіоміопатія.',
  },
  {
    key: 'structuralHeartDiseaseOrBiomarkers',
    title: 'Є структурне ураження серця або підвищені біомаркери',
    description: 'Наприклад: гіпертрофія/дилатація камер, клапанна патологія, перенесений ІМ, підвищені BNP/NT-proBNP.',
  },
  {
    key: 'heartFailureSymptoms',
    title: 'Є поточні або попередні симптоми СН',
    description: 'Задишка, набряки, ортопное, зниження толерантності до навантаження у відповідному клінічному контексті.',
  },
  {
    key: 'refractorySymptoms',
    title: 'Є рефрактерні симптоми або часті госпіталізації',
    description: 'Симптоми попри оптимальну терапію, повторні госпіталізації або ознаки advanced HF.',
  },
];

const nyhaQuestions = [
  {
    key: 'symptomsAtRest',
    title: 'Симптоми СН у спокої',
    description: 'Якщо так — це відповідає NYHA IV.',
  },
  {
    key: 'symptomsWithLessThanOrdinaryActivity',
    title: 'Симптоми при меншому, ніж звичайне, навантаженні',
    description: 'Наприклад, симптоми при мінімальній побутовій активності — NYHA III.',
  },
  {
    key: 'symptomsWithOrdinaryActivity',
    title: 'Симптоми при звичайному фізичному навантаженні',
    description: 'Звичайна активність спричиняє задишку, втому або серцебиття — NYHA II.',
  },
];

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function CheckboxCard({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block leading-6 text-slate-600">{description}</span>
      </span>
    </label>
  );
}

function ResultCard({ title, value, subtitle, children }) {
  return (
    <section className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
      <p className="mt-1 font-semibold text-slate-900">{subtitle}</p>
      <div className="mt-3 space-y-2 leading-6 text-slate-700">{children}</div>
    </section>
  );
}

export default function H2fpefCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const canCalculate =
    hasPositiveNumber(formData.age) &&
    hasPositiveNumber(formData.height) &&
    hasPositiveNumber(formData.weight);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!canCalculate) return;
    setResult(calculateHeartFailureHfpEfAssessment(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">
          Серцева недостатність зі збереженою фракцією викиду (HFpEF)
        </h2>
        <p className="mt-1">
          Допоміжна оцінка пацієнта із задишкою або підозрою на серцеву недостатність:
          H2FPEF, стадія СН ACC/AHA та функціональний клас NYHA.
        </p>
      </div>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">A. H2FPEF Score</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Вік" hint="років">
            <input
              type="number"
              value={formData.age}
              onChange={(event) => handleChange('age', event.target.value)}
              className={inputClass}
              placeholder="68"
              min="1"
              step="1"
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

          <FormField label="Маса тіла" hint="кг">
            <input
              type="number"
              value={formData.weight}
              onChange={(event) => handleChange('weight', event.target.value)}
              className={inputClass}
              placeholder="86"
              min="1"
              step="0.1"
            />
          </FormField>

          <FormField label="Антигіпертензивні препарати" hint="кількість">
            <input
              type="number"
              value={formData.antihypertensiveCount}
              onChange={(event) => handleChange('antihypertensiveCount', event.target.value)}
              className={inputClass}
              placeholder="2"
              min="0"
              step="1"
            />
          </FormField>

          <FormField label="PASP / СТЛА" hint="мм рт. ст.">
            <input
              type="number"
              value={formData.pasp}
              onChange={(event) => handleChange('pasp', event.target.value)}
              className={inputClass}
              placeholder="38"
              min="1"
              step="0.1"
            />
          </FormField>

          <FormField label="E/e′">
            <input
              type="number"
              value={formData.eOverEPrime}
              onChange={(event) => handleChange('eOverEPrime', event.target.value)}
              className={inputClass}
              placeholder="10"
              min="1"
              step="0.1"
            />
          </FormField>
        </div>

        <div className="mt-4">
          <CheckboxCard
            title="Фібриляція передсердь"
            description="Пароксизмальна, персистуюча або постійна ФП в анамнезі чи на ЕКГ."
            checked={formData.atrialFibrillation}
            onChange={(value) => handleChange('atrialFibrillation', value)}
          />
        </div>
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">B. Стадія СН ACC/AHA</h3>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {accAhaQuestions.map((question) => (
            <CheckboxCard
              key={question.key}
              title={question.title}
              description={question.description}
              checked={formData[question.key]}
              onChange={(value) => handleChange(question.key, value)}
            />
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">C. Функціональний клас NYHA</h3>
        <p className="mt-1 text-sm text-slate-600">
          Якщо жоден пункт не позначений, результат буде NYHA I.
        </p>
        <div className="mt-4 grid gap-3">
          {nyhaQuestions.map((question) => (
            <CheckboxCard
              key={question.key}
              title={question.title}
              description={question.description}
              checked={formData[question.key]}
              onChange={(value) => handleChange(question.key, value)}
            />
          ))}
        </div>
      </section>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!canCalculate}
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
            <ResultCard
              title="H2FPEF"
              value={result.h2fpef.score}
              subtitle={result.h2fpef.interpretation}
            >
              <p>Розрахований ІМТ: {result.bmi} кг/м².</p>
            </ResultCard>

            <ResultCard
              title="ACC/AHA"
              value={result.accAhaStage.stage}
              subtitle={result.accAhaStage.title}
            >
              <p>{result.accAhaStage.interpretation}</p>
            </ResultCard>

            <ResultCard
              title="NYHA"
              value={result.nyha.className}
              subtitle="Функціональний клас"
            >
              <p>{result.nyha.interpretation}</p>
            </ResultCard>
          </div>

          <section className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
            <h3 className="font-semibold text-slate-950">Наступний крок</h3>
            <p className="mt-2">{result.h2fpef.nextStep}</p>
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Що перевірити додатково</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {result.additionalChecks.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">Пов’язані інструменти</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {result.relatedTools.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
            Цей модуль є допоміжним інструментом для лікаря. Результати H2FPEF,
            ACC/AHA staging та NYHA не встановлюють діагноз самостійно і мають
            інтерпретуватися з урахуванням анамнезу, огляду, ЕКГ, ЕхоКГ, біомаркерів,
            супутніх захворювань і чинних клінічних рекомендацій.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          Заповніть щонайменше вік, зріст і масу тіла, потім натисніть “Розрахувати”.
        </div>
      )}
    </>
  );
}
