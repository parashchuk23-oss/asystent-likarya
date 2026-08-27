'use client';

import { nationalSchedule } from '../../data/vaccination/ukraine/nationalSchedule';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';
import { getVaccineTitle } from '../../utils/vaccination/vaccinationAssessment';

export default function NationalScheduleView() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-950">Календар щеплень України</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Швидкий перегляд календарних щеплень. На телефоні записи читаються як картки, без широкої таблиці.
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500">
          Перевірено: {vaccinationMetadata.checkedAt}. Версія: {vaccinationMetadata.version}.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {nationalSchedule.map((dose) => (
          <article key={dose.id} className="rounded-lg border border-teal-300 bg-white p-4 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">{dose.ageLabel}</p>
            <h4 className="mt-2 text-lg font-bold text-slate-950">{getVaccineTitle(dose.vaccineId)}</h4>
            <p className="mt-1 text-sm text-slate-600">
              {dose.type}
              {dose.doseNumber ? `, доза ${dose.doseNumber}` : ''}
              {dose.sex === 'female' ? ', дівчата' : ''}.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{dose.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
