const fs = require('fs');
const path = require('path');
const { paths } = require('./config');
const { downloadExcel, getSourceFromCli } = require('./download');
const { parseExcel } = require('./parseExcel');
const { normalizeRecords } = require('./normalize');
const { validateMedicines } = require('./validate');
const { readPreviousMedicines, compareMedicines } = require('./compare');
const { generateJson } = require('./generateJson');
const { createReport, writeReport } = require('./report');

function copyLocalExcel(localFile, outputPath) {
  const sourcePath = path.resolve(localFile);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Локальний Excel-файл не знайдено: ${sourcePath}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.copyFileSync(sourcePath, outputPath);

  return {
    sourceUrl: sourcePath,
    resolvedExcelUrl: '',
    outputPath,
    sizeBytes: fs.statSync(outputPath).size,
    contentType: 'local-file',
  };
}

async function updateMedicines() {
  const { sourceUrl, localFile } = getSourceFromCli();

  const downloadInfo = localFile
    ? copyLocalExcel(localFile, paths.downloadedExcel)
    : await downloadExcel({ sourceUrl, outputPath: paths.downloadedExcel });

  const previousRecords = readPreviousMedicines(paths.outputJson);
  const parseInfo = parseExcel(paths.downloadedExcel);
  const normalizedRecords = normalizeRecords(parseInfo.records);
  const validation = validateMedicines(normalizedRecords);
  const comparison = compareMedicines(previousRecords, normalizedRecords);
  const generated = generateJson({
    records: normalizedRecords,
    sourceUrl: downloadInfo.sourceUrl,
    resolvedExcelUrl: downloadInfo.resolvedExcelUrl,
    validation,
  });

  const reportText = createReport({
    metadata: generated.metadata,
    validation,
    comparison,
    parseInfo,
    downloadInfo,
  });
  const reportPath = writeReport(reportText);

  console.log(reportText);
  console.log(`JSON: ${generated.outputJson}`);
  console.log(`Metadata: ${generated.metadataJson}`);
  console.log(`Report: ${reportPath}`);

  if (!validation.isValid) {
    process.exitCode = 1;
  }
}

updateMedicines().catch((error) => {
  console.error(`Помилка оновлення переліку "Доступні ліки": ${error.message}`);
  process.exitCode = 1;
});
