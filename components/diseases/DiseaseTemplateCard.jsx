'use client';

import { useMemo, useState } from 'react';

function getInitialConstructorState(disease) {
  return {
    stage: disease.diagnosisConstructor?.stages?.[1]?.value ?? '',
    grade: disease.diagnosisConstructor?.grades?.[1]?.value ?? '',
    risk: disease.diagnosisConstructor?.risks?.[2]?.value ?? '',
    targetOrganDamage: [],
    comorbidities: [],
    additionalText: '',
  };
}

function buildDiagnosisFromState(state) {
  const baseParts = [state.stage, state.grade, state.risk].filter(Boolean);
  const detailParts = [
    ...state.targetOrganDamage,
    ...state.comorbidities,
    state.additionalText.trim(),
  ].filter(Boolean);

  const base = `Гіпертонічна хвороба ${baseParts.join(', ')}.`;
  if (!detailParts.length) return base;

  return `${base} ${detailParts.join('. ')}.`;
}

export default function DiseaseTemplateCard({ disease, onAddDiagnosis }) {
  const [constructorState, setConstructorState] = useState(() =>
    getInitialConstructorState(disease),
  );

  const constructedDiagnosis = useMemo(
    () => buildDiagnosisFromState(constructorState),
    [constructorState],
  );

  function updateConstructorValue(field, value) {
    setConstructorState((current) => ({ ...current, [field]: value }));
  }

  function toggleConstructorItem(field, value) {
    setConstructorState((current) => {
      const currentValues = current[field];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return { ...current, [field]: nextValues };
    });
  }

  return (
    <article>
      <div className="p-5">
        <section>
          <h4 className="text-sm font-semibold text-slate-950">Конструктор діагнозу</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Стадія</span>
              <select
                value={constructorState.stage}
                onChange={(event) => updateConstructorValue('stage', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.stages.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Ступінь</span>
              <select
                value={constructorState.grade}
                onChange={(event) => updateConstructorValue('grade', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.grades.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Ризик</span>
              <select
                value={constructorState.risk}
                onChange={(event) => updateConstructorValue('risk', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {disease.diagnosisConstructor.risks.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <fieldset>
              <legend className="text-xs font-semibold text-slate-600">
                Ураження органів-мішеней
              </legend>
              <div className="mt-2 space-y-2">
                {disease.diagnosisConstructor.targetOrganDamage.map((item) => (
                  <label
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={constructorState.targetOrganDamage.includes(item)}
                      onChange={() => toggleConstructorItem('targetOrganDamage', item)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold text-slate-600">Супутні стани</legend>
              <div className="mt-2 space-y-2">
                {disease.diagnosisConstructor.comorbidities.map((item) => (
                  <label
                    key={item}
                    className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={constructorState.comorbidities.includes(item)}
                      onChange={() => toggleConstructorItem('comorbidities', item)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">
              Додатково вручну
            </span>
            <input
              type="text"
              value={constructorState.additionalText}
              onChange={(event) => updateConstructorValue('additionalText', event.target.value)}
              placeholder="Наприклад: ГЛШ за даними ЕхоКГ, ХХН G2 A1"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Сформований діагноз
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-900">{constructedDiagnosis}</p>
              </div>
              <button
                type="button"
                onClick={() => onAddDiagnosis(constructedDiagnosis)}
                className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
              >
                Додати до діагнозу
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
