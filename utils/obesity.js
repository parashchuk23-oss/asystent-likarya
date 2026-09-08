export function parseClinicalNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;

  const normalized = String(value ?? '').trim().replace(',', '.');
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function calculateBmi(weightKg, heightCm) {
  const weight = parseClinicalNumber(weightKg);
  const height = parseClinicalNumber(heightCm);

  if (!weight || !height || weight <= 0 || height <= 0) return null;

  const heightM = height / 100;
  return weight / heightM ** 2;
}

export function getAdultBmiClassification(bmi) {
  if (!Number.isFinite(bmi)) return null;

  if (bmi < 18.5) return { label: 'Недостатня маса тіла', diagnosis: 'Недостатня маса тіла' };
  if (bmi < 25) return { label: 'Нормальна маса тіла', diagnosis: 'Нормальна маса тіла' };
  if (bmi < 30) return { label: 'Надмірна маса тіла', diagnosis: 'Надмірна маса тіла' };
  if (bmi < 35) return { label: 'Ожиріння I ступеня', diagnosis: 'Ожиріння I ступеня' };
  if (bmi < 40) return { label: 'Ожиріння II ступеня', diagnosis: 'Ожиріння II ступеня' };

  return { label: 'Ожиріння III ступеня', diagnosis: 'Ожиріння III ступеня' };
}

export function calculateWaistToHeightRatio(waistCm, heightCm) {
  const waist = parseClinicalNumber(waistCm);
  const height = parseClinicalNumber(heightCm);

  if (!waist || !height || waist <= 0 || height <= 0) return null;

  return waist / height;
}

export function calculateWeightGoals(weightKg) {
  const weight = parseClinicalNumber(weightKg);
  if (!weight || weight <= 0) return null;

  return {
    fivePercent: weight * 0.95,
    tenPercent: weight * 0.9,
  };
}
