'use client';

import { useState } from 'react';
import CalculatorsTab from './CalculatorsTab';
import CardioAssistantTab from './CardioAssistantTab';
import EgfrTab from './EgfrTab';
import QuestionnairesTab from './QuestionnairesTab';
import Score2Tab from './Score2Tab';

const tabs = [
  {
    id: 'assistant',
    label: 'Асистент лікаря',
    description: 'Заключення формується лікарем на основі введених даних.',
  },
  {
    id: 'score2',
    label: 'Кардіоваскулярний ризик',
    description: 'SCORE2 / SCORE2-OP',
  },
  {
    id: 'egfr',
    label: 'Ниркова функція',
    description: 'CKD-EPI 2021, Cockcroft-Gault, ACR, KDIGO',
  },
  {
    id: 'calculators',
    label: 'Калькулятори',
    description: 'CHA₂DS₂-VASc, HAS-BLED',
  },
  {
    id: 'questionnaires',
    label: 'Опитувальники',
    description: 'GAD-7, PHQ-9, FINDRISC, AUDIT-C, STOP-Bang',
  },
];

export default function AppTabs() {
  const [activeTab, setActiveTab] = useState('assistant');
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

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

      {activeTabData?.description && (
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm text-slate-500">{activeTabData.description}</p>
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
