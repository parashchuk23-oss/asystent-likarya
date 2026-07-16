'use client';

import { textareaClass } from '../../formStyles';

function CopyButton({ label, value }) {
  const copy = async () => {
    if (value) await navigator.clipboard.writeText(value);
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

export default function AbdomenReportPreview({
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
  const fullText = [
    'ПРОТОКОЛ УЗД ОРГАНІВ ЧЕРЕВНОЇ ПОРОЖНИНИ',
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
    <aside className="space-y-4 lg:sticky lg:top-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">Попередній перегляд</h3>
            <p className="mt-1 text-xs text-slate-500">Усі блоки можна редагувати перед копіюванням.</p>
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
          <button type="button" onClick={onRegenerate} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
            Сформувати протокол
          </button>
          <button type="button" onClick={onClear} className="rounded-md border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600">
            Очистити
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-950">Опис</h4>
          <CopyButton label="Копіювати опис" value={overview} />
        </div>
        <textarea value={overview} onChange={(event) => onOverviewChange(event.target.value)} rows={12} className={textareaClass} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-950">Висновок</h4>
          <CopyButton label="Копіювати висновок" value={conclusion} />
        </div>
        <textarea value={conclusion} onChange={(event) => onConclusionChange(event.target.value)} rows={5} className={textareaClass} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-950">Рекомендації</h4>
          <CopyButton label="Копіювати рекомендації" value={recommendations} />
        </div>
        <textarea value={recommendations} onChange={(event) => onRecommendationsChange(event.target.value)} rows={6} className={textareaClass} />
        <div className="mt-3">
          <CopyButton label="Копіювати все" value={fullText} />
        </div>
      </div>
    </aside>
  );
}
