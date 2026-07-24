'use client';

import { useMemo, useState } from 'react';
import { mentalHealthSkills } from '../../data/mentalHealthSkills';
import MentalHealthSafetyAlert from './MentalHealthSafetyAlert';
import MentalHealthSkillCard from './MentalHealthSkillCard';
import MentalHealthSkillPreview from './MentalHealthSkillPreview';
import SelectedRecommendationsPanel from './SelectedRecommendationsPanel';

function sortSkillsForQuestionnaire(questionnaire) {
  return [...mentalHealthSkills].sort((first, second) => {
    const firstRecommended = first.targetQuestionnaires.includes(questionnaire) ? 0 : 1;
    const secondRecommended = second.targetQuestionnaires.includes(questionnaire) ? 0 : 1;
    return firstRecommended - secondRecommended;
  });
}

export default function PatientRecommendationsSection({ questionnaire, showSafetyAlert = false }) {
  const skills = useMemo(() => sortSkillsForQuestionnaire(questionnaire), [questionnaire]);
  const [activeSkillId, setActiveSkillId] = useState(skills[0]?.id || '');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editedTexts, setEditedTexts] = useState({});
  const [editingId, setEditingId] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const activeSkill = skills.find((skill) => skill.id === activeSkillId) || skills[0];
  const selectedSkills = skills.filter((skill) => selectedIds.includes(skill.id));

  function getSkillText(skill) {
    return editedTexts[skill.id] ?? skill.defaultText;
  }

  function toggleSelected(skillId) {
    setSelectedIds((current) =>
      current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId],
    );
    setCopyStatus('');
  }

  function handleTextChange(skillId, value) {
    setEditedTexts((current) => ({
      ...current,
      [skillId]: value,
    }));
    setCopyStatus('');
  }

  function restoreText(skillId) {
    setEditedTexts((current) => {
      const next = { ...current };
      delete next[skillId];
      return next;
    });
    setCopyStatus('');
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/60">
      <div className="border-b border-slate-100 pb-3">
        <p className="text-base font-semibold text-slate-950">Рекомендації для пацієнта</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Навички самодопомоги, які лікар може обрати, відредагувати та передати пацієнту.
          Це не автоматичне лікування і не заміна консультації лікаря або психологічної допомоги.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <MentalHealthSafetyAlert show={showSafetyAlert} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <div className="space-y-3">
            {skills.map((skill) => (
              <MentalHealthSkillCard
                key={skill.id}
                skill={skill}
                text={getSkillText(skill)}
                isActive={activeSkill?.id === skill.id}
                isSelected={selectedIds.includes(skill.id)}
                isRecommended={skill.targetQuestionnaires.includes(questionnaire)}
                onPreview={() => {
                  setActiveSkillId(skill.id);
                  setCopyStatus('');
                }}
                onToggleSelected={() => toggleSelected(skill.id)}
                onCopyStatus={setCopyStatus}
              />
            ))}
          </div>

          <MentalHealthSkillPreview
            skill={activeSkill}
            text={activeSkill ? getSkillText(activeSkill) : ''}
            isEditing={editingId === activeSkill?.id}
            onEdit={() => setEditingId(activeSkill?.id || '')}
            onCancelEdit={() => setEditingId('')}
            onChangeText={(value) => activeSkill && handleTextChange(activeSkill.id, value)}
            onRestore={() => activeSkill && restoreText(activeSkill.id)}
            onCopyStatus={setCopyStatus}
          />
        </div>

        <SelectedRecommendationsPanel
          selectedSkills={selectedSkills}
          getText={getSkillText}
          onCopyStatus={setCopyStatus}
        />

        {copyStatus ? <p className="text-sm text-slate-600">{copyStatus}</p> : null}
      </div>
    </section>
  );
}
