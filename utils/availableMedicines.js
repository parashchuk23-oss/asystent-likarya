export const COPAYMENT_FILTERS = {
  all: 'all',
  free: 'free',
  paid: 'paid',
};

export const MEDICINE_SORTS = {
  default: 'default',
  copaymentAsc: 'copaymentAsc',
  copaymentDesc: 'copaymentDesc',
  activeIngredient: 'activeIngredient',
  tradeName: 'tradeName',
};

export function normalizeMedicineSearchValue(value) {
  return String(value || '')
    .toLocaleLowerCase('uk-UA')
    .replace(/№\s*/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeMedicineSearchToken(token) {
  if (token.startsWith('таблет')) return 'таблет';
  if (token.startsWith('капсул')) return 'капсул';
  if (token.startsWith('флакон')) return 'флакон';
  if (token.startsWith('ампул')) return 'ампул';
  if (token.startsWith('доз')) return 'доз';
  if (token.startsWith('шприц')) return 'шприц';
  if (token.startsWith('пакет')) return 'пакет';
  return token;
}

function getMedicineSearchTokens(value) {
  const normalizedValue = normalizeMedicineSearchValue(value);
  if (!normalizedValue) return [];
  return normalizedValue.split(' ').map(normalizeMedicineSearchToken).filter(Boolean);
}

function getMedicineSearchDocument(medicine) {
  return getMedicineSearchTokens([
    medicine.activeIngredient,
    medicine.tradeName,
    medicine.manufacturer,
    medicine.form,
    medicine.dosage,
    medicine.dosageValue,
    medicine.packageQuantity,
    medicine.packageUnit,
    medicine.packageDescription,
  ].filter((value) => value !== null && value !== undefined).join(' '));
}

export function normalizeMedicineRecord(record) {
  return {
    id: record.id,
    activeIngredient: record.activeIngredient || '',
    tradeName: record.tradeName || '',
    manufacturer: record.manufacturer || '',
    form: record.form || '',
    dosage: record.dosage || '',
    dosageValue: record.dosageValue || '',
    packageQuantity: record.packageQuantity ?? null,
    packageUnit: record.packageUnit || '',
    packageDescription: record.packageDescription || '',
    copayment: typeof record.copayment === 'number' ? record.copayment : null,
    currency: record.currency || 'UAH',
  };
}

export function normalizeMedicines(records) {
  if (!Array.isArray(records)) return [];
  return records.filter(Boolean).map(normalizeMedicineRecord).filter((record) => record.id);
}

export function formatPackageQuantity(medicine) {
  if (medicine.packageQuantity === null || medicine.packageQuantity === undefined || !medicine.packageUnit) {
    return medicine.packageDescription || 'Немає даних';
  }

  return `${medicine.packageQuantity} ${medicine.packageUnit}`;
}

export function formatCopayment(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'Немає даних';
  if (Number(value) === 0) return 'Без доплати';

  return `${Number(value).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} грн`;
}

export function normalizeTabletkiSearchQuery(value) {
  return String(value || '')
    .replace(/[®™]/g, '')
    .replace(/\s*\([^)]*[A-Za-z][^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildTabletkiSearchUrl(medicine) {
  const tradeName = normalizeTabletkiSearchQuery(medicine?.tradeName);
  const activeIngredient = normalizeTabletkiSearchQuery(medicine?.activeIngredient);
  const query = tradeName || activeIngredient;

  if (!query) return 'https://tabletki.ua/uk/';

  return `https://tabletki.ua/uk/search/${encodeURIComponent(query)}/`;
}

export function filterMedicines(medicines, query, copaymentFilter) {
  const queryTokens = getMedicineSearchTokens(query);

  return medicines.filter((medicine) => {
    const medicineTokens = getMedicineSearchDocument(medicine);
    const matchesQuery = queryTokens.length === 0 || queryTokens.every((queryToken) =>
      medicineTokens.some((medicineToken) => (
        /^\d+$/.test(queryToken)
          ? medicineToken === queryToken
          : medicineToken.includes(queryToken)
      )),
    );

    if (!matchesQuery) return false;

    if (copaymentFilter === COPAYMENT_FILTERS.free) return medicine.copayment === 0;
    if (copaymentFilter === COPAYMENT_FILTERS.paid) return typeof medicine.copayment === 'number' && medicine.copayment > 0;

    return true;
  });
}

function compareText(first, second) {
  return String(first || '').localeCompare(String(second || ''), 'uk-UA', { sensitivity: 'base' });
}

function compareCopayment(first, second, direction = 'asc') {
  const firstValue = typeof first.copayment === 'number' ? first.copayment : Number.POSITIVE_INFINITY;
  const secondValue = typeof second.copayment === 'number' ? second.copayment : Number.POSITIVE_INFINITY;
  const result = firstValue - secondValue;
  return direction === 'desc' ? -result : result;
}

export function sortMedicines(medicines, sortMode) {
  return [...medicines].sort((first, second) => {
    if (sortMode === MEDICINE_SORTS.default) {
      return compareText(first.activeIngredient, second.activeIngredient) || compareText(first.tradeName, second.tradeName);
    }

    if (sortMode === MEDICINE_SORTS.copaymentAsc) {
      return compareCopayment(first, second, 'asc') || compareText(first.tradeName, second.tradeName);
    }

    if (sortMode === MEDICINE_SORTS.copaymentDesc) {
      return compareCopayment(first, second, 'desc') || compareText(first.tradeName, second.tradeName);
    }

    if (sortMode === MEDICINE_SORTS.activeIngredient) {
      return compareText(first.activeIngredient, second.activeIngredient) || compareText(first.tradeName, second.tradeName);
    }

    if (sortMode === MEDICINE_SORTS.tradeName) {
      return compareText(first.tradeName, second.tradeName) || compareText(first.activeIngredient, second.activeIngredient);
    }

    return compareText(first.activeIngredient, second.activeIngredient) || compareText(first.tradeName, second.tradeName);
  });
}

export function paginateMedicines(medicines, page, rowsPerPage) {
  const safeRowsPerPage = Number(rowsPerPage) || 50;
  const totalPages = Math.max(1, Math.ceil(medicines.length / safeRowsPerPage));
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (safePage - 1) * safeRowsPerPage;
  const endIndex = startIndex + safeRowsPerPage;

  return {
    page: safePage,
    totalPages,
    startIndex,
    endIndex,
    items: medicines.slice(startIndex, endIndex),
  };
}
