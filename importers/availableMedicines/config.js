const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

const DEFAULT_SOURCE_URL =
  'https://backend.nszu.gov.ua/storage/application/26/07/17/frQ9Y5u4749wdh2MgAlOVpCal9fJtf9utTFWmCku.pdf';

const paths = {
  projectRoot,
  tempDir: path.join(projectRoot, 'tmp', 'availableMedicines'),
  downloadedExcel: path.join(projectRoot, 'tmp', 'availableMedicines', 'source.xlsx'),
  downloadedPdf: path.join(projectRoot, 'tmp', 'availableMedicines', 'source.pdf'),
  outputJson: path.join(projectRoot, 'data', 'availableMedicines', 'availableMedicines.json'),
  metadataJson: path.join(projectRoot, 'data', 'availableMedicines', 'metadata.json'),
  report: path.join(projectRoot, 'tmp', 'availableMedicines', 'report.txt'),
};

module.exports = {
  DEFAULT_SOURCE_URL,
  paths,
};
