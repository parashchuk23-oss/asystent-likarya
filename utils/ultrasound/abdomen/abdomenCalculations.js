export function parsePositiveNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return Number(value).toFixed(digits).replace('.', ',');
}

export function isLiverEnlarged(liver) {
  const rightCraniocaudal = parsePositiveNumber(liver.rightLobeLength);
  const rightAp = parsePositiveNumber(liver.rightLobeAp);
  const left = parsePositiveNumber(liver.leftLobeLength);
  const caudate = parsePositiveNumber(liver.caudateLobe);
  return Boolean(
    (rightCraniocaudal && rightCraniocaudal > 150) ||
      (rightAp && rightAp > 120) ||
      (left && left > 80) ||
      (caudate && caudate > 35)
  );
}

export function isPortalVeinDilated(value) {
  const diameter = parsePositiveNumber(value);
  return diameter ? diameter > 13 : false;
}

export function isGallbladderWallThickened(value) {
  const wall = parsePositiveNumber(value);
  return wall ? wall > 3 : false;
}

export function isCommonBileDuctDilated(value) {
  const diameter = parsePositiveNumber(value);
  return diameter ? diameter > 6 : false;
}

export function isPancreaticDuctDilated(value) {
  const diameter = parsePositiveNumber(value);
  return diameter ? diameter > 2.5 : false;
}

export function isSpleenEnlarged(spleen) {
  const length = parsePositiveNumber(spleen.length);
  const width = parsePositiveNumber(spleen.width);
  return Boolean((length && length > 120) || (width && width > 60));
}

export function formatMm(value) {
  const number = parsePositiveNumber(value);
  return number ? `${formatNumber(number)} мм` : '';
}

export function formatDimensions(length, width) {
  const parts = [parsePositiveNumber(length), parsePositiveNumber(width)].filter(Boolean);
  if (!parts.length) return '';
  return `${parts.map((value) => formatNumber(value)).join(' × ')} мм`;
}

const polypRiskLabels = {
  extremelyLow: 'вкрай низького ризику',
  low: 'низького ризику',
  indeterminate: 'невизначеного ризику',
};

function parsePreviousDate(value) {
  if (!value) return null;
  const normalized = String(value).trim();
  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const localMatch = normalized.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
  const parts = isoMatch
    ? [Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3])]
    : localMatch
      ? [Number(localMatch[3]), Number(localMatch[2]), Number(localMatch[1])]
      : null;
  if (!parts) return null;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export function assessGallbladderPolypSru(polyp) {
  const size = parsePositiveNumber(polyp.size);
  const adjacentWallThickness = parsePositiveNumber(polyp.adjacentWallThickness);
  const previousSize = parsePositiveNumber(polyp.previousSize);
  const growth = size && previousSize ? size - previousSize : null;
  const previousDate = parsePreviousDate(polyp.previousDate);
  const intervalDays = previousDate ? (Date.now() - previousDate.getTime()) / 86400000 : null;
  const rapidGrowth = growth !== null && growth >= 4 && intervalDays !== null && intervalDays >= 0 && intervalDays <= 366;

  let risk = 'low';
  if (adjacentWallThickness && adjacentWallThickness >= 4) {
    risk = 'indeterminate';
  } else if (polyp.morphology === 'ballOnWall') {
    risk = 'extremelyLow';
  }

  let recommendation = 'Вказати розмір поліпа для визначення тактики за SRU 2022.';
  if (size) {
    if (rapidGrowth) {
      recommendation = 'Консультація хірурга: збільшення розміру на ≥4 мм протягом не більше ніж 12 місяців.';
    } else if (risk === 'extremelyLow') {
      if (size <= 9) recommendation = 'Подальше УЗ-спостереження не потрібне.';
      else if (size <= 14) recommendation = 'Контрольне УЗД через 6, 12 і 24 місяці.';
      else recommendation = 'Консультація хірурга.';
    } else if (risk === 'low') {
      if (size <= 6) recommendation = 'Подальше УЗ-спостереження не потрібне.';
      else if (size <= 9) recommendation = 'Контрольне УЗД через 12 місяців.';
      else if (size <= 14) recommendation = 'Контрольне УЗД через 6, 12, 24 і 36 місяців.';
      else recommendation = 'Консультація хірурга.';
    } else if (size <= 6) {
      recommendation = 'Контрольне УЗД через 6, 12, 24 і 36 місяців.';
    } else {
      recommendation = 'Консультація хірурга.';
    }
  }

  return {
    risk,
    riskLabel: polypRiskLabels[risk],
    recommendation,
    growth,
    rapidGrowth,
  };
}
