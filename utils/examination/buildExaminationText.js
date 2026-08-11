function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
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

function buildSentence(label, value) {
  if (!hasValue(value)) return '';
  return `${label}: ${trimEndingPunctuation(value)}`;
}

function buildGeneralStatus(formData) {
  const generalCondition = joinParts([
    formData.generalCondition && `загальний стан: ${formData.generalCondition}`,
    formData.generalConditionNote,
  ]);

  const rows = [
    generalCondition,
    formData.consciousness,
    formData.patientPosition,
    buildSentence('шкірні покриви', formData.skinCondition),
    formData.mucousMembranes,
    buildSentence('лімфатичні вузли', formData.lymphNodes),
    buildSentence('щитоподібна залоза', formData.thyroid),
    buildSentence('ротова порожнина', formData.oralCavity),
    buildSentence('тип будови тіла', formData.bodyType),
    joinParts([
      formData.height && `зріст: ${formData.height} см`,
      formData.weight && `маса тіла: ${formData.weight} кг`,
      formData.bmi && `ІМТ: ${formData.bmi} кг/м²`,
    ]),
    joinParts([
      formData.bloodPressure && `АТ: ${formData.bloodPressure} мм рт. ст.`,
      formData.heartRate && `ЧСС: ${formData.heartRate} уд/хв`,
    ]),
    buildSentence('аускультація серця', formData.heartAuscultation),
    buildSentence('периферичні набряки', formData.peripheralEdema),
    formData.abdomen,
    formData.liver,
    formData.spleen,
    buildSentence('дефекація', formData.defecation),
    buildSentence('сечовипускання', formData.urination),
    formData.cvsSymptom,
  ];

  return rows.filter(hasValue);
}

function buildRespiratoryStatus(formData) {
  return [buildSentence('аускультація легень', formData.lungAuscultation)].filter(hasValue);
}

function buildNeurologicalStatus(formData, mode) {
  const rows = [
    joinParts([
      formData.neuroConsciousness,
      formData.neuroOrientation,
      formData.neuroSpeech,
    ]),
    mode !== 'short' && buildSentence('зіниці', formData.neuroPupils),
    mode !== 'short' && buildSentence('черепні нерви', formData.neuroCranialNerves),
    buildSentence('рухова сфера', formData.neuroMotorStrength),
    mode !== 'short' && buildSentence('чутливість', formData.neuroSensory),
    mode !== 'short' && buildSentence('координація', formData.neuroCoordination),
    buildSentence('менінгеальні знаки', formData.neuroMeningealSigns),
    mode === 'expanded' && buildSentence('патологічні рефлекси', formData.neuroPathologicalReflexes),
    mode === 'expanded' && buildSentence('хода', formData.neuroGait),
  ];

  return rows.filter(hasValue);
}

function buildCustomStatus(formData) {
  if (!hasValue(formData.customText)) return [];

  const title = hasValue(formData.customTitle) ? String(formData.customTitle).trim() : 'Додатковий статус';
  return [`${title}: ${String(formData.customText).trim()}`];
}

const statusBuilders = {
  general: buildGeneralStatus,
  respiratory: buildRespiratoryStatus,
  neurological: buildNeurologicalStatus,
  custom: buildCustomStatus,
};

export function buildExaminationText(selectedStatuses, formData, statusModes = {}) {
  const rows = selectedStatuses.flatMap((statusId) => {
    const builder = statusBuilders[statusId];
    if (!builder) return [];

    return builder(formData, statusModes[statusId] || 'standard');
  });

  const text = rows.map(normalizeSentence).filter(hasValue).join('. ');

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
