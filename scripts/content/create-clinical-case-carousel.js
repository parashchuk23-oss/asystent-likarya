#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "../..");
const configPath = path.resolve(process.argv[2] || path.join(projectRoot, "public/content/clinical-cases/score2/source/case-config.json"));
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const sourceDir = path.dirname(configPath);
const outputDir = path.resolve(projectRoot, config.outputDirectory);
const layout = config.layout;
const screenshotWindow = layout.screenshotWindow;
const screenshotTarget = {
  left: screenshotWindow.left + screenshotWindow.padding,
  top: screenshotWindow.top + screenshotWindow.padding,
  width: screenshotWindow.width - screenshotWindow.padding * 2,
  height: screenshotWindow.height - screenshotWindow.padding * 2,
};

const palette = {
  navy: "#0F172A",
  teal: "#14B8A6",
  sky: "#38BDF8",
  ink: "#334155",
  muted: "#64748B",
  line: "#CBD5E1",
  surface: "#F8FAFC",
  white: "#FFFFFF",
};

const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(lines, x, y, fontSize, lineHeight, attrs = "") {
  return lines.map((line, index) => (
    `<text x="${x}" y="${y + index * lineHeight}" font-size="${fontSize}" ${attrs}>${esc(line)}</text>`
  )).join("");
}

function frameSvg(slide) {
  const titleLines = wrap(slide.title, slide.titleWrap || 27);
  const subtitleLines = slide.subtitle ? wrap(slide.subtitle, slide.subtitleWrap || 52) : [];
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" font-family="Arial, Helvetica, sans-serif">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F8FAFC"/>
          <stop offset="1" stop-color="#ECFEFF"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#0F172A" flood-opacity="0.13"/>
        </filter>
      </defs>
      <rect width="1080" height="1080" fill="url(#bg)"/>
      <circle cx="42" cy="1030" r="210" fill="#38BDF8" opacity="0.06"/>
      <rect x="72" y="54" width="72" height="5" rx="2.5" fill="#14B8A6"/>
      ${textLines(titleLines, layout.titleX, layout.titleY, slide.titleSize || 48, slide.titleLineHeight || 54, 'font-weight="800" fill="#0F172A"')}
      ${textLines(subtitleLines, layout.subtitleX, layout.subtitleY, 24, 31, 'font-weight="500" fill="#475569"')}
      <rect x="${screenshotWindow.left}" y="${screenshotWindow.top}" width="${screenshotWindow.width}" height="${screenshotWindow.height}" rx="${screenshotWindow.radius}" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" filter="url(#shadow)"/>
      <rect x="72" y="1018" width="936" height="2" rx="1" fill="#14B8A6" opacity="0.45"/>
      <text x="72" y="1054" font-size="18" font-weight="700" fill="#0F172A">Асистент лікаря</text>
      <text x="1008" y="1054" text-anchor="end" font-size="18" font-weight="600" fill="#64748B">${esc(slide.tool || config.tool)}</text>
    </svg>
  `);
}

function coverSvg(slide) {
  const titleLines = wrap(slide.title, 23);
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" font-family="Arial, Helvetica, sans-serif">
      <defs>
        <linearGradient id="cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F8FAFC"/>
          <stop offset="0.68" stop-color="#F0FDFA"/>
          <stop offset="1" stop-color="#E0F2FE"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="22" stdDeviation="30" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="1080" height="1080" fill="url(#cover)"/>
      <circle cx="936" cy="132" r="280" fill="#14B8A6" opacity="0.07"/>
      <circle cx="92" cy="1000" r="290" fill="#38BDF8" opacity="0.06"/>
      <rect x="72" y="72" width="306" height="52" rx="26" fill="#0F172A"/>
      <text x="225" y="106" text-anchor="middle" font-size="21" font-weight="700" letter-spacing="1.05" fill="#FFFFFF">${esc(config.seriesLabel)}</text>
      ${textLines(titleLines, 72, 302, 66, 76, 'font-weight="850" fill="#0F172A"')}
      <text x="72" y="${330 + titleLines.length * 76}" font-size="31" font-weight="650" fill="#334155">${esc(slide.subtitle)}</text>
      <rect x="72" y="${392 + titleLines.length * 76}" width="330" height="4" rx="2" fill="#14B8A6"/>
      <text x="72" y="882" font-size="28" font-weight="700" fill="#0F172A">${esc(slide.tool || config.tool)}</text>
      <text x="72" y="926" font-size="23" font-weight="500" fill="#64748B">${esc(slide.footer)}</text>
      <text x="1008" y="1017" text-anchor="end" font-size="20" font-weight="700" fill="#0F172A">Асистент лікаря</text>
    </svg>
  `);
}

async function renderSlide(slide) {
  const output = path.join(outputDir, slide.outputFilename);
  if (slide.kind === "cover") {
    const logoPath = path.resolve(projectRoot, config.logo);
    const logo = await sharp(logoPath).resize(168, 168, { fit: "contain" }).png().toBuffer();
    await sharp(coverSvg(slide)).composite([{ input: logo, left: 840, top: 740 }]).png().toFile(output);
    return;
  }

  const screenshotPath = path.resolve(sourceDir, slide.screenshot);
  const crop = slide.crop;
  const roundedMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${screenshotTarget.width}" height="${screenshotTarget.height}"><rect width="${screenshotTarget.width}" height="${screenshotTarget.height}" rx="${Math.max(8, screenshotWindow.radius - screenshotWindow.padding)}" fill="#FFFFFF"/></svg>`);
  const screenshot = await sharp(screenshotPath)
    .extract(crop)
    .resize(screenshotTarget.width, screenshotTarget.height, { fit: slide.fit || "cover", position: slide.position || "centre", background: palette.white })
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const overlays = [{ input: screenshot, left: screenshotTarget.left, top: screenshotTarget.top }];
  if (slide.highlightRegion) {
    const h = slide.highlightRegion;
    overlays.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" rx="${h.radius || 18}" fill="none" stroke="#14B8A6" stroke-width="${h.stroke || 8}"/><rect x="${h.x + 10}" y="${h.y + 10}" width="${Math.max(0, h.width - 20)}" height="${Math.max(0, h.height - 20)}" rx="${Math.max(8, (h.radius || 18) - 6)}" fill="#14B8A6" opacity="0.035"/></svg>`),
      left: 0,
      top: 0,
    });
  }

  await sharp(frameSvg(slide)).composite(overlays).png().toFile(output);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const slide of config.slides) await renderSlide(slide);
  console.log(`Created ${config.slides.length} slides in ${outputDir}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
