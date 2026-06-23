'use client';

import { hypertensionDisease } from '../data/diseases/hypertension';
import DiseaseTemplateCard from './diseases/DiseaseTemplateCard';

const diseases = [hypertensionDisease];

export default function DiseasesTab() {
  return (
    <div>
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Клінічні шаблони
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Хвороби</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Довідкові блоки для швидкого формулювання діагнозу та рекомендацій. Текст призначений
          для редагування лікарем перед копіюванням у заключення.
        </p>
      </header>

      <section className="mt-6 space-y-4">
        {diseases.map((disease) => (
          <DiseaseTemplateCard key={disease.id} disease={disease} />
        ))}
      </section>
    </div>
  );
}
