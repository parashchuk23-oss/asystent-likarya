'use client';

import { textareaClass } from '../../formStyles';

function CopyButton({ label, value }) {
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
    >
      {label}
    </button>
  );
}

export default function EchoReportPreview({
  overview,
  conclusion,
  recommendations,
  onOverviewChange,
  onConclusionChange,
  onRecommendationsChange,
  autoUpdate,
  onAutoUpdateChange,
  onRegenerate,
  onClear,
}) {
  const fullProtocol = [
    'ПРОТОКОЛ ЕХОКАРДІОГРАФІЇ',
    '',
    'Опис:',
    overview,
    '',
    'Висновок:',
    conclusion,
    '',
    'Рекомендації:',
    recommendations,
  ].join('\n');

  return (
    <aside className="space-y-4 xl:sticky xl:top-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">Чернетка протоколу</h3>
            <p className="mt-1 text-xs text-slate-500">Текст редагується перед копіюванням або друком.</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={(event) => onAutoUpdateChange(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Автооновлення
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={onRegenerate} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-800">
            Оновити з форми
          </button>
          <button type="button" onClick={() => window.print()} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700">
            Друк / PDF
          </button>
          <button type="button" onClick={onClear} className="rounded-md border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
            Очистити
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Опис</label>
              <CopyButton label="Копіювати опис" value={overview} />
            </div>
            <textarea value={overview} onChange={(event) => onOverviewChange(event.target.value)} rows={8} className={textareaClass} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Висновок</label>
              <CopyButton label="Копіювати висновок" value={conclusion} />
            </div>
            <textarea value={conclusion} onChange={(event) => onConclusionChange(event.target.value)} rows={5} className={textareaClass} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Рекомендації</label>
              <CopyButton label="Копіювати рекомендації" value={recommendations} />
            </div>
            <textarea value={recommendations} onChange={(event) => onRecommendationsChange(event.target.value)} rows={4} className={textareaClass} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton label="Копіювати все" value={fullProtocol} />
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        Модуль формує чернетку протоколу ЕхоКГ. Автоматичний текст не встановлює діагноз
        самостійно і потребує перевірки лікарем з урахуванням якості візуалізації,
        можливостей конкретного апарата УЗД та клінічного контексту.
      </div>
    </aside>
  );
}
