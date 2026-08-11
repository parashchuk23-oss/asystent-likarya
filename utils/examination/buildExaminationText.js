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

function buildLungAuscultation(formData) {
  return joinParts([formData.breathSounds, formData.lungWheezes]) || formData.lungAuscultation;
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
    buildSentence(
      'аускультація серця',
      joinParts([formData.heartSounds, formData.heartMurmurs]) || formData.heartAuscultation,
    ),
    buildSentence('периферичні набряки', formData.peripheralEdema),
    formData.respiratoryRate && `ЧД: ${formData.respiratoryRate}/хв`,
    buildSentence('аускультація легень', buildLungAuscultation(formData)),
    formData.abdomen,
    formData.liver,
    formData.spleen,
    buildSentence('дефекація', formData.defecation),
    buildSentence('сечовипускання', formData.urination),
    formData.cvsSymptom,
  ];

  return rows.filter(hasValue);
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

function buildPediatricPreventiveStatus(formData) {
  const pediatricVision = joinParts([
    formData.pediatricVisionOd && `OD ${formData.pediatricVisionOd}`,
    formData.pediatricVisionOs && `OS ${formData.pediatricVisionOs}`,
  ]) || formData.pediatricVision;
  const pediatricAge = joinParts([
    formData.pediatricAgeYears && `${formData.pediatricAgeYears} років`,
    formData.pediatricAgeMonths && `${formData.pediatricAgeMonths} міс.`,
  ]);
  const pediatricBmi = calculateBmi(formData.pediatricHeight, formData.pediatricWeight);

  const rows = [
    'профілактичний огляд дитини',
    joinParts([
      pediatricAge && `вік: ${pediatricAge}`,
      formData.pediatricSex && `стать: ${formData.pediatricSex}`,
    ]),
    joinParts([
      formData.pediatricGeneralCondition && `загальний стан: ${formData.pediatricGeneralCondition}`,
      formData.pediatricTemperature && `температура: ${formData.pediatricTemperature} °C`,
    ]),
    joinParts([
      formData.pediatricHeight && `зріст: ${formData.pediatricHeight} см`,
      formData.pediatricWeight && `маса тіла: ${formData.pediatricWeight} кг`,
      pediatricBmi && `ІМТ: ${pediatricBmi} кг/м²`,
      formData.pediatricHeightAssessment && `оцінка зросту: ${formData.pediatricHeightAssessment}`,
      formData.pediatricWeightAssessment && `оцінка маси тіла: ${formData.pediatricWeightAssessment}`,
    ]),
    joinParts([
      formData.pediatricBloodPressure && `АТ: ${formData.pediatricBloodPressure} мм рт. ст.`,
      formData.pediatricHeartRate && `ЧСС: ${formData.pediatricHeartRate} уд/хв`,
      formData.pediatricRespiratoryRate && `ЧД: ${formData.pediatricRespiratoryRate}/хв`,
    ]),
    buildSentence(
      'аускультація серця',
      joinParts([formData.pediatricHeartSounds, formData.pediatricHeartMurmurs]),
    ),
    buildSentence(
      'аускультація легень',
      joinParts([formData.pediatricBreathSounds, formData.pediatricLungWheezes]),
    ),
    buildSentence('шкірні покриви', formData.pediatricSkinCondition),
    formData.pediatricMucousMembranes,
    buildSentence('лімфатичні вузли', formData.pediatricLymphNodes),
    buildSentence('ротова порожнина', formData.pediatricOralCavity),
    formData.pediatricAbdomen,
    buildSentence('зір', pediatricVision),
    buildSentence('слух', formData.pediatricHearing),
    buildSentence('постава', formData.pediatricPosture),
    buildSentence('склепіння стопи', formData.pediatricFootArch),
    buildSentence('стоматологічний статус', formData.pediatricDentalStatus),
    buildSentence('педикульоз', formData.pediatricPediculosis),
    buildSentence('група для занять фізичною культурою', formData.pediatricPhysicalEducationGroup),
    formData.pediatricConclusion,
  ];

  return rows.filter(hasValue);
}

const statusBuilders = {
  general: buildGeneralStatus,
  neurological: buildNeurologicalStatus,
  'pediatric-preventive': buildPediatricPreventiveStatus,
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
