const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

const DEFAULT_SOURCE_URL =
  'https://backend.nszu.gov.ua/storage/application/26/09/09/XXN4AcmawrUclW9f1gwcr8KeDD5DJqPOvBE9bIzD.pdf';
const DEFAULT_SOURCE_NAME = 'Накази НСЗУ №491 від 09.09.2026 та №361 від 13.07.2026';
const DEFAULT_VALID_AS_OF = '2026-09-30';

const paths = {
  projectRoot,
  tempDir: path.join(projectRoot, 'tmp', 'availableMedicines'),
  downloadedExcel: path.join(projectRoot, 'tmp', 'availableMedicines', 'source.xlsx'),
  downloadedPdf: path.join(projectRoot, 'tmp', 'availableMedicines', 'source.pdf'),
  outputJson: path.join(projectRoot, 'data', 'availableMedicines', 'availableMedicines.json'),
  metadataJson: path.join(projectRoot, 'data', 'availableMedicines', 'metadata.json'),
  supplementalJson: path.join(projectRoot, 'data', 'availableMedicines', 'supplementalMedicines.json'),
  report: path.join(projectRoot, 'tmp', 'availableMedicines', 'report.txt'),
};

module.exports = {
  DEFAULT_SOURCE_URL,
  DEFAULT_SOURCE_NAME,
  DEFAULT_VALID_AS_OF,
  paths,
};
