const fs = require('fs');
const path = require('path');
const { paths } = require('./config');

function sortForOutput(records) {
  return [...records].sort((first, second) => {
    const firstCopayment = typeof first.copayment === 'number' ? first.copayment : Number.POSITIVE_INFINITY;
    const secondCopayment = typeof second.copayment === 'number' ? second.copayment : Number.POSITIVE_INFINITY;

    return (
      firstCopayment - secondCopayment ||
      first.tradeName.localeCompare(second.tradeName, 'uk-UA', { sensitivity: 'base' }) ||
      first.activeIngredient.localeCompare(second.activeIngredient, 'uk-UA', { sensitivity: 'base' })
    );
  });
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function createMetadata({ sourceUrl, resolvedExcelUrl, records, validation, version }) {
  const manufacturers = new Set(records.map((record) => record.manufacturer).filter(Boolean));
  const activeIngredients = new Set(records.map((record) => record.activeIngredient).filter(Boolean));

  return {
    title: 'Доступні ліки',
    version,
    importedAt: new Date().toISOString(),
    validAsOf: new Date().toISOString().slice(0, 10),
    sourceName: 'Офіційний набір відкритих даних МОЗ України',
    sourceUrl,
    resolvedExcelUrl,
    totalMedicines: records.length,
    totalManufacturers: manufacturers.size,
    totalActiveIngredients: activeIngredients.size,
    freeMedicines: records.filter((record) => record.copayment === 0).length,
    paidMedicines: records.filter((record) => typeof record.copayment === 'number' && record.copayment > 0).length,
    validationErrors: validation.errors.length,
    validationWarnings: validation.warnings.length,
  };
}

function generateJson({ records, sourceUrl, resolvedExcelUrl, validation, outputJson = paths.outputJson, metadataJson = paths.metadataJson }) {
  const outputRecords = sortForOutput(records);
  const version = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
  const metadata = createMetadata({
    sourceUrl,
    resolvedExcelUrl,
    records: outputRecords,
    validation,
    version,
  });

  writeJson(outputJson, outputRecords);
  writeJson(metadataJson, metadata);

  return {
    outputJson,
    metadataJson,
    metadata,
  };
}

module.exports = {
  generateJson,
};
