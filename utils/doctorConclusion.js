function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function valueOrEmpty(value) {
  return hasValue(value) ? String(value).trim() : '';
}

function joinParts(parts) {
  return parts.filter(hasValue).join(', ');
}

function buildObjectiveStatus(formData) {
  const generalCondition = joinParts([
    formData.generalCondition && `загальний стан: ${formData.generalCondition}`,
    formData.generalConditionNote,
  ]);

  const objectiveRows = [
    generalCondition,
    formData.skinCondition && `шкірні покриви: ${formData.skinCondition}`,
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
    formData.abdomen && `живіт: ${formData.abdomen}`,
    formData.defecation && `дефекація: ${formData.defecation}`,
    formData.urination && `сечовипускання: ${formData.urination}`,
    formData.cvsSymptom && `симптом поколочування по попереку: ${formData.cvsSymptom}`,
    formData.edema && `набряки: ${formData.edema}`,
  ];

  return objectiveRows.filter(hasValue).join('. ');
}

export function buildDoctorConclusion(formData) {
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
    `Об'єктивно: ${buildObjectiveStatus(formData)}`,
    '',
    `Діагноз: ${valueOrEmpty(formData.diagnosis)}`,
    '',
    `Рекомендації: ${valueOrEmpty(formData.recommendations)}`,
  ];

  return sections.join('\n').trim();
}
