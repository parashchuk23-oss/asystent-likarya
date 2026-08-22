const labels = {
  indication: {
    screening: 'профілактичний огляд',
    dizziness: 'запаморочення',
    headache: 'головний біль',
    bruit: 'судинний шум',
    tiaStroke: 'після ТІА / інсульту',
    followUp: 'контроль у динаміці',
  },
  visualization: {
    good: 'візуалізація достатня',
    limited: 'візуалізація частково обмежена',
    difficult: 'візуалізація утруднена',
  },
  course: {
    straight: 'хід прямолінійний',
    tortuous: 'хід звивистий',
    kink: 'kink-деформація',
    coil: 'coil-деформація',
  },
  intima: {
    clear: 'інтима чітко диференціюється',
    thickened: 'КІМ потовщений',
    irregular: 'інтима нерівномірно потовщена',
  },
  bifurcation: {
    normal: 'без локального потовщення',
    thickened: 'локально потовщена',
    plaque: 'атеросклеротична бляшка',
  },
  flow: {
    normal: 'кровотік збережений',
    disturbed: 'локальне прискорення / турбулентність кровотоку',
    reduced: 'кровотік знижений',
  },
  vertebralDirection: {
    antegrade: 'антеградний',
    bidirectional: 'двонаправлений',
    retrograde: 'ретроградний',
    notVisualized: 'не візуалізується',
  },
  veinState: {
    normal: 'не розширені',
    dilated: 'розширені',
    thrombosis: 'ознаки тромбозу',
  },
  veinPatency: {
    patent: 'прохідні',
    partial: 'частково прохідні',
    occluded: 'непрохідні',
  },
  veinCompression: {
    full: 'стискаються повністю',
    partial: 'стискаються частково',
    absent: 'не стискаються',
  },
  plaqueStructure: {
    homogeneous: 'гомогенна',
    heterogeneous: 'гетерогенна',
    calcified: 'кальцинована',
    soft: 'м’яка / гіпоехогенна',
  },
  plaqueSurface: {
    smooth: 'поверхня рівна',
    irregular: 'поверхня нерівна',
    ulcerated: 'з ознаками виразкування',
  },
};

function label(group, value) {
  return labels[group]?.[value] ?? value ?? '';
}

function compact(items) {
  return items.filter(Boolean);
}

function sentence(parts) {
  const text = compact(parts).reduce((result, part) => {
    if (!result) return part;
    return `${result}${result.endsWith(':') ? ' ' : ', '}${part}`;
  }, '');
  return text ? `${text}.` : '';
}

function formatMm(value) {
  return value ? `${value} мм` : '';
}

function formatSpeed(value) {
  return value ? `${value} см/с` : '';
}

function stenosisText(value) {
  const stenosis = Number(value);
  if (!stenosis) return '';
  if (stenosis < 50) return `стеноз орієнтовно до ${stenosis}% без гемодинамічної значущості`;
  return `стеноз орієнтовно ${stenosis}%`;
}

function hasSignificantStenosis(plaque) {
  return Number(plaque.stenosis) >= 50;
}

function sideHasAtherosclerosis(side) {
  return side.bifurcation === 'plaque' || Number(side.icaStenosis) > 0;
}

function generateCarotidSide(sideName, side) {
  return [
    sentence([
      `${sideName} сонна система`,
      label('course', side.course),
      label('intima', side.intima),
      side.imt ? `КІМ ${formatMm(side.imt)}` : '',
      `біфуркація ${label('bifurcation', side.bifurcation)}`,
    ]),
    sentence([
      'Загальна сонна артерія',
      label('flow', side.ccaFlow),
      side.ccaPsv ? `PSV ${formatSpeed(side.ccaPsv)}` : '',
      side.ccaEdv ? `EDV ${formatSpeed(side.ccaEdv)}` : '',
    ]),
    sentence([
      'Внутрішня сонна артерія',
      label('flow', side.icaFlow),
      side.icaPsv ? `PSV ${formatSpeed(side.icaPsv)}` : '',
      side.icaEdv ? `EDV ${formatSpeed(side.icaEdv)}` : '',
      stenosisText(side.icaStenosis),
    ]),
    side.notes ? sentence([side.notes]) : '',
  ].filter(Boolean).join('\n');
}

function generatePlaque(plaque, index) {
  return sentence([
    `Бляшка ${index + 1}`,
    plaque.side,
    plaque.location,
    plaque.size ? `розмір ${formatMm(plaque.size)}` : '',
    label('plaqueStructure', plaque.structure),
    label('plaqueSurface', plaque.surface),
    stenosisText(plaque.stenosis),
  ]);
}

function generateVertebralSide(sideName, artery) {
  return sentence([
    `${sideName} хребтова артерія`,
    artery.diameter ? `діаметр ${formatMm(artery.diameter)}` : '',
    `кровотік ${label('vertebralDirection', artery.direction)}`,
    artery.psv ? `PSV ${formatSpeed(artery.psv)}` : '',
    artery.notes,
  ]);
}

function generateVeins(data) {
  return sentence([
    'Внутрішні яремні вени',
    `праворуч ${data.rightDiameter ? formatMm(data.rightDiameter) : 'без вимірювання'}`,
    `ліворуч ${data.leftDiameter ? formatMm(data.leftDiameter) : 'без вимірювання'}`,
    `стан: ${label('veinState', data.state)}`,
    `прохідність: ${label('veinPatency', data.patency)}`,
    `компресія: ${label('veinCompression', data.compression)}`,
    data.notes,
  ]);
}

export function generateNeckVesselsOverview(data) {
  return [
    sentence([
      'УЗД судин шиї',
      label('indication', data.general.indication),
      label('visualization', data.general.visualization),
      data.general.notes,
    ]),
    generateCarotidSide('Права', data.rightCarotid),
    generateCarotidSide('Ліва', data.leftCarotid),
    data.plaques.length ? data.plaques.map(generatePlaque).join('\n') : 'Атеросклеротичні бляшки не виявлені.',
    generateVertebralSide('Права', data.rightVertebral),
    generateVertebralSide('Ліва', data.leftVertebral),
    generateVeins(data.jugularVeins),
  ].filter(Boolean).join('\n\n');
}

export function generateNeckVesselsConclusion(data) {
  const lines = [];
  const plaques = data.plaques;
  const significantPlaques = plaques.filter(hasSignificantStenosis);
  const rightIcaStenosis = Number(data.rightCarotid.icaStenosis);
  const leftIcaStenosis = Number(data.leftCarotid.icaStenosis);
  const manualSignificantStenoses = [
    rightIcaStenosis >= 50 ? `УЗ-ознаки стенозу правої внутрішньої сонної артерії орієнтовно ${rightIcaStenosis}%.` : '',
    leftIcaStenosis >= 50 ? `УЗ-ознаки стенозу лівої внутрішньої сонної артерії орієнтовно ${leftIcaStenosis}%.` : '',
  ].filter(Boolean);

  if (plaques.length && significantPlaques.length) {
    significantPlaques.forEach((plaque) => {
      lines.push(`УЗ-ознаки атеросклеротичного стенозу ${plaque.location} ${plaque.side} орієнтовно ${plaque.stenosis}%.`);
    });
    manualSignificantStenoses.forEach((item) => lines.push(item));
  } else if (manualSignificantStenoses.length) {
    manualSignificantStenoses.forEach((item) => lines.push(item));
  } else if (plaques.length) {
    lines.push('УЗ-ознаки атеросклеротичних змін сонних артерій без гемодинамічно значущого стенозу.');
  } else if (sideHasAtherosclerosis(data.rightCarotid) || sideHasAtherosclerosis(data.leftCarotid)) {
    lines.push('УЗ-ознаки атеросклеротичних змін сонних артерій без гемодинамічно значущого стенозу.');
  } else {
    lines.push('УЗ-ознак гемодинамічно значущих стенозів сонних артерій не виявлено.');
  }

  if (data.rightCarotid.intima !== 'clear' || data.leftCarotid.intima !== 'clear') {
    lines.push('УЗ-ознаки потовщення комплексу інтима-медіа сонних артерій.');
  }

  if (data.rightCarotid.course !== 'straight') lines.push(`Деформація ходу правої сонної системи: ${label('course', data.rightCarotid.course)}.`);
  if (data.leftCarotid.course !== 'straight') lines.push(`Деформація ходу лівої сонної системи: ${label('course', data.leftCarotid.course)}.`);

  if (data.rightVertebral.direction !== 'antegrade' || data.leftVertebral.direction !== 'antegrade') {
    lines.push('Змінений напрямок кровотоку по хребтовій артерії / артеріях.');
  } else {
    lines.push('Кровотік по хребтових артеріях антеградний.');
  }

  if (data.jugularVeins.state === 'thrombosis' || data.jugularVeins.patency !== 'patent' || data.jugularVeins.compression !== 'full') {
    lines.push('УЗ-ознаки порушення прохідності / компресії внутрішніх яремних вен.');
  }

  return lines.join('\n');
}

export function generateNeckVesselsRecommendations(data) {
  const recommendations = ['Подальша тактика визначається лікарем з урахуванням клінічної ситуації та факторів серцево-судинного ризику.'];

  if (data.plaques.length) {
    recommendations.push('Контроль ліпідограми та корекція серцево-судинного ризику відповідно до чинних рекомендацій.');
  }

  if (data.plaques.some(hasSignificantStenosis)) {
    recommendations.push('Консультація судинного хірурга / невролога для уточнення подальшої тактики.');
  }

  if (data.rightVertebral.direction !== 'antegrade' || data.leftVertebral.direction !== 'antegrade') {
    recommendations.push('Розглянути дообстеження вертебробазилярного басейну за клінічним контекстом.');
  }

  if (data.jugularVeins.state === 'thrombosis' || data.jugularVeins.patency !== 'patent') {
    recommendations.push('Клінічна оцінка ризику венозного тромбозу та подальша тактика за рішенням лікаря.');
  }

  return recommendations.join('\n');
}

export function buildNeckVesselsReport(data) {
  return {
    overview: generateNeckVesselsOverview(data),
    conclusion: generateNeckVesselsConclusion(data),
    recommendations: generateNeckVesselsRecommendations(data),
  };
}
