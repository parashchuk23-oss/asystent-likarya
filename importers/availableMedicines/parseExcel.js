const xlsx = require('xlsx');

const columnAliases = {
  activeIngredient: [
    'мнн',
    'міжнародна непатентована назва',
    'міжнародна непатентована назва лікарського засобу',
    'діюча речовина',
    'назва діючої речовини',
  ],
  tradeName: [
    'торгова назва',
    'торговельна назва',
    'найменування лікарського засобу',
    'назва лікарського засобу',
  ],
  manufacturer: [
    'виробник',
    'виробника',
    'найменування виробника',
    'найменування виробника країни',
    'заявник',
    'виробник лікарського засобу',
  ],
  form: ['форма випуску', 'лікарська форма', 'форма випуску первинна упаковка'],
  dosage: ['дозування', 'сила дії', 'доза', 'форма випуску та дозування'],
  package: [
    'кількість в упаковці',
    'кількість одиниць лікарського засобу у споживчій упаковці',
    'кількість одиниць лікарського засобу в упаковці',
    'кількість одиниць лікарського засобу у споживчій упаковці',
    'кількість мо в первинній упаковці',
    'кількість одиниць в упаковці',
    'споживчій упаковці',
    'первинній упаковці',
    'упаковка',
  ],
  copayment: [
    'сума доплати',
    'сума доплати за упаковку',
    'розмір доплати',
    'доплата',
    'сума доплати за упаковку',
    'роздрібна ціна за упаковку лікарського засобу з урахуванням референтних цін',
  ],
};

function normalizeHeader(value) {
  return String(value || '')
    .toLocaleLowerCase('uk-UA')
    .replace(/\s+/g, ' ')
    .replace(/[№:;,.()]/g, '')
    .trim();
}

function getCellText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function findFieldForHeader(header) {
  const normalizedHeader = normalizeHeader(header);

  return Object.entries(columnAliases).find(([, aliases]) =>
    aliases.some((alias) => {
      const normalizedAlias = normalizeHeader(alias);
      return normalizedHeader === normalizedAlias || normalizedHeader.includes(normalizedAlias);
    }),
  )?.[0];
}

function detectColumnsInRow(row) {
  const columns = {};
  row.forEach((cell, cellIndex) => {
    const field = findFieldForHeader(cell);
    if (field && columns[field] === undefined) columns[field] = cellIndex;
  });

  return columns;
}

function getColumnScore(columns) {
  return Object.keys(columns).length;
}

function detectHeaderRow(rows) {
  let bestMatch = { index: -1, columns: {}, score: 0 };

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const columns = detectColumnsInRow(row);
    const score = getColumnScore(columns);
    const firstCell = normalizeHeader(row[0]);
    const isMainHeader = firstCell.includes('порядковий номер');

    if (isMainHeader && score >= 5) {
      return { index: rowIndex, columns, score };
    }

    if (score > bestMatch.score || (score === bestMatch.score && bestMatch.index === -1)) {
      bestMatch = { index: rowIndex, columns, score };
    }
  }

  if (bestMatch.score < 3) {
    throw new Error('Не вдалося автоматично визначити заголовки таблиці в Excel.');
  }

  return bestMatch;
}

function isNumberingRow(record) {
  return record.activeIngredient === '2' && record.tradeName === '3';
}

function isRepeatedHeaderRow(record) {
  return Boolean(findFieldForHeader(record.activeIngredient) || findFieldForHeader(record.tradeName));
}

function worksheetToRows(worksheet) {
  return xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: false,
  });
}

function findMainWorksheet(workbook) {
  const candidates = workbook.SheetNames.map((sheetName) => {
    const rows = worksheetToRows(workbook.Sheets[sheetName]);
    return { sheetName, rows, rowCount: rows.length };
  }).filter((candidate) => candidate.rowCount > 0);

  if (!candidates.length) throw new Error('Excel-файл не містить таблиць.');

  return candidates.sort((first, second) => second.rowCount - first.rowCount)[0];
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const { sheetName, rows } = findMainWorksheet(workbook);
  const header = detectHeaderRow(rows);
  let activeColumns = header.columns;
  const records = [];

  for (let rowIndex = header.index + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const nextColumns = detectColumnsInRow(row);

    if (getColumnScore(nextColumns) >= 5) {
      activeColumns = nextColumns;
      continue;
    }

    const record = {
      sourceRow: rowIndex + 1,
      activeIngredient: getCellText(row[activeColumns.activeIngredient]),
      tradeName: getCellText(row[activeColumns.tradeName]),
      manufacturer: getCellText(row[activeColumns.manufacturer]),
      form: getCellText(row[activeColumns.form]),
      dosage: getCellText(row[activeColumns.dosage]),
      package: getCellText(row[activeColumns.package]),
      copayment: getCellText(row[activeColumns.copayment]),
    };

    if (isNumberingRow(record) || isRepeatedHeaderRow(record)) continue;
    records.push(record);
  }

  return {
    sheetName,
    headerRow: header.index + 1,
    detectedColumns: header.columns,
    records,
  };
}

module.exports = {
  parseExcel,
};
