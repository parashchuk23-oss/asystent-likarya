const fs = require('fs');
const path = require('path');
const { paths } = require('./config');
const { downloadExcel, getSourceFromCli } = require('./download');
const { parseExcel } = require('./parseExcel');
const { parsePdf } = require('./parsePdf');
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
  const normalizedRecords = normalizeRecords(parseInfo.records);
  const validation = validateMedicines(normalizedRecords);
  const comparison = compareMedicines(previousRecords, normalizedRecords);
  const generated = generateJson({
    records: normalizedRecords,
    sourceUrl: downloadInfo.sourceUrl,
    resolvedExcelUrl: downloadInfo.resolvedExcelUrl,
    sourceType: downloadInfo.sourceType,
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
