'use client';

import { useState } from 'react';
import CalculatorsTab from './CalculatorsTab';
import CardioAssistantTab from './CardioAssistantTab';
import DiseasesTab from './DiseasesTab';
import HomeTab from './HomeTab';
import PharmacologyTab from './PharmacologyTab';
import QuestionnairesTab from './QuestionnairesTab';

const tabs = [
  {
    id: 'home',
    label: 'Головна',
    description: 'Що це за продукт і з чого почати.',
  },
  {
    id: 'assistant',
    label: 'Асистент лікаря',
    description: 'Заключення формується лікарем на основі введених даних.',
  },
  {
    id: 'calculators',
    label: 'Калькулятори',
    description: 'SCORE2, ниркова функція, CHA₂DS₂-VASc, HAS-BLED та інші інструменти',
  },
  {
    id: 'questionnaires',
    label: 'Опитувальники',
    description: 'GAD-7, PHQ-9, FINDRISC, AUDIT-C, STOP-Bang',
  },
  {
    id: 'drugs',
    label: 'Препарати',
    description: 'Практичний фармакологічний довідник',
  },
  {
    id: 'diseases',
    label: 'Хвороби',
    description: 'Діагнози та рекомендації для копіювання',
  },
];

export default function AppTabs() {
  const [activeTab, setActiveTab] = useState('home');
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/70">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/80 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                : 'text-slate-500 hover:bg-white/80 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTabData?.description && (
        <div className="border-b border-slate-100 bg-white px-4 py-3">
          <p className="text-sm font-medium text-slate-500">{activeTabData.description}</p>
        </div>
      )}

      <div className="p-4">
        {activeTab === 'home' && <HomeTab onSelectTab={setActiveTab} />}
        {activeTab === 'assistant' && <CardioAssistantTab />}
        {activeTab === 'calculators' && <CalculatorsTab />}
        {activeTab === 'questionnaires' && <QuestionnairesTab />}
        {activeTab === 'drugs' && <PharmacologyTab />}
        {activeTab === 'diseases' && <DiseasesTab />}
      </div>
    </section>
  );
}
