'use client';

import { useState } from 'react';
import BmiCalculator from './calculators/BmiCalculator';
import Cha2ds2VascCalculator from './calculators/Cha2ds2VascCalculator';
import HasBledCalculator from './calculators/HasBledCalculator';

const calculators = [
  {
    id: 'bmi',
    title: 'BMI (ІМТ)',
    description: 'Розрахунок індексу маси тіла',
    component: <BmiCalculator />,
  },
  {
    id: 'cha2ds2-vasc',
    title: 'CHA₂DS₂-VASc',
    description: 'Оцінка ризику інсульту при фібриляції передсердь',
    component: <Cha2ds2VascCalculator />,
  },
  {
    id: 'has-bled',
    title: 'HAS-BLED',
    description: 'Оцінка ризику кровотечі під час антикоагулянтної терапії',
    component: <HasBledCalculator />,
  },
];

export default function CalculatorsTab() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-4">
      {calculators.map((calculator) => {
        const isOpen = openId === calculator.id;

        return (
          <article
            key={calculator.id}
            className={`overflow-hidden rounded-lg border bg-white transition ${
              isOpen ? 'border-teal-300 shadow-sm' : 'border-slate-200'
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded={isOpen}
              aria-controls={`${calculator.id}-calculator`}
              onClick={() => setOpenId(isOpen ? null : calculator.id)}
            >
              <span className="min-w-0">
                <span className="block font-semibold text-slate-950">{calculator.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{calculator.description}</span>
              </span>
              <span className="shrink-0 text-2xl leading-none text-teal-700" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen ? (
              <div id={`${calculator.id}-calculator`} className="border-t border-slate-200 p-5">
                {calculator.component}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
