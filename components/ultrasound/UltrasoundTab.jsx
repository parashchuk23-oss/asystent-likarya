'use client';

import { useState } from 'react';
import AbdomenUltrasoundModule from './abdomen/AbdomenUltrasoundModule';
import BreastUltrasoundModule from './breast/BreastUltrasoundModule';
import EchoUltrasoundModule from './echo/EchoUltrasoundModule';
import RenalUltrasoundModule from './renal/RenalUltrasoundModule';
import ThyroidUltrasoundModule from './ThyroidUltrasoundModule';

const ultrasoundModules = [
  {
    id: 'thyroid',
    label: 'Щитоподібна залоза',
    title: 'Щитоподібна залоза',
    description:
      'Структурований протокол із розрахунком об’єму, описом вузлів, лімфатичних вузлів, висновком та рекомендаціями для подальшого редагування лікарем.',
  },
  {
    id: 'abdomen',
    label: 'Органи черевної порожнини',
    title: 'Органи черевної порожнини',
    description:
      'Конструктор протоколу УЗД ОЧП з оглядовою частиною, ехографічним висновком, рекомендаціями та текстом для копіювання.',
  },
  {
    id: 'renal',
    label: 'Нирки',
    title: 'Нирки та сечовидільна система',
    description:
      'Конструктор протоколу УЗД нирок, наднирників, сечоводів і сечового міхура з автоматичним текстом для копіювання.',
  },
  {
    id: 'echo',
    label: 'Ехокардіографія',
    title: 'Ехокардіографія',
    description:
      'Структурований протокол трансторакального УЗД серця з режимами стандартного ЕхоКГ та швидкого Ехо / POCUS для практичної роботи.',
  },
  {
    id: 'breast',
    label: 'Молочні залози',
    title: 'Молочні залози',
    description:
      'Конструктор протоколу УЗД молочних залоз з описом утворень, регіонарних лімфовузлів, ACR BI-RADS, висновком і рекомендаціями.',
  },
];

export default function UltrasoundTab() {
  const [activeModuleId, setActiveModuleId] = useState('thyroid');
  const activeModule = ultrasoundModules.find((module) => module.id === activeModuleId) || ultrasoundModules[0];

  return (
    <div className="space-y-4">
      <article className="overflow-hidden rounded-lg border border-teal-300 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">УЗД</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{activeModule.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{activeModule.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ultrasoundModules.map((module) => {
              const isActive = module.id === activeModuleId;
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setActiveModuleId(module.id)}
                  className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-teal-300 bg-teal-50 text-teal-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700'
                  }`}
                >
                  {module.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          {activeModuleId === 'abdomen' ? (
            <AbdomenUltrasoundModule />
          ) : activeModuleId === 'renal' ? (
            <RenalUltrasoundModule />
          ) : activeModuleId === 'echo' ? (
            <EchoUltrasoundModule />
          ) : activeModuleId === 'breast' ? (
            <BreastUltrasoundModule />
          ) : (
            <ThyroidUltrasoundModule />
          )}
        </div>
      </article>
    </div>
  );
}
