'use client';

import { catchUpRules } from '../../data/vaccination/ukraine/nationalSchedule';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';
import { getVaccineTitle } from '../../utils/vaccination/vaccinationAssessment';

export default function CatchUpPlanner() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-950">Catch-up вакцинація</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Орієнтир для ситуацій, коли щеплення пропущені або історія неповна. Курс не слід починати заново лише через
          тривалу перерву без перевірки чинних правил.
        </p>
      </section>

      <div className="space-y-3">
        {catchUpRules.map((rule) => (
          <article key={rule.vaccineId} className="rounded-lg border border-teal-300 bg-white p-4">
            <h4 className="text-base font-bold text-slate-950">{getVaccineTitle(rule.vaccineId)}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{rule.summary}</p>
          </article>
        ))}
      </div>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Мінімальні інтервали можуть залежати від віку, попередніх доз, типу вакцини та конкретного препарату. Перед
        остаточним планом звіртеся з чинною редакцією наказу №595 і офіційною інструкцією вакцини.
      </section>

      <p className="text-xs font-semibold text-slate-500">Джерело: {vaccinationMetadata.source[2].title}.</p>
    </div>
  );
}
