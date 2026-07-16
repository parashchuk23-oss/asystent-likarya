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
  const right = parsePositiveNumber(liver.rightLobeLength);
  const left = parsePositiveNumber(liver.leftLobeLength);
  const caudate = parsePositiveNumber(liver.caudateLobe);
  return Boolean((right && right > 155) || (left && left > 80) || (caudate && caudate > 35));
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
