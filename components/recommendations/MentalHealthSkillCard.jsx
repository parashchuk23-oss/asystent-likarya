'use client';

import CopyRecommendationsButton from './CopyRecommendationsButton';

export default function MentalHealthSkillCard({
  skill,
  isActive,
  isSelected,
  isRecommended,
  text,
  onPreview,
  onToggleSelected,
  onCopyStatus,
}) {
  return (
    <article
      className={`rounded-md border bg-white p-3 transition ${
        isActive ? 'border-blue-300 shadow-sm shadow-blue-100' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{skill.title}</p>
          {isRecommended ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
              Частіше для цього опитувальника
            </p>
          ) : null}
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelected}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Додати
        </label>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">{skill.shortDescription}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Переглянути
        </button>
        <CopyRecommendationsButton
          text={text}
          label="Копіювати"
          variant="secondary"
          onCopied={onCopyStatus}
        />
        <button
          type="button"
          onClick={onToggleSelected}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          {isSelected ? 'Скасувати вибір' : 'Додати до рекомендацій'}
        </button>
      </div>
    </article>
  );
}
