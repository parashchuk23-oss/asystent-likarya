'use client';

import { patientRecommendationDisclaimer } from '../../data/mentalHealthSkills';
import CopyRecommendationsButton from './CopyRecommendationsButton';

export function buildSelectedRecommendationsText(selectedSkills, getText) {
  if (selectedSkills.length === 0) return '';

  const body = selectedSkills
    .map((skill, index) => `${index + 1}. ${skill.title}\n\n${getText(skill)}`)
    .join('\n\n');

  return `Рекомендації для пацієнта\n\n${body}\n\n${patientRecommendationDisclaimer}`;
}

export default function SelectedRecommendationsPanel({ selectedSkills, getText, onCopyStatus }) {
  const text = buildSelectedRecommendationsText(selectedSkills, getText);

  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-950">Вибрані рекомендації</p>
      {selectedSkills.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {selectedSkills.map((skill) => (
            <li key={skill.id}>{skill.title}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 leading-6">Оберіть одну або декілька навичок, щоб сформувати текст для пацієнта.</p>
      )}

      <div className="mt-3">
        <CopyRecommendationsButton
          text={text}
          label="Копіювати вибрані рекомендації"
          disabled={selectedSkills.length === 0}
          onCopied={onCopyStatus}
        />
      </div>
    </div>
  );
}
