'use client';

import { useState } from 'react';
import { regulations } from '../data/regulations';
import RegulationCard from './documents/RegulationCard';
import RegulationViewer from './documents/RegulationViewer';

const documentAreas = [
  {
    id: 'regulations',
    title: 'Накази та стандарти',
    description: 'Офіційні нормативні документи, структуровані для швидкої роботи лікаря.',
  },
  {
    id: 'templates',
    title: 'Довідки й шаблони',
    description: 'Практичні тексти для копіювання. Розділ буде наповнюватися окремо.',
  },
];

export default function DocumentsTab() {
  const [activeArea, setActiveArea] = useState('regulations');
  const [selectedRegulationId, setSelectedRegulationId] = useState(regulations[0]?.id);
  const selectedRegulation = regulations.find((regulation) => regulation.id === selectedRegulationId);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">Документи</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Нормативні документи та шаблони</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Практичний розділ для швидкого пошуку критеріїв, копіювання фрагментів і підготовки короткого тексту
          направлення. Дані структуровані з офіційного документа, без автоматичного рішення за лікаря.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {documentAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => setActiveArea(area.id)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              activeArea === area.id
                ? 'border-blue-300 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <h3 className="text-lg font-bold">{area.title}</h3>
            <p className="mt-1 text-sm leading-6">{area.description}</p>
          </button>
        ))}
      </div>

      {activeArea === 'templates' && (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-950">Довідки й шаблони</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Цей розділ підготовлений у структурі модуля, але поки не наповнений окремими шаблонами. Перший шаблон
            направлення вже доступний всередині критеріїв наказу №1044.
          </p>
        </section>
      )}

      {activeArea === 'regulations' && (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            {regulations.map((regulation) => (
              <RegulationCard
                key={regulation.id}
                regulation={regulation}
                isActive={selectedRegulationId === regulation.id}
                onSelect={() => setSelectedRegulationId(regulation.id)}
              />
            ))}
          </div>
          {selectedRegulation && <RegulationViewer regulation={selectedRegulation} />}
        </div>
      )}
    </div>
  );
}
