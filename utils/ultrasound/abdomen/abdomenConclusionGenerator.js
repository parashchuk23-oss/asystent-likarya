import {
  isCommonBileDuctDilated,
  isGallbladderWallThickened,
  isLiverEnlarged,
  isPancreaticDuctDilated,
  isSpleenEnlarged,
} from './abdomenCalculations';

export function generateAbdomenConclusion(data) {
  const lines = [];

  if (data.liver.changes.includes('fattyInfiltration') || data.liver.echogenicity === 'increased') {
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
  if (data.gallbladder.stones.length) {
    lines.push('УЗ-ознаки жовчнокам’яної хвороби.');
  }
  if (data.gallbladder.content !== 'anechoic' || isGallbladderWallThickened(data.gallbladder.wall)) {
    lines.push('УЗ-ознаки хронічного холециститу.');
  }
  if (data.gallbladder.polyps.length) {
    lines.push('Поліпоподібні утворення жовчного міхура.');
  }
  if (isCommonBileDuctDilated(data.commonBileDuct.diameter) || data.commonBileDuct.lumen === 'stone') {
    lines.push('УЗ-ознаки змін холедоха; потребує клініко-лабораторної кореляції.');
  }
  if (
    data.pancreas.echogenicity === 'increased' ||
    data.pancreas.structure === 'heterogeneous' ||
    isPancreaticDuctDilated(data.pancreas.wirsung)
  ) {
    lines.push('УЗ-ознаки дифузних змін підшлункової залози.');
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
  const recommendations = ['Консультація гастроентеролога за клінічними показами.'];

  if (
    data.liver.mode === 'changed' ||
    data.gallbladder.mode === 'changed' ||
    data.commonBileDuct.lumen !== 'free' ||
    data.pancreas.mode === 'changed'
  ) {
    recommendations.push('Біохімічний аналіз крові: АЛТ, АСТ, білірубін, ЛФ, ГГТ; амілаза / ліпаза за показами.');
  }

  if (data.gallbladder.stones.length || data.gallbladder.content !== 'anechoic') {
    recommendations.push('ФГДС та консультація профільного спеціаліста за клінічними показами.');
  }

  if (data.commonBileDuct.lumen === 'stone' || isCommonBileDuctDilated(data.commonBileDuct.diameter)) {
    recommendations.push('МРХПГ / КТ / МРТ за клінічними показами для уточнення стану жовчних проток.');
  }

  if (data.pancreas.lesions.length || data.spleen.lesions.length) {
    recommendations.push('КТ або МРТ з контрастуванням за клінічними показами для уточнення виявлених змін.');
  }

  recommendations.push('Повторне УЗД у динаміці за клінічними показами.');

  return recommendations.join('\n');
}
