import { pediatricBloodPressureScreening } from '../data/pediatrics/pediatricBloodPressureScreening.js';
import { calculateRosnerBloodPressureModel } from './rosnerPediatricBloodPressure.js';

const SEX_MAP = {
  чоловіча: 'M', жіноча: 'F', хлопчик: 'M', дівчинка: 'F', male: 'M', female: 'F',
};

const CATEGORY_PRIORITY = { normal: 0, elevated: 1, stage1: 2, stage2: 3 };
const CATEGORY_DETAILS = {
  normal: { label: 'нормальний рівень', summary: 'рівень АТ у межах нормальної категорії', tone: 'normal' },
  elevated: { label: 'відповідає категорії підвищеного АТ', summary: 'рівень АТ відповідає категорії підвищеного АТ', tone: 'notice' },
  stage1: { label: 'відповідає категорії АГ 1 ступеня', summary: 'рівень АТ відповідає категорії АГ 1 ступеня', tone: 'warning' },
  stage2: { label: 'відповідає категорії АГ 2 ступеня', summary: 'рівень АТ відповідає категорії АГ 2 ступеня', tone: 'danger' },
};

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseBloodPressure(value) {
  if (!value) return null;
  const match = String(value).replace(',', '.').match(/(\d{2,3})\s*[/:\\-]\s*(\d{2,3})/u);
  if (!match) return null;
  const systolic = Number(match[1]);
  const diastolic = Number(match[2]);
  if (systolic < 40 || systolic > 260 || diastolic < 20 || diastolic > 180 || systolic <= diastolic) return null;
  return { systolic, diastolic };
}

function getAgeInMonths(ageYears, ageMonths) {
  const years = toNumber(ageYears);
  const months = ageMonths === '' || ageMonths === null || ageMonths === undefined ? 0 : toNumber(ageMonths);
  if (years === null || months === null || !Number.isInteger(years) || !Number.isInteger(months) || years < 0 || months < 0 || months > 11) return null;
  return years * 12 + months;
}

function getAdolescentCategory({ systolic, diastolic }) {
  if (systolic >= 140 || diastolic >= 90) return 'stage2';
  if (systolic >= 130 || diastolic >= 80) return 'stage1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'normal';
}

function getComponentCategory(value, thresholds, component) {
  const absolute = component === 'systolic'
    ? { elevated: 120, stage1: 130, stage2: 140 }
    : { elevated: 80, stage1: 80, stage2: 90 };
  if (value >= Math.min(thresholds.p95Plus12, absolute.stage2)) return 'stage2';
  if (value >= Math.min(thresholds.p95, absolute.stage1)) return 'stage1';
  if (value >= Math.min(thresholds.p90, absolute.elevated)) return 'elevated';
  return 'normal';
}

function getHigherCategory(left, right) {
  return CATEGORY_PRIORITY[left] >= CATEGORY_PRIORITY[right] ? left : right;
}

export function classifyPediatricBloodPressure({ sex, ageYears, ageMonths, heightCm, systolic, diastolic }) {
  const normalizedSex = SEX_MAP[sex];
  const ageInMonths = getAgeInMonths(ageYears, ageMonths);
  const hasHeight = heightCm !== '' && heightCm !== null && heightCm !== undefined;
  const parsedHeight = toNumber(heightCm);
  const parsedSystolic = toNumber(systolic);
  const parsedDiastolic = toNumber(diastolic);

  if (!normalizedSex) return { status: 'missing-sex', message: 'Оберіть стать дитини для оцінки АТ.' };
  if (ageInMonths === null) return { status: 'missing-age', message: 'Вкажіть коректний вік дитини для оцінки АТ.' };
  if (parsedSystolic === null || parsedDiastolic === null || parsedSystolic < 40 || parsedSystolic > 260 || parsedDiastolic < 20 || parsedDiastolic > 180 || parsedSystolic <= parsedDiastolic) {
    return { status: 'invalid-bp', message: 'Перевірте АТ: САТ має бути більшим за ДАТ.' };
  }
  if (ageInMonths < 12 || ageInMonths >= 216) {
    return { status: 'out-of-range', message: 'Автоматична оцінка АТ доступна для дітей від 1 до 17 років.' };
  }

  if (ageInMonths >= 156) {
    const category = getAdolescentCategory({ systolic: parsedSystolic, diastolic: parsedDiastolic });
    return {
      status: 'ready', mode: 'aap-2017-fixed-13-plus', systolicCategory: null, diastolicCategory: null,
      category, categoryLabel: CATEGORY_DETAILS[category].summary, tone: CATEGORY_DETAILS[category].tone,
      source: pediatricBloodPressureScreening.source,
    };
  }

  if (!hasHeight) {
    return { status: 'missing-height', message: 'Введіть зріст дитини для повної оцінки АТ за AAP 2017.' };
  }
  if (parsedHeight === null || parsedHeight <= 0) {
    return { status: 'invalid-height', message: 'Введіть коректний зріст дитини в сантиметрах.' };
  }

  const modelResult = calculateRosnerBloodPressureModel({
    sex: normalizedSex, ageInMonths, heightCm: parsedHeight, systolic: parsedSystolic, diastolic: parsedDiastolic,
  });
  if (modelResult.status !== 'ready') {
    return { status: 'out-of-range', message: 'Зріст виходить за межі валідованого діапазону моделі для цього віку та статі.' };
  }

  const systolicCategory = getComponentCategory(parsedSystolic, modelResult.thresholds.systolic, 'systolic');
  const diastolicCategory = getComponentCategory(parsedDiastolic, modelResult.thresholds.diastolic, 'diastolic');
  const category = getHigherCategory(systolicCategory, diastolicCategory);

  return {
    status: 'ready', mode: 'aap-2017-full',
    systolicPercentile: modelResult.systolicPercentile, diastolicPercentile: modelResult.diastolicPercentile,
    systolicCategory, diastolicCategory,
    systolicCategoryLabel: CATEGORY_DETAILS[systolicCategory].label,
    diastolicCategoryLabel: CATEGORY_DETAILS[diastolicCategory].label,
    category, categoryLabel: CATEGORY_DETAILS[category].summary, tone: CATEGORY_DETAILS[category].tone,
    source: 'AAP 2017 / Bernard Rosner',
  };
}

export function assessPediatricBloodPressure({ bloodPressure, sex, ageYears, ageMonths, heightCm }) {
  if (!bloodPressure) return { status: 'missing-bp', message: 'Введіть АТ у форматі 100/60 для довідкової оцінки.' };
  const parsed = parseBloodPressure(bloodPressure);
  if (!parsed) return { status: 'invalid-bp', message: 'АТ потрібно ввести у форматі САТ/ДАТ; САТ має бути більшим за ДАТ.' };
  return classifyPediatricBloodPressure({ sex, ageYears, ageMonths, heightCm, ...parsed });
}
