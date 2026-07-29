import { renalOptionLabel } from '../../../data/ultrasound/renalOptions';

function compact(items) {
  return items.filter(Boolean);
}

function sentence(parts) {
  const text = compact(parts).join(' ');
  return text ? `${text}.` : '';
}

function commaSentence(parts) {
  const text = compact(parts).reduce((result, part) => {
    if (!result) return part;
    return `${result}${result.endsWith(':') ? ' ' : ', '}${part}`;
  }, '');
  return text ? `${text}.` : '';
}

function formatMm(value) {
  return value ? `${value} мм` : '';
}

function formatMl(value) {
  return value ? `${value} мл` : '';
}

function kidneySizeStatus(kidney) {
  const length = Number(kidney.length);
  const width = Number(kidney.width);

  if (!length || !width) return 'розміри не оцінені';
  if (length > 120 || width > 60) return 'збільшена';
  if (length < 90 || width < 40) return 'зменшена';
  return 'не збільшена';
}

function generateKidney(name, kidney) {
  const position = kidney.position === 'moderatePtosis' && kidney.ptosisNote
    ? `${renalOptionLabel('kidneyPosition', kidney.position)} ${kidney.ptosisNote}`
    : renalOptionLabel('kidneyPosition', kidney.position);

  return [
    commaSentence([
      `${name} нирка`,
      position,
      kidney.length && kidney.width ? `розміри ${kidney.length} x ${kidney.width} мм` : '',
      kidneySizeStatus(kidney),
    ]),
    commaSentence([
      `Контури ${renalOptionLabel('contours', kidney.contours)}`,
      renalOptionLabel('contourClarity', kidney.contourClarity),
    ]),
    commaSentence([
      `Корково-мозкова диференціація ${renalOptionLabel('corticomedullary', kidney.corticomedullary)}`,
      kidney.parenchyma ? `товщина шару паренхіми в середньому сегменті ${formatMm(kidney.parenchyma)}` : '',
    ]),
    commaSentence([
      `Нирковий синус ${renalOptionLabel('sinusEchogenicity', kidney.sinusEchogenicity)}`,
      `судинний малюнок ${renalOptionLabel('vascularPattern', kidney.vascularPattern)}`,
    ]),
    commaSentence([
      `Чашечки, лоханка ${renalOptionLabel('collectingSystem', kidney.collectingSystem)}`,
      kidney.collectingSystem === 'dilated' && kidney.collectingSystemDetails ? kidney.collectingSystemDetails : '',
    ]),
    commaSentence([
      `Додаткові утворення ${renalOptionLabel('findingStatus', kidney.lesionsStatus)}`,
      kidney.lesionsStatus === 'present' ? kidney.lesionsDetails : '',
    ]),
    commaSentence([
      `Конкременти ${renalOptionLabel('findingStatus', kidney.stonesStatus)}`,
      kidney.stonesStatus === 'present' ? kidney.stonesDetails : '',
    ]),
    kidney.microInclusions === 'yes'
      ? 'На фоні ЧМС визначаються поодинокі гіперехогенні включення до 2 мм без ехо-тіні.'
      : '',
  ].filter(Boolean).join('\n');
}

function generateAdrenal(name, adrenal) {
  return commaSentence([
    `${name} наднирник`,
    renalOptionLabel('adrenalStatus', adrenal.status),
    adrenal.status === 'changed' ? adrenal.details : '',
  ]);
}

function generateUreters(ureters) {
  return commaSentence([
    'Сечоводи',
    renalOptionLabel('uretersStatus', ureters.status),
    ureters.status === 'dilated' ? ureters.details : '',
  ]);
}

function generateRenalArteries(arteries) {
  return commaSentence([
    renalOptionLabel('arteryStenosis', arteries.stenosis),
    arteries.stenosis === 'yes' ? arteries.details : '',
  ]);
}

function generateBladder(bladder) {
  return [
    commaSentence([
      'Сечовий міхур:',
      bladder.volume ? `об'єм ${formatMl(bladder.volume)}` : '',
      `стінки ${renalOptionLabel('bladderWall', bladder.wallStatus)}`,
      bladder.wallThickness ? `до ${formatMm(bladder.wallThickness)}` : '',
    ]),
    commaSentence([
      `Вміст ${renalOptionLabel('bladderContent', bladder.content)}`,
      bladder.content === 'heterogeneous' ? `за рахунок ${bladder.contentDetails}` : '',
    ]),
    commaSentence([
      `Патологічні утворення, конкременти ${renalOptionLabel('findingStatus', bladder.pathologyStatus)}`,
      bladder.pathologyStatus === 'present' ? bladder.pathologyDetails : '',
    ]),
    commaSentence([
      `Вічка сечоводів ${renalOptionLabel('uretericOrifices', bladder.uretericOrifices)}`,
      bladder.residualVolume ? `об'єм залишкової сечі ${formatMl(bladder.residualVolume)}` : '',
    ]),
  ].filter(Boolean).join('\n');
}

export function generateRenalOverview(data) {
  return [
    generateKidney('Права', data.rightKidney),
    generateAdrenal('Правий', data.rightAdrenal),
    generateKidney('Ліва', data.leftKidney),
    generateAdrenal('Лівий', data.leftAdrenal),
    generateUreters(data.ureters),
    generateRenalArteries(data.renalArteries),
    generateBladder(data.bladder),
  ].filter(Boolean).join('\n\n');
}

export function generateRenalConclusion(data) {
  const lines = [];
  const kidneys = [
    { side: 'правої нирки', data: data.rightKidney },
    { side: 'лівої нирки', data: data.leftKidney },
  ];

  kidneys.forEach(({ side, data: kidney }) => {
    if (kidneySizeStatus(kidney) === 'збільшена') lines.push(`УЗ-ознаки збільшення ${side}.`);
    if (kidneySizeStatus(kidney) === 'зменшена') lines.push(`УЗ-ознаки зменшення ${side}.`);
    if (kidney.collectingSystem === 'dilated') lines.push(`УЗ-ознаки розширення чашково-мискової системи ${side}.`);
    if (kidney.stonesStatus === 'present') lines.push(`УЗ-ознаки конкременту / конкрементів ${side}.`);
    if (kidney.lesionsStatus === 'present') lines.push(`УЗ-ознаки додаткового утворення ${side}.`);
    if (kidney.microInclusions === 'yes') lines.push(`Поодинокі гіперехогенні включення ЧМС ${side} без чіткої ехо-тіні.`);
    if (kidney.corticomedullary !== 'preserved') lines.push(`УЗ-ознаки порушення корково-мозкової диференціації ${side}.`);
  });

  if (data.ureters.status === 'dilated') lines.push('УЗ-ознаки розширення сечоводів.');
  if (data.renalArteries.stenosis === 'yes') lines.push('УЗ-ознаки можливого стенозу ниркових артерій; потребує профільного уточнення.');
  if (data.bladder.wallStatus === 'thickened') lines.push('УЗ-ознаки потовщення стінок сечового міхура.');
  if (data.bladder.content === 'heterogeneous') lines.push('Неоднорідний вміст сечового міхура.');
  if (data.bladder.pathologyStatus === 'present') lines.push('УЗ-ознаки патологічного утворення / конкременту сечового міхура.');
  if (Number(data.bladder.residualVolume) > 50) lines.push('Збільшений об’єм залишкової сечі.');

  return lines.length ? lines.join('\n') : 'УЗ-ознак структурних змін нирок та сечового міхура не виявлено.';
}

export function generateRenalRecommendations(data) {
  const recommendations = ['Контроль у динаміці визначає лікар з урахуванням клінічної ситуації.'];

  if (
    data.rightKidney.collectingSystem === 'dilated' ||
    data.leftKidney.collectingSystem === 'dilated' ||
    data.ureters.status === 'dilated' ||
    data.rightKidney.stonesStatus === 'present' ||
    data.leftKidney.stonesStatus === 'present'
  ) {
    recommendations.push('ЗАС, креатинін, ШКФ; консультація уролога.');
  }

  if (data.rightKidney.lesionsStatus === 'present' || data.leftKidney.lesionsStatus === 'present') {
    recommendations.push('КТ або МРТ нирок для уточнення характеру виявленого утворення.');
  }

  if (data.renalArteries.stenosis === 'yes') {
    recommendations.push('Доплерографія ниркових артерій або інше судинне дообстеження.');
  }

  if (Number(data.bladder.residualVolume) > 50 || data.bladder.wallStatus === 'thickened') {
    recommendations.push('Оцінити скарги з боку нижніх сечових шляхів та об’єм залишкової сечі в динаміці.');
  }

  return recommendations.join('\n');
}
