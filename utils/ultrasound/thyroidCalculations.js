export function parsePositiveNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const normalized = String(value).replace(',', '.').trim();
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function validatePositiveNumber(value, { min = 0.1, max = 300 } = {}) {
  if (value === '' || value === null || value === undefined) return '';
  const number = parsePositiveNumber(value);
  if (!number) return 'Введіть додатне число.';
  if (number < min || number > max) return `Перевірте значення: очікуваний діапазон ${min}–${max}.`;
  return '';
}

export function formatDecimal(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return Number(value).toFixed(digits).replace('.', ',');
}

export function calculateLobeVolume(dimensions) {
  const length = parsePositiveNumber(dimensions?.length);
  const thickness = parsePositiveNumber(dimensions?.thickness);
  const width = parsePositiveNumber(dimensions?.width);

  if (!length || !thickness || !width) return null;
  return (length * thickness * width * 0.479) / 1000;
}

export function calculateTotalVolume(rightVolume, leftVolume) {
  const volumes = [rightVolume, leftVolume].filter((value) => typeof value === 'number');
  if (!volumes.length) return null;
  return volumes.reduce((sum, value) => sum + value, 0);
}

export function formatDimensions(dimensions) {
  const values = [dimensions?.length, dimensions?.thickness, dimensions?.width]
    .map(parsePositiveNumber)
    .filter(Boolean);

  if (!values.length) return '';
  return `${values.map((value) => formatDecimal(value)).join(' × ')} мм`;
}

export function getCalculatedVolumes(measurements) {
  const rightVolume = calculateLobeVolume(measurements?.right);
  const leftVolume = calculateLobeVolume(measurements?.left);
  const totalVolume = calculateTotalVolume(rightVolume, leftVolume);

  return {
    rightVolume,
    leftVolume,
    totalVolume,
  };
}
