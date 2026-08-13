import { whoGrowthReference2007 } from '../data/growth/whoGrowthReference2007';

const SEX_MAP = {
  чоловіча: 'male',
  жіноча: 'female',
  хлопчик: 'male',
  дівчинка: 'female',
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 1) {
  if (!Number.isFinite(value)) return null;
  return Number(value.toFixed(digits));
}

function getAgeMonths(ageYears, ageMonths) {
  const years = toNumber(ageYears);
  const months = toNumber(ageMonths) || 0;

  if (years === null || years < 0 || months < 0 || months > 11) {
    return null;
  }

  return Math.round(years * 12 + months);
}

function findReferenceRow(table, ageMonths) {
  if (!table || !ageMonths) return null;

  if (ageMonths < whoGrowthReference2007.ageMonths.min || ageMonths > whoGrowthReference2007.ageMonths.max) {
    return null;
  }

  return table.find((row) => row.month === ageMonths) || null;
}

function calculateZScore(value, reference) {
  if (!reference || !value || value <= 0) return null;

  if (reference.l === 0) {
    return Math.log(value / reference.m) / reference.s;
  }

  return ((value / reference.m) ** reference.l - 1) / (reference.l * reference.s);
}

function erf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function zToPercentile(zScore) {
  if (!Number.isFinite(zScore)) return null;
  return round(0.5 * (1 + erf(zScore / Math.sqrt(2))) * 100, 1);
}

function getHeightCategory(zScore) {
  if (zScore === null) return '';
  if (zScore < -3) return 'дуже низький зріст';
  if (zScore < -2) return 'низький зріст';
  if (zScore <= 2) return 'зріст у межах очікуваного діапазону';
  if (zScore <= 3) return 'високий зріст';
  return 'дуже високий зріст';
}

function getBmiCategory(zScore) {
  if (zScore === null) return '';
  if (zScore < -3) return 'тяжкий дефіцит маси тіла';
  if (zScore < -2) return 'дефіцит маси тіла';
  if (zScore <= 1) return 'ІМТ у межах очікуваного діапазону';
  if (zScore <= 2) return 'надлишкова маса тіла';
  return 'ожиріння';
}

function buildAssessment({ value, reference, category }) {
  const zScore = calculateZScore(value, reference);

  if (zScore === null) {
    return null;
  }

  return {
    zScore: round(zScore, 2),
    percentile: zToPercentile(zScore),
    category: category(zScore),
  };
}

export function calculatePediatricGrowthAssessment({ sex, ageYears, ageMonths, height, weight }) {
  const normalizedSex = SEX_MAP[sex];
  const ageInMonths = getAgeMonths(ageYears, ageMonths);
  const heightCm = toNumber(height);
  const weightKg = toNumber(weight);

  if (!normalizedSex || !ageInMonths) {
    return {
      status: 'missing-data',
      message: 'Оберіть стать і вік дитини для автоматичної оцінки.',
    };
  }

  if (ageInMonths < whoGrowthReference2007.ageMonths.min || ageInMonths > whoGrowthReference2007.ageMonths.max) {
    return {
      status: 'out-of-range',
      ageInMonths,
      message: 'Автоматична оцінка доступна для дітей 5-19 років за WHO Growth Reference 2007.',
    };
  }

  const heightReference = findReferenceRow(whoGrowthReference2007.height[normalizedSex], ageInMonths);
  const bmiReference = findReferenceRow(whoGrowthReference2007.bmi[normalizedSex], ageInMonths);
  const bmi = heightCm && weightKg ? weightKg / ((heightCm / 100) ** 2) : null;

  return {
    status: 'ready',
    ageInMonths,
    source: whoGrowthReference2007.source,
    height: heightCm
      ? buildAssessment({
          value: heightCm,
          reference: heightReference,
          category: getHeightCategory,
        })
      : null,
    bmi: bmi
      ? {
          value: round(bmi, 1),
          ...buildAssessment({
            value: bmi,
            reference: bmiReference,
            category: getBmiCategory,
          }),
        }
      : null,
  };
}
