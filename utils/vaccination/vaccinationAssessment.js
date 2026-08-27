import { nationalSchedule, catchUpRules } from '../../data/vaccination/ukraine/nationalSchedule';
import { recommendedVaccineDefinitions, vaccineDefinitions } from '../../data/vaccination/ukraine/vaccineDefinitions';

const allVaccines = [...vaccineDefinitions, ...recommendedVaccineDefinitions];

export function getAgeInMonths({ birthDate, manualAgeYears, manualAgeMonths }) {
  if (birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    if (!Number.isNaN(birth.getTime()) && birth <= today) {
      let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
      if (today.getDate() < birth.getDate()) months -= 1;
      return Math.max(months, 0);
    }
  }

  const years = Number(manualAgeYears) || 0;
  const months = Number(manualAgeMonths) || 0;
  return Math.max(years * 12 + months, 0);
}

export function formatAge(months) {
  if (months < 24) return `${months} міс.`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} р. ${rest} міс.` : `${years} р.`;
}

export function getVaccineTitle(vaccineId) {
  return allVaccines.find((vaccine) => vaccine.id === vaccineId)?.title || vaccineId;
}

export function assessVaccination({ ageMonths, sex, history = {}, riskFactors = [] }) {
  const dueCalendar = nationalSchedule.filter((dose) => {
    if (ageMonths < dose.minAgeMonths) return false;
    if (dose.maxAgeMonths && ageMonths > dose.maxAgeMonths) return false;
    if (dose.sex && dose.sex !== sex) return false;
    return true;
  });

  const requiredByAge = dueCalendar.map((dose) => ({
    ...dose,
    title: getVaccineTitle(dose.vaccineId),
  }));

  const catchUp = requiredByAge
    .filter((dose) => {
      const value = history[dose.vaccineId] || 'unknown';
      if (value === 'complete') return false;
      if (value === 'unknown' || value === 'none') return true;
      const received = Number(value);
      return Number.isFinite(received) && dose.doseNumber && received < dose.doseNumber;
    })
    .map((dose) => {
      const value = history[dose.vaccineId] || 'unknown';
      const received = value === 'none' || value === 'unknown' ? 0 : Number(value);
      const rule = catchUpRules.find((item) => item.vaccineId === dose.vaccineId);
      return {
        vaccineId: dose.vaccineId,
        title: dose.title,
        reason:
          value === 'unknown'
            ? 'Історія вакцинації невідома або не підтверджена.'
            : `За віком очікується доза ${dose.doseNumber || 'ревакцинація'}, зазначено отримано: ${received}.`,
        nextStep: rule?.summary || 'Звірити з чинним календарем і попередніми дозами.',
      };
    });

  const recommendedMap = new Map();
  riskFactors.forEach((factor) => {
    factor.vaccines.forEach((vaccineId) => {
      if (!recommendedMap.has(vaccineId)) {
        recommendedMap.set(vaccineId, {
          vaccineId,
          title: getVaccineTitle(vaccineId),
          reasons: [],
          warning: factor.warning,
        });
      }
      recommendedMap.get(vaccineId).reasons.push(factor.label);
      if (factor.warning) recommendedMap.get(vaccineId).warning = factor.warning;
    });
  });

  if (ageMonths >= 6 && !recommendedMap.has('influenza')) {
    recommendedMap.set('influenza', {
      vaccineId: 'influenza',
      title: getVaccineTitle('influenza'),
      reasons: ['щорічна сезонна профілактика'],
    });
  }

  return {
    requiredByAge,
    catchUp,
    recommended: Array.from(recommendedMap.values()),
  };
}

export function buildVaccinationPlanText({ assessment, ageMonths }) {
  const lines = [`План вакцинації, вік пацієнта: ${formatAge(ageMonths)}.`];

  if (assessment.requiredByAge.length) {
    lines.push('', 'Обов’язково за календарем:');
    assessment.requiredByAge.forEach((item) => {
      lines.push(`- ${item.title}: ${item.ageLabel}, ${item.type}${item.doseNumber ? `, доза ${item.doseNumber}` : ''}.`);
    });
  }

  if (assessment.catchUp.length) {
    lines.push('', 'Потрібно надолужити / уточнити:');
    assessment.catchUp.forEach((item) => {
      lines.push(`- ${item.title}: ${item.reason} ${item.nextStep}`);
    });
  }

  if (assessment.recommended.length) {
    lines.push('', 'Рекомендовано додатково:');
    assessment.recommended.forEach((item) => {
      lines.push(`- ${item.title}: ${item.reasons.join(', ')}.`);
    });
  }

  lines.push('', 'План є довідковою підказкою. Остаточне рішення приймає лікар після перевірки анамнезу, документів вакцинації, протипоказань та чинних рекомендацій.');

  return lines.join('\n');
}
