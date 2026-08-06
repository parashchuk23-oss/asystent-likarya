function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function joinParts(parts) {
  return parts.filter(hasValue).join(', ');
}

function buildSentence(label, value) {
  if (!hasValue(value)) return '';
  return `${label}: ${String(value).trim()}`;
}

function buildGeneralStatus(formData, mode) {
  const generalCondition = joinParts([
    formData.generalCondition && `загальний стан: ${formData.generalCondition}`,
    formData.generalConditionNote,
  ]);

  const rows = [
    generalCondition,
    buildSentence('шкірні покриви', formData.skinCondition),
    mode !== 'short' && buildSentence('тип будови тіла', formData.bodyType),
    mode !== 'short' && buildSentence('лімфатичні вузли', formData.lymphNodes),
    mode === 'expanded' && buildSentence('щитоподібна залоза', formData.thyroid),
    mode === 'expanded' && buildSentence('ротова порожнина', formData.oralCavity),
    joinParts([
      formData.height && `зріст: ${formData.height} см`,
      formData.weight && `маса тіла: ${formData.weight} кг`,
      formData.bmi && `ІМТ: ${formData.bmi} кг/м²`,
    ]),
    buildSentence('живіт', formData.abdomen),
    mode === 'expanded' && buildSentence('дефекація', formData.defecation),
    mode === 'expanded' && buildSentence('сечовипускання', formData.urination),
    mode === 'expanded' && buildSentence('симптом поколочування по попереку', formData.cvsSymptom),
  ];

  return rows.filter(hasValue);
}

function buildCardiovascularStatus(formData, mode) {
  const rows = [
    joinParts([
      formData.bloodPressure && `АТ: ${formData.bloodPressure} мм рт. ст.`,
      formData.heartRate && `ЧСС: ${formData.heartRate} уд/хв`,
    ]),
    buildSentence('аускультація серця', formData.heartAuscultation),
    mode !== 'short' && buildSentence('набряки', formData.edema || 'не виявлені'),
  ];

  return rows.filter(hasValue);
}

function buildRespiratoryStatus(formData) {
  return [buildSentence('аускультація легень', formData.lungAuscultation)].filter(hasValue);
}

function buildCustomStatus(formData) {
  if (!hasValue(formData.customText)) return [];

  const title = hasValue(formData.customTitle) ? String(formData.customTitle).trim() : 'Додатковий статус';
  return [`${title}: ${String(formData.customText).trim()}`];
}

const statusBuilders = {
  general: buildGeneralStatus,
  cardiovascular: buildCardiovascularStatus,
  respiratory: buildRespiratoryStatus,
  custom: buildCustomStatus,
};

export function buildExaminationText(selectedStatuses, formData, statusModes = {}) {
  const rows = selectedStatuses.flatMap((statusId) => {
    const builder = statusBuilders[statusId];
    if (!builder) return [];

    return builder(formData, statusModes[statusId] || 'standard');
  });

  const text = rows.filter(hasValue).join('. ');

  if (!text) {
    return '';
  }

  return text.endsWith('.') ? text : `${text}.`;
}

export function calculateBmi(height, weight) {
  const heightCm = Number(height);
  const weightKg = Number(weight);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return '';
  }

  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}
