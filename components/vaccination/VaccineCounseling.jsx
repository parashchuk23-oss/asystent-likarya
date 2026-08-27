'use client';

import { useState } from 'react';
import AccordionSection from '../AccordionSection';
import { vaccinationObjections } from '../../data/vaccination/ukraine/counseling/objections';

export default function VaccineCounseling() {
  const [openId, setOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyText = async (item) => {
    const text = `${item.title}\n\n${item.response}\n\nКлючовий факт: ${item.keyFact}\n\nКоли потрібна додаткова оцінка: ${item.whenToAssess}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-950">Робота із запереченнями</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Короткі фрази для спокійної розмови з пацієнтом: без осуду, залякування і неперевіреної статистики.
        </p>
      </section>

      {vaccinationObjections.map((item) => (
        <AccordionSection
          key={item.id}
          id={`objection-${item.id}`}
          title={item.title}
          subtitle="Емпатична відповідь, факт і коли потрібна додаткова оцінка"
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        >
          <div className="space-y-3 text-sm leading-6 text-slate-700">
            <p>{item.response}</p>
            <p><strong>Ключовий факт:</strong> {item.keyFact}</p>
            <p><strong>Коли оцінити додатково:</strong> {item.whenToAssess}</p>
            <button
              type="button"
              onClick={() => copyText(item)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {copiedId === item.id ? 'Скопійовано' : 'Скопіювати для пацієнта'}
            </button>
          </div>
        </AccordionSection>
      ))}
    </div>
  );
}
