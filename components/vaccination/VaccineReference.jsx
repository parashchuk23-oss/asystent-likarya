'use client';

import AccordionSection from '../AccordionSection';
import { useState } from 'react';
import {
  recommendedVaccineDefinitions,
  vaccineDefinitions,
} from '../../data/vaccination/ukraine/vaccineDefinitions';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';
import { inputClass } from '../formStyles';

const allVaccineDefinitions = [...vaccineDefinitions, ...recommendedVaccineDefinitions];

export default function VaccineReference() {
  const [openId, setOpenId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('uk-UA');
  const filteredVaccines = normalizedSearchTerm
    ? allVaccineDefinitions.filter((vaccine) => [
      vaccine.title,
      ...(vaccine.disease || []),
      vaccine.importance,
      vaccine.schedule,
      ...(vaccine.tradeNames || []),
      ...(vaccine.recommendedFor || []),
    ].filter(Boolean).join(' ').toLocaleLowerCase('uk-UA').includes(normalizedSearchTerm))
    : allVaccineDefinitions;

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <label className="block">
          <span className="text-sm font-bold text-slate-800">Пошук у довіднику вакцин</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Назва вакцини або хвороби"
            className={`${inputClass} mt-2`}
          />
        </label>
        <p className="mt-2 text-xs font-semibold text-slate-500">
          Знайдено: {filteredVaccines.length} із {allVaccineDefinitions.length}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Торгові назви наведено як типові приклади для українського ринку, а не як вичерпний перелік або рекомендацію конкретного препарату. Наявність і реєстраційний статус можуть змінюватися.
        </p>
      </section>

      {filteredVaccines.map((vaccine) => (
        <AccordionSection
          key={vaccine.id}
          id={`vaccine-${vaccine.id}`}
          title={vaccine.title}
          subtitle={vaccine.disease?.length
            ? `Захищає від: ${vaccine.disease.join(', ')}`
            : 'Рекомендована вакцина поза Національним календарем'}
          isOpen={openId === vaccine.id}
          onToggle={() => setOpenId(openId === vaccine.id ? null : vaccine.id)}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <InfoBlock title="Від якої хвороби захищає" items={vaccine.disease} />
            <InfoBlock title="Чому важливо" items={[vaccine.importance]} />
            <InfoBlock title="Коли робиться" items={[vaccine.schedule]} />
            <InfoBlock title="Державна чи власним коштом" items={[vaccine.funding]} />
            <InfoBlock title="Тип вакцини" items={[vaccine.vaccineType]} />
            {vaccine.tradeNames?.length ? <InfoBlock title="Типові торгові назви в Україні" items={vaccine.tradeNames} /> : null}
            <InfoBlock title="Побічні реакції та переносимість" items={vaccine.adverseEffects} />
            {vaccine.recommendedFor?.length ? <InfoBlock title="Кому рекомендована" items={vaccine.recommendedFor} /> : null}
            {vaccine.routes?.length ? <InfoBlock title="Шлях введення" items={vaccine.routes} /> : null}
            {vaccine.contraindications?.length ? <InfoBlock title="Основні протипоказання" items={vaccine.contraindications} /> : null}
            {vaccine.precautions?.length ? <InfoBlock title="Тимчасові застереження" items={vaccine.precautions} /> : null}
            {vaccine.simultaneousUse ? <InfoBlock title="Одночасне введення" items={[vaccine.simultaneousUse]} /> : null}
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Актуальність перевірено: {vaccinationMetadata.checkedAt}. Перед застосуванням перевірте чинну державну реєстрацію, інструкцію, відповідність віку та схемі, наявність препарату і дотримання холодового ланцюга.
          </p>
        </AccordionSection>
      ))}

      {filteredVaccines.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
          За цим запитом вакцин не знайдено. Спробуйте ввести назву вакцини або інфекції.
        </section>
      ) : null}
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
