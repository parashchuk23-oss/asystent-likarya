'use client';

import { useMemo, useState } from 'react';
import { abdomenOptions, abdomenOptionLabel } from '../../../data/ultrasound/abdomenOptions';
import { assessGallbladderPolypSru } from '../../../utils/ultrasound/abdomen/abdomenCalculations';
import { NumberField, SelectField, TextField } from './AbdomenFormControls';

export const initialAbdomenPolypData = {
  size: '',
  morphology: 'uncertain',
  adjacentWallThickness: '',
  previousSize: '',
  previousDate: '',
};

export default function AbdomenPolypCalculator({ data, onChange, onBack }) {
  const [copyStatus, setCopyStatus] = useState('');
  const result = useMemo(() => assessGallbladderPolypSru(data), [data]);
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
    setCopyStatus('');
  };
  const resultText = [
    `Поліп жовчного міхура: ${data.size ? `${String(data.size).replace('.', ',')} мм` : 'розмір не вказано'}.`,
    `Морфологія: ${abdomenOptionLabel('gallbladderPolypMorphology', data.morphology)}.`,
    `Категорія SRU 2022: ${result.riskLabel}.`,
    result.recommendation,
  ].join('\n');

  const copyResult = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(resultText);
    setCopyStatus('Скопійовано');
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
        ← До інструментів УЗД ОЧП
      </button>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Оцінювання поліпа</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Поліпи жовчного міхура за SRU 2022</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Вкажіть максимальний розмір і морфологію. Попереднє дослідження потрібне лише для оцінки темпу росту.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <NumberField label="Максимальний розмір" value={data.size} onChange={(value) => update('size', value)} />
            <SelectField label="Морфологія" value={data.morphology} onChange={(value) => update('morphology', value)} options={abdomenOptions.gallbladderPolypMorphology} />
            <NumberField label="Товщина прилеглої стінки" value={data.adjacentWallThickness} onChange={(value) => update('adjacentWallThickness', value)} />
            <NumberField label="Попередній розмір" value={data.previousSize} onChange={(value) => update('previousSize', value)} />
            <TextField label="Дата попереднього УЗД" value={data.previousDate} onChange={(value) => update('previousDate', value)} placeholder="Наприклад: 01.09.2025" />
          </div>
        </section>

        <section className="rounded-lg border border-teal-300 bg-teal-50/40 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Результат</p>
          <p className="mt-2 text-xl font-bold text-slate-950">{result.riskLabel}</p>
          <p className="mt-3 rounded-md border border-teal-200 bg-white p-3 text-sm font-medium leading-relaxed text-slate-700">{result.recommendation}</p>
          {result.growth !== null ? <p className="mt-3 text-sm text-slate-600">Зміна розміру: {String(result.growth).replace('.', ',')} мм.</p> : null}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={copyResult} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Копіювати результат</button>
            <button type="button" onClick={() => onChange(initialAbdomenPolypData)} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Очистити</button>
            {copyStatus ? <span className="text-sm font-semibold text-teal-700">{copyStatus}</span> : null}
          </div>
        </section>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Інструмент призначений для випадково виявлених поліпоподібних утворень у дорослих і не замінює клінічне рішення. Джерело: <a href="https://pubs.rsna.org/doi/10.1148/radiol.213079" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">SRU Consensus Conference Recommendations, Radiology 2022</a>.
      </p>
    </div>
  );
}
