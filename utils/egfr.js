function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function parsePositiveNumber(value) {
  if (!hasValue(value)) return null;

  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeCreatinineToMgDl(creatinine, unit) {
  const parsed = parsePositiveNumber(creatinine);
  if (parsed === null) return null;

  return unit === 'umolL' ? parsed / 88.4 : parsed;
}

function getEgfrCategory(egfr) {
  if (egfr >= 90) {
    return {
      category: 'G1',
      interpretation: 'Нормальна або висока ШКФ.',
    };
  }

  if (egfr >= 60) {
    return {
      category: 'G2',
      interpretation: 'Легке зниження ШКФ.',
    };
  }

  if (egfr >= 45) {
    return {
      category: 'G3a',
      interpretation: 'Легке або помірне зниження ШКФ.',
    };
  }

  if (egfr >= 30) {
    return {
      category: 'G3b',
      interpretation: 'Помірне або виражене зниження ШКФ.',
    };
  }

  if (egfr >= 15) {
    return {
      category: 'G4',
      interpretation: 'Виражене зниження ШКФ.',
    };
  }

  return {
    category: 'G5',
    interpretation: 'Ниркова недостатність. Потрібна термінова клінічна оцінка.',
  };
}

export function calculateEgfr(data) {
  const age = parsePositiveNumber(data.age);
  const creatinineMgDl = normalizeCreatinineToMgDl(data.creatinine, data.creatinineUnit);

  if (!age || !data.sex || !creatinineMgDl) {
    return null;
  }

  const isFemale = data.sex === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const creatinineRatio = creatinineMgDl / kappa;

  const egfr =
    142 *
    Math.pow(Math.min(creatinineRatio, 1), alpha) *
    Math.pow(Math.max(creatinineRatio, 1), -1.2) *
    Math.pow(0.9938, age) *
    (isFemale ? 1.012 : 1);

  const roundedEgfr = Math.round(egfr);
  const categoryData = getEgfrCategory(roundedEgfr);

  return {
    egfr: roundedEgfr,
    creatinineMgDl: Math.round(creatinineMgDl * 100) / 100,
    ...categoryData,
  };
}
