function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function valueOrEmpty(value) {
  return hasValue(value) ? String(value).trim() : '';
}

function joinParts(parts) {
  return parts.filter(hasValue).join(', ');
}

function trimEndingPunctuation(value) {
  return String(value).trim().replace(/[.!?…]+$/u, '');
}

function capitalizeFirst(value) {
  const text = String(value).trim();
  if (!text) return '';

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeSentence(value) {
  if (!hasValue(value)) return '';
  return capitalizeFirst(trimEndingPunctuation(value));
}

function buildObjectiveStatus(formData) {
  const generalCondition = joinParts([
    formData.generalCondition && `загальний стан: ${formData.generalCondition}`,
    formData.generalConditionNote,
  ]);

  const objectiveRows = [
    generalCondition,
    formData.consciousness,
    formData.patientPosition,
    formData.skinCondition && `шкірні покриви: ${formData.skinCondition}`,
    formData.mucousMembranes,
    formData.peripheralEdema && `периферичні набряки: ${formData.peripheralEdema}`,
    formData.bodyType && `тип будови тіла: ${formData.bodyType}`,
    formData.lymphNodes && `лімфатичні вузли: ${formData.lymphNodes}`,
    formData.thyroid && `щитоподібна залоза: ${formData.thyroid}`,
    formData.oralCavity && `ротова порожнина: ${formData.oralCavity}`,
    joinParts([
      formData.height && `зріст: ${formData.height} см`,
      formData.weight && `вага: ${formData.weight} кг`,
      formData.bmi && `ІМТ: ${formData.bmi} кг/м²`,
    ]),
    joinParts([
      formData.bloodPressure && `АТ: ${formData.bloodPressure} мм рт.ст.`,
      formData.heartRate && `ЧСС: ${formData.heartRate} уд/хв`,
    ]),
    formData.heartAuscultation && `аускультація серця: ${formData.heartAuscultation}`,
    formData.lungAuscultation && `аускультація легень: ${formData.lungAuscultation}`,
    formData.abdomen,
    formData.liver,
    formData.spleen,
    formData.defecation && `дефекація: ${formData.defecation}`,
    formData.urination && `сечовипускання: ${formData.urination}`,
    formData.cvsSymptom,
    formData.edema && `набряки: ${formData.edema}`,
  ];

  return objectiveRows.map(normalizeSentence).filter(hasValue).join('. ');
}

export function buildDoctorConclusion(formData, options = {}) {
  const objectiveStatus = hasValue(options.objectiveStatusText)
    ? String(options.objectiveStatusText).trim()
    : buildObjectiveStatus(formData);

  const passport = [
    formData.visitDate && `Дата прийому: ${formData.visitDate}`,
    formData.birthDate && `Дата народження: ${formData.birthDate}`,
    formData.age && `Вік: ${formData.age} р.`,
    formData.sex && `Стать: ${formData.sex}`,
  ].filter(hasValue);

  const sections = [
    'КОНСУЛЬТАЦІЯ ЛІКАРЯ',
    '',
    ...passport,
    '',
    `Скарги: ${valueOrEmpty(formData.complaints)}`,
    '',
    `Об'єктивно: ${objectiveStatus}`,
    '',
    `Діагноз: ${valueOrEmpty(formData.diagnosis)}`,
    '',
    `Рекомендації: ${valueOrEmpty(formData.recommendations)}`,
  ];

  return sections.join('\n').trim();
}
