const fs = require('fs');
const path = require('path');
const { DEFAULT_SOURCE_URL, paths } = require('./config');

function parseCliValue(argv, name) {
  const prefix = `--${name}=`;
  const match = argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : '';
}

function isExcelUrl(url) {
  return /\.(xlsx|xls)(\?|#|$)/i.test(url);
}

function isPdfUrl(url) {
  return /\.pdf(\?|#|$)/i.test(url);
}

function isJsonApiUrl(url) {
  return /\/api\/3\/action\/package_show/i.test(url);
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function findExcelUrlFromHtml(html, pageUrl) {
  const links = [...html.matchAll(/href=["']([^"']+\.(?:xlsx|xls)(?:[^"']*)?)["']/gi)]
    .map((match) => decodeHtml(match[1]))
    .map((href) => new URL(href, pageUrl).toString());

  if (!links.length) {
    throw new Error('На сторінці джерела не знайдено посилання на Excel-файл.');
  }

  return links[0];
}

function getResourceDate(resource) {
  const value = resource.last_modified || resource.metadata_modified || resource.created || '';
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

async function findExcelUrlFromDataGovApi(apiUrl) {
  const response = await fetch(apiUrl, {
    headers: {
      accept: 'application/json',
      'user-agent': 'asystent-likarya-data-importer/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Не вдалося отримати metadata data.gov.ua: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const resources = payload?.result?.resources || [];
  const excelResources = resources
    .filter((resource) => /\.(xlsx|xls)(\?|#|$)/i.test(resource.url || '') || /xlsx|xls|excel/i.test(resource.format || ''))
    .filter((resource) => resource.url)
    .sort((first, second) => getResourceDate(second) - getResourceDate(first));

  if (!excelResources.length) {
    throw new Error('У metadata data.gov.ua не знайдено XLSX/XLS ресурсу.');
  }

  return excelResources[0].url;
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'asystent-likarya-data-importer/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити джерело: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    contentType: response.headers.get('content-type') || '',
    finalUrl: response.url || url,
  };
}

async function resolveExcelSource(sourceUrl) {
  if (isPdfUrl(sourceUrl)) return sourceUrl;
  if (isExcelUrl(sourceUrl)) return sourceUrl;
  if (isJsonApiUrl(sourceUrl)) return findExcelUrlFromDataGovApi(sourceUrl);

  const page = await fetchBuffer(sourceUrl);
  const html = page.buffer.toString('utf8');
  return findExcelUrlFromHtml(html, page.finalUrl);
}

async function downloadExcel({ sourceUrl = DEFAULT_SOURCE_URL, outputPath = paths.downloadedExcel } = {}) {
  const resolvedExcelUrl = await resolveExcelSource(sourceUrl);
  const excel = await fetchBuffer(resolvedExcelUrl);
  const sourceType = isPdfUrl(resolvedExcelUrl) ? 'pdf' : 'excel';
  const finalOutputPath = sourceType === 'pdf' ? paths.downloadedPdf : outputPath;

  fs.mkdirSync(path.dirname(finalOutputPath), { recursive: true });
  fs.writeFileSync(finalOutputPath, excel.buffer);

  return {
    sourceUrl,
    resolvedExcelUrl,
    outputPath: finalOutputPath,
    sourceType,
    sizeBytes: excel.buffer.length,
    contentType: excel.contentType,
  };
}

function getSourceFromCli(argv = process.argv.slice(2)) {
  return {
    sourceUrl: parseCliValue(argv, 'source') || process.env.AVAILABLE_MEDICINES_SOURCE_URL || DEFAULT_SOURCE_URL,
    localFile: parseCliValue(argv, 'file') || process.env.AVAILABLE_MEDICINES_LOCAL_FILE || '',
  };
}

module.exports = {
  downloadExcel,
  getSourceFromCli,
};
