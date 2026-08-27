'use client';

import { useMemo, useState } from 'react';
import { vaccinationRiskFactors } from '../../data/vaccination/ukraine/riskGroups';
import { vaccineDefinitions } from '../../data/vaccination/ukraine/vaccineDefinitions';
import {
  assessVaccination,
  buildVaccinationPlanText,
  formatAge,
  getAgeInMonths,
} from '../../utils/vaccination/vaccinationAssessment';
import { inputClass } from '../formStyles';
import VaccinationResultCard from './VaccinationResultCard';

const historyOptions = [
  { value: 'unknown', label: 'невідомо' },
  { value: 'none', label: 'не вакцинований' },
  { value: '1', label: '1 доза' },
  { value: '2', label: '2 дози' },
  { value: '3', label: '3 дози' },
  { value: '4', label: '4 дози' },
  { value: 'complete', label: 'повністю за віком' },
];

export default function VaccinationChecker() {
  const [birthDate, setBirthDate] = useState('');
  const [manualAgeYears, setManualAgeYears] = useState('');
  const [manualAgeMonths, setManualAgeMonths] = useState('');
  const [sex, setSex] = useState('female');
  const [history, setHistory] = useState({});
  const [selectedRiskIds, setSelectedRiskIds] = useState([]);
  const [copied, setCopied] = useState(false);

  const ageMonths = useMemo(
    () => getAgeInMonths({ birthDate, manualAgeYears, manualAgeMonths }),
    [birthDate, manualAgeYears, manualAgeMonths],
  );

  const selectedRiskFactors = vaccinationRiskFactors.filter((factor) => {
    if (!selectedRiskIds.includes(factor.id)) return false;
    if (factor.appliesTo && factor.appliesTo !== sex) return false;
    return true;
  });

  const assessment = assessVaccination({ ageMonths, sex, history, riskFactors: selectedRiskFactors });
  const planText = buildVaccinationPlanText({ assessment, ageMonths });

  const toggleRisk = (id) => {
    setSelectedRiskIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const copyPlan = async () => {
    await navigator.clipboard.writeText(planText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-950">Перевірити вакцинацію</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Введіть вік або дату народження, позначте фактори ризику та орієнтовну історію вакцинації.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Дата народження</span>
            <input type="date" className={inputClass} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Вік, років</span>
            <input type="number" min="0" className={inputClass} value={manualAgeYears} onChange={(event) => setManualAgeYears(event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Місяців</span>
            <input type="number" min="0" max="11" className={inputClass} value={manualAgeMonths} onChange={(event) => setManualAgeMonths(event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-slate-700">Стать</span>
            <select className={inputClass} value={sex} onChange={(event) => setSex(event.target.value)}>
              <option value="female">жіноча</option>
              <option value="male">чоловіча</option>
            </select>
          </label>
        </div>

        <div className="mt-3 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900">
          Вік для оцінки: {formatAge(ageMonths)}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-950">Фактори ризику</h3>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
            {selectedRiskIds.length} вибрано
          </span>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {vaccinationRiskFactors.map((factor) => (
            <label key={factor.id} className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={selectedRiskIds.includes(factor.id)}
                onChange={() => toggleRisk(factor.id)}
              />
              {factor.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-bold text-slate-950">Історія вакцинації</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Якщо даних немає, залиште «невідомо». Це допоможе сформувати перелік того, що треба уточнити або надолужити.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {vaccineDefinitions.map((vaccine) => (
            <label key={vaccine.id} className="space-y-1.5">
              <span className="text-sm font-semibold text-slate-700">{vaccine.title}</span>
              <select
                className={inputClass}
                value={history[vaccine.id] || 'unknown'}
                onChange={(event) => setHistory((current) => ({ ...current, [vaccine.id]: event.target.value }))}
              >
                {historyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <VaccinationResultCard
          title="Обов’язково за календарем"
          tone="teal"
          items={assessment.requiredByAge}
          emptyText="За введеним віком немає календарних щеплень, які вже мали бути виконані."
        />
        <VaccinationResultCard
          title="Потрібно надолужити"
          tone="amber"
          items={assessment.catchUp}
          emptyText="За введеною історією явних пропусків не позначено."
        />
        <VaccinationResultCard
          title="Рекомендовано додатково"
          tone="blue"
          items={assessment.recommended}
          emptyText="Позначте фактори ризику, щоб побачити додаткові рекомендації."
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-950">План вакцинації</h3>
            <p className="mt-1 text-sm text-slate-600">Текст можна скопіювати і відредагувати в документації.</p>
          </div>
          <button type="button" onClick={copyPlan} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {copied ? 'Скопійовано' : 'Скопіювати план'}
          </button>
        </div>
        <pre className="mt-3 whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          {planText}
        </pre>
      </section>
    </div>
  );
}
