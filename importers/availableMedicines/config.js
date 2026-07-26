const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');

const DEFAULT_SOURCE_URL =
  'https://data.gov.ua/api/3/action/package_show?id=perelik_lik_zasoby_reimburs_moz';

const paths = {
  projectRoot,
  tempDir: path.join(projectRoot, 'tmp', 'availableMedicines'),
  downloadedExcel: path.join(projectRoot, 'tmp', 'availableMedicines', 'source.xlsx'),
  outputJson: path.join(projectRoot, 'data', 'availableMedicines', 'availableMedicines.json'),
  metadataJson: path.join(projectRoot, 'data', 'availableMedicines', 'metadata.json'),
  report: path.join(projectRoot, 'tmp', 'availableMedicines', 'report.txt'),
};

module.exports = {
  DEFAULT_SOURCE_URL,
  paths,
};
