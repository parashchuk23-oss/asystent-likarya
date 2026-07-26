const crypto = require('crypto');

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeName(value) {
  const text = cleanText(value).replace(/\*+/g, '').trim();
  if (!text) return '';
  return text;
}

function normalizeSearchKey(value) {
  return cleanText(value).toLocaleLowerCase('uk-UA');
}

function parseNumber(value) {
  const text = cleanText(value)
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function parsePackage(rawPackage) {
  const text = cleanText(rawPackage);
  if (!text) {
    return {
      packageQuantity: null,
      packageUnit: '',
      packageDescription: '',
    };
  }

  const match = text.match(/(\d+(?:[,.]\d+)?)\s*([^\d,;.]+)?/);
  const packageQuantity = match ? parseNumber(match[1]) : null;
  const packageUnit = match && match[2] ? cleanText(match[2]).replace(/[.;,]$/, '') : 'од.';

  return {
    packageQuantity,
    packageUnit,
    packageDescription: text,
  };
}

function createMedicineId(record) {
  const key = [
    normalizeSearchKey(record.activeIngredient),
    normalizeSearchKey(record.tradeName),
    normalizeSearchKey(record.manufacturer),
    normalizeSearchKey(record.form),
    normalizeSearchKey(record.dosage),
    normalizeSearchKey(record.packageDescription),
  ].join('|');

  return crypto.createHash('sha1').update(key).digest('hex').slice(0, 16);
}

function normalizeRecord(record) {
  const form = normalizeName(record.form);
  const dosageValue = normalizeName(record.dosage);
  const normalized = {
    sourceRow: record.sourceRow,
    activeIngredient: normalizeName(record.activeIngredient),
    tradeName: normalizeName(record.tradeName),
    manufacturer: normalizeName(record.manufacturer),
    form,
    dosage: [form, dosageValue].filter(Boolean).join(', '),
    dosageValue,
    copayment: parseNumber(record.copayment),
    currency: 'UAH',
    ...parsePackage(record.package),
  };

  return {
    id: createMedicineId(normalized),
    ...normalized,
  };
}

function normalizeRecords(records) {
  return records
    .map(normalizeRecord)
    .filter((record) => record.activeIngredient && record.tradeName);
}

module.exports = {
  normalizeRecords,
  parseNumber,
};
