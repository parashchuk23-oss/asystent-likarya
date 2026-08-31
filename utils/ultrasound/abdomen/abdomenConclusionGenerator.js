import {
  isCommonBileDuctDilated,
  isGallbladderWallThickened,
  isLiverEnlarged,
  isPancreaticDuctDilated,
  isSpleenEnlarged,
} from './abdomenCalculations';

export function generateAbdomenConclusion(data) {
  const lines = [];

  if (data.gallbladder.notVisualized) {
    lines.push('Жовчний міхур не візуалізується.');
  }

  if (
    data.liver.changes.includes('fattyInfiltration') ||
    data.liver.echogenicity === 'increased' ||
    data.liver.echogenicity === 'markedlyIncreased' ||
    data.liver.steatosisGrade
  ) {
    lines.push('УЗ-ознаки стеатозу печінки.');
  }
  if (data.liver.changes.includes('fibrosis')) {
    lines.push('УЗ-ознаки фіброзних змін печінки.');
  }
  if (data.liver.changes.includes('cirrhoticRemodeling')) {
    lines.push('УЗ-ознаки дифузних змін печінки з ознаками циротичної перебудови.');
  }
  if (isLiverEnlarged(data.liver)) {
    lines.push('УЗ-ознаки гепатомегалії.');
  }
  if (!data.gallbladder.notVisualized && data.gallbladder.stones.length) {
    lines.push('УЗ-ознаки жовчнокам’яної хвороби.');
  }
  if (!data.gallbladder.notVisualized && isGallbladderWallThickened(data.gallbladder.wall)) {
    lines.push(`УЗ-ознаки ${data.gallbladder.wallThickeningType === 'local' ? 'локального' : 'дифузного'} потовщення стінки жовчного міхура.`);
  }
  if (!data.gallbladder.notVisualized && data.gallbladder.polyps.length) {
    lines.push('Поліпоподібні утворення жовчного міхура.');
  }
  if (isCommonBileDuctDilated(data.commonBileDuct.diameter) || data.commonBileDuct.lumen === 'stone') {
    lines.push('УЗ-ознаки змін холедоха; потребує клініко-лабораторної кореляції.');
  }
  if (
    data.pancreas.echogenicity === 'increased' ||
    data.pancreas.echogenicity === 'markedlyIncreased' ||
    data.pancreas.structure === 'heterogeneous' ||
    isPancreaticDuctDilated(data.pancreas.wirsung) ||
    data.pancreas.diffuseChangeType
  ) {
    const diffuseChange = data.pancreas.diffuseChangeType === 'fatty'
      ? 'жирова інфільтрація'
      : data.pancreas.diffuseChangeType === 'fibrotic'
        ? 'фіброзні зміни'
        : '';
    lines.push(`УЗ-ознаки дифузних змін підшлункової залози${diffuseChange ? ` (${diffuseChange})` : ''}.`);
  }
  if (data.pancreas.lesions.length) {
    lines.push('Об’ємне утворення підшлункової залози; потребує уточнення.');
  }
  if (isSpleenEnlarged(data.spleen)) {
    lines.push('УЗ-ознаки спленомегалії.');
  }
  if (data.spleen.lesions.length) {
    lines.push('Вогнищеві зміни селезінки; потребують клінічної кореляції.');
  }
  if (data.freeFluid.status === 'yes') {
    lines.push('Вільна рідина в черевній порожнині.');
  }
  if (data.lymphNodes.status === 'yes') {
    lines.push('Збільшені лімфатичні вузли черевної порожнини.');
  }

  return lines.length ? lines.join('\n') : 'УЗ-ознак структурних змін органів черевної порожнини не виявлено.';
}

export function generateAbdomenRecommendations(data) {
  const hasSteatosis =
    data.liver.changes.includes('fattyInfiltration') ||
    data.liver.echogenicity === 'increased' ||
    data.liver.echogenicity === 'markedlyIncreased' ||
    Boolean(data.liver.steatosisGrade);
  const hasStructuralChanges =
    data.liver.echogenicity !== 'medium' ||
    data.liver.structure !== 'homogeneous' ||
    data.liver.changes.length ||
    isLiverEnlarged(data.liver) ||
    (!data.gallbladder.notVisualized && data.gallbladder.content !== 'anechoic') ||
    (!data.gallbladder.notVisualized && data.gallbladder.stones.length) ||
    (!data.gallbladder.notVisualized && data.gallbladder.polyps.length) ||
    (!data.gallbladder.notVisualized && isGallbladderWallThickened(data.gallbladder.wall)) ||
    data.commonBileDuct.lumen !== 'free' ||
    isCommonBileDuctDilated(data.commonBileDuct.diameter) ||
    data.pancreas.echogenicity !== 'medium' ||
    data.pancreas.structure !== 'homogeneous' ||
    data.pancreas.diffuseChangeType ||
    isPancreaticDuctDilated(data.pancreas.wirsung) ||
    data.pancreas.lesions.length ||
    isSpleenEnlarged(data.spleen) ||
    data.spleen.lesions.length ||
    data.freeFluid.status === 'yes' ||
    data.lymphNodes.status === 'yes';

  if (!hasStructuralChanges) {
    return 'Додаткові рекомендації — за клінічним контекстом.';
  }

  const recommendations = ['Консультація гастроентеролога.'];

  if (hasSteatosis) {
    recommendations.push('АЛТ, АСТ, ГГТ, ЛФ, загальний білірубін; HbA1c; ліпідограма; ТТГ.');
    recommendations.push('ЗАК із тромбоцитами та розрахунок FIB-4.');
    recommendations.push('Еластографія печінки.');
  }

  if (
    data.liver.echogenicity !== 'medium' ||
    data.liver.structure !== 'homogeneous' ||
    data.liver.changes.length ||
    (!data.gallbladder.notVisualized && data.gallbladder.content !== 'anechoic') ||
    (!data.gallbladder.notVisualized && data.gallbladder.stones.length) ||
    (!data.gallbladder.notVisualized && data.gallbladder.polyps.length) ||
    data.commonBileDuct.lumen !== 'free' ||
    data.pancreas.echogenicity !== 'medium' ||
    data.pancreas.structure !== 'homogeneous' ||
    data.pancreas.diffuseChangeType ||
    data.pancreas.lesions.length
  ) {
    if (!hasSteatosis) recommendations.push('Біохімічний аналіз крові: АЛТ, АСТ, білірубін, ЛФ, ГГТ; амілаза / ліпаза.');
  }

  if (!data.gallbladder.notVisualized && (data.gallbladder.stones.length || data.gallbladder.content !== 'anechoic')) {
    recommendations.push('ФГДС та консультація профільного спеціаліста.');
  }

  if (data.commonBileDuct.lumen === 'stone' || isCommonBileDuctDilated(data.commonBileDuct.diameter)) {
    recommendations.push('МРХПГ / КТ / МРТ для уточнення стану жовчних проток.');
  }

  if (data.pancreas.lesions.length || data.spleen.lesions.length) {
    recommendations.push('КТ або МРТ з контрастуванням для уточнення виявлених змін.');
  }

  recommendations.push('Повторне УЗД у динаміці.');

  return recommendations.join('\n');
}
