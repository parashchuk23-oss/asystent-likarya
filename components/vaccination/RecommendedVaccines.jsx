'use client';

import { recommendedVaccineDefinitions } from '../../data/vaccination/ukraine/vaccineDefinitions';

export default function RecommendedVaccines() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-950">Рекомендовані позакалендарні вакцини</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Це не обов’язкові щеплення Національного календаря. Вони можуть бути доречними за віком, станом здоров’я,
          професійними ризиками або перед подорожами.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {recommendedVaccineDefinitions.map((vaccine) => (
          <article key={vaccine.id} className="rounded-lg border border-teal-300 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              рекомендована поза Національним календарем
            </p>
            <h4 className="mt-2 text-lg font-bold text-slate-950">{vaccine.title}</h4>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
              {vaccine.recommendedFor.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
