'use client';

import { useState } from 'react';
import NationalScheduleView from './vaccination/NationalScheduleView';
import VaccinationChecker from './vaccination/VaccinationChecker';
import VaccineCounseling from './vaccination/VaccineCounseling';
import VaccineReference from './vaccination/VaccineReference';

const sections = [
  { id: 'checker', title: 'Перевірити вакцинацію', description: 'Вік, історія доз, календарні щеплення, catch-up і додаткові вакцини.' },
  { id: 'calendar', title: 'Календар щеплень', description: 'Національний календар України у форматі швидкого перегляду.' },
  { id: 'reference', title: 'Довідник вакцин', description: 'Календарні й рекомендовані вакцини у форматі практичних карток.' },
  { id: 'counseling', title: 'Заперечення', description: 'Короткі відповіді для розмови з пацієнтом.' },
];

export default function VaccinationTab() {
  const [activeSection, setActiveSection] = useState('checker');

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">Вакцинація</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Календар, catch-up і рекомендовані вакцини</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Довідковий модуль для лікаря: допомагає швидко перевірити щеплення за віком, побачити можливі пропуски,
          оцінити додаткові вакцини за факторами ризику та підготувати короткий план для копіювання.
        </p>
      </section>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`rounded-lg border p-3 text-left transition ${
              activeSection === section.id
                ? 'border-teal-500 bg-teal-50 text-teal-900'
                : 'border-teal-300 bg-white text-slate-700 hover:border-teal-500'
            }`}
          >
            <span className="block text-sm font-bold">{section.title}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{section.description}</span>
          </button>
        ))}
      </div>

      {activeSection === 'checker' && <VaccinationChecker />}
      {activeSection === 'calendar' && <NationalScheduleView />}
      {activeSection === 'reference' && <VaccineReference />}
      {activeSection === 'counseling' && <VaccineCounseling />}

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Модуль вакцинації є довідковою підказкою для лікаря. Остаточне рішення щодо вакцинації, відтермінування,
        catch-up-схеми або протипоказань приймається лікарем після перевірки медичної документації, анамнезу,
        інструкції до конкретної вакцини та чинних нормативних документів.
      </section>
    </div>
  );
}
