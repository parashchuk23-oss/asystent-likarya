import { pediatricBloodPressureScreening } from '../data/pediatrics/pediatricBloodPressureScreening.js';

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

function parseBloodPressure(value) {
  if (!value) return null;

  const match = String(value)
    .replace(',', '.')
    .match(/(\d{2,3})\s*[/:\\-]\s*(\d{2,3})/u);

  if (!match) return null;

  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);

  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) return null;
  if (systolic < 40 || systolic > 260 || diastolic < 20 || diastolic > 180) return null;

  return { systolic, diastolic };
}

function getAgeYears(ageYears, ageMonths) {
  const years = toNumber(ageYears);
  const months = toNumber(ageMonths) || 0;

  if (years === null || years < 0 || months < 0 || months > 11) {
    return null;
  }

  return years + months / 12;
}

function getAdolescentCategory({ systolic, diastolic }) {
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'рівень АТ відповідає категорії АГ 2 ступеня',
      tone: 'danger',
      interpretation: 'Категорія рівня АТ визначена за порогами AAP 2017 для дітей віком від 13 років.',
    };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'рівень АТ відповідає категорії АГ 1 ступеня',
      tone: 'warning',
      interpretation: 'Категорія рівня АТ визначена за порогами AAP 2017 для дітей віком від 13 років.',
    };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'рівень АТ відповідає категорії підвищеного АТ',
      tone: 'notice',
      interpretation: 'Категорія рівня АТ визначена за порогами AAP 2017 для дітей віком від 13 років.',
    };
  }

  return {
    category: 'рівень АТ нижчий за пороги підвищеного АТ',
    tone: 'normal',
    interpretation: 'Категорія рівня АТ визначена за порогами AAP 2017 для дітей віком від 13 років.',
  };
}

function getChildScreeningResult({ sex, ageYears, systolic, diastolic }) {
  const roundedAge = Math.floor(ageYears);
  const threshold = pediatricBloodPressureScreening.childrenUnder13[roundedAge]?.[sex];

  if (!threshold) {
    return {
      status: 'out-of-range',
      message: 'Скринінгова оцінка АТ доступна для дітей від 1 до 17 років.',
    };
  }

  const isAtOrAboveThreshold = systolic >= threshold.systolic || diastolic >= threshold.diastolic;

  if (isAtOrAboveThreshold) {
    return {
      status: 'ready',
      category: 'показник потребує повторного вимірювання та оцінки за повними таблицями AAP',
      tone: 'notice',
      threshold,
      interpretation: 'АТ дорівнює або перевищує скринінговий поріг AAP 2017.',
    };
  }

  return {
    status: 'ready',
    category: 'нижче скринінгового порогу',
    tone: 'normal',
    threshold,
    interpretation:
      'Показник нижчий за спрощений скринінговий поріг AAP 2017 для віку та статі.',
  };
}

export function assessPediatricBloodPressure({ bloodPressure, sex, ageYears, ageMonths }) {
  const normalizedSex = SEX_MAP[sex];
  const age = getAgeYears(ageYears, ageMonths);
  const parsed = parseBloodPressure(bloodPressure);

  if (!bloodPressure) {
    return {
      status: 'missing-bp',
      message: 'Введіть АТ у форматі 100/60 для довідкової оцінки.',
    };
  }

  if (!parsed) {
    return {
      status: 'invalid-bp',
      message: 'АТ потрібно ввести у форматі САТ/ДАТ, наприклад 100/60.',
    };
  }

  if (!normalizedSex || age === null) {
    return {
      status: 'missing-data',
      bloodPressure: parsed,
      message: 'Для оцінки АТ оберіть стать і вік дитини.',
    };
  }

  if (age < pediatricBloodPressureScreening.ageRangeYears.min || age > pediatricBloodPressureScreening.ageRangeYears.max) {
    return {
      status: 'out-of-range',
      bloodPressure: parsed,
      message: 'Автоматична довідкова оцінка АТ доступна для дітей 1-17 років.',
    };
  }

  if (age >= 13) {
    return {
      status: 'ready',
      bloodPressure: parsed,
      source: pediatricBloodPressureScreening.source,
      thresholds: pediatricBloodPressureScreening.adolescents13AndOlder,
      ...getAdolescentCategory(parsed),
    };
  }

  return {
    bloodPressure: parsed,
    source: pediatricBloodPressureScreening.source,
    ...getChildScreeningResult({
      sex: normalizedSex,
      ageYears: age,
      systolic: parsed.systolic,
      diastolic: parsed.diastolic,
    }),
  };
}
