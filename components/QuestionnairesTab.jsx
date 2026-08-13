'use client';

import { useEffect, useRef, useState } from 'react';
import AuditCQuestionnaire from './questionnaires/AuditCQuestionnaire';
import ChronicPainImpactQuestionnaire from './questionnaires/ChronicPainImpactQuestionnaire';
import EpworthQuestionnaire from './questionnaires/EpworthQuestionnaire';
import FagerstromQuestionnaire from './questionnaires/FagerstromQuestionnaire';
import FindriscQuestionnaire from './questionnaires/FindriscQuestionnaire';
import Gad7Questionnaire from './questionnaires/Gad7Questionnaire';
import NeuropathicPainScreeningQuestionnaire from './questionnaires/NeuropathicPainScreeningQuestionnaire';
import PalliativeCareNeedQuestionnaire from './questionnaires/PalliativeCareNeedQuestionnaire';
import PainFunctionalImpactQuestionnaire from './questionnaires/PainFunctionalImpactQuestionnaire';
import PainIntensityQuestionnaire from './questionnaires/PainIntensityQuestionnaire';
import Phq9Questionnaire from './questionnaires/Phq9Questionnaire';
import SleepDifficultyQuestionnaire from './questionnaires/SleepDifficultyQuestionnaire';
import StopBangQuestionnaire from './questionnaires/StopBangQuestionnaire';
import StressPerceptionQuestionnaire from './questionnaires/StressPerceptionQuestionnaire';

const questionnaires = [
  {
    id: 'gad7',
    title: 'GAD-7',
    description: 'Скринінг симптомів тривоги',
    component: <Gad7Questionnaire />,
  },
  {
    id: 'phq9',
    title: 'PHQ-9',
    description: 'Скринінг депресивних симптомів',
    component: <Phq9Questionnaire />,
  },
  {
    id: 'findrisc',
    title: 'FINDRISC',
    description: 'Оцінка ризику цукрового діабету 2 типу',
    component: <FindriscQuestionnaire />,
  },
  {
    id: 'auditc',
    title: 'AUDIT-C',
    description: 'Скринінг ризикованого вживання алкоголю',
    component: <AuditCQuestionnaire />,
  },
  {
    id: 'fagerstrom',
    title: 'Fagerström',
    description: 'Оцінка нікотинової залежності',
    component: <FagerstromQuestionnaire />,
  },
  {
    id: 'stopbang',
    title: 'STOP-Bang',
    description: 'Скринінг ризику обструктивного апное сну',
    component: <StopBangQuestionnaire />,
  },
  {
    id: 'epworth',
    title: 'Epworth',
    description: 'Оцінка денної сонливості',
    component: <EpworthQuestionnaire />,
  },
  {
    id: 'sleep-difficulty',
    title: 'Порушення сну',
    description: 'Короткий скринінг безсоння без копіювання ISI',
    component: <SleepDifficultyQuestionnaire />,
  },
  {
    id: 'stress-perception',
    title: 'Сприйнятий стрес',
    description: 'Короткий скринінг стресу без копіювання PSS-10',
    component: <StressPerceptionQuestionnaire />,
  },
  {
    id: 'pain-intensity',
    title: 'Біль 0-10',
    description: 'NRS / VAS для швидкої оцінки інтенсивності болю',
    component: <PainIntensityQuestionnaire />,
  },
  {
    id: 'chronic-pain-impact',
    title: 'Хронічний біль',
    description: 'GCPS-R / PEG: частота болю та функціональний вплив',
    component: <ChronicPainImpactQuestionnaire />,
  },
  {
    id: 'neuropathic-pain',
    title: 'Нейропатичний компонент болю',
    description: 'Короткий чек-лист ознак без використання DN4 як шкали',
    component: <NeuropathicPainScreeningQuestionnaire />,
  },
  {
    id: 'pain-functional-impact',
    title: 'Функціональний вплив болю',
    description: 'Спрощений модуль замість копіювання BPI short form',
    component: <PainFunctionalImpactQuestionnaire />,
  },
  {
    id: 'palliative-care-need',
    title: 'Потреба в паліативній допомозі',
    description: 'Оцінка за критеріями наказу МОЗ №1308',
    component: <PalliativeCareNeedQuestionnaire />,
  },
];

export default function QuestionnairesTab() {
  const [openId, setOpenId] = useState(null);
  const buttonRefs = useRef({});
  const pendingScrollIdRef = useRef(null);

  useEffect(() => {
    if (!openId || pendingScrollIdRef.current !== openId) return;

    pendingScrollIdRef.current = null;
    window.requestAnimationFrame(() => {
      buttonRefs.current[openId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [openId]);

  function toggleQuestionnaire(id) {
    if (openId !== id) {
      pendingScrollIdRef.current = id;
    }
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="space-y-4 rounded-lg bg-slate-50/70 p-3 sm:p-4">
      {questionnaires.map((questionnaire) => {
        const isOpen = openId === questionnaire.id;

        return (
          <article
            key={questionnaire.id}
            className={`rounded-lg border bg-white shadow-sm shadow-slate-200/60 transition ${
              isOpen
                ? 'border-teal-300 bg-teal-50/20 shadow-sm shadow-teal-100/70'
                : 'border-teal-200/80 hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60'
            }`}
          >
            <button
              ref={(element) => {
                buttonRefs.current[questionnaire.id] = element;
              }}
              type="button"
              onClick={() => toggleQuestionnaire(questionnaire.id)}
              className="scroll-mt-4 flex w-full items-center justify-between gap-4 rounded-lg p-5 text-left transition hover:bg-teal-50/40"
            >
              <span>
                <span className={`block text-base font-semibold tracking-tight ${isOpen ? 'text-teal-900' : 'text-slate-950'}`}>
                  {questionnaire.title}
                </span>
                <span className="mt-1 block text-sm text-slate-500">{questionnaire.description}</span>
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl font-semibold transition ${
                  isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                }`}
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-teal-200/80 bg-white p-5">
                {questionnaire.component || (
                  <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                    Буде додано пізніше.
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
