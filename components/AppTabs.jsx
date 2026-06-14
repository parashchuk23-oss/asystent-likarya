'use client';

import { useState } from 'react';
import CalculatorsTab from './CalculatorsTab';
import CardioAssistantTab from './CardioAssistantTab';
import EgfrTab from './EgfrTab';
import QuestionnairesTab from './QuestionnairesTab';
import Score2Tab from './Score2Tab';

const tabs = [
  { id: 'assistant', label: 'Асистент лікаря' },
  { id: 'score2', label: 'Кардіоваскулярний ризик' },
  { id: 'egfr', label: 'Ниркова функція' },
  { id: 'calculators', label: 'Калькулятори' },
  { id: 'questionnaires', label: 'Опитувальники' },
];

export default function AppTabs() {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
