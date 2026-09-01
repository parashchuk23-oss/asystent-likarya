'use client';

import { useMemo, useState } from 'react';
import { nationalSchedule } from '../../data/vaccination/ukraine/nationalSchedule';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';
import { getVaccineTitle } from '../../utils/vaccination/vaccinationAssessment';

const ageColumns = [
  { key: 'birth', label: '3–5 доба', shortLabel: '3–5 діб', group: 'infancy', matches: (dose) => dose.id === 'bcg-birth' },
  { key: '2m', label: '2 місяці', shortLabel: '2 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 2 },
  { key: '4m', label: '4 місяці', shortLabel: '4 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 4 },
  { key: '6m', label: '6 місяців', shortLabel: '6 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 6 },
  { key: '12m', label: '12 місяців', shortLabel: '12 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 12 },
  { key: '18m', label: '18 місяців', shortLabel: '18 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 18 },
  { key: '4y', label: '4 роки', shortLabel: '4 роки', group: 'childhood', matches: (dose) => dose.minAgeMonths === 48 },
  { key: '6y', label: '6 років', shortLabel: '6 років', group: 'childhood', matches: (dose) => dose.minAgeMonths === 72 },
  { key: '12y', label: '12–13 років', shortLabel: '12–13 р.', group: 'childhood', matches: (dose) => dose.minAgeMonths === 144 },
  { key: '16y', label: '16 років', shortLabel: '16 років', group: 'childhood', matches: (dose) => dose.minAgeMonths === 192 },
  { key: 'adult', label: 'Дорослі', shortLabel: 'Дорослі', group: 'adult', matches: (dose) => dose.id === 'dt-adult' },
];

const stageFilters = [
  { id: 'all', label: 'Увесь календар' },
  { id: 'infancy', label: 'До 18 місяців' },
  { id: 'childhood', label: '4–16 років' },
  { id: 'adult', label: 'Дорослі' },
];

const vaccineOrder = ['bcg', 'hepb', 'dtap', 'polio', 'hib', 'mmr', 'hpv', 'dt'];

function getDoseLabel(dose) {
  if (dose.id === 'dt-adult') return '10 р.';
  if (dose.type.includes('ревакцинація') && dose.vaccineId === 'dt') return 'РВ';
  return dose.doseNumber ? String(dose.doseNumber) : '•';
}

function getDoseAccessibleLabel(dose) {
  const dosePart = dose.doseNumber ? `, доза ${dose.doseNumber}` : '';
  const sexPart = dose.sex === 'female' ? ', дівчата' : '';
  return `${getVaccineTitle(dose.vaccineId)}, ${dose.ageLabel}${dosePart}${sexPart}`;
}

export default function NationalScheduleView() {
  const [view, setView] = useState('chart');
  const [stage, setStage] = useState('all');
  const [selectedDose, setSelectedDose] = useState(nationalSchedule[0]);

  const visibleColumns = stage === 'all' ? ageColumns : ageColumns.filter((column) => column.group === stage);
  const visibleDoses = nationalSchedule.filter((dose) => visibleColumns.some((column) => column.matches(dose)));

  const vaccineRows = useMemo(
    () => vaccineOrder
      .map((vaccineId) => ({
        vaccineId,
        title: getVaccineTitle(vaccineId),
        doses: nationalSchedule.filter((dose) => dose.vaccineId === vaccineId),
      }))
      .filter((row) => row.doses.length > 0),
    [],
  );

  const selectStage = (stageId) => {
    const nextColumns = stageId === 'all' ? ageColumns : ageColumns.filter((column) => column.group === stageId);
    const firstDose = nationalSchedule.find((dose) => nextColumns.some((column) => column.matches(dose)));
    setStage(stageId);
    if (firstDose) setSelectedDose(firstDose);
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Національний календар України</p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-xl font-bold">Календар профілактичних щеплень</h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
                Оберіть віковий етап і натисніть на маркер дози, щоб переглянути деталі.
              </p>
            </div>
            <div className="inline-flex w-fit rounded-lg border border-white/15 bg-white/10 p-1" aria-label="Спосіб відображення календаря">
              {[
                { id: 'chart', label: 'Графік' },
                { id: 'list', label: 'Список' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setView(option.id)}
                  className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                    view === option.id ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-pressed={view === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="Фільтр за віковим етапом">
            {stageFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => selectStage(filter.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  stage === filter.id
                    ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-800'
                }`}
                aria-pressed={stage === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {view === 'chart' && (
            <>
              <div className="mt-5 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
                <div
                  className="min-w-max bg-white"
                  style={{ display: 'grid', gridTemplateColumns: `minmax(190px, 1.5fr) repeat(${visibleColumns.length}, minmax(82px, 1fr))` }}
                >
                  <div className="sticky left-0 z-20 flex items-end border-b border-r border-slate-200 bg-slate-50 p-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Інфекція / вакцина
                  </div>
                  {visibleColumns.map((column) => (
                    <div key={column.key} className="flex min-h-16 items-end justify-center border-b border-slate-200 bg-slate-50 px-2 py-3 text-center text-xs font-bold text-slate-700">
                      {column.shortLabel}
                    </div>
                  ))}

                  {vaccineRows.map((row, rowIndex) => (
                    <div key={row.vaccineId} className="contents">
                      <div className={`sticky left-0 z-10 flex items-center border-r border-slate-200 px-3 py-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}>
                        <span className="mr-3 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" aria-hidden="true" />
                        <span className="text-sm font-bold leading-5 text-slate-900">{row.title}</span>
                      </div>
                      {visibleColumns.map((column) => {
                        const dose = row.doses.find((item) => column.matches(item));
                        const isSelected = dose?.id === selectedDose?.id;

                        return (
                          <div
                            key={`${row.vaccineId}-${column.key}`}
                            className={`relative flex min-h-20 items-center justify-center px-2 py-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}
                          >
                            <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" aria-hidden="true" />
                            {dose && (
                              <button
                                type="button"
                                onClick={() => setSelectedDose(dose)}
                                className={`relative z-10 flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-2 text-sm font-extrabold transition focus:outline-none focus:ring-4 focus:ring-teal-200 ${
                                  isSelected
                                    ? 'scale-110 border-teal-700 bg-teal-600 text-white shadow-md shadow-teal-200'
                                    : 'border-teal-200 bg-teal-50 text-teal-800 hover:scale-105 hover:border-teal-500 hover:bg-teal-100'
                                }`}
                                aria-label={getDoseAccessibleLabel(dose)}
                                aria-pressed={isSelected}
                              >
                                {getDoseLabel(dose)}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-5 md:hidden">
                {visibleColumns.map((column) => {
                  const doses = visibleDoses.filter((dose) => column.matches(dose));
                  if (doses.length === 0) return null;

                  return (
                    <section key={column.key} className="relative pl-8">
                      <span className="absolute bottom-0 left-3 top-3 w-px bg-teal-200" aria-hidden="true" />
                      <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal-500 ring-2 ring-teal-100" aria-hidden="true" />
                      <h4 className="text-sm font-extrabold text-slate-950">{column.label}</h4>
                      <div className="mt-2 grid gap-2">
                        {doses.map((dose) => {
                          const isSelected = dose.id === selectedDose?.id;
                          return (
                            <button
                              key={dose.id}
                              type="button"
                              onClick={() => setSelectedDose(dose)}
                              className={`rounded-lg border p-3 text-left transition ${
                                isSelected
                                  ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100'
                                  : 'border-slate-200 bg-white hover:border-teal-300'
                              }`}
                              aria-pressed={isSelected}
                            >
                              <span className="block text-sm font-bold text-slate-950">{getVaccineTitle(dose.vaccineId)}</span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">
                                {dose.type}{dose.doseNumber ? ` · доза ${dose.doseNumber}` : ''}{dose.sex === 'female' ? ' · дівчата' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}

          {view === 'list' && (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleDoses.map((dose) => (
                <button
                  key={dose.id}
                  type="button"
                  onClick={() => setSelectedDose(dose)}
                  className={`rounded-lg border p-4 text-left transition ${
                    dose.id === selectedDose?.id
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100'
                      : 'border-slate-200 bg-white hover:border-teal-300'
                  }`}
                  aria-pressed={dose.id === selectedDose?.id}
                >
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{dose.ageLabel}</span>
                  <span className="mt-2 block text-base font-bold text-slate-950">{getVaccineTitle(dose.vaccineId)}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">
                    {dose.type}{dose.doseNumber ? `, доза ${dose.doseNumber}` : ''}{dose.sex === 'female' ? ', дівчата' : ''}.
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedDose && (
            <aside className="mt-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4" aria-live="polite">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Вибране щеплення</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-950">{getVaccineTitle(selectedDose.vaccineId)}</h4>
                </div>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-bold text-sky-800 ring-1 ring-sky-200">
                  {selectedDose.ageLabel}
                </span>
              </div>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Етап</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {selectedDose.type}{selectedDose.doseNumber ? `, доза ${selectedDose.doseNumber}` : ''}{selectedDose.sex === 'female' ? ', дівчата' : ''}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Примітка</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{selectedDose.note}</dd>
                </div>
              </dl>
            </aside>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-500" />Календарна доза</span>
            <span>РВ — ревакцинація</span>
            <span>10 р. — повторювати кожні 10 років</span>
          </div>
        </div>
      </section>

      <p className="px-1 text-xs font-semibold leading-5 text-slate-500">
        Перевірено: {vaccinationMetadata.checkedAt}. Версія: {vaccinationMetadata.version}. Дані не зберігаються і не передаються на сервер.
      </p>
    </div>
  );
}
