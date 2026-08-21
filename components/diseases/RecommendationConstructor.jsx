'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { getRecommendationConstructorConfig } from '../../data/diseases/recommendationConstructor';

const sections = [
  { key: 'labs', title: 'Лабораторні дообстеження' },
  { key: 'instrumental', title: 'Інструментальні дообстеження' },
  { key: 'consultations', title: 'Консультації' },
  { key: 'lifestyle', title: 'Режим і спосіб життя' },
];

const labItemReplacements = {
  'creatinine-egfr': [{ id: 'creatinine', text: 'креатинін' }],
  alt: [{ id: 'alt-ast', text: 'АЛТ / АСТ' }],
  ast: [{ id: 'alt-ast', text: 'АЛТ / АСТ' }],
  'liver-tests': [
    { id: 'alt-ast', text: 'АЛТ / АСТ' },
    { id: 'bilirubin', text: 'білірубін' },
    { id: 'ggt', text: 'ГГТ' },
    { id: 'alkaline-phosphatase', text: 'лужна фосфатаза' },
  ],
  'bilirubin-total': [{ id: 'bilirubin', text: 'білірубін' }],
  'glucose-hba1c': [
    { id: 'glucose', text: 'глюкоза крові' },
    { id: 'hba1c', text: 'HbA1c' },
  ],
  tsh: [
    { id: 'tsh', text: 'ТТГ' },
    { id: 'free-t3-t4', text: 'вільний Т3 / вільний Т4' },
  ],
  'free-t3': [{ id: 'free-t3-t4', text: 'вільний Т3 / вільний Т4' }],
  'free-t4': [{ id: 'free-t3-t4', text: 'вільний Т3 / вільний Т4' }],
};

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function normalizeItems(items, key) {
  if (key !== 'labs') return items;

  return uniqueById(
    items.flatMap((item) => labItemReplacements[item.id] ?? [item]),
  );
}

function getItems(disease, key) {
  return normalizeItems(disease?.recommendationGroups?.[key] ?? [], key);
}

function getDefaultSelectedIds(disease) {
  return sections.flatMap((section) => getItems(disease, section.key).map((item) => item.id));
}

function getSelectedRecommendationPayload({ disease, selectedIds, medicationChoices, medicationSelects }) {
  const selectedSections = {};

  sections.forEach((section) => {
    const selectedItems = getItems(disease, section.key).filter((item) => selectedIds.includes(item.id));
    if (selectedItems.length) {
      selectedSections[section.key] = selectedItems;
    }
  });

  const selectedMedications = medicationSelects
    .map((select) => {
      const selectedValue = medicationChoices[select.id];
      const selectedOption = select.options.find((option) => option.value === selectedValue);
      if (!selectedOption) return null;

      return {
        id: `${select.id}-${selectedOption.value}`,
        text: selectedOption.text,
      };
    })
    .filter(Boolean);

  return {
    diseaseId: disease.id,
    diseaseTitle: disease.title,
    sections: selectedSections,
    medications: selectedMedications,
  };
}

const RecommendationConstructor = forwardRef(function RecommendationConstructor(
  { disease, onAddRecommendations },
  ref,
) {
  const config = useMemo(() => getRecommendationConstructorConfig(disease.id), [disease.id]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [medicationChoices, setMedicationChoices] = useState({});
  const hasAnyItems = sections.some((section) => getItems(disease, section.key).length > 0);
  const selectedCount = selectedIds.length + Object.values(medicationChoices).filter(Boolean).length;

  useEffect(() => {
    setSelectedIds(getDefaultSelectedIds(disease));
    setMedicationChoices({});
  }, [disease.id]);

  function buildSelectedRecommendationPayload() {
    return getSelectedRecommendationPayload({
      disease,
      selectedIds,
      medicationChoices,
      medicationSelects: config.medicationSelects,
    });
  }

  useImperativeHandle(ref, () => ({
    getSelectedRecommendationPayload() {
      return buildSelectedRecommendationPayload();
    },
  }));

  function toggleItem(itemId) {
    setSelectedIds((current) => {
      if (current.includes(itemId)) return current.filter((id) => id !== itemId);
      return [...current, itemId];
    });
  }

  function handleMedicationChange(selectId, value) {
    setMedicationChoices((current) => ({
      ...current,
      [selectId]: value,
    }));
  }

  function addSelectedRecommendations() {
    const payload = buildSelectedRecommendationPayload();

    if (!selectedCount) return;
    onAddRecommendations(payload);
  }

  const labItems = getItems(disease, 'labs');
  const fullWidthSections = sections.filter((section) => section.key !== 'labs');

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Конструктор
        </p>
        <h3 className="text-lg font-semibold text-slate-950">Конструктор рекомендацій</h3>
        <p className="text-sm leading-6 text-slate-600">
          Оберіть потрібні пункти. Вони додадуться в нижнє редаговане поле рекомендацій.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <div className="grid items-stretch gap-4 xl:grid-cols-2">
          <div className="rounded-lg border border-teal-300 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-slate-950">Що додати</h4>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {selectedCount} вибрано
              </span>
            </div>

            {labItems.length ? (
              <details open className="mt-4 rounded-lg border border-slate-200 bg-slate-50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-slate-800">
                  <span>Лабораторні дообстеження</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-teal-700">
                    {labItems.filter((item) => selectedIds.includes(item.id)).length} вибрано
                  </span>
                </summary>
                <div className="grid gap-2 border-t border-slate-200 p-3 sm:grid-cols-2">
                  {labItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                      />
                      <span>{item.text}</span>
                    </label>
                  ))}
                </div>
              </details>
            ) : (
              <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Для цієї хвороби поки немає лабораторних пунктів рекомендацій.
              </p>
            )}
          </div>

          <aside className="flex h-full flex-col rounded-lg border border-blue-200 bg-blue-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              Довідка
            </p>
            <h4 className="mt-1 text-base font-semibold text-slate-950">
              Рекомендації до рекомендацій
            </h4>
            <ul className="mt-3 flex-1 space-y-2 text-sm leading-6 text-slate-700">
              {config.notes.map((note) => (
                <li key={note} className="rounded-md border border-blue-100 bg-white px-3 py-2">
                  {note}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Це довідкова підказка. Остаточний текст, дозу, кратність і тривалість лікування лікар
              редагує в основному полі рекомендацій.
            </p>
          </aside>
        </div>

        <div className="rounded-lg border border-teal-300 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-950">Інші рекомендації</h4>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {selectedCount} вибрано
            </span>
          </div>

          {hasAnyItems ? (
            <div className="mt-4 space-y-4">
              {fullWidthSections.map((section) => {
                const items = getItems(disease, section.key);
                if (!items.length) return null;

                return (
                  <details key={section.key} className="rounded-lg border border-slate-200 bg-slate-50">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-slate-800">
                      <span>{section.title}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-teal-700">
                        {items.filter((item) => selectedIds.includes(item.id)).length} вибрано
                      </span>
                    </summary>
                    <div className="grid gap-2 border-t border-slate-200 p-3 sm:grid-cols-2">
                      {items.map((item) => (
                        <label
                          key={item.id}
                          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                          />
                          <span>{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Для цієї хвороби поки немає структурованих пунктів рекомендацій.
            </p>
          )}

          {config.medicationSelects.length ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h4 className="text-sm font-semibold text-slate-950">Лікарські призначення</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {config.medicationSelects.map((select) => (
                  <label key={select.id} className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {select.label}
                    </span>
                    <select
                      value={medicationChoices[select.id] ?? ''}
                      onChange={(event) => handleMedicationChange(select.id, event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Не обрано</option>
                      {select.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Наведені схеми є прикладами для редагування лікарем. Остаточна схема, доза,
                кратність і цілі лікування визначаються індивідуально.
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={addSelectedRecommendations}
            disabled={!selectedCount}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Додати вибране до рекомендацій
          </button>
        </div>
      </div>
    </div>
  );
});

export default RecommendationConstructor;
