'use client';

import { useState } from 'react';

const sections = [
  { key: 'preferredOrUseful', title: '✅ Можливі / корисні при показах' },
  { key: 'useWithCaution', title: '⚠️ Потребують обережності' },
  { key: 'avoidOrReview', title: '🚫 Уникати або переглянути' },
  { key: 'doseAdjustmentNeeded', title: '💊 Потребують корекції дози' },
  { key: 'monitoring', title: '🧪 Що контролювати' },
];

const disclaimer =
  'Цей блок є довідковою підказкою для лікаря. Остаточне рішення щодо призначення, відміни або корекції дози препарату приймається лікарем з урахуванням інструкції до конкретного препарату, CrCl, eGFR, калію, супутніх захворювань та клінічного стану пацієнта.';

export default function RenalMedicationAdvice({ advice }) {
  const [openSection, setOpenSection] = useState('useWithCaution');

  function handleToggle(sectionKey) {
    setOpenSection((current) => (current === sectionKey ? null : sectionKey));
  }

  return (
    <section className="border-t border-blue-100 pt-4">
      <div className="border-b border-blue-100 pb-4">
        <h2 className="text-base font-semibold tracking-tight text-slate-950">
          Лікарські засоби: на що звернути увагу
        </h2>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <div>
            <dt className="inline font-medium">eGFR: </dt>
            <dd className="inline">{advice.egfr} мл/хв/1,73 м² ({advice.category})</dd>
          </div>
          <div>
            <dt className="inline font-medium">CrCl: </dt>
            <dd className="inline">
              {advice.crcl === null ? 'не розрахований' : `${advice.crcl} мл/хв`}
            </dd>
          </div>
          <div>
            <dt className="inline font-medium">Калій: </dt>
            <dd className="inline">
              {advice.potassium === null ? 'не вказаний' : `${advice.potassium} ммоль/л`}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-2">
        {sections.map((section) => {
          const isOpen = openSection === section.key;
          const panelId = `renal-medication-${section.key}`;

          return (
            <div
              key={section.key}
              className={`overflow-hidden rounded-md border transition ${
                isOpen ? 'border-teal-300 bg-teal-50/20' : 'border-teal-200/80 bg-white hover:border-teal-300'
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-3 py-3 text-left transition hover:bg-teal-50/40"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(section.key)}
              >
                <span className={`text-sm font-semibold ${isOpen ? 'text-teal-900' : 'text-slate-900'}`}>{section.title}</span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xl leading-none transition ${
                    isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="border-t border-teal-200/80 bg-white px-3 py-3">
                  <ul className="space-y-2 pl-5 text-sm leading-6 text-slate-700">
                    {advice[section.key].map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <aside className="mt-4 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        {disclaimer}
      </aside>
    </section>
  );
}
