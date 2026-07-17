import { parsePositiveNumber } from './thyroidCalculations';

function getMaxNoduleSizeCm(dimensions = {}) {
  const maxMm = Math.max(
    parsePositiveNumber(dimensions.length) || 0,
    parsePositiveNumber(dimensions.thickness) || 0,
    parsePositiveNumber(dimensions.width) || 0,
  );

  return maxMm > 0 ? maxMm / 10 : null;
}

function getCompositionPoints(type) {
  if (type === 'mixed') return 1;
  if (type === 'solid' || type === 'predominantlySolid') return 2;
  return 0;
}

function getEchogenicityPoints(echogenicity) {
  if (echogenicity === 'hyperechoic' || echogenicity === 'isoechoic' || echogenicity === 'ambiguous') return 1;
  if (echogenicity === 'hypoechoic') return 2;
  if (echogenicity === 'veryHypoechoic') return 3;
  return 0;
}

function getShapePoints(orientation) {
  return orientation === 'vertical' ? 3 : 0;
}

function getMarginPoints(contour) {
  if (contour === 'uneven' || contour === 'lobulated') return 2;
  if (contour === 'suspectedExtension') return 3;
  return 0;
}

function getEchogenicFociPoints(inclusions = []) {
  const values = new Set(inclusions);
  let points = 0;

  if (values.has('macrocalcifications')) points += 1;
  if (values.has('peripheralCalcifications')) points += 2;
  if (values.has('punctateEchogenicFoci')) points += 3;

  return points;
}

export function getTiradsCategory(points) {
  if (points === 0) return 'TR1';
  if (points === 2) return 'TR2';
  if (points === 3) return 'TR3';
  if (points >= 4 && points <= 6) return 'TR4';
  if (points >= 7) return 'TR5';
  return 'TR2';
}

export function getTiradsLabel(category) {
  const labels = {
    TR1: 'ACR TI-RADS 1',
    TR2: 'ACR TI-RADS 2',
    TR3: 'ACR TI-RADS 3',
    TR4: 'ACR TI-RADS 4',
    TR5: 'ACR TI-RADS 5',
  };

  return labels[category] || '';
}

export function getTiradsInterpretation(category) {
  const interpretations = {
    TR1: 'Доброякісні ознаки.',
    TR2: 'Без підозри на злоякісність.',
    TR3: 'Ймовірно доброякісний вузол.',
    TR4: 'Підозрілі ознаки.',
    TR5: 'Висока ймовірність злоякісності.',
  };

  return interpretations[category] || '';
}

export function getTiradsRecommendation(category, dimensions) {
  const maxSizeCm = getMaxNoduleSizeCm(dimensions);

  if (!maxSizeCm) {
    return 'Тактика ACR TI-RADS залежить від максимального розміру вузла.';
  }

  if (category === 'TR1' || category === 'TR2') {
    return 'За ACR TI-RADS рутинна ТАПБ або спостереження за категорією зазвичай не показані.';
  }

  if (category === 'TR3') {
    if (maxSizeCm >= 2.5) return 'За ACR TI-RADS можна розглянути ТАПБ при розмірі >= 2,5 см.';
    if (maxSizeCm >= 1.5) return 'За ACR TI-RADS можна розглянути УЗ-спостереження при розмірі >= 1,5 см.';
    return 'За ACR TI-RADS поріг для планового спостереження за розміром не досягнутий.';
  }

  if (category === 'TR4') {
    if (maxSizeCm >= 1.5) return 'За ACR TI-RADS можна розглянути ТАПБ при розмірі >= 1,5 см.';
    if (maxSizeCm >= 1) return 'За ACR TI-RADS можна розглянути УЗ-спостереження при розмірі >= 1,0 см.';
    return 'За ACR TI-RADS поріг для планового спостереження за розміром не досягнутий.';
  }

  if (category === 'TR5') {
    if (maxSizeCm >= 1) return 'За ACR TI-RADS можна розглянути ТАПБ при розмірі >= 1,0 см.';
    if (maxSizeCm >= 0.5) return 'За ACR TI-RADS можна розглянути УЗ-спостереження при розмірі >= 0,5 см.';
    return 'За ACR TI-RADS поріг для планового спостереження за розміром не досягнутий.';
  }

  return '';
}

export function calculateAcrTirads(nodule) {
  const pointsByFeature = {
    composition: getCompositionPoints(nodule.type),
    echogenicity: getEchogenicityPoints(nodule.echogenicity),
    shape: getShapePoints(nodule.orientation),
    margin: getMarginPoints(nodule.contour),
    echogenicFoci: getEchogenicFociPoints(nodule.inclusions),
  };
  const points = Object.values(pointsByFeature).reduce((sum, value) => sum + value, 0);
  const category = getTiradsCategory(points);

  return {
    points,
    pointsByFeature,
    category,
    label: getTiradsLabel(category),
    interpretation: getTiradsInterpretation(category),
    recommendation: getTiradsRecommendation(category, nodule.dimensions),
  };
}

export function getEffectiveTirads(nodule) {
  return getTiradsLabel(nodule.tirads || calculateAcrTirads(nodule).category);
}
