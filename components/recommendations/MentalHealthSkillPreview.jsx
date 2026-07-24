'use client';

import CopyRecommendationsButton from './CopyRecommendationsButton';
import MentalHealthSkillEditor from './MentalHealthSkillEditor';

export default function MentalHealthSkillPreview({
  skill,
  text,
  isEditing,
  onEdit,
  onCancelEdit,
  onChangeText,
  onRestore,
  onCopyStatus,
}) {
  if (!skill) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
        Оберіть навичку ліворуч, щоб переглянути текст для пацієнта.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <p className="text-base font-semibold text-slate-950">{skill.title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{skill.shortDescription}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skill.sourceLabels.map((label) => (
            <span key={label} className="rounded border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              {label}
            </span>
          ))}
        </div>
      </div>

      {isEditing ? (
        <MentalHealthSkillEditor value={text} onChange={onChangeText} onRestore={onRestore} />
      ) : (
        <div className="max-h-[34rem] overflow-auto rounded-md border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-800 whitespace-pre-wrap">
          {text}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <CopyRecommendationsButton
          text={text}
          label="Копіювати навичку"
          onCopied={onCopyStatus}
        />
        <button
          type="button"
          onClick={isEditing ? onCancelEdit : onEdit}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          {isEditing ? 'Завершити редагування' : 'Редагувати текст'}
        </button>
      </div>
    </div>
  );
}
