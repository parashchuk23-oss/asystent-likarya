'use client';

import { useMemo, useState } from 'react';
import { textareaClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const checklistItems = [
  { id: 'rate', label: 'ЧСС', placeholder: 'Наприклад: 72/хв' },
  { id: 'rhythm', label: 'Ритм', placeholder: 'Наприклад: синусовий' },
  { id: 'axis', label: 'Електрична вісь', placeholder: 'Наприклад: не відхилена' },
  { id: 'pq', label: 'PQ', placeholder: 'Наприклад: 160 мс' },
  { id: 'qrs', label: 'QRS', placeholder: 'Наприклад: 90 мс' },
  { id: 'qt', label: 'QT / QTc', placeholder: 'Наприклад: QTc 420 мс' },
  { id: 'blocks', label: 'Блокади', placeholder: 'Наприклад: ознак блокад немає' },
  { id: 'hypertrophy', label: 'Гіпертрофія', placeholder: 'Наприклад: критерії ГЛШ не виконуються' },
  { id: 'st', label: 'ST', placeholder: 'Наприклад: елевації ST не виявлено' },
  { id: 't', label: 'T', placeholder: 'Наприклад: T без гострих змін' },
  { id: 'q', label: 'Патологічні Q', placeholder: 'Наприклад: патологічні Q не виявлені' },
];

function buildConclusion(values) {
  const lines = checklistItems
    .map((item) => values[item.id]?.trim())
    .filter(Boolean);

  if (!lines.length) {
    return 'Заповніть пункти чек-листа, щоб сформувати короткий структурований висновок.';
  }

  return `${lines.join('. ')}.`;
}

export default function EcgChecklistModule() {
  const [values, setValues] = useState({});
  const conclusion = useMemo(() => buildConclusion(values), [values]);

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));

  return (
    <EcgModuleShell
      eyebrow="Чек-лист"
      title="Покроковий аналіз ЕКГ"
      description="Базовий маршрут: ЧСС, ритм, вісь, інтервали, провідність, гіпертрофія, ST-T та патологічні Q."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {checklistItems.map((item) => (
          <label key={item.id} className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">{item.label}</span>
            <input
              value={values[item.id] || ''}
              onChange={(event) => update(item.id, event.target.value)}
              placeholder={item.placeholder}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h4 className="text-sm font-bold text-blue-900">Структурований висновок</h4>
        <textarea value={conclusion} readOnly rows={4} className={`${textareaClass} mt-3 bg-white`} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Коли діяти негайно</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>STEMI або нова значуща елевація ST у відповідному клінічному контексті.</li>
            <li>Ширококомплексна тахікардія з нестабільністю.</li>
            <li>Виражена брадикардія, AV-блокада високого ступеня або синкопе.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Наступний крок</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Порівняти з попередніми ЕКГ, співставити з симптомами, гемодинамікою, тропонінами,
            електролітами та клінічним контекстом.
          </p>
        </div>
      </div>

      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
