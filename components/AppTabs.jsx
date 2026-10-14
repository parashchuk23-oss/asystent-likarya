'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import HomeTab from './HomeTab';

function TabLoading() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
      Завантаження розділу…
    </div>
  );
}

const CalculatorsTab = dynamic(() => import('./CalculatorsTab'), { loading: TabLoading });
const CardioAssistantTab = dynamic(() => import('./CardioAssistantTab'), { loading: TabLoading });
const DiseasesTab = dynamic(() => import('./DiseasesTab'), { loading: TabLoading });
const DocumentsTab = dynamic(() => import('./DocumentsTab'), { loading: TabLoading });
const EcgTab = dynamic(() => import('./ecg/EcgTab'), { loading: TabLoading });
const PharmacologyTab = dynamic(() => import('./PharmacologyTab'), { loading: TabLoading });
const QuestionnairesTab = dynamic(() => import('./QuestionnairesTab'), { loading: TabLoading });
const UltrasoundTab = dynamic(() => import('./ultrasound/UltrasoundTab'), { loading: TabLoading });
const VaccinationTab = dynamic(() => import('./VaccinationTab'), { loading: TabLoading });

const tabs = [
  {
    id: 'home',
    label: 'Головна',
    description: 'Що це за продукт і з чого почати.',
  },
  {
    id: 'assistant',
    label: 'Огляд пацієнта',
    description: 'Оберіть потрібні клінічні статуси та сформуйте структурований опис огляду.',
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
    id: 'vaccination',
    label: 'Вакцинація',
    description: 'Календар щеплень, catch-up, рекомендовані вакцини та робота із запереченнями',
  },
  {
    id: 'ultrasound',
    label: 'УЗД',
    description: 'Структуровані протоколи ультразвукових досліджень',
  },
  {
    id: 'ecg',
    label: 'ЕКГ',
    description: 'Структурована інтерпретація ЕКГ, QT/QTc, електрична вісь та клінічні чек-листи',
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
  {
    id: 'documents',
    label: 'Документи',
    description: 'Накази, стандарти, критерії госпіталізації та шаблони для копіювання',
  },
];

export default function AppTabs({
  initialTab = 'home',
  initialDrugSection = 'guide',
  initialDocumentArea = 'regulations',
  initialRehabilitationSearchOpen = false,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [requestedQuestionnaireId, setRequestedQuestionnaireId] = useState(null);
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  function openQuestionnaire(questionnaireId) {
    setRequestedQuestionnaireId(questionnaireId);
    setActiveTab('questionnaires');
  }

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
        {activeTab === 'questionnaires' && (
          <QuestionnairesTab requestedQuestionnaireId={requestedQuestionnaireId} />
        )}
        {activeTab === 'vaccination' && <VaccinationTab />}
        {activeTab === 'ultrasound' && <UltrasoundTab />}
        {activeTab === 'ecg' && <EcgTab />}
        {activeTab === 'drugs' && <PharmacologyTab initialSection={initialDrugSection} />}
        {activeTab === 'diseases' && <DiseasesTab />}
        {activeTab === 'documents' && (
          <DocumentsTab
            initialArea={initialDocumentArea}
            initialRehabilitationSearchOpen={initialRehabilitationSearchOpen}
            onOpenQuestionnaire={openQuestionnaire}
          />
        )}
      </div>
    </section>
  );
}
