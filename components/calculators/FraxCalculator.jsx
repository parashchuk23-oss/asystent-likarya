'use client';

import { useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import { calculateFractureRisk } from '../../utils/calculations';

const officialFraxUrl = 'https://frax.shef.ac.uk/FRAX/';

const initialFormData = {
  ageAtLeast50: false,
  postmenopausalWoman: false,
  manAtLeast70: false,
  lowEnergyFracture: false,
  heightLoss: false,
  longTermGlucocorticoids: false,
  rheumatoidArthritis: false,
  lowBodyWeight: false,
  smoking: false,
  excessiveAlcohol: false,
  parentalHipFracture: false,
  secondaryOsteoporosis: false,
  femoralNeckTScore: '',
  lumbarTScore: '',
};

const suspicionFields = [
  { key: 'ageAtLeast50', label: 'Вік ≥50 років' },
  { key: 'postmenopausalWoman', label: 'Жінка після менопаузи' },
  { key: 'manAtLeast70', label: 'Чоловік ≥70 років' },
  { key: 'lowEnergyFracture', label: 'Низькоенергетичний перелом' },
  { key: 'heightLoss', label: 'Зменшення зросту' },
  { key: 'longTermGlucocorticoids', label: 'Тривалий прийом глюкокортикостероїдів' },
  { key: 'rheumatoidArthritis', label: 'Ревматоїдний артрит' },
  { key: 'lowBodyWeight', label: 'Низька маса тіла' },
  { key: 'smoking', label: 'Куріння' },
  { key: 'excessiveAlcohol', label: 'Надмірне вживання алкоголю' },
  { key: 'parentalHipFracture', label: 'Перелом стегна у батьків' },
  { key: 'secondaryOsteoporosis', label: 'Вторинний остеопороз' },
];

const labChecks = [
  'Загальний кальцій',
  'Альбумін',
  '25(OH)D',
  'Креатинін',
  'ШКФ',
  'Лужна фосфатаза',
  'Загальний аналіз крові',
  'ТТГ за показами',
  'Паратгормон за показами',
  'Фосфор',
  'Електрофорез білків за показами',
];

const patientAdvice = [
  'Регулярна фізична активність.',
  'Силові вправи.',
  'Вправи на рівновагу.',
  'Профілактика падінь.',
  'Достатнє надходження кальцію.',
  'Вітамін D за показами.',
  'Відмова від куріння.',
  'Обмеження алкоголю.',
];

const relatedModules = ['ІМТ', 'ШКФ', 'Препарати — незабаром', 'Алгоритми — незабаром'];
const medicationGroups = [
  'Бісфосфонати — незабаром',
  'Деносумаб — незабаром',
  'Терипаратид — незабаром',
  'Ромосозумаб — незабаром',
];

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
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

function AccordionBlock({ id, title, openId, onToggle, children }) {
  const isOpen = openId === id;

  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
        onClick={() => onToggle(isOpen ? null : id)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-950">{title}</span>
        <span className="text-2xl leading-none text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen ? <div className="border-t border-slate-200 p-4">{children}</div> : null}
    </section>
  );
}

function Chips({ items }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function FraxCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [openId, setOpenId] = useState('suspicion');

  function handleChange(field, value) {
    const nextData = {
      ...formData,
      [field]: value,
    };
    setFormData(nextData);
    setResult(calculateFractureRisk(nextData));
  }

  function handleCalculate() {
    setResult(calculateFractureRisk(formData));
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
    setOpenId('suspicion');
  }

  const activeResult = result || calculateFractureRisk(formData);

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">
          Оцінка ризику остеопоротичних переломів
        </h2>
        <p className="mt-1">
          Фактори ризику, DXA, FRAX, лабораторне обстеження та подальша тактика.
        </p>
      </div>

      <div className="space-y-3">
        <AccordionBlock
          id="suspicion"
          title="1. Коли потрібно думати про остеопороз?"
          openId={openId}
          onToggle={setOpenId}
        >
          <div className="grid gap-3 lg:grid-cols-2">
            {suspicionFields.map((field) => (
              <CheckboxField
                key={field.key}
                label={field.label}
                checked={formData[field.key]}
                onChange={(value) => handleChange(field.key, value)}
              />
            ))}
          </div>

          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
            <p className="text-slate-600">Орієнтовна оцінка</p>
            <p className="mt-1 text-2xl font-semibold text-blue-800">{activeResult.riskLabel}</p>
            <p className="mt-2 text-slate-700">
              Позначено факторів: {activeResult.factorCount}. {activeResult.riskInterpretation}
            </p>
          </div>
        </AccordionBlock>

        <AccordionBlock id="dxa" title="2. DXA" openId={openId} onToggle={setOpenId}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="T-score шийки стегнової кістки" hint="необов’язково">
              <input
                type="number"
                value={formData.femoralNeckTScore}
                onChange={(event) => handleChange('femoralNeckTScore', event.target.value)}
                className={inputClass}
                placeholder="-2.5"
                step="0.1"
              />
            </FormField>

            <FormField label="T-score поперекового відділу" hint="необов’язково">
              <input
                type="number"
                value={formData.lumbarTScore}
                onChange={(event) => handleChange('lumbarTScore', event.target.value)}
                className={inputClass}
                placeholder="-1.8"
                step="0.1"
              />
            </FormField>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">Інтерпретація DXA</p>
            <p className="mt-2">{activeResult.dxaInterpretation}</p>
            {activeResult.lowestTScore === null && (
              <a
                href={officialFraxUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Відкрити офіційний FRAX
              </a>
            )}
          </div>
        </AccordionBlock>

        <AccordionBlock
          id="checks"
          title="3. Що перевірити додатково"
          openId={openId}
          onToggle={setOpenId}
        >
          <Chips items={labChecks} />
        </AccordionBlock>

        <AccordionBlock id="next" title="4. Наступний крок" openId={openId} onToggle={setOpenId}>
          <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
            <p className="font-semibold text-slate-950">{activeResult.riskLabel}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {activeResult.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </AccordionBlock>

        <AccordionBlock
          id="advice"
          title="5. Що порадити пацієнту"
          openId={openId}
          onToggle={setOpenId}
        >
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
            {patientAdvice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AccordionBlock>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Оновити оцінку
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
      </div>

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">Пов’язані модулі</h3>
        <Chips items={relatedModules} />
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">Препарати</h3>
        <p className="mt-1 text-sm text-slate-600">
          Після реалізації відповідних розділів у вкладці “Препарати” тут будуть прямі посилання.
        </p>
        <Chips items={medicationGroups} />
      </section>

      <p className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Модуль оцінки ризику остеопоротичних переломів є допоміжним клінічним
        інструментом. Оцінка факторів ризику, DXA та FRAX не встановлюють діагноз
        самостійно. Рішення щодо лікування приймається лікарем відповідно до клінічної
        картини та чинних міжнародних рекомендацій.
      </p>
    </>
  );
}
