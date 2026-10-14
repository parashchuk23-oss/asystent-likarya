'use client';

import { useState } from 'react';
import { regulations } from '../data/regulations';
import RegulationCard from './documents/RegulationCard';
import RegulationViewer from './documents/RegulationViewer';
import SocialCareMedicalConclusionForm from './documents/SocialCareMedicalConclusionForm';
import FunctioningAssessment from './documents/FunctioningAssessment';

const documentAreas = [
  {
    id: 'regulations',
    title: 'Накази та стандарти',
    description: 'Офіційні нормативні документи, структуровані для швидкої роботи лікаря.',
  },
  {
    id: 'templates',
    title: 'Довідки й шаблони',
    description: 'Медичні висновки та практичні шаблони для швидкого заповнення, копіювання і друку.',
  },
  {
    id: 'functioning',
    title: 'Оцінювання функціонування',
    description: 'Об’єктивні дослідження та валідовані тести для документування функціональних порушень.',
  },
];

export default function DocumentsTab({
  initialArea = 'regulations',
  initialRehabilitationSearchOpen = false,
  onOpenQuestionnaire,
}) {
  const [activeArea, setActiveArea] = useState(initialArea);
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

      <nav aria-label="Розділи документів" className="border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto" role="tablist">
        {documentAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => setActiveArea(area.id)}
            role="tab"
            aria-selected={activeArea === area.id}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors sm:text-base ${
              activeArea === area.id
                ? 'border-blue-600 text-blue-800'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            {area.title}
          </button>
        ))}
        </div>
      </nav>

      <p className="text-sm leading-6 text-slate-600">
        {documentAreas.find((area) => area.id === activeArea)?.description}
      </p>

      {activeArea === 'templates' && (
        <SocialCareMedicalConclusionForm />
      )}

      {activeArea === 'functioning' && (
        <FunctioningAssessment
          initialSearchOpen={initialRehabilitationSearchOpen}
          onOpenQuestionnaire={onOpenQuestionnaire}
        />
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
