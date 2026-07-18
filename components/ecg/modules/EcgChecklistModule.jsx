'use client';

import { useMemo, useState } from 'react';
import { buildQtMetricsInput, calculateQtMetrics, getSmallCellDurationMs } from '../../../utils/ecg/qtCalculations';
import { inputClass, textareaClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const checklistItems = [
  { id: 'rate', label: 'ЧСС', placeholder: 'Наприклад: 76/хв', norm: 'приблизна норма: 60–100/хв' },
  { id: 'rhythm', label: 'Ритм', placeholder: 'Наприклад: синусовий, регулярний', norm: 'приблизна норма: синусовий, регулярний' },
  { id: 'axis', label: 'Електрична вісь', placeholder: 'Наприклад: не відхилена', norm: 'приблизна норма: −30°…+90°' },
  { id: 'pq', label: 'PQ', placeholder: 'Наприклад: 180 мс', norm: 'приблизна норма: 120–200 мс' },
  { id: 'qrs', label: 'QRS', placeholder: 'Наприклад: 90 мс', norm: 'приблизна норма: 60–110 мс' },
  { id: 'qt', label: 'QT / QTc', placeholder: 'Наприклад: QTc 420 мс', norm: 'приблизна норма QTc: до 450 мс у чоловіків, до 460 мс у жінок' },
  { id: 'blocks', label: 'Блокади', placeholder: 'Наприклад: ознак блокад немає', norm: 'приблизна норма: ознак порушення провідності немає' },
  { id: 'hypertrophy', label: 'Гіпертрофія', placeholder: 'Наприклад: критерії ГЛШ не виконуються', norm: 'приблизна норма: ЕКГ-критерії гіпертрофії не виконуються' },
  { id: 'st', label: 'ST', placeholder: 'Наприклад: без значущих змін', norm: 'приблизна норма: без значущої елевації або депресії' },
  { id: 't', label: 'T', placeholder: 'Наприклад: без гострих ішемічних змін', norm: 'приблизна норма: без гострих ішемічних змін' },
  { id: 'q', label: 'Патологічні Q', placeholder: 'Наприклад: не виявлені', norm: 'приблизна норма: патологічні Q не виявлені' },
];

const normalChecklistValues = {
  rate: 'ЧСС 76/хв',
  rhythm: 'ритм синусовий, регулярний',
  axis: 'електрична вісь серця не відхилена, приблизно +60°',
  pq: 'PQ 180 мс',
  qrs: 'QRS 90 мс',
  qt: 'QTc 420 мс',
  blocks: 'ознак порушення провідності не виявлено',
  hypertrophy: 'ЕКГ-критерії гіпертрофії камер серця не виконуються',
  st: 'сегмент ST без значущої елевації або депресії',
  t: 'зубці T без гострих ішемічних змін',
  q: 'патологічні зубці Q не виявлені',
};

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
  const [values, setValues] = useState(normalChecklistValues);
  const [qtForm, setQtForm] = useState({
    inputMode: 'cells',
    paperSpeed: '25',
    qt: '10.5',
    rr: '19.75',
    heartRate: '',
    sex: 'male',
  });
  const conclusion = useMemo(() => buildConclusion(values), [values]);
  const qtMetricsInput = useMemo(() => buildQtMetricsInput(qtForm), [qtForm]);
  const qtMetrics = useMemo(() => calculateQtMetrics(qtMetricsInput), [qtMetricsInput]);

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const resetToNormal = () => setValues(normalChecklistValues);
  const updateQtForm = (field, value) => setQtForm((current) => ({ ...current, [field]: value }));
  const applyQtToChecklist = () => {
    if (!qtMetrics) return;
    update('qt', `QT ${qtMetrics.qt} мс, QTc Fridericia ${qtMetrics.qtcFridericia} мс (${qtMetrics.interpretation.label.toLowerCase()})`);
  };

  return (
    <EcgModuleShell
      eyebrow="Чек-лист"
      title="Покроковий аналіз ЕКГ"
      description="Базовий маршрут: ЧСС, ритм, вісь, інтервали, провідність, гіпертрофія, ST-T та патологічні Q."
    >
      <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-emerald-900">
          Чек-лист заповнений приблизною нормою. Змініть лише ті пункти, де на ЕКГ є відхилення.
        </p>
        <button
          type="button"
          onClick={resetToNormal}
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          Повернути норму
        </button>
      </div>

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
            <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">{item.norm}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="font-bold text-slate-950">QT / QTc: розрахунок із клітинок</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Введіть QT і RR у мілісекундах або в маленьких клітинках. При 25 мм/с одна маленька клітинка = 40 мс, при 50 мм/с = 20 мс.
            </p>
          </div>
          <button
            type="button"
            onClick={applyQtToChecklist}
            disabled={!qtMetrics}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Внести в QT/QTc
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Спосіб</span>
            <select value={qtForm.inputMode} onChange={(event) => updateQtForm('inputMode', event.target.value)} className={inputClass}>
              <option value="cells">маленькі клітинки</option>
              <option value="ms">мілісекунди</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Швидкість</span>
            <select value={qtForm.paperSpeed} onChange={(event) => updateQtForm('paperSpeed', event.target.value)} className={inputClass}>
              <option value="25">25 мм/с</option>
              <option value="50">50 мм/с</option>
            </select>
            <span className="mt-1 block text-xs font-medium text-slate-500">1 клітинка = {getSmallCellDurationMs(qtForm.paperSpeed)} мс</span>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">QT</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={qtForm.qt}
              onChange={(event) => updateQtForm('qt', event.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">{qtForm.inputMode === 'cells' ? 'маленьких клітинок' : 'мс'}</span>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">RR</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={qtForm.rr}
              onChange={(event) => updateQtForm('rr', event.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">{qtForm.inputMode === 'cells' ? 'маленьких клітинок' : 'мс'}</span>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Стать</span>
            <select value={qtForm.sex} onChange={(event) => updateQtForm('sex', event.target.value)} className={inputClass}>
              <option value="male">чоловік</option>
              <option value="female">жінка</option>
            </select>
          </label>
          <div className="rounded-md border border-blue-100 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Результат</p>
            {qtMetrics ? (
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
                QT {qtMetrics.qt} мс, RR {Math.round(qtMetrics.rr * 1000)} мс, QTcF {qtMetrics.qtcFridericia} мс
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Введіть QT і RR.</p>
            )}
          </div>
        </div>
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
