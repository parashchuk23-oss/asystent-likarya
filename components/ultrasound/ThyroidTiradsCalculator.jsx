'use client';

import { useMemo, useState } from 'react';
import { thyroidOptions } from '../../data/ultrasound/thyroidOptions';
import { calculateAcrTirads, formatTiradsPoints } from '../../utils/ultrasound/thyroidTirads';
import { inputClass } from '../formStyles';

const selectGroups = [
  { field: 'type', label: 'Склад', options: 'noduleType' },
  { field: 'echogenicity', label: 'Ехогенність', options: 'noduleEchogenicity' },
  { field: 'orientation', label: 'Форма в поперечній площині', options: 'noduleOrientation' },
  { field: 'contour', label: 'Контури', options: 'noduleContour' },
];

const requiredFields = selectGroups.map(({ field }) => field);

function optionLabel(group, value) {
  return thyroidOptions[group].find((option) => option.value === value)?.label || '';
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="">Оберіть ознаку</option>
        {thyroidOptions[options].map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export const initialTiradsData = {
  type: '',
  echogenicity: '',
  orientation: '',
  contour: '',
  inclusions: ['absent'],
  dimensions: { length: '' },
};

export default function ThyroidTiradsCalculator({ data, onChange, onBack }) {
  const [copyStatus, setCopyStatus] = useState('');
  const isComplete = requiredFields.every((field) => data[field]);
  const result = isComplete ? calculateAcrTirads(data) : null;

  const update = (field, value) => {
    onChange({ ...data, [field]: value });
    setCopyStatus('');
  };

  const toggleInclusion = (value) => {
    if (value === 'absent' || value === 'cometTail') {
      update('inclusions', [value]);
      return;
    }
    const next = data.inclusions.includes(value)
      ? data.inclusions.filter((item) => item !== value)
      : [...data.inclusions.filter((item) => item !== 'absent' && item !== 'cometTail'), value];
    update('inclusions', next.length ? next : ['absent']);
  };

  const resultText = useMemo(() => {
    if (!result) return '';
    const features = [
      `Склад: ${optionLabel('noduleType', data.type)} (${result.pointsByFeature.composition} б.)`,
      `Ехогенність: ${optionLabel('noduleEchogenicity', data.echogenicity)} (${result.pointsByFeature.echogenicity} б.)`,
      `Форма: ${optionLabel('noduleOrientation', data.orientation)} (${result.pointsByFeature.shape} б.)`,
      `Контури: ${optionLabel('noduleContour', data.contour)} (${result.pointsByFeature.margin} б.)`,
      `Ехогенні фокуси: ${data.inclusions.map((item) => optionLabel('noduleInclusions', item)).join(', ')} (${result.pointsByFeature.echogenicFoci} б.)`,
    ];
    return [`${result.label}: ${formatTiradsPoints(result.points)}.`, ...features, result.recommendation].join('\n');
  }, [data, result]);

  const copyResult = async () => {
    if (!resultText || typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(resultText);
    setCopyStatus('Скопійовано');
  };

  const clear = () => {
    onChange(initialTiradsData);
    setCopyStatus('');
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
        ← До інструментів ЩЗ
      </button>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Оцінювання вузла</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Калькулятор ACR TI-RADS</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Оберіть п’ять ультразвукових характеристик. Категорія розраховується автоматично, а максимальний розмір визначає рекомендовану тактику.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {selectGroups.map((group) => (
              <SelectField key={group.field} label={group.label} value={data[group.field]} options={group.options} onChange={(value) => update(group.field, value)} />
            ))}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Ехогенні фокуси</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {thyroidOptions.noduleInclusions
                .filter(({ value }) => !['cysticInclusions', 'other'].includes(value))
                .map((option) => (
                  <label key={option.value} className="flex items-start gap-3 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={data.inclusions.includes(option.value)} onChange={() => toggleInclusion(option.value)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span>{option.label}</span>
                  </label>
                ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">Макрокальцинати, периферичні кальцинати та пунктатні фокуси сумуються.</p>
          </fieldset>

          <label className="block max-w-sm">
            <span className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-slate-700">
              Максимальний розмір вузла <span className="text-xs font-medium text-slate-400">мм</span>
            </span>
            <input type="number" min="0" max="200" step="0.1" value={data.dimensions.length} onChange={(event) => update('dimensions', { length: event.target.value })} className={inputClass} />
            <span className="mt-1 block text-xs text-slate-500">Розмір не змінює категорію, але визначає поріг спостереження або ТАПБ.</span>
          </label>
        </section>

        <section className="rounded-lg border border-teal-300 bg-teal-50/40 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Результат</p>
          {result ? (
            <>
              <p className="mt-2 text-2xl font-bold text-slate-950">{result.label}</p>
              <p className="mt-1 text-base font-semibold text-teal-800">{formatTiradsPoints(result.points)}</p>
              <p className="mt-2 text-sm text-slate-700">{result.interpretation}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                <span>Склад: {result.pointsByFeature.composition}</span>
                <span>Ехогенність: {result.pointsByFeature.echogenicity}</span>
                <span>Форма: {result.pointsByFeature.shape}</span>
                <span>Контури: {result.pointsByFeature.margin}</span>
                <span>Фокуси: {result.pointsByFeature.echogenicFoci}</span>
              </div>
              <p className="mt-4 rounded-md border border-teal-200 bg-white p-3 text-sm font-medium leading-relaxed text-slate-700">{result.recommendation}</p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Заповніть склад, ехогенність, форму та контури вузла. Ехогенні фокуси вже позначені як відсутні.</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={copyResult} disabled={!result} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300">Копіювати результат</button>
            <button type="button" onClick={clear} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">Очистити</button>
            {copyStatus ? <span className="text-sm font-semibold text-teal-700">{copyStatus}</span> : null}
          </div>
        </section>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Розрахунок є довідковим інструментом за ACR TI-RADS і не замінює клінічне рішення. Тактика може змінюватися з урахуванням клінічного контексту, попередніх результатів цитології та динаміки вузла. Джерело: <a href="https://www.acr.org/clinical-resources/clinical-tools-and-reference/reporting-and-data-systems/ti-rads" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">American College of Radiology</a>.
      </p>
    </div>
  );
}
