'use client';

import { useMemo, useState } from 'react';
import {
  formatDecimal,
  formatDimensions,
  getCalculatedVolumes,
  parsePositiveNumber,
  validatePositiveNumber,
} from '../../utils/ultrasound/thyroidCalculations';
import { inputClass } from '../formStyles';

const dimensionFields = [
  { key: 'length', label: 'Довжина' },
  { key: 'thickness', label: 'Товщина' },
  { key: 'width', label: 'Ширина' },
];

function DimensionField({ label, value, onChange, max = 200 }) {
  const error = validatePositiveNumber(value, { max });

  return (
    <div>
      <div className="mb-1.5 flex min-h-5 items-baseline justify-between gap-2">
        <label className="text-sm font-semibold leading-tight text-slate-700">{label}</label>
        <span className="text-xs font-medium text-slate-400">мм</span>
      </div>
      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function LobeCard({ title, value, volume, onChange }) {
  const update = (field, nextValue) => onChange({ ...value, [field]: nextValue });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-950">{title}</h4>
          <p className="mt-1 text-xs text-slate-500">Введіть три максимальні розміри.</p>
        </div>
        <span className="rounded-md bg-teal-50 px-2.5 py-1.5 text-sm font-bold text-teal-800">
          {volume ? `${formatDecimal(volume)} см³` : '—'}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {dimensionFields.map((field) => (
          <DimensionField
            key={field.key}
            label={field.label}
            value={value[field.key]}
            onChange={(nextValue) => update(field.key, nextValue)}
          />
        ))}
      </div>
    </section>
  );
}

export default function ThyroidVolumeCalculator({ data, onChange, onBack }) {
  const [copyStatus, setCopyStatus] = useState('');
  const volumes = getCalculatedVolumes(data);
  const hasBothLobes = Boolean(volumes.rightVolume && volumes.leftVolume);
  const totalVolume = hasBothLobes ? volumes.totalVolume : null;
  const isthmusThickness = parsePositiveNumber(data.isthmusThickness);
  const isthmusStatus = isthmusThickness ? (isthmusThickness > 5 ? 'потовщений' : 'не потовщений') : '';

  const resultText = useMemo(() => {
    const parts = [];
    if (volumes.rightVolume) {
      parts.push(`Права частка: ${formatDimensions(data.right)}, об’єм ${formatDecimal(volumes.rightVolume)} см³.`);
    }
    if (volumes.leftVolume) {
      parts.push(`Ліва частка: ${formatDimensions(data.left)}, об’єм ${formatDecimal(volumes.leftVolume)} см³.`);
    }
    if (totalVolume) {
      parts.push(`Сумарний об’єм щитоподібної залози: ${formatDecimal(totalVolume)} см³.`);
    }
    if (isthmusThickness) {
      parts.push(`Перешийок: ${formatDecimal(isthmusThickness)} мм, ${isthmusStatus}.`);
    }
    return parts.join('\n');
  }, [data.left, data.right, isthmusStatus, isthmusThickness, totalVolume, volumes.leftVolume, volumes.rightVolume]);

  const update = (field, value) => onChange({ ...data, [field]: value });
  const clear = () => {
    onChange({
      right: { length: '', thickness: '', width: '' },
      left: { length: '', thickness: '', width: '' },
      isthmusThickness: '',
    });
    setCopyStatus('');
  };
  const copyResult = async () => {
    if (!resultText || typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(resultText);
    setCopyStatus('Скопійовано');
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
      >
        ← До інструментів ЩЗ
      </button>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Швидкий розрахунок</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Об’єм щитоподібної залози</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Введіть розміри обох часток у міліметрах. Об’єм кожної частки розраховується за формулою Brunn: Д × Ш × Т × 0,479.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <LobeCard title="Права частка" value={data.right} volume={volumes.rightVolume} onChange={(value) => update('right', value)} />
        <LobeCard title="Ліва частка" value={data.left} volume={volumes.leftVolume} onChange={(value) => update('left', value)} />
      </div>

      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
        <DimensionField label="Перешийок" value={data.isthmusThickness} onChange={(value) => update('isthmusThickness', value)} max={80} />
        <div>
          <p className="mb-1.5 text-sm font-semibold text-slate-700">Автоматичний статус перешийка</p>
          <div className="flex min-h-[38px] items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
            {isthmusStatus || 'Буде визначено автоматично'}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-teal-300 bg-teal-50/40 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Права частка</p>
            <p className="mt-1 text-xl font-bold text-slate-950">{volumes.rightVolume ? `${formatDecimal(volumes.rightVolume)} см³` : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ліва частка</p>
            <p className="mt-1 text-xl font-bold text-slate-950">{volumes.leftVolume ? `${formatDecimal(volumes.leftVolume)} см³` : '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Сумарний об’єм</p>
            <p className="mt-1 text-xl font-bold text-teal-800">{totalVolume ? `${formatDecimal(totalVolume)} см³` : '—'}</p>
          </div>
        </div>

        {resultText ? (
          <div className="mt-4 rounded-md border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {resultText}
          </div>
        ) : null}

        {!hasBothLobes && (volumes.rightVolume || volumes.leftVolume) ? (
          <p className="mt-3 text-sm text-slate-600">Для сумарного об’єму заповніть усі три розміри обох часток.</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyResult}
            disabled={!resultText}
            className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Копіювати результат
          </button>
          <button type="button" onClick={clear} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
            Очистити
          </button>
          {copyStatus ? <span className="text-sm font-semibold text-teal-700">{copyStatus}</span> : null}
        </div>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">
        Сумарний об’єм дорівнює сумі об’ємів правої та лівої часток; перешийок до розрахунку не включається. Результат є допоміжним і потребує клінічної інтерпретації лікарем.
      </p>
    </div>
  );
}
