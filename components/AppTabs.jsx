'use client';

import { useState } from 'react';
import CalculatorsTab from './CalculatorsTab';
import CardioAssistantTab from './CardioAssistantTab';
import EgfrTab from './EgfrTab';
import QuestionnairesTab from './QuestionnairesTab';
import Score2Tab from './Score2Tab';

const tabs = [
  {
    id: 'score2',
    label: 'Кардіоваскулярний ризик',
    description: 'SCORE2 / SCORE2-OP',
    detail: 'Оцінка 10-річного СС-ризику.',
    icon: '⌁',
    tone: 'blue',
  },
  {
    id: 'egfr',
    label: 'Ниркова функція',
    description: 'CKD-EPI, Cockcroft-Gault, ACR',
    detail: 'ШКФ, альбумінурія та KDIGO-ризик.',
    icon: '◖',
    tone: 'emerald',
  },
  {
    id: 'calculators',
    label: 'Калькулятори',
    description: 'CHA₂DS₂-VASc, HAS-BLED, BMI та інші',
    detail: 'Клінічні шкали для практики.',
    icon: '▦',
    tone: 'blue',
  },
  {
    id: 'questionnaires',
    label: 'Опитувальники',
    description: 'GAD-7, PHQ-9, FINDRISC, AUDIT-C',
    detail: 'Скринінгові опитувальники.',
    icon: '?',
    tone: 'teal',
  },
  {
    id: 'assistant',
    label: 'Асистент лікаря',
    description: 'Структурований медичний висновок',
    detail: 'Заключення на основі даних.',
    icon: '▤',
    tone: 'slate',
  },
];

const toneClasses = {
  blue: {
    icon: 'bg-blue-50 text-blue-700 ring-blue-100',
    title: 'text-blue-700',
    button: 'border-blue-200 text-blue-700 hover:bg-blue-50',
    active: 'border-blue-300 bg-blue-50/60 ring-blue-100',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    title: 'text-emerald-700',
    button: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
    active: 'border-emerald-300 bg-emerald-50/60 ring-emerald-100',
  },
  teal: {
    icon: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
    title: 'text-cyan-700',
    button: 'border-cyan-200 text-cyan-700 hover:bg-cyan-50',
    active: 'border-cyan-300 bg-cyan-50/60 ring-cyan-100',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-700 ring-slate-200',
    title: 'text-slate-700',
    button: 'border-slate-300 text-slate-700 hover:bg-slate-50',
    active: 'border-slate-300 bg-slate-50 ring-slate-200',
  },
};

export default function AppTabs() {
  const [activeTab, setActiveTab] = useState('assistant');
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            ▦
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-blue-700">
            Калькулятори та інструменти
          </h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {tabs.map((tab) => (
            <article
              key={tab.id}
              className={`flex min-h-[8.5rem] flex-col rounded-lg border bg-white p-3 shadow-sm shadow-slate-100/80 transition ${
                activeTab === tab.id
                  ? `${toneClasses[tab.tone].active} ring-2`
                  : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50/40'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-1 flex-col text-left"
              >
                <span className="flex items-start gap-2">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-1 ${toneClasses[tab.tone].icon}`}>
                    {tab.icon}
                  </span>
                  <span>
                    <span className={`block text-sm font-semibold ${toneClasses[tab.tone].title}`}>
                      {tab.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold leading-4 text-slate-600">
                      {tab.description}
                    </span>
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-4 text-slate-600">{tab.detail}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`mt-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${toneClasses[tab.tone].button}`}
              >
                Перейти
              </button>
            </article>
          ))}
        </div>
      </div>

      {activeTabData?.description && (
        <div className="border-b border-slate-100 bg-white px-4 py-3">
          <p className="text-sm font-medium text-slate-500">{activeTabData.description}</p>
        </div>
      )}

      <div className="p-4">
        {activeTab === 'assistant' && <CardioAssistantTab />}
        {activeTab === 'score2' && <Score2Tab />}
        {activeTab === 'egfr' && <EgfrTab />}
        {activeTab === 'calculators' && <CalculatorsTab />}
        {activeTab === 'questionnaires' && <QuestionnairesTab />}
      </div>
    </section>
  );
}
