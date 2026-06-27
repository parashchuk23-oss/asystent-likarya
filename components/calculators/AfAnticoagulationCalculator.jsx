'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateAfAnticoagulationAssessment } from '../../utils/calculations';

const initialFormData = {
  age: '',
  sex: '',
  heartFailure: false,
  hypertension: false,
  diabetes: false,
  strokeTiaThromboembolism: false,
  vascularDisease: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  bleedingHistory: false,
  labileInr: false,
  drugs: false,
  alcohol: false,
};

const clinicalFactors = [
  {
    key: 'heartFailure',
    title: 'Серцева недостатність',
    description: 'СН в анамнезі або клінічні/ехо-ознаки серцевої недостатності, незалежно від ФВ.',
    scoreHint: 'CHA₂DS₂-VASc +1',
  },
  {
    key: 'hypertension',
    title: 'Артеріальна гіпертензія',
    description:
      'Діагностована АГ або антигіпертензивна терапія. Для HAS-BLED особливо важливо, якщо САТ >160 мм рт. ст.',
    scoreHint: 'обидві шкали',
  },
  {
    key: 'diabetes',
    title: 'Цукровий діабет',
    description: 'ЦД 1 або 2 типу, незалежно від виду цукрознижувальної терапії.',
    scoreHint: 'CHA₂DS₂-VASc +1',
  },
  {
    key: 'strokeTiaThromboembolism',
    title: 'Інсульт / ТІА / системна емболія',
    description:
      'Ішемічний інсульт, ТІА або системна тромбоемболія в анамнезі. У HAS-BLED це також рахується як інсульт в анамнезі.',
    scoreHint: 'обидві шкали',
  },
  {
    key: 'vascularDisease',
    title: 'Судинне захворювання',
    description:
      'Наприклад: інфаркт міокарда в анамнезі, периферичний атеросклероз артерій або атеросклеротична бляшка в аорті.',
    scoreHint: 'CHA₂DS₂-VASc +1',
  },
  {
    key: 'abnormalRenalFunction',
    title: 'Порушення функції нирок',
    description:
      'Для HAS-BLED: діаліз, трансплантація нирки або креатинін ≥200 мкмоль/л. Практичний орієнтир для уваги — ШКФ <30 мл/хв/1,73 м².',
    scoreHint: 'HAS-BLED +1',
  },
  {
    key: 'abnormalLiverFunction',
    title: 'Порушення функції печінки',
    description:
      'Цироз або значне біохімічне порушення: білірубін >2× ВМН разом із АСТ/АЛТ/ЛФ >3× ВМН.',
    scoreHint: 'HAS-BLED +1',
  },
  {
    key: 'bleedingHistory',
    title: 'Кровотеча в анамнезі',
    description:
      'Клінічно значуща кровотеча: ШКТ, внутрішньочерепна, госпіталізація, трансфузія або відміна антикоагулянта. Одинична легка носова кровотеча зазвичай не рахується.',
    scoreHint: 'HAS-BLED +1',
  },
  {
    key: 'labileInr',
    title: 'Лабільний INR',
    description:
      'Тільки для пацієнтів на варфарині: нестабільний INR або TTR <60%. Якщо пацієнт не приймає варфарин — не відмічати.',
    scoreHint: 'HAS-BLED +1',
  },
  {
    key: 'drugs',
    title: 'НПЗП / антитромбоцитарні препарати',
    description:
      'Регулярний прийом НПЗП, антитромбоцитарних препаратів або інша клінічно значуща взаємодія. Разова таблетка НПЗП зазвичай не рахується.',
    scoreHint: 'HAS-BLED +1',
  },
  {
    key: 'alcohol',
    title: 'Алкоголь',
    description:
      'Надмірне вживання, орієнтовно ≥8 стандартних доз на тиждень, запої або регулярне значне вживання. Невелика кількість пива по вихідних не завжди рахується.',
    scoreHint: 'HAS-BLED +1',
  },
];

const baselineChecks = [
  'Креатинін',
  'ШКФ',
  'Hb',
  'Тромбоцити',
  'АЛТ',
  'АСТ',
  'Маса тіла',
  'Артеріальний тиск',
];

const modifiableBleedingRisks = [
  'Неконтрольована артеріальна гіпертензія',
  'Алкоголь',
  'НПЗП',
  'Антитромбоцитарні препарати',
  'Лабільний INR для пацієнтів на варфарині',
  'Контроль функції нирок',
  'Контроль функції печінки',
];

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function RiskCard({ title, score, category, status, children }) {
  const statusClass =
    {
      lower: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      increased: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      high: 'border-orange-200 bg-orange-50 text-orange-900',
    }[status] || 'border-blue-100 bg-blue-50 text-blue-900';

  return (
    <section className={`rounded-md border p-4 ${statusClass}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-3xl font-bold">{score}</p>
      <p className="mt-1 text-sm font-semibold">{category}</p>
      <div className="mt-3 space-y-2 text-sm leading-6">{children}</div>
    </section>
  );
}

function CheckboxCard({ factor, checked, onChange }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
          {factor.title}
          <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
            {factor.scoreHint}
          </span>
        </span>
        <span className="mt-1 block leading-6 text-slate-600">{factor.description}</span>
      </span>
    </label>
  );
}

export default function AfAnticoagulationCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const canCalculate = hasPositiveNumber(formData.age) && Boolean(formData.sex);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!canCalculate) return;
    setResult(calculateAfAnticoagulationAssessment(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">
          Оцінка антикоагулянтної терапії при фібриляції передсердь
        </h2>
        <p className="mt-1">
          Комплексна оцінка ризику інсульту та кровотечі у пацієнтів із фібриляцією
          передсердь.
        </p>
      </div>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">Основні дані пацієнта</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Вік" hint="років">
            <input
              type="number"
              value={formData.age}
              onChange={(event) => handleChange('age', event.target.value)}
              className={inputClass}
              placeholder="72"
              min="1"
              step="1"
            />
          </FormField>

          <FormField label="Стать">
            <select
              value={formData.sex}
              onChange={(event) => handleChange('sex', event.target.value)}
              className={inputClass}
            >
              <option value="">Оберіть стать</option>
              <option value="male">Чоловік</option>
              <option value="female">Жінка</option>
            </select>
          </FormField>
        </div>
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">Фактори ризику</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Одна форма заповнює обидві шкали. Якщо фактор використовується в обох шкалах,
          він вводиться лише один раз.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {clinicalFactors.map((factor) => (
            <CheckboxCard
              key={factor.key}
              factor={factor}
              checked={formData[factor.key]}
              onChange={(value) => handleChange(factor.key, value)}
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
          <div className="grid gap-4 lg:grid-cols-2">
            <RiskCard
              title="CHA₂DS₂-VASc"
              score={result.cha2ds2Vasc.score}
              category={result.cha2ds2Vasc.category}
              status={result.cha2ds2Vasc.status}
            >
              <p>
                <span className="font-semibold">Орієнтовний річний ризик інсульту:</span>{' '}
                {result.cha2ds2Vasc.annualStrokeRisk}.
              </p>
              <p>{result.cha2ds2Vasc.escInterpretation}</p>
            </RiskCard>

            <RiskCard
              title="HAS-BLED"
              score={result.hasBled.score}
              category={result.hasBled.category}
              status={result.hasBled.status}
            >
              <p>{result.hasBled.interpretation}</p>
              <p>
                Високий HAS-BLED не є протипоказанням до антикоагуляції. Його мета —
                виявити модифіковані фактори ризику кровотечі.
              </p>
            </RiskCard>
          </div>

          <section className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
            <h3 className="font-semibold text-slate-950">Що робити далі</h3>
            <p className="mt-2">{result.nextStep}</p>
            {result.cha2ds2Vasc.anticoagulationLikely && (
              <button
                type="button"
                className="mt-3 rounded-md border border-blue-200 bg-white px-3 py-2 font-semibold text-blue-700"
                onClick={() =>
                  document
                    .getElementById('renal-function-calculator')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                Перейти до ШКФ
              </button>
            )}
          </section>

          <section className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Що перевірити</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Перед початком або під час антикоагулянтної терапії доцільно оцінити:
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {baselineChecks.map((item) => (
                <span key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </section>

          {result.hasBled.isHigh && (
            <section className="rounded-md border border-orange-200 bg-orange-50 p-4">
              <h3 className="font-semibold text-orange-950">На що звернути увагу</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {modifiableBleedingRisks.map((item) => (
                  <label key={item} className="flex items-start gap-2 text-sm text-orange-950">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-orange-300" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-950">Пов’язані модулі</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {['ШКФ', 'Препарати → НОАК', 'Алгоритм ведення ФП — незабаром'].map((item) => (
                <span key={item} className="rounded-md border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
            Результати шкал CHA₂DS₂-VASc та HAS-BLED є допоміжними інструментами оцінки
            ризику. Остаточне рішення щодо антикоагулянтної терапії приймається лікарем
            з урахуванням клінічної ситуації, супутніх захворювань, функції нирок,
            ризику кровотечі, побажань пацієнта та чинних клінічних рекомендацій.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
          Введіть вік, стать і позначте фактори ризику, потім натисніть “Розрахувати”.
        </div>
      )}
    </>
  );
}
