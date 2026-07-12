import { optionLabel } from '../../data/ultrasound/thyroidOptions';
import { formatDecimal, formatDimensions, getCalculatedVolumes, parsePositiveNumber } from './thyroidCalculations';

function compact(items) {
  return items.filter(Boolean);
}

function sentence(parts) {
  const text = compact(parts).join(' ');
  return text ? `${text}.` : '';
}

function listLabels(group, values = [], otherText = '') {
  const labels = values
    .map((value) => (value === 'other' ? otherText : optionLabel(group, value)))
    .filter(Boolean);
  return labels.join(', ');
}

const noduleLocationText = {
  upperThird: 'верхній третині',
  middleThird: 'середній третині',
  lowerThird: 'нижній третині',
};

const lobeGenitiveText = {
  right: 'правої частки',
  left: 'лівої частки',
  isthmus: 'перешийка',
};

const contourInstrumentalText = {
  smooth: 'рівним',
  uneven: 'нерівним',
  lobulated: 'лобульованим',
};

const clarityInstrumentalText = {
  clear: 'чітким',
  unclear: 'нечітким',
};

function generateLobeLine(label, dimensions, volume) {
  const sizeText = formatDimensions(dimensions);
  if (!sizeText && !volume) return '';
  const volumeText = volume ? `об’єм ${formatDecimal(volume)} см³` : '';
  return sentence([`${label}:`, compact([sizeText, volumeText]).join(', ')]);
}

function generateGeneralText(data) {
  const shape =
    data.general.shape === 'other'
      ? data.general.shapeOther
      : optionLabel('shape', data.general.shape);

  return sentence([
    `Щитоподібна залоза ${optionLabel('surgeryStatus', data.general.surgeryStatus)},`,
    optionLabel('location', data.general.location),
    shape ? `Форма ${shape}` : '',
  ]);
}

function generateMeasurementsText(data) {
  const { rightVolume, leftVolume, totalVolume } = getCalculatedVolumes(data.measurements);
  const lines = [
    generateLobeLine('Права частка', data.measurements.right, rightVolume),
    generateLobeLine('Ліва частка', data.measurements.left, leftVolume),
  ];

  const isthmusThickness = parsePositiveNumber(data.measurements.isthmus.thickness);
  if (isthmusThickness) {
    lines.push(
      sentence([
        `Перешийок ${formatDecimal(isthmusThickness)} мм,`,
        optionLabel('isthmusStatus', data.measurements.isthmus.status),
      ]),
    );
  }

  if (totalVolume) {
    const status =
      data.measurements.totalVolumeStatus !== 'notAssessed'
        ? optionLabel('volumeStatus', data.measurements.totalVolumeStatus)
        : '';
    const percent = parsePositiveNumber(data.measurements.enlargementPercent);
    lines.push(
      sentence([
        `Сумарний об’єм ${formatDecimal(totalVolume)} см³`,
        status ? `(${status})` : '',
        percent ? `Збільшена приблизно на ${formatDecimal(percent, 0)}% від обраної норми` : '',
      ]),
    );
  }

  return lines.filter(Boolean).join('\n');
}

function generateAppearanceText(data) {
  return sentence([
    `Контури ${optionLabel('contour', data.appearance.contour)},`,
    optionLabel('clarity', data.appearance.clarity),
    `Капсула ${optionLabel('capsule', data.appearance.capsule)}`,
    `Ехогенність ${optionLabel('echogenicity', data.appearance.echogenicity)}`,
  ]);
}

function generateParenchymaText(data) {
  const structure = optionLabel('parenchymaStructure', data.parenchyma.structure);
  if (data.parenchyma.structure !== 'diffuselyHeterogeneous') {
    return sentence([`Паренхіма ${structure}`]);
  }

  const features = listLabels('parenchymaFeatures', data.parenchyma.features, data.parenchyma.other);
  const sizes = compact([
    data.parenchyma.hypoechoicSize ? `гіпоехогенні ділянки до ${data.parenchyma.hypoechoicSize} мм` : '',
    data.parenchyma.fibroticSize ? `фіброзні ділянки до ${data.parenchyma.fibroticSize} мм` : '',
  ]).join(', ');

  return sentence([`Паренхіма ${structure}`, features ? `(${features})` : '', sizes]);
}

function generateNoduleText(nodule, index) {
  const location = getNoduleLocationPhrase(nodule);
  const contour = getNoduleContourPhrase(nodule);
  const inclusions = listLabels('noduleInclusions', nodule.inclusions, nodule.inclusionOther);
  const dimensions = formatDimensions(nodule.dimensions);

  return sentence([
    `${index + 1}. ${location}, візуалізується`,
    `${compact([optionLabel('noduleType', nodule.type), optionLabel('noduleEchogenicity', nodule.echogenicity)]).join(', ')},`,
    `вузлове утворення, ${optionLabel('noduleShape', nodule.shape)} ${optionLabel('noduleOrientation', nodule.orientation)},`.trim(),
    contour,
    optionLabel('noduleStructure', nodule.structure),
    inclusions,
    dimensions ? `розміром ${dimensions}` : '',
    optionLabel('bloodFlow', nodule.bloodFlow),
    nodule.tirads ? nodule.tirads : '',
  ]);
}

function getNoduleLocationPhrase(nodule) {
  const lobe = lobeGenitiveText[nodule.lobe] || optionLabel('noduleLobe', nodule.lobe).toLowerCase();

  if (nodule.location === 'border') {
    if (nodule.lobe === 'right') return 'На межі правої частки та перешийка';
    if (nodule.lobe === 'left') return 'На межі лівої частки та перешийка';
    return 'У ділянці перешийка';
  }

  if (nodule.location === 'other') {
    return nodule.locationOther ? `У ${nodule.locationOther}` : `У ${lobe}`;
  }

  return `У ${noduleLocationText[nodule.location] || optionLabel('noduleLocation', nodule.location).toLowerCase()} ${lobe}`;
}

function getNoduleContourPhrase(nodule) {
  const contour = contourInstrumentalText[nodule.contour];
  const clarity = clarityInstrumentalText[nodule.clarity];

  if (contour && clarity) {
    return `з ${contour}, ${clarity} контуром`;
  }

  if (contour) {
    return `з ${contour} контуром`;
  }

  if (nodule.contour === 'noExtension') {
    return 'без ознак екстратиреоїдного поширення';
  }

  if (nodule.contour === 'suspectedExtension') {
    return 'з підозрою на екстратиреоїдне поширення';
  }

  return '';
}

function generatePerithyroidText(item, index) {
  const dimensions = formatDimensions(item.dimensions);
  const differential = listLabels('differential', item.differential, item.differentialOther);

  return sentence([
    `${index + 1}. Додаткове утворення ${item.localization || 'перитиреоїдно'}`,
    dimensions ? `розміром ${dimensions}` : '',
    item.shape ? `форма: ${item.shape}` : '',
    item.echogenicity ? `ехогенність: ${item.echogenicity}` : '',
    item.contours ? `контури: ${item.contours}` : '',
    item.bloodFlow ? `кровотік: ${item.bloodFlow}` : '',
    item.compression ? `компресія: ${item.compression}` : '',
    differential ? `Диференційний ряд: ${differential}` : '',
  ]);
}

function generateFocalText(data) {
  const noduleLines = data.nodules.map(generateNoduleText);
  const perithyroidLines = data.perithyroidFormations.map(generatePerithyroidText);
  return [...noduleLines, ...perithyroidLines].filter(Boolean).join('\n');
}

function generateLymphText(data) {
  const lymph = data.lymphNodes;
  const zones = listLabels('lymphZones', lymph.zones);
  const details = compact([
    zones ? `зони: ${zones}` : '',
    lymph.structure ? `структура: ${lymph.structure}` : '',
    lymph.bloodFlow ? `кровотік: ${lymph.bloodFlow}` : '',
    lymph.shortAxisMax ? `максимальна коротка вісь ${lymph.shortAxisMax} мм` : '',
  ]).join(', ');

  if (lymph.status === 'notEnlarged' && !details) {
    return 'Регіонарні лімфатичні вузли не збільшені.';
  }

  return sentence([
    `Регіонарні лімфатичні вузли ${lymph.status === 'enlarged' ? 'збільшені' : 'не збільшені'}`,
    details,
  ]);
}

function generateOptionalVascularText(data) {
  const lines = [];
  const { jugular, carotid } = data.optionalVascular;

  if (data.optionalVascular.jugularEnabled) {
    lines.push(
      sentence([
        'Внутрішні яремні вени:',
        jugular.rightDiameter ? `праворуч ${jugular.rightDiameter} мм` : '',
        jugular.leftDiameter ? `ліворуч ${jugular.leftDiameter} мм` : '',
        jugular.dilation ? `стан: ${jugular.dilation}` : '',
        jugular.patency ? `прохідність: ${jugular.patency}` : '',
        jugular.compression ? `компресія: ${jugular.compression}` : '',
      ]),
    );
  }

  if (data.optionalVascular.carotidEnabled) {
    lines.push(
      sentence([
        'Загальні сонні артерії:',
        carotid.course ? `хід: ${carotid.course}` : '',
        carotid.intima ? `інтима: ${carotid.intima}` : '',
        carotid.cimtRight ? `КІМ праворуч ${carotid.cimtRight} мм` : '',
        carotid.cimtLeft ? `КІМ ліворуч ${carotid.cimtLeft} мм` : '',
        carotid.bifurcation ? `біфуркація: ${carotid.bifurcation}` : '',
        carotid.plaques === 'detected' ? `бляшки: ${carotid.plaqueDescription || 'виявлені'}` : 'бляшки не виявлені',
      ]),
    );
  }

  return lines.filter(Boolean).join('\n');
}

export function generateThyroidOverview(data) {
  return [
    generateGeneralText(data),
    generateMeasurementsText(data),
    generateAppearanceText(data),
    generateParenchymaText(data),
    sentence([`Васкуляризація залози ${optionLabel('vascularization', data.vascularization)}`]),
    generateFocalText(data),
    generateLymphText(data),
    generateOptionalVascularText(data),
  ]
    .filter(Boolean)
    .join('\n\n');
}
