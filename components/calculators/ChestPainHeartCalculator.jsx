'use client';

import { useState } from 'react';
import { calculateHeartScore } from '../../utils/calculations';

const initialFormData = {
  history: '',
  ecg: '',
  age: '',
  riskFactors: '',
  troponin: '',
};

const heartSections = [
  {
    key: 'history',
    title: 'History',
    subtitle: 'Анамнез болю',
    options: [
      { value: 0, title: 'Низько підозрілий', description: 'Нехарактерний біль, мало ознак ішемічного походження.' },
      { value: 1, title: 'Помірно підозрілий', description: 'Є окремі риси, які можуть відповідати ішемії.' },
      { value: 2, title: 'Високо підозрілий', description: 'Типова або дуже підозріла картина ішемічного болю.' },
    ],
  },
  {
    key: 'ecg',
    title: 'ECG',
    subtitle: 'ЕКГ',
    options: [
      { value: 0, title: 'Нормальна ЕКГ', description: 'Без значущих ішемічних змін.' },
      { value: 1, title: 'Неспецифічні зміни', description: 'Порушення реполяризації без чіткої діагностичної картини.' },
      { value: 2, title: 'Значуща депресія ST', description: 'Зміни, які підвищують підозру на гостру ішемію.' },
    ],
  },
  {
    key: 'age',
    title: 'Age',
    subtitle: 'Вік',
    options: [
      { value: 0, title: '<45 років', description: '0 балів.' },
      { value: 1, title: '45–64 роки', description: '1 бал.' },
      { value: 2, title: '≥65 років', description: '2 бали.' },
    ],
  },
  {
    key: 'riskFactors',
    title: 'Risk Factors',
    subtitle: 'Фактори ризику',
    options: [
      { value: 0, title: 'Немає факторів', description: 'Не позначено класичних факторів ризику.' },
      { value: 1, title: '1–2 фактори', description: 'АГ, ЦД, куріння, дисліпідемія, сімейний анамнез, ожиріння.' },
      { value: 2, title: '≥3 або відомий атеросклероз', description: 'Кілька факторів ризику або вже відоме судинне захворювання.' },
    ],
  },
  {
    key: 'troponin',
    title: 'Troponin',
    subtitle: 'Тропонін',
    options: [
      { value: 0, title: '≤ норми', description: 'У межах референтного значення лабораторії.' },
      { value: 1, title: '1–3× норми', description: 'Помірне підвищення відносно верхньої межі норми.' },
      { value: 2, title: '>3× норми', description: 'Виражене підвищення відносно верхньої межі норми.' },
    ],
  },
];

const useCases = [
  'пацієнт із болем у грудях',
  'підозра на гострий коронарний синдром без елевації ST',
];

const doNotUseCases = [
  'STEMI',
  'кардіогенний шок',
  'гемодинамічно нестабільний пацієнт',
  'якщо діагноз уже очевидний',
];

const checks = [
  'Повторна ЕКГ',
  'Серійний тропонін',
  'Креатинін',
  'ШКФ',
  'Загальний аналіз крові',
  'Ліпідограма',
  'HbA1c за показами',
  'ЕхоКГ за показами',
];

const relatedModules = [
  'Кардіоваскулярний ризик',
  'ШКФ',
  'ІМТ',
  'Препарати',
  'Артеріальна гіпертензія — модуль хвороб',
];

const relatedDrugs = [
  'Статини — у довіднику препаратів',
  'Антиагреганти — незабаром',
  'Бета-блокатори — у довіднику препаратів',
  'Інгібітори РААС — у довіднику препаратів',
];

const practicalTips = [
  'HEART не замінює клінічне мислення.',
  'Результат оцінюється разом із анамнезом, оглядом, ЕКГ і лабораторними даними.',
  'Не використовувати HEART як єдиний критерій прийняття рішення.',
];

const redFlags = [
  'STEMI',
  'кардіогенний шок',
  'гемодинамічна нестабільність',
  'життєво небезпечні аритмії',
];

function Card({ title, children, tone = 'default' }) {
  const toneClass =
    tone === 'danger'
      ? 'border-red-200 bg-red-50'
      : tone === 'info'
        ? 'border-blue-100 bg-blue-50/50'
        : 'border-slate-200 bg-white';

  return (
    <section className={`rounded-md border p-4 ${toneClass}`}>
      {title ? <h3 className="font-semibold text-slate-950">{title}</h3> : null}
      {children}
    </section>
  );
}

function OptionCard({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-md border px-3 py-3 text-left text-sm transition ${
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-sm'
          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50'
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-semibold">{option.title}</span>
          <span className="mt-1 block leading-5 text-slate-600">{option.description}</span>
        </span>
        <span className="shrink-0 rounded bg-white px-2 py-0.5 text-xs font-bold text-blue-700">
          {option.value}
        </span>
      </span>
    </button>
  );
}

function ChipList({ items, tone = 'default' }) {
  const itemClass =
    tone === 'danger'
      ? 'border-red-200 bg-white text-red-900'
      : 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-md border px-3 py-2 text-sm font-medium ${itemClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function ResultCard({ result }) {
  const statusClass =
    {
      low: 'border-emerald-200 bg-emerald-50 text-emerald-950',
      intermediate: 'border-yellow-200 bg-yellow-50 text-yellow-950',
      high: 'border-red-200 bg-red-50 text-red-950',
    }[result.riskLevel] || 'border-blue-100 bg-blue-50 text-blue-950';

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <section className={`rounded-md border p-4 ${statusClass}`}>
        <p className="text-sm font-semibold">HEART Score</p>
        <p className="mt-2 text-4xl font-bold">{result.score}</p>
        <p className="mt-1 text-sm font-semibold">{result.riskLabel}</p>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">Орієнтовний ризик MACE</p>
        <p className="mt-2 text-2xl font-bold text-slate-950">{result.maceRisk}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          30-денні великі серцево-судинні події. Це орієнтовна оцінка.
        </p>
      </section>
      <section className="rounded-md border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-950">Інтерпретація</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result.interpretation}</p>
      </section>
    </div>
  );
}

export default function ChestPainHeartCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const canCalculate = heartSections.every((section) => formData[section.key] !== '');

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleCalculate() {
    if (!canCalculate) return;
    setResult(calculateHeartScore(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">
          Оцінка пацієнта з болем у грудях
        </h2>
        <p className="mt-1">HEART Score та подальша клінічна оцінка пацієнта.</p>
      </div>

      <div className="space-y-4">
        <Card title="Коли використовувати" tone="info">
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Використовується</p>
              <ChipList items={useCases} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Не використовувати</p>
              <ChipList items={doNotUseCases} />
            </div>
          </div>
        </Card>

        <Card title="HEART Score">
          <div className="mt-4 space-y-4">
            {heartSections.map((section) => (
              <div key={section.key} className="rounded-md border border-slate-100 bg-white p-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold text-slate-950">{section.title}</p>
                  <p className="text-sm text-slate-500">{section.subtitle}</p>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-3">
                  {section.options.map((option) => (
                    <OptionCard
                      key={`${section.key}-${option.value}`}
                      option={option}
                      selected={formData[section.key] === option.value}
                      onSelect={() => handleChange(section.key, option.value)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
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
        </Card>

        {result ? (
          <>
            <ResultCard result={result} />

            <Card title="Наступний клінічний крок">
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                {result.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </Card>
          </>
        ) : null}

        <Card title="Що перевірити">
          <ChipList items={checks} />
        </Card>

        <Card title="Red Flags" tone="danger">
          <p className="mt-2 text-sm leading-6 text-red-900">
            У цих ситуаціях HEART застосовувати не слід або потрібна негайна клінічна оцінка.
          </p>
          <ChipList items={redFlags} tone="danger" />
        </Card>

        <Card title="Пов’язані модулі">
          <ChipList items={relatedModules} />
        </Card>

        <Card title="Пов’язані препарати">
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Лише переходи до довідника без рекомендацій щодо призначення.
          </p>
          <ChipList items={relatedDrugs} />
        </Card>

        <Card title="Практичні поради">
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
            {practicalTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Результат HEART Score є допоміжним інструментом оцінки ризику. Остаточне
        клінічне рішення приймається лікарем на підставі анамнезу, фізикального
        обстеження, ЕКГ, лабораторних даних, візуалізації та чинних міжнародних
        рекомендацій.
      </p>
    </>
  );
}
