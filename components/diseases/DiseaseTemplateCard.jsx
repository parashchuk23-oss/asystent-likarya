'use client';

import { useEffect, useMemo, useState } from 'react';

function getInitialConstructorState(disease) {
  const constructor = disease.diagnosisConstructor;
  const selectValues = Object.fromEntries(
    constructor.selectFields.map((field) => [
      field.id,
      field.defaultValue ?? field.options[0]?.value ?? '',
    ]),
  );
  const checkboxValues = Object.fromEntries(
    constructor.checkboxGroups.map((group) => [group.id, []]),
  );
  const freeTextValues = Object.fromEntries(
    constructor.freeTextFields.map((field) => [field.id, '']),
  );

  return { ...selectValues, ...checkboxValues, ...freeTextValues };
}

function formatFreeTextValue(field, value) {
  const normalizedValue = value.trim();
  if (!normalizedValue) return '';

  return `${field.prefix ?? ''}${normalizedValue}${field.suffix ?? ''}`;
}

function formatIcd10Items(items) {
  return items.map((item) => `${item.code} — ${item.label}`).join('\n');
}

function getIcd10FromState(disease, state) {
  const constructor = disease.diagnosisConstructor;

  if (constructor.icd10) {
    return formatIcd10Items([constructor.icd10]);
  }

  const matchedOption = constructor.icd10Options?.find(
    (option) => state[option.field] === option.value,
  );

  if (!matchedOption) return '';

  return formatIcd10Items(matchedOption.items);
}

function buildDiagnosisFromState(disease, state) {
  const constructor = disease.diagnosisConstructor;
  const checkboxParts = constructor.checkboxGroups.flatMap((group) => state[group.id] ?? []);
  const freeTextParts = constructor.freeTextFields
    .map((field) => formatFreeTextValue(field, state[field.id] ?? ''))
    .filter(Boolean);

  if (disease.id === 'hypertension') {
    const baseParts = [state.stage, state.grade, state.risk].filter(Boolean);
    const base = `${constructor.textPrefix} ${baseParts.join(', ')}.`;
    const detailParts = [...checkboxParts, ...freeTextParts];
    if (!detailParts.length) return base;

    return `${base} ${detailParts.join('. ')}.`;
  }

  if (disease.id === 'ihd') {
    const anginaPart = [state.clinicalForm, state.functionalClass].filter(Boolean).join(' ');
    const eventYear = state.eventYear
      ? formatFreeTextValue(
          constructor.freeTextFields.find((field) => field.id === 'eventYear'),
          state.eventYear,
        )
      : '';
    const additionalText = state.additionalText?.trim() ?? '';
    const detailParts = [
      eventYear,
      ...checkboxParts,
      additionalText,
    ].filter(Boolean);
    const base = `${constructor.textPrefix}. ${anginaPart}.`;
    if (!detailParts.length) return base;

    return `${base} ${detailParts.join('. ')}.`;
  }

  if (disease.id === 'heartFailure') {
    const efPart = [
      state.efCategory,
      state.efValue
        ? formatFreeTextValue(
            constructor.freeTextFields.find((field) => field.id === 'efValue'),
            state.efValue,
          )
        : '',
    ]
      .filter(Boolean)
      .join(' ');
    const baseParts = [
      state.stage,
      efPart,
      state.nyhaClass,
      state.chfClass,
    ].filter(Boolean);
    const base = `${constructor.textPrefix}, ${baseParts.join(', ')}.`;
    const additionalText = state.additionalText?.trim() ?? '';
    const detailParts = [
      state.etiology,
      ...checkboxParts,
      additionalText,
    ].filter(Boolean);
    if (!detailParts.length) return base;

    return `${base} ${detailParts.join('. ')}.`;
  }

  if (disease.id === 'atrialFibrillation') {
    const baseParts = [state.afForm, state.rateVariant].filter(Boolean);
    const base = `${constructor.textPrefix}, ${baseParts.join(', ')}.`;
    const riskParts = constructor.freeTextFields
      .filter((field) => field.id !== 'additionalText')
      .map((field) => formatFreeTextValue(field, state[field.id] ?? ''))
      .filter(Boolean);
    const additionalText = state.additionalText?.trim() ?? '';
    const detailParts = [
      state.strategy,
      ...riskParts,
      ...checkboxParts,
      additionalText,
    ].filter(Boolean);
    if (!detailParts.length) return base;

    return `${base} ${detailParts.join('. ')}.`;
  }

  const fallbackParts = constructor.selectFields
    .map((field) => state[field.id])
    .filter(Boolean);
  const base = [constructor.textPrefix, ...fallbackParts].filter(Boolean).join('. ');
  const detailParts = [...checkboxParts, ...freeTextParts];
  if (!detailParts.length) return `${base}.`;

  return `${base} ${detailParts.join('. ')}.`;
}

export default function DiseaseTemplateCard({ disease, onAddDiagnosis }) {
  const [constructorState, setConstructorState] = useState(() =>
    getInitialConstructorState(disease),
  );

  useEffect(() => {
    setConstructorState(getInitialConstructorState(disease));
  }, [disease]);

  const constructedDiagnosis = useMemo(
    () => buildDiagnosisFromState(disease, constructorState),
    [disease, constructorState],
  );
  const constructedIcd10 = useMemo(
    () => getIcd10FromState(disease, constructorState),
    [disease, constructorState],
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
            {disease.diagnosisConstructor.selectFields.map((field) => (
              <label key={field.id} className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">
                  {field.label}
                </span>
                <select
                  value={constructorState[field.id]}
                  onChange={(event) => updateConstructorValue(field.id, event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {field.options.map((option) => (
                    <option key={`${field.id}-${option.label}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {disease.diagnosisConstructor.checkboxGroups.map((group) => (
              <fieldset key={group.id}>
                <legend className="text-xs font-semibold text-slate-600">{group.label}</legend>
                <div className="mt-2 space-y-2">
                  {group.options.map((item) => (
                    <label
                      key={`${group.id}-${item}`}
                      className="flex items-start gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={(constructorState[group.id] ?? []).includes(item)}
                        onChange={() => toggleConstructorItem(group.id, item)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {disease.diagnosisConstructor.freeTextFields.map((field) => (
              <label key={field.id} className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">
                  {field.label}
                </span>
                <input
                  type="text"
                  value={constructorState[field.id]}
                  onChange={(event) => updateConstructorValue(field.id, event.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                  Сформований діагноз
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-900">{constructedDiagnosis}</p>
                {constructedIcd10 ? (
                  <div className="mt-3 rounded-md border border-blue-100 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      МКХ-10
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {constructedIcd10}
                    </p>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onAddDiagnosis(constructedDiagnosis, constructedIcd10)}
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
