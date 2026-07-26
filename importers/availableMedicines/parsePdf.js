const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getPythonCommand() {
  const bundledPython =
    '/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';

  if (process.env.AVAILABLE_MEDICINES_PYTHON) return process.env.AVAILABLE_MEDICINES_PYTHON;
  if (fs.existsSync(bundledPython)) return bundledPython;

  return 'python3';
}

function parsePdf(filePath) {
  const scriptPath = path.join(__dirname, 'parsePdf.py');

  try {
    const output = execFileSync(getPythonCommand(), [scriptPath, filePath], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 50,
    });

    return {
      sheetName: 'PDF',
      headerRow: 0,
      detectedColumns: {},
      records: JSON.parse(output),
    };
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr) : '';
    throw new Error(
      [
        'Не вдалося прочитати PDF-перелік.',
        'Для PDF-імпорту потрібен Python 3 з бібліотекою pdfplumber.',
        stderr || error.message,
      ].join(' '),
    );
  }
}

module.exports = {
  parsePdf,
};
