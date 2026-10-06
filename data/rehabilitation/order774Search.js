import order774Index from './order774Index.json';

const ICD_CODE_RE = /\b([A-ZА-ЯІЇЄ]\d{2}(?:\.\d{1,2})?)\b/i;

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

