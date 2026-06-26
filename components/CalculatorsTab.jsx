'use client';

import { useState } from 'react';
import BmiCalculator from './calculators/BmiCalculator';
import Cha2ds2VascCalculator from './calculators/Cha2ds2VascCalculator';
import EgfrTab from './EgfrTab';
import FraxCalculator from './calculators/FraxCalculator';
import H2fpefCalculator from './calculators/H2fpefCalculator';
import HasBledCalculator from './calculators/HasBledCalculator';
import Score2Tab from './Score2Tab';
import WellsDimerCalculator from './calculators/WellsDimerCalculator';

const calculators = [
  {
    id: 'score2',
    title: 'SCORE2',
    description: 'SCORE2 / SCORE2-OP',
    component: <Score2Tab />,
  },
  {
    id: 'renal-function',
    title: 'ШКФ',
    description: 'CKD-EPI 2021, Cockcroft-Gault, ACR, KDIGO і медикаментозна безпека',
    component: <EgfrTab />,
  },
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
  {
    id: 'h2fpef',
    title: 'H2FPEF Score',
    description: 'Оцінка ймовірності HFpEF у пацієнтів із задишкою',
    component: <H2fpefCalculator />,
  },
  {
    id: 'wells-dimer',
    title: 'Підозра на ТЕЛА / ТГВ',
    description: 'Wells PE та віковий поріг D-димеру',
    component: <WellsDimerCalculator />,
  },
  {
    id: 'fracture-risk',
    title: 'Оцінка факторів ризику остеопоротичних переломів',
    description: 'Спрощена структурована оцінка, не офіційний FRAX',
    component: <FraxCalculator />,
  },
];

const calculatorCategories = [
  {
    title: '⭐ Популярні',
    ids: ['score2', 'renal-function', 'cha2ds2-vasc', 'has-bled'],
  },
  {
    title: 'Кардіологія',
    ids: ['score2', 'cha2ds2-vasc', 'has-bled', 'h2fpef', 'wells-dimer'],
  },
  {
    title: 'Нефрологія',
    ids: ['renal-function'],
  },
  {
    title: 'Терапія',
    ids: ['bmi'],
  },
  {
    title: 'Інші',
    ids: ['fracture-risk'],
  },
];

const calculatorsById = Object.fromEntries(calculators.map((calculator) => [calculator.id, calculator]));

export default function CalculatorsTab() {
  const [openId, setOpenId] = useState(null);
  const activeCalculator = openId ? calculatorsById[openId] : null;

  return (
    <div>
      <div className="space-y-4">
        {calculatorCategories.map((category) => {
          const categoryItems = category.ids.map((id) => calculatorsById[id]).filter(Boolean);

          return (
            <section key={category.title}>
              <h3 className="text-sm font-semibold text-slate-800">{category.title}</h3>
              {categoryItems.length ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryItems.map((calculator) => {
                    const isOpen = openId === calculator.id;

                    return (
                      <button
                        key={`${category.title}-${calculator.id}`}
                        type="button"
                        className={`rounded-md border p-3 text-left transition ${
                          isOpen
                            ? 'border-teal-300 bg-teal-50 text-slate-950 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={`${calculator.id}-calculator`}
                        onClick={() => setOpenId(isOpen ? null : calculator.id)}
                      >
                        <span className="block text-sm font-semibold">{calculator.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {calculator.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  Категорія буде доповнена.
                </p>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-5">
        {activeCalculator ? (
          <article className="overflow-hidden rounded-lg border border-teal-300 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded="true"
              aria-controls={`${activeCalculator.id}-calculator`}
              onClick={() => setOpenId(null)}
            >
              <span className="min-w-0">
                <span className="block font-semibold text-slate-950">{activeCalculator.title}</span>
                <span className="mt-1 block text-sm text-slate-600">
                  {activeCalculator.description}
                </span>
              </span>
              <span className="shrink-0 text-2xl leading-none text-teal-700" aria-hidden="true">
                −
              </span>
            </button>

            <div id={`${activeCalculator.id}-calculator`} className="border-t border-slate-200 p-5">
              {activeCalculator.component}
            </div>
          </article>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
            Оберіть інструмент у категоріях вище.
          </div>
        )}
      </div>
    </div>
  );
}
