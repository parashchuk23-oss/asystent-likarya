'use client';

import AccordionSection from '../AccordionSection';
import { useState } from 'react';
import { vaccineDefinitions } from '../../data/vaccination/ukraine/vaccineDefinitions';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';

export default function VaccineReference() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-3">
      {vaccineDefinitions.map((vaccine) => (
        <AccordionSection
          key={vaccine.id}
          id={`vaccine-${vaccine.id}`}
          title={vaccine.title}
          subtitle={`Захищає від: ${vaccine.disease.join(', ')}`}
          isOpen={openId === vaccine.id}
          onToggle={() => setOpenId(openId === vaccine.id ? null : vaccine.id)}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <InfoBlock title="Статус в Україні" items={[vaccine.status === 'national-calendar' ? 'календарна вакцина' : 'рекомендована вакцина']} />
            <InfoBlock title="Шлях введення" items={vaccine.routes} />
            <InfoBlock title="Основні протипоказання" items={vaccine.contraindications} />
            <InfoBlock title="Тимчасові застереження" items={vaccine.precautions} />
            <InfoBlock title="Типові реакції" items={vaccine.adverseEffects} />
            <InfoBlock title="Одночасне введення" items={[vaccine.simultaneousUse]} />
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Актуальність перевірено: {vaccinationMetadata.checkedAt}. Джерела: МОЗ України, ЦГЗ МОЗ України, наказ №595.
          </p>
        </AccordionSection>
      ))}
    </div>
  );
}

function InfoBlock({ title, items = [] }) {
  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}
