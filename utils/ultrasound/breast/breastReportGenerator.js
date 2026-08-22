const optionLabels = {
  indication: {
    screening: 'профілактичний огляд',
    pain: 'масталгія',
    palpableMass: 'пальпаторне ущільнення',
    discharge: 'виділення із соска',
    followUp: 'контроль у динаміці',
    postoperative: 'післяопераційний контроль',
  },
  menstrualStatus: {
    reproductive: 'репродуктивний період',
    menopause: 'менопауза',
    lactation: 'лактація',
    notSpecified: 'не вказано',
  },
  tissuePattern: {
    fibroglandular: 'фіброгландулярна тканина',
    fatty: 'переважно жирова інволюція',
    mixed: 'змішана фіброзно-жирова структура',
    dense: 'виражений фіброгландулярний компонент',
  },
  ducts: {
    notDilated: 'не розширені',
    dilated: 'розширені',
    ectasia: 'дуктектазія',
  },
  cysts: {
    absent: 'не виявлені',
    simple: 'прості кісти',
    complicated: 'ускладнені / неоднорідні кісти',
    multiple: 'множинні дрібні кісти',
  },
  shape: {
    oval: 'овальної форми',
    round: 'округлої форми',
    irregular: 'неправильної форми',
  },
  orientation: {
    parallel: 'паралельної орієнтації',
    notParallel: 'непаралельної орієнтації',
  },
  margin: {
    circumscribed: 'з чітким рівним контуром',
    indistinct: 'з нечітким контуром',
    microlobulated: 'з мікролобульованим контуром',
    angular: 'з кутовим контуром',
    spiculated: 'зі спікульованим контуром',
  },
  echogenicity: {
    anechoic: 'анехогенне',
    hypoechoic: 'гіпоехогенне',
    isoechoic: 'ізоехогенне',
    hyperechoic: 'гіперехогенне',
    complex: 'змішаної ехоструктури',
  },
  posterior: {
    none: 'без вираженого заднього акустичного ефекту',
    enhancement: 'із заднім акустичним посиленням',
    shadowing: 'із задньою акустичною тінню',
    combined: 'з комбінованими задніми акустичними ознаками',
  },
  vascularity: {
    none: 'без патологічного кровотоку',
    peripheral: 'з периферичним кровотоком',
    central: 'з центральним кровотоком',
    mixed: 'зі змішаним кровотоком',
  },
  lymphNodes: {
    normal: 'не збільшені, структура збережена',
    reactive: 'реактивного характеру',
    suspicious: 'з підозрілими ехографічними ознаками',
  },
};

function label(group, value) {
  return optionLabels[group]?.[value] ?? value ?? '';
}

function compact(items) {
  return items.filter(Boolean);
}

function sentence(parts) {
  const text = compact(parts).join(', ');
  return text ? `${text}.` : '';
}

function formatSize(item) {
  const parts = [item.length, item.width, item.height].filter(Boolean);
  return parts.length ? `${parts.join(' x ')} мм` : '';
}

function formatLocation(item) {
  return compact([
    item.clock ? `на ${item.clock} год` : '',
    item.distance ? `на відстані ${item.distance} см від соска` : '',
    item.quadrant,
  ]).join(', ');
}

function isSimpleCyst(item) {
  return item.echogenicity === 'anechoic' && item.shape === 'oval' && item.margin === 'circumscribed';
}

function suspiciousScore(item) {
  let score = 0;

  if (item.shape === 'irregular') score += 2;
  if (item.orientation === 'notParallel') score += 2;
  if (['indistinct', 'microlobulated', 'angular'].includes(item.margin)) score += 1;
  if (item.margin === 'spiculated') score += 3;
  if (item.posterior === 'shadowing') score += 1;
  if (item.calcifications === 'yes') score += 1;
  if (['central', 'mixed'].includes(item.vascularity)) score += 1;

  return score;
}

function lesionBirads(item) {
  if (isSimpleCyst(item)) return 2;
  const score = suspiciousScore(item);

  if (score >= 5) return 5;
  if (score >= 2) return 4;
  return 3;
}

function getAllLesions(data) {
  return [...data.rightBreast.formations, ...data.leftBreast.formations];
}

export function getBreastBirads(data) {
  if (data.birads.manual) return Number(data.birads.manual);
  if (data.lymphNodes.axillary === 'suspicious' || data.lymphNodes.supraclavicular === 'suspicious') return 4;

  const lesions = getAllLesions(data);
  if (!lesions.length) {
    if (data.rightBreast.cysts !== 'absent' || data.leftBreast.cysts !== 'absent') return 2;
    return 1;
  }

  return Math.max(...lesions.map(lesionBirads));
}

export function getBiradsText(category) {
  const descriptions = {
    1: 'негативне дослідження',
    2: 'доброякісні зміни',
    3: 'ймовірно доброякісні зміни',
    4: 'підозрілі зміни',
    5: 'висока ймовірність злоякісності',
  };

  return `ACR BI-RADS ${category}: ${descriptions[category] ?? 'потребує уточнення'}.`;
}

function generateFormationDescription(side, item, index) {
  return sentence([
    `${side} молочна залоза, утворення ${index + 1}`,
    formatLocation(item),
    'візуалізується вузлове утворення',
    label('echogenicity', item.echogenicity),
    label('shape', item.shape),
    label('orientation', item.orientation),
    label('margin', item.margin),
    formatSize(item) ? `розмірами ${formatSize(item)}` : '',
    label('posterior', item.posterior),
    item.calcifications === 'yes' ? 'з кальцинатами' : 'кальцинати не визначаються',
    label('vascularity', item.vascularity),
  ]);
}

function generateBreast(side, breast) {
  const lines = [
    sentence([
      `${side} молочна залоза`,
      label('tissuePattern', breast.tissuePattern),
      `молочні протоки ${label('ducts', breast.ducts)}`,
      `кісти ${label('cysts', breast.cysts)}`,
    ]),
  ];

  if (breast.ducts !== 'notDilated' && breast.ductsDetails) {
    lines.push(sentence([`Деталі протоків: ${breast.ductsDetails}`]));
  }

  if (breast.cysts !== 'absent' && breast.cystsDetails) {
    lines.push(sentence([`Кісти: ${breast.cystsDetails}`]));
  }

  breast.formations.forEach((item, index) => {
    lines.push(generateFormationDescription(side, item, index));
  });

  if (breast.additionalText) lines.push(sentence([breast.additionalText]));

  return lines.filter(Boolean).join('\n');
}

function generateLymphNodes(data) {
  return [
    sentence([
      'Пахвові лімфатичні вузли',
      `праворуч ${label('lymphNodes', data.axillary)}`,
      data.axillaryDetails,
    ]),
    sentence([
      'Над- та підключичні лімфатичні вузли',
      label('lymphNodes', data.supraclavicular),
      data.supraclavicularDetails,
    ]),
  ].filter(Boolean).join('\n');
}

export function generateBreastOverview(data) {
  return [
    sentence([
      'УЗД молочних залоз',
      label('indication', data.general.indication),
      label('menstrualStatus', data.general.menstrualStatus),
      data.general.cycleDay ? `${data.general.cycleDay} день циклу` : '',
      data.general.previousStudies ? `попередні дослідження: ${data.general.previousStudies}` : '',
    ]),
    generateBreast('Права', data.rightBreast),
    generateBreast('Ліва', data.leftBreast),
    generateLymphNodes(data.lymphNodes),
    getBiradsText(getBreastBirads(data)),
  ].filter(Boolean).join('\n\n');
}

export function generateBreastConclusion(data) {
  const lines = [];
  const birads = getBreastBirads(data);

  if (!data.rightBreast.formations.length && !data.leftBreast.formations.length) {
    if (data.rightBreast.cysts === 'absent' && data.leftBreast.cysts === 'absent') {
      lines.push('Ехографічних ознак вогнищевої патології молочних залоз не виявлено.');
    }
  }

  if (data.rightBreast.cysts !== 'absent' || data.leftBreast.cysts !== 'absent') {
    lines.push('УЗ-ознаки кіст молочних залоз.');
  }

  if (data.rightBreast.formations.length) {
    lines.push('УЗ-ознаки вузлового утворення / утворень правої молочної залози.');
  }

  if (data.leftBreast.formations.length) {
    lines.push('УЗ-ознаки вузлового утворення / утворень лівої молочної залози.');
  }

  if (data.lymphNodes.axillary === 'suspicious' || data.lymphNodes.supraclavicular === 'suspicious') {
    lines.push('УЗ-ознаки патологічно змінених регіонарних лімфатичних вузлів.');
  }

  lines.push(getBiradsText(birads));

  return lines.join('\n');
}

export function generateBreastRecommendations(data) {
  const birads = getBreastBirads(data);
  const recommendations = ['Подальша тактика визначається лікарем з урахуванням клінічної ситуації та попередніх досліджень.'];

  if (birads === 0) recommendations.push('Порівняти з попередніми дослідженнями або виконати додаткову візуалізацію.');
  if (birads === 3) recommendations.push('Контрольне УЗД у динаміці або мамографія відповідно до віку та клінічного контексту.');
  if (birads >= 4) recommendations.push('Консультація мамолога / онколога. Розглянути трепан-біопсію або мамографію за рішенням лікаря.');
  if (data.general.indication === 'discharge') recommendations.push('Оцінити характер виділень із соска; за потреби консультація мамолога.');

  return recommendations.join('\n');
}

export function buildBreastReport(data) {
  return {
    overview: generateBreastOverview(data),
    conclusion: generateBreastConclusion(data),
    recommendations: generateBreastRecommendations(data),
  };
}
