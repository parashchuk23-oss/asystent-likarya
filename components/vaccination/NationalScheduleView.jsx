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

const vaccineRowDefinitions = [
  { id: 'bcg', title: 'БЦЖ', vaccineIds: ['bcg'] },
  { id: 'hepb', title: 'Гепатит B', vaccineIds: ['hepb'] },
  { id: 'dtap-dt', title: 'Кашлюк, дифтерія, правець', vaccineIds: ['dtap', 'dt'] },
  { id: 'polio', title: 'Поліомієліт', vaccineIds: ['polio'] },
  { id: 'hib', title: 'Hib', vaccineIds: ['hib'] },
  { id: 'mmr', title: 'КПК', vaccineIds: ['mmr'] },
  { id: 'hpv', title: 'ВПЛ', vaccineIds: ['hpv'] },
];

function getDoseLabel(dose) {
  if (dose.vaccineId === 'dt') return { main: 'ДП', sub: null };
  if (dose.doseNumber) return { main: String(dose.doseNumber), sub: 'доза' };
  return { main: '•', sub: null };
}

function getCalendarVaccineTitle(vaccineId) {
  return vaccineId === 'dtap' ? 'Кашлюк, дифтерія, правець' : getVaccineTitle(vaccineId);
}

function getDoseAccessibleLabel(dose) {
  const dosePart = dose.doseNumber ? `, доза ${dose.doseNumber}` : '';
  const sexPart = dose.sex === 'female' ? ', дівчата' : '';
  return `${getCalendarVaccineTitle(dose.vaccineId)}, ${dose.ageLabel}${dosePart}${sexPart}`;
}

function getBcgCatchUpRecommendation(ageMonths) {
  if (ageMonths < 7) {
    return {
      ageGroup: 'Дитина молодше 7 місяців',
      paragraphs: [
        'БЦЖ у пологовому стаціонарі не проведена. Рекомендована вакцинація БЦЖ найближчим часом без попередньої діагностики туберкульозної інфекції після огляду дитини та виключення протипоказань.',
        'Якщо був відомий контакт із хворим на туберкульоз: у зв’язку з відомим контактом вакцинацію БЦЖ не проводити до обстеження дитини, виключення активного туберкульозу та визначення подальшої тактики. Рекомендована консультація фтизіопедіатра/фтизіатра та обстеження відповідно до чинних стандартів ведення контактних осіб.',
      ],
    };
  }

  if (ageMonths < 216) {
    return {
      ageGroup: 'Дитина від 7 місяців до 17 років 11 місяців 29 днів',
      paragraphs: [
        'Перед вакцинацією БЦЖ рекомендовано провести діагностику туберкульозної інфекції: пробу Манту, шкірний тест на основі антигенів туберкульозу або IGRA. За негативного результату, відсутності симптомів активного туберкульозу та протипоказань — провести вакцинацію БЦЖ.',
        'При позитивному або сумнівному результаті БЦЖ не проводити. Позитивний або сумнівний результат тесту не підтверджує активний туберкульоз, але потребує оцінки на туберкульозну інфекцію та виключення активного захворювання. Рекомендована консультація фтизіатра/фтизіопедіатра.',
      ],
    };
  }

  return {
    ageGroup: 'Особа віком 18 років і старше',
    paragraphs: [
      'Планове надолуження БЦЖ після досягнення 18 років Календарем профілактичних щеплень України не передбачене. За наявності контакту, симптомів або факторів ризику провести обстеження на туберкульозну інфекцію та активний туберкульоз відповідно до чинних стандартів.',
    ],
  };
}

export default function NationalScheduleView() {
  const [selectedDose, setSelectedDose] = useState(nationalSchedule[0]);
  const [ageValue, setAgeValue] = useState('');
  const [ageUnit, setAgeUnit] = useState('years');
  const [missingDoseIds, setMissingDoseIds] = useState([]);

  const visibleColumns = ageColumns.filter((column) => column.group !== 'adult');
  const visibleDoses = nationalSchedule.filter((dose) => visibleColumns.some((column) => column.matches(dose)));

  const numericAge = ageValue === '' ? null : Number(ageValue);
  const maximumAge = ageUnit === 'years' ? 120 : 216;
  const ageMonths = numericAge === null ? null : numericAge * (ageUnit === 'years' ? 12 : 1);
  const ageIsValid = numericAge !== null
    && Number.isInteger(numericAge)
    && numericAge >= 0
    && numericAge <= maximumAge;

  const ageRecommendations = useMemo(() => {
    if (!ageIsValid) return [];

    const latestDoseByVaccine = new Map();
    nationalSchedule.forEach((dose) => {
      if (dose.minAgeMonths <= ageMonths) latestDoseByVaccine.set(dose.vaccineId, dose);
    });

    return Array.from(latestDoseByVaccine.values());
  }, [ageIsValid, ageMonths]);

  const vaccineRows = useMemo(
    () => vaccineRowDefinitions
      .map((row) => ({
        ...row,
        doses: nationalSchedule.filter((dose) => row.vaccineIds.includes(dose.vaccineId)),
      }))
      .filter((row) => row.doses.length > 0),
    [],
  );

  const bcgCatchUpRecommendation = ageIsValid && missingDoseIds.includes('bcg-birth')
    ? getBcgCatchUpRecommendation(ageMonths)
    : null;

  const handleDoseClick = (dose) => {
    setSelectedDose(dose);
    if (!ageIsValid || dose.minAgeMonths > ageMonths || dose.vaccineId !== 'bcg') return;

    setMissingDoseIds((current) => (
      current.includes(dose.id)
        ? current.filter((id) => id !== dose.id)
        : [...current, dose.id]
    ));
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Національний календар України</p>
          <div className="mt-2">
            <h3 className="text-xl font-bold">Календар профілактичних щеплень</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
              Введіть вік і натисніть на відсутню дозу, щоб отримати рекомендації з надолуження.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <section className="mb-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.7fr)] lg:items-start">
              <div>
                <h4 className="text-base font-bold text-slate-950">Рекомендації за віком</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Введіть вік, щоб побачити, які календарні щеплення потрібно перевірити в медичній документації.
                </p>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_120px] gap-2">
                  <label>
                    <span className="sr-only">Вік</span>
                    <input
                      type="number"
                      min="0"
                      max={ageUnit === 'years' ? '120' : '216'}
                      step="1"
                      inputMode="numeric"
                      value={ageValue}
                      onChange={(event) => setAgeValue(event.target.value)}
                      placeholder="Введіть вік"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </label>
                  <label>
                    <span className="sr-only">Одиниця віку</span>
                    <select
                      value={ageUnit}
                      onChange={(event) => setAgeUnit(event.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    >
                      <option value="years">років</option>
                      <option value="months">місяців</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-white bg-white p-3 shadow-sm">
                {ageValue === '' && (
                  <p className="text-sm leading-6 text-slate-500">Після введення віку тут з’явиться перелік для перевірки.</p>
                )}

                {ageValue !== '' && !ageIsValid && (
                  <p className="text-sm font-semibold leading-6 text-rose-700">
                    Вкажіть цілий вік від 0 до {maximumAge} {ageUnit === 'years' ? 'років' : 'місяців'}.
                  </p>
                )}

                {ageIsValid && ageRecommendations.length > 0 && (
                  <>
                    <p className="text-sm font-bold text-slate-900">До цього віку перевірте виконання:</p>
                    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                      {ageRecommendations.map((dose) => (
                        <li key={dose.vaccineId} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                          <span className="block text-sm font-bold text-slate-900">{getCalendarVaccineTitle(dose.vaccineId)}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                            {dose.ageLabel}{dose.doseNumber ? ` · доза ${dose.doseNumber}` : ''}{dose.sex === 'female' ? ' · дівчата' : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Без даних про попередні щеплення програма не визначає пропуск. Звірте дози та інтервали з документами пацієнта.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div
                  className="min-w-0 bg-white"
                  style={{ display: 'grid', gridTemplateColumns: `minmax(140px, 1.45fr) repeat(${visibleColumns.length}, minmax(0, 1fr))` }}
                >
                  <div className="flex min-w-0 items-end border-b border-r border-slate-200 bg-slate-50 p-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 lg:p-3 lg:text-xs">
                    Інфекція / вакцина
                  </div>
                  {visibleColumns.map((column) => (
                    <div key={column.key} className="flex min-h-14 min-w-0 items-end justify-center border-b border-slate-200 bg-slate-50 px-0.5 py-2 text-center text-[10px] font-bold leading-4 text-slate-700 lg:min-h-16 lg:px-1 lg:py-3 lg:text-xs">
                      {column.shortLabel}
                    </div>
                  ))}

                  {vaccineRows.map((row, rowIndex) => (
                    <div key={row.id} className="contents">
                      <div className={`flex min-w-0 items-center border-r border-slate-200 px-2 py-2 lg:px-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}>
                        <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-teal-500 lg:mr-3 lg:h-2.5 lg:w-2.5" aria-hidden="true" />
                        <span className="min-w-0 text-xs font-bold leading-4 text-slate-900 lg:text-sm lg:leading-5">{row.title}</span>
                      </div>
                      {visibleColumns.map((column) => {
                        const dose = row.doses.find((item) => column.matches(item));
                        const isSelected = dose?.id === selectedDose?.id;
                        const isAgeRelevant = Boolean(dose && ageIsValid && dose.minAgeMonths <= ageMonths);
                        const isMissing = Boolean(dose && missingDoseIds.includes(dose.id));

                        return (
                          <div
                            key={`${row.id}-${column.key}`}
                            className={`relative flex min-h-16 min-w-0 items-center justify-center px-0.5 py-2 lg:min-h-20 lg:px-1 lg:py-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}
                          >
                            <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" aria-hidden="true" />
                            {dose && (
                              <button
                                type="button"
                                onClick={() => handleDoseClick(dose)}
                                className={`relative z-10 flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-1 text-xs font-extrabold transition focus:outline-none focus:ring-4 focus:ring-teal-200 lg:h-11 lg:min-w-11 lg:text-sm ${
                                  isMissing
                                    ? 'scale-110 border-amber-700 bg-amber-500 text-slate-950 shadow-md shadow-amber-200'
                                    : isAgeRelevant
                                      ? 'border-teal-700 bg-teal-600 text-white shadow-sm shadow-teal-200'
                                      : isSelected
                                        ? 'scale-105 border-sky-600 bg-sky-50 text-sky-800 shadow-sm'
                                    : 'border-teal-200 bg-teal-50 text-teal-800 hover:scale-105 hover:border-teal-500 hover:bg-teal-100'
                                }`}
                                aria-label={`${getDoseAccessibleLabel(dose)}${isMissing ? ', позначено як не отримано' : ''}`}
                                aria-pressed={isMissing}
                              >
                                <span className="flex flex-col items-center leading-none">
                                  <span>{getDoseLabel(dose).main}</span>
                                  {getDoseLabel(dose).sub && (
                                    <span className="mt-0.5 text-[8px] font-bold leading-none lg:text-[9px]">
                                      {getDoseLabel(dose).sub}
                                    </span>
                                  )}
                                </span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
          </div>

          <div className="space-y-5 md:hidden">
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
                          const isAgeRelevant = ageIsValid && dose.minAgeMonths <= ageMonths;
                          const isMissing = missingDoseIds.includes(dose.id);
                          return (
                            <button
                              key={dose.id}
                              type="button"
                              onClick={() => handleDoseClick(dose)}
                              className={`rounded-lg border p-3 text-left transition ${
                                isMissing
                                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100'
                                  : isAgeRelevant
                                    ? 'border-teal-500 bg-teal-50'
                                    : isSelected
                                      ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-100'
                                  : 'border-slate-200 bg-white hover:border-teal-300'
                              }`}
                              aria-pressed={isMissing}
                            >
                              <span className="block text-sm font-bold text-slate-950">{getCalendarVaccineTitle(dose.vaccineId)}</span>
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

          {selectedDose && (
            <aside className="mt-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4" aria-live="polite">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Вибране щеплення</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-950">{getCalendarVaccineTitle(selectedDose.vaccineId)}</h4>
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

          {bcgCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-slate-950">БЦЖ не проведена</h4>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {bcgCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {bcgCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції.
              </p>
            </section>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-600" />Активна за введеним віком</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Позначена як не отримана</span>
            <span>ДП — дифтерія, правець</span>
            <span>Дорослим — повторювати кожні 10 років</span>
          </div>
        </div>
      </section>

      <p className="px-1 text-xs font-semibold leading-5 text-slate-500">
        Перевірено: {vaccinationMetadata.checkedAt}. Версія: {vaccinationMetadata.version}. Дані не зберігаються і не передаються на сервер.
      </p>
    </div>
  );
}
