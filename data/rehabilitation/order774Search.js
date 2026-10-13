import order774Index from './order774Index.json';

const ICD_CODE_RE = /\b([A-ZА-ЯІЇЄ]\d{2}(?:\.\d{1,2})?)\b/i;
const ICD_DIAGNOSIS_RE = /\b([A-Z]\d{2}(?:\.\d{1,2})?)\s+([\s\S]*?)(?=\s+[A-Z]\d{2}(?:\.\d{1,2})?\s+|$)/g;

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-zа-яіїєґ0-9.']+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractIcdCode(value) {
  return String(value || '').toUpperCase().match(ICD_CODE_RE)?.[1] || '';
}

function icdMatches(queryCode, pattern) {
  const queryBase = queryCode.split('.')[0];
  const patternBase = pattern.split('.')[0];
  if (queryBase !== patternBase) return false;
  return !queryCode.includes('.') || !pattern.includes('.') || queryCode === pattern;
}

const order774Diagnoses = (() => {
  const diagnosesByCode = new Map();

  order774Index.entries.forEach((entry) => {
    for (const match of entry.diagnosisText.matchAll(ICD_DIAGNOSIS_RE)) {
      const code = match[1].toUpperCase();
      const title = match[2].replace(/\s+/g, ' ').trim();

      if (!title || /^[-–—]+$/.test(title) || diagnosesByCode.has(code)) continue;
      diagnosesByCode.set(code, { code, title });
    }
  });

  return Array.from(diagnosesByCode.values()).sort((left, right) => left.code.localeCompare(right.code));
})();

export function searchOrder774Diagnoses(query, limit = 8) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const compactQuery = normalizedQuery.replace(/\s+/g, '');

  return order774Diagnoses
    .map((diagnosis) => {
      const code = diagnosis.code.toLowerCase();
      const title = normalizeText(diagnosis.title);
      let score = 0;

      if (code === compactQuery) score = 100;
      else if (code.startsWith(compactQuery)) score = 80;
      else if (title.startsWith(normalizedQuery)) score = 60;
      else if (title.split(' ').some((word) => word.startsWith(normalizedQuery))) score = 45;
      else if (title.includes(normalizedQuery)) score = 30;

      return score ? { ...diagnosis, score } : null;
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.code.localeCompare(right.code))
    .slice(0, limit)
    .map(({ score, ...diagnosis }) => diagnosis);
}

export function searchOrder774(query) {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.length < 2) return [];

  const queryCode = extractIcdCode(query);
  const words = normalizedQuery.split(' ').filter((word) => word.length >= 3);

  return order774Index.entries
    .map((entry) => {
      const diagnosis = normalizeText(entry.diagnosisText);
      const product = normalizeText(entry.productName);
      const classification = normalizeText(entry.classification);
      const codeMatch = queryCode && entry.icdPatterns.some((pattern) => icdMatches(queryCode, pattern));
      const phraseMatch = !queryCode && diagnosis.includes(normalizedQuery);
      const wordMatch = !queryCode && words.length > 0 && words.every((word) => diagnosis.includes(word));
      const productMatch = !queryCode && (product.includes(normalizedQuery) || classification.includes(normalizedQuery));

      if (!codeMatch && !phraseMatch && !wordMatch && !productMatch) return null;
      const score = Number(codeMatch) * 100 + Number(phraseMatch) * 30 + Number(wordMatch) * 20 + Number(productMatch) * 10;
      return { ...entry, score };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.pageStart - right.pageStart);
}

export const order774Source = order774Index.source;
export const order774EntryCount = order774Index.entryCount;
