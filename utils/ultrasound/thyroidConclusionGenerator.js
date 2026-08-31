import { getCalculatedVolumes } from './thyroidCalculations';
import { getEffectiveTirads } from './thyroidTirads';

function hasThyroiditisPattern(data) {
  return data.parenchyma.structure === 'diffuselyHeterogeneous';
}

function hasNormalPattern(data) {
  const { totalVolume } = getCalculatedVolumes(data.measurements);
  return (
    data.measurements.totalVolumeStatus === 'notEnlarged' &&
    totalVolume !== null &&
    data.appearance.echogenicity === 'medium' &&
    data.parenchyma.structure === 'homogeneous' &&
    data.vascularization === 'normal' &&
    data.nodules.length === 0 &&
    data.perithyroidFormations.length === 0 &&
    data.lymphNodes.status === 'notEnlarged'
  );
}

function getNoduleConclusion(data) {
  if (!data.nodules.length) return '';

  const lobes = new Set(data.nodules.map((nodule) => nodule.lobe));
  const tirads = [...new Set(data.nodules.map((nodule) => getEffectiveTirads(nodule)).filter(Boolean))].join(', ');

  if (lobes.size > 1) {
    return `Вузлові утворення щитоподібної залози${tirads ? `, ${tirads}` : ''}.`;
  }

  const lobe = data.nodules[0].lobe === 'right' ? 'правої частки' : data.nodules[0].lobe === 'left' ? 'лівої частки' : 'перешийка';
  const prefix = data.nodules.length > 1 ? 'Вузлові утворення' : 'Вузлове утворення';
  return `${prefix} ${lobe} щитоподібної залози${tirads ? `, ${tirads}` : ''}.`;
}

function getPerithyroidConclusion(data) {
  if (!data.perithyroidFormations.length) return '';
  return 'Додаткове перитиреоїдне утворення. Диференційний ряд потребує клініко-лабораторної кореляції.';
}

export function generateThyroidConclusion(data) {
  if (hasNormalPattern(data)) {
    return 'УЗ-ознак структурних змін щитоподібної залози не виявлено.';
  }

  const lines = [];

  if (hasThyroiditisPattern(data)) {
    lines.push('УЗ-ознаки дифузних змін ЩЗ по типу тиреоїдиту.');
  }

  const noduleConclusion = getNoduleConclusion(data);
  if (noduleConclusion) lines.push(noduleConclusion);

  const perithyroidConclusion = getPerithyroidConclusion(data);
  if (perithyroidConclusion) lines.push(perithyroidConclusion);

  if (data.lymphNodes.status === 'enlarged') {
    lines.push('Регіонарні лімфатичні вузли збільшені; оцінка потребує клінічної кореляції.');
  }

  return lines.length ? lines.join('\n') : 'Висновок потребує редагування лікарем з урахуванням клінічних даних.';
}

export function generateThyroidRecommendations(data) {
  const recommendations = [];

  if (hasThyroiditisPattern(data)) {
    recommendations.push('Консультація ендокринолога.');
    recommendations.push('ТТГ, Т4, АТ-ТПО, АТ-ТГ.');
  }

  if (data.perithyroidFormations.length) {
    recommendations.push('Загальний або іонізований кальцій, ПТГ за підозри на утворення прищитоподібної залози.');
  }

  if (data.nodules.length) {
    recommendations.push(
      'Тактика щодо спостереження або ТАПБ визначається з урахуванням категорії ACR TI-RADS, максимального розміру вузла, анамнезу та клінічних факторів ризику.',
    );
    recommendations.push('Динамічний УЗ-контроль.');
  }

  return recommendations.join('\n');
}
