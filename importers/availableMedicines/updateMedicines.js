const fs = require('fs');
const path = require('path');
const {
  DEFAULT_SOURCE_NAME,
  DEFAULT_SOURCE_URL,
  DEFAULT_VALID_AS_OF,
  paths,
} = require('./config');
const { downloadExcel, getSourceFromCli } = require('./download');
const { parseExcel } = require('./parseExcel');
const { parsePdf } = require('./parsePdf');
const { createMedicineId, normalizeRecords } = require('./normalize');
const { validateMedicines } = require('./validate');
const { readPreviousMedicines, compareMedicines } = require('./compare');
const { generateJson } = require('./generateJson');
const { createReport, writeReport } = require('./report');

function copyLocalExcel(localFile, outputPath) {
  const sourcePath = path.resolve(localFile);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Локальний Excel-файл не знайдено: ${sourcePath}`);
  }

  const sourceType = sourcePath.toLocaleLowerCase().endsWith('.pdf') ? 'pdf' : 'excel';
  const finalOutputPath = sourceType === 'pdf' ? paths.downloadedPdf : outputPath;

  fs.mkdirSync(path.dirname(finalOutputPath), { recursive: true });
  fs.copyFileSync(sourcePath, finalOutputPath);

  return {
    sourceUrl: sourcePath,
    resolvedExcelUrl: '',
    outputPath: finalOutputPath,
    sourceType,
    sizeBytes: fs.statSync(finalOutputPath).size,
    contentType: 'local-file',
  };
}

function readSupplementalMedicines(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(records)) {
    throw new Error(`Додатковий перелік має бути масивом: ${filePath}`);
  }

  return records.map((record) => ({
    ...record,
    id: createMedicineId(record),
  }));
}

function mergeUniqueMedicines(primaryRecords, supplementalRecords) {
  const merged = new Map();
  [...primaryRecords, ...supplementalRecords].forEach((record) => {
    if (!merged.has(record.id)) merged.set(record.id, record);
  });
  return [...merged.values()];
}

async function updateMedicines() {
  const { sourceUrl, localFile } = getSourceFromCli();

  const downloadInfo = localFile
    ? copyLocalExcel(localFile, paths.downloadedExcel)
    : await downloadExcel({ sourceUrl, outputPath: paths.downloadedExcel });

  const previousRecords = readPreviousMedicines(paths.outputJson);
  const parseInfo =
    downloadInfo.sourceType === 'pdf'
      ? parsePdf(downloadInfo.outputPath)
      : parseExcel(downloadInfo.outputPath);
  const primaryRecords = normalizeRecords(parseInfo.records);
  const supplementalRecords = readSupplementalMedicines(paths.supplementalJson);
  const normalizedRecords = mergeUniqueMedicines(primaryRecords, supplementalRecords);
  const validation = validateMedicines(normalizedRecords);
  const comparison = compareMedicines(previousRecords, normalizedRecords);
  const generated = generateJson({
    records: normalizedRecords,
    sourceUrl: DEFAULT_SOURCE_URL,
    resolvedExcelUrl: downloadInfo.resolvedExcelUrl,
    sourceType: downloadInfo.sourceType,
    sourceName: DEFAULT_SOURCE_NAME,
    validAsOf: DEFAULT_VALID_AS_OF,
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
