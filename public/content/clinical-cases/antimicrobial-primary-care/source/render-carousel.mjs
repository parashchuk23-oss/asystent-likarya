import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = new URL('../../../../../', import.meta.url).pathname;
const sourceDirectory = `${root}public/content/clinical-cases/antimicrobial-primary-care/source/`;
const outputDirectory = `${root}public/content/clinical-cases/antimicrobial-primary-care/`;
const canvas = { width: 1080, height: 1080 };
const screenshotWindow = { left: 72, top: 300, width: 936, height: 665, padding: 14, radius: 24 };
const inner = {
  left: screenshotWindow.left + screenshotWindow.padding,
  top: screenshotWindow.top + screenshotWindow.padding,
  width: screenshotWindow.width - screenshotWindow.padding * 2,
  height: screenshotWindow.height - screenshotWindow.padding * 2,
};

const slides = [
  {
    output: '01-open-pharmacology.png', source: '01-home.png',
    title: 'Відкриваємо розділ «Препарати»',
    subtitle: 'Перший крок до клінічного навігатора антимікробної терапії',
    crop: { left: 0, top: 0, width: 1440, height: 1010 }, fit: 'cover',
  },
  {
    output: '02-open-antimicrobial.png', source: '02-pharmacology.png',
    title: 'Обираємо «Антимікробна терапія»',
    subtitle: 'Клінічні стани, антибіотики, AWaRe та загальні правила — в одному модулі',
    crop: { left: 0, top: 0, width: 1440, height: 1010 }, fit: 'cover',
  },
  {
    output: '03-find-condition.png', source: '03-antimicrobial.png',
    title: 'Знаходимо потрібний клінічний стан',
    subtitle: 'Пошук серед 15 амбулаторних карток без перегляду довгих таблиць',
    crop: { left: 0, top: 0, width: 1440, height: 1010 }, fit: 'cover',
  },
  {
    output: '04-pharyngitis-assessment.png', source: '04-pharyngitis-top.png',
    title: 'Фарингіт: спочатку оцінюємо причину',
    subtitle: 'EBV, дифтерія та Centor/McIsaac — до рішення про антибіотик',
    crop: { left: 120, top: 400, width: 1200, height: 700 }, fit: 'contain',
  },
  {
    output: '05-pharyngitis-treatment.png', source: '05-pharyngitis-treatment.png',
    title: 'Фарингіт: режим, тривалість і безпека',
    subtitle: 'Перша лінія, альтернатива, повторна оцінка та пряме посилання на протокол',
    crop: { left: 140, top: 150, width: 1160, height: 540 }, fit: 'contain',
  },
  {
    output: '06-pneumonia-assessment.png', source: '06-pneumonia-assessment.png',
    title: 'Пневмонія: оцінюємо тяжкість',
    subtitle: 'Клінічні критерії та CRB-65 допомагають визначити безпечний маршрут',
    crop: { left: 120, top: 400, width: 1200, height: 700 }, fit: 'contain',
  },
  {
    output: '07-pneumonia-treatment.png', source: '07-pneumonia-treatment.png',
    title: 'Пневмонія: перша лінія та альтернативи',
    subtitle: 'Дози, алергія на пеніцилін, вагітність і контроль через 48–72 години',
    crop: { left: 140, top: 300, width: 1160, height: 680 }, fit: 'contain',
  },
  {
    output: '08-safety-and-sources.png', source: '08-pneumonia-safety-source.png',
    title: 'Безпека та джерела залишаються видимими',
    subtitle: 'МОЗ №1328, дитячий протокол і застереження — без автоматичного призначення',
    crop: { left: 120, top: 30, width: 1200, height: 700 }, fit: 'contain',
  },
];

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function wrapWords(value, maxCharacters) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(lines, x, firstY, lineHeight) {
  return lines.map((line, index) => `<tspan x="${x}" y="${firstY + index * lineHeight}">${escapeXml(line)}</tspan>`).join('');
}

function frameSvg(title, subtitle, index) {
  const titleLines = wrapWords(title, 38).slice(0, 2);
  const subtitleLines = wrapWords(subtitle, 74).slice(0, 2);
  const subtitleY = titleLines.length === 1 ? 202 : 246;
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" font-family="Arial, Helvetica, sans-serif">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0F172A" flood-opacity="0.13"/></filter>
      </defs>
      <rect width="1080" height="1080" fill="#F8FAFC"/>
      <rect x="72" y="52" width="72" height="5" rx="2.5" fill="#14B8A6"/>
      <text font-size="45" font-weight="800" fill="#0F172A">${textLines(titleLines, 72, 116, 52)}</text>
      <text font-size="23" font-weight="500" fill="#475569">${textLines(subtitleLines, 72, subtitleY, 30)}</text>
      <rect x="${screenshotWindow.left}" y="${screenshotWindow.top}" width="${screenshotWindow.width}" height="${screenshotWindow.height}" rx="${screenshotWindow.radius}" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" filter="url(#shadow)"/>
      <rect x="72" y="1018" width="936" height="2" rx="1" fill="#14B8A6" opacity="0.45"/>
      <text x="72" y="1054" font-size="18" font-weight="700" fill="#0F172A">Асистент лікаря</text>
      <text x="540" y="1054" text-anchor="middle" font-size="18" font-weight="600" fill="#64748B">Антимікробна терапія</text>
      <text x="1008" y="1054" text-anchor="end" font-size="18" font-weight="700" fill="#0F172A">${index + 1}/8</text>
    </svg>`);
}

function highlightSvg(highlight, crop, fit) {
  const scale = fit === 'cover'
    ? Math.max(inner.width / crop.width, inner.height / crop.height)
    : Math.min(inner.width / crop.width, inner.height / crop.height);
  const renderedWidth = crop.width * scale;
  const renderedHeight = crop.height * scale;
  const offsetX = inner.left + (inner.width - renderedWidth) / 2;
  const offsetY = inner.top + (inner.height - renderedHeight) / 2;
  const visibleLeft = Math.max(highlight.x, crop.left);
  const visibleTop = Math.max(highlight.y, crop.top);
  const visibleRight = Math.min(highlight.x + highlight.width, crop.left + crop.width);
  const visibleBottom = Math.min(highlight.y + highlight.height, crop.top + crop.height);
  const x = Math.max(inner.left + 4, offsetX + (visibleLeft - crop.left) * scale);
  const y = Math.max(inner.top + 4, offsetY + (visibleTop - crop.top) * scale);
  const width = Math.min((visibleRight - visibleLeft) * scale, inner.left + inner.width - x - 4);
  const height = Math.min((visibleBottom - visibleTop) * scale, inner.top + inner.height - y - 4);
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080">
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(0, width).toFixed(1)}" height="${Math.max(0, height).toFixed(1)}" rx="13" fill="none" stroke="#0D9488" stroke-width="7"/>
    </svg>`);
}

await mkdir(outputDirectory, { recursive: true });
const metadata = JSON.parse(await readFile(`${sourceDirectory}capture-metadata.json`, 'utf8'));
const captures = new Map(metadata.captures.map((capture) => [capture.filename, capture]));
const provenance = [];

for (let index = 0; index < slides.length; index += 1) {
  const slide = slides[index];
  const capture = captures.get(slide.source);
  const screenshot = await sharp(`${sourceDirectory}${slide.source}`)
    .extract(slide.crop)
    .resize(inner.width, inner.height, { fit: slide.fit, position: 'centre', background: '#FFFFFF' })
    .png()
    .toBuffer();
  await sharp(frameSvg(slide.title, slide.subtitle, index))
    .composite([
      { input: screenshot, left: inner.left, top: inner.top },
      { input: highlightSvg(capture.highlight, slide.crop, slide.fit), left: 0, top: 0 },
    ])
    .png()
    .toFile(`${outputDirectory}${slide.output}`);
  provenance.push({
    output: slide.output,
    source: `source/${slide.source}`,
    sourceUrl: metadata.productionUrl,
    viewport: metadata.viewport,
    crop: slide.crop,
    fit: `proportional crop and ${slide.fit}`,
    screenshotWindow,
    highlightSourceCoordinates: capture.highlight,
  });
}

const contactComposites = [];
for (let index = 0; index < slides.length; index += 1) {
  const thumbnail = await sharp(`${outputDirectory}${slides[index].output}`).resize(500, 500).png().toBuffer();
  contactComposites.push({ input: thumbnail, left: 10 + (index % 4) * 515, top: 10 + Math.floor(index / 4) * 515 });
}
await sharp({ create: { width: 2070, height: 1040, channels: 4, background: '#E2E8F0' } })
  .composite(contactComposites).png().toFile(`${outputDirectory}contact-sheet.png`);

const mobileComposites = [];
for (let index = 0; index < slides.length; index += 1) {
  const preview = await sharp(`${outputDirectory}${slides[index].output}`).resize(375, 375).png().toBuffer();
  mobileComposites.push({ input: preview, left: 0, top: index * 387 });
}
await sharp({ create: { width: 375, height: slides.length * 375 + (slides.length - 1) * 12, channels: 4, background: '#E2E8F0' } })
  .composite(mobileComposites).png().toFile(`${outputDirectory}preview-mobile-375.png`);

await writeFile(`${outputDirectory}provenance.json`, `${JSON.stringify({
  createdAt: new Date().toISOString(),
  productionUrl: metadata.productionUrl,
  scenario: 'Препарати → Антимікробна терапія → гострий тонзиліт/фарингіт та позагоспітальна пневмонія',
  slides: provenance,
}, null, 2)}\n`);

console.log(`Created ${slides.length} slides, contact sheet, mobile preview and provenance.`);
