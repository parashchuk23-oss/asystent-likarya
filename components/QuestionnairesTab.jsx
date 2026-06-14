'use client';

import { useState } from 'react';
import AuditCQuestionnaire from './questionnaires/AuditCQuestionnaire';
import EpworthQuestionnaire from './questionnaires/EpworthQuestionnaire';
import FagerstromQuestionnaire from './questionnaires/FagerstromQuestionnaire';
import FindriscQuestionnaire from './questionnaires/FindriscQuestionnaire';
import Gad7Questionnaire from './questionnaires/Gad7Questionnaire';
import Phq9Questionnaire from './questionnaires/Phq9Questionnaire';
import StopBangQuestionnaire from './questionnaires/StopBangQuestionnaire';

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
];

export default function QuestionnairesTab() {
  const [openId, setOpenId] = useState(null);

  function toggleQuestionnaire(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="space-y-4">
      {questionnaires.map((questionnaire) => {
        const isOpen = openId === questionnaire.id;

        return (
          <article key={questionnaire.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => toggleQuestionnaire(questionnaire.id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
            >
              <span>
                <span className="block text-base font-semibold text-blue-700">{questionnaire.title}</span>
                <span className="mt-1 block text-sm text-slate-500">{questionnaire.description}</span>
              </span>
              <span className="text-xl font-semibold text-slate-400">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 p-5">
                {questionnaire.component || (
                  <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
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
