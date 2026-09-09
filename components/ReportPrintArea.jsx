'use client';

import PrintArea from './PrintArea';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function printSectionHtml(title, value) {
  if (!value?.trim()) return '';

  return `
    <section class="report-section">
      <h2>${escapeHtml(title)}</h2>
      <div class="preserve-lines">${escapeHtml(value)}</div>
    </section>
  `;
}

export function printReportDocument({
  title,
  overviewTitle = 'Опис',
  overview,
  conclusion,
  recommendations,
}) {
  if (typeof document === 'undefined') return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  const printDocument = iframe.contentWindow?.document;
  if (!printDocument) {
    document.body.removeChild(iframe);
    window.alert('Не вдалося підготувати протокол до друку. Спробуйте скопіювати текст і надрукувати вручну.');
    return;
  }

  printDocument.open();
  printDocument.write(`<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm; }
    body {
      color: #0f172a;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 11px;
      line-height: 1.35;
    }
    .header {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .brand {
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      margin: 4px 0 0;
      font-size: 20px;
      font-weight: 800;
    }
    .report-section {
      break-inside: avoid;
      border-top: 1px solid #e2e8f0;
      padding: 10px 0;
    }
    .report-section h2 {
      margin: 0 0 6px;
      font-size: 13px;
      font-weight: 800;
    }
    .preserve-lines {
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Асистент лікаря</div>
    <h1>${escapeHtml(title)}</h1>
  </div>
  ${printSectionHtml(overviewTitle, overview)}
  ${printSectionHtml('Висновок', conclusion)}
  ${printSectionHtml('Рекомендації', recommendations)}
</body>
</html>`);
  printDocument.close();

  window.setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
}

function ReportSection({ title, value }) {
  if (!value?.trim()) return null;

  return (
    <section className="print-report-section">
      <h2>{title}</h2>
      <div className="print-preserve-lines">{value}</div>
    </section>
  );
}

export default function ReportPrintArea({
  title,
  overviewTitle = 'Опис',
  overview,
  conclusion,
  recommendations,
}) {
  return (
    <PrintArea className="report-print-area">
      <div className="print-header">
        <p className="print-brand">Асистент лікаря</p>
        <h1>{title}</h1>
      </div>

      <ReportSection title={overviewTitle} value={overview} />
      <ReportSection title="Висновок" value={conclusion} />
      <ReportSection title="Рекомендації" value={recommendations} />
    </PrintArea>
  );
}
