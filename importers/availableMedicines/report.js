const fs = require('fs');
const path = require('path');
const { paths } = require('./config');

function formatList(items, formatter, limit = 20) {
  if (!items.length) return 'немає';

  const visible = items.slice(0, limit).map(formatter);
  const rest = items.length > limit ? [`... ще ${items.length - limit}`] : [];
  return [...visible, ...rest].join('\n');
}

function createReport({ metadata, validation, comparison, parseInfo, downloadInfo }) {
  const lines = [
    'Оновлення переліку "Доступні ліки"',
    '',
    validation.isValid ? 'Оновлення завершено' : 'Оновлення завершено з помилками валідації',
    '',
    `Дата імпорту: ${metadata.importedAt}`,
    `Джерело: ${downloadInfo.sourceUrl}`,
    `Excel: ${downloadInfo.resolvedExcelUrl || 'локальний файл'}`,
    `Аркуш Excel: ${parseInfo.sheetName}`,
    `Рядок заголовків: ${parseInfo.headerRow}`,
    '',
    `Всього препаратів: ${metadata.totalMedicines}`,
    `Унікальних МНН: ${metadata.totalActiveIngredients}`,
    `Унікальних виробників: ${metadata.totalManufacturers}`,
    `Без доплати: ${metadata.freeMedicines}`,
    `З доплатою: ${metadata.paidMedicines}`,
    `Помилок: ${validation.errors.length}`,
    `Попереджень: ${validation.warnings.length}`,
    '',
    'Порівняння з попередньою версією:',
    `Нові препарати: ${comparison.added.length}`,
    `Видалені препарати: ${comparison.removed.length}`,
    `Змінені доплати: ${comparison.changedCopayments.length}`,
    `Нові виробники: ${comparison.newManufacturers.length}`,
    '',
    'Нові препарати:',
    formatList(comparison.added, (item) => `- ${item.tradeName} (${item.activeIngredient})`),
    '',
    'Видалені препарати:',
    formatList(comparison.removed, (item) => `- ${item.tradeName} (${item.activeIngredient})`),
    '',
    'Змінені доплати:',
    formatList(
      comparison.changedCopayments,
      (item) => `- ${item.tradeName}: ${item.previousCopayment} -> ${item.nextCopayment}`,
    ),
    '',
    'Помилки:',
    formatList(validation.errors, (issue) => `- рядок ${issue.row || '?'}: ${issue.message}`),
    '',
    'Попередження:',
    formatList(validation.warnings, (issue) => `- рядок ${issue.row || '?'}: ${issue.message}`),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function writeReport(reportText, reportPath = paths.report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportText);
  return reportPath;
}

module.exports = {
  createReport,
  writeReport,
};
