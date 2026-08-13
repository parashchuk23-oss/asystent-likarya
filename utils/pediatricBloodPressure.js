import { pediatricBloodPressureScreening } from '../data/pediatrics/pediatricBloodPressureScreening';

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
      category: 'артеріальна гіпертензія 2 ступеня',
      tone: 'danger',
      interpretation:
        'Для дітей віком від 13 років цей рівень відповідає категорії АГ 2 ступеня за AAP 2017.',
    };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'артеріальна гіпертензія 1 ступеня',
      tone: 'warning',
      interpretation:
        'Для дітей віком від 13 років цей рівень відповідає категорії АГ 1 ступеня за AAP 2017.',
    };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'підвищений артеріальний тиск',
      tone: 'notice',
      interpretation:
        'Для дітей віком від 13 років цей рівень відповідає підвищеному АТ за AAP 2017.',
    };
  }

  return {
    category: 'АТ у межах очікуваного діапазону',
    tone: 'normal',
    interpretation: 'Для дітей віком від 13 років показник нижчий за пороги підвищеного АТ.',
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
      category: 'показник потребує повторної оцінки',
      tone: 'notice',
      threshold,
      interpretation:
        'АТ дорівнює або перевищує скринінговий поріг AAP 2017. Доцільно повторити вимірювання коректною манжетою та оцінити за повними перцентильними таблицями з урахуванням зросту.',
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
