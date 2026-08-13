'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  buildQtMetricsInput,
  calculateQtMetrics,
  getQtClinicalNextSteps,
  getSmallCellDurationMs,
} from '../../../utils/ecg/qtCalculations';
import { inputClass, textareaClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const rhythmOptions = [
  { value: 'sinus', label: 'синусовий' },
  { value: 'af', label: 'фібриляція передсердь' },
  { value: 'flutter', label: 'тріпотіння передсердь' },
  { value: 'atrial', label: 'передсердний' },
  { value: 'junctional', label: 'вузловий' },
  { value: 'ventricular', label: 'шлуночковий' },
  { value: 'paced', label: 'ритм ЕКС' },
  { value: 'other', label: 'інший / потребує уточнення' },
];

const regularityOptions = [
  { value: 'regular', label: 'регулярний' },
  { value: 'irregular', label: 'нерегулярний' },
];

const polarityOptions = [
  { value: 'positive', label: 'позитивний' },
  { value: 'negative', label: 'негативний' },
  { value: 'isoelectric', label: 'R=S / ізоелектричний' },
];

const pqClarificationOptions = {
  short: [
    { value: 'wpw', label: 'WPW' },
    { value: 'lowAtrial', label: 'нижньопередсердний ритм' },
    { value: 'junctional', label: 'AV-вузловий ритм' },
    { value: 'fastAvConduction', label: 'варіант швидкого AV-проведення' },
  ],
  long: [
    { value: 'avBlockI', label: 'AV-блокада I ступеня' },
    { value: 'mobitzI', label: 'AV-блокада II ступеня, Mobitz I' },
    { value: 'mobitzII', label: 'AV-блокада II ступеня, Mobitz II' },
    { value: 'twoToOne', label: 'AV-блокада 2:1' },
    { value: 'threeToOne', label: 'AV-блокада високого ступеня 3:1' },
    { value: 'fourToOne', label: 'AV-блокада високого ступеня 4:1' },
    { value: 'avBlockIII', label: 'AV-блокада III ступеня' },
    { value: 'other', label: 'інше / потребує уточнення' },
  ],
};

const pqClarificationDescriptions = {
  wpw: 'Короткий PQ у поєднанні з delta-хвилею та розширенням QRS може відповідати передчасному збудженню шлуночків. Оцінюйте форму початку QRS, ширину комплексу та клінічний контекст.',
  lowAtrial: 'Імпульс може виходити з нижніх відділів передсердь, тому шлях до AV-вузла коротший. Часто варто подивитися полярність P у II, III та aVF.',
  junctional: 'Імпульс формується в ділянці AV-вузла. P може бути відсутній, зливатися з QRS або розташовуватися після QRS; якщо P перед QRS, PQ часто короткий.',
  fastAvConduction: 'Короткий PQ без delta-хвилі та без розширення QRS може бути варіантом швидкого AV-проведення. Це краще трактувати обережно, не як самостійний діагноз.',
  avBlockI: 'PQ понад 200 мс, але кожен зубець P проводиться до QRS. Проведення сповільнене, випадіння комплексів немає; можливий вплив ваготонії або препаратів, що сповільнюють AV-провідність.',
  mobitzI: 'PQ поступово подовжується, після чого один QRS випадає. Часто це рівень AV-вузла; може бути при ваготонії, у спортсменів, під час сну або на фоні бета-блокаторів, верапамілу, дилтіазему чи дигоксину.',
  mobitzII: 'PQ залишається стабільним, але QRS раптово випадає. Частіше це порушення нижче AV-вузла, на рівні пучка Гіса або ніжок; клінічно важливіше через ризик прогресування.',
  twoToOne: 'Кожен другий зубець P не проводиться до шлуночків. Часто неможливо точно відрізнити Mobitz I від Mobitz II, бо немає послідовності PQ для оцінки динаміки.',
  threeToOne: 'До шлуночків проводиться кожен третій передсердний імпульс. Це AV-блокада високого ступеня; важливо оцінити ЧСС, симптоми, ширину QRS і клінічний контекст.',
  fourToOne: 'До шлуночків проводиться кожен четвертий передсердний імпульс. Це виражена AV-блокада високого ступеня; особливо важливі брадикардія, синкопе та ширина QRS.',
  avBlockIII: 'Передсердя і шлуночки працюють незалежно: P не має стабільного зв’язку з QRS. Це повна AV-блокада з AV-дисоціацією.',
  other: 'Використовуйте, якщо картина не вкладається в типові варіанти або потребує ручного уточнення у висновку.',
};

const qrsClarificationOptions = [
  { value: 'incompleteRbbb', label: 'неповна блокада правої ніжки пучка Гіса' },
  { value: 'rbbb', label: 'блокада правої ніжки пучка Гіса' },
  { value: 'lbbb', label: 'блокада лівої ніжки пучка Гіса' },
  { value: 'ivcd', label: 'неспецифічне порушення внутрішньошлуночкової провідності' },
  { value: 'ventricularRhythm', label: 'ритм шлуночкового походження' },
  { value: 'pacedRhythm', label: 'ритм електрокардіостимулятора' },
  { value: 'wpw', label: 'WPW / передчасне збудження' },
  { value: 'hyperkalemia', label: 'розглянути гіперкаліємію / метаболічну причину' },
];

const qrsClarificationDescriptions = {
  incompleteRbbb: 'Зазвичай QRS <120 мс, часто rsR′ / rSR′ у V1–V2. Може бути варіантом норми, але оцінюється разом із клінікою, правими відділами серця та попередніми ЕКГ.',
  rbbb: 'Зазвичай QRS ≥120 мс, rSR′ / широкий R′ у V1–V2 та широкий S у I, V5–V6. Важливо оцінити, чи блокада нова, чи є симптоми, ішемія, ТЕЛА, перевантаження правих відділів або структурне захворювання серця.',
  lbbb: 'Зазвичай QRS ≥120 мс, широкий або зазубрений R у I, aVL, V5–V6, глибокий S або QS у V1. Нова БЛНПГ потребує уважної клінічної оцінки, особливо при болю в грудях або підозрі на гострий коронарний синдром.',
  ivcd: 'QRS розширений, але картина не відповідає типовим критеріям блокади правої або лівої ніжки. Варто оцінити попередні ЕКГ, структурне захворювання серця, електроліти, ішемію та медикаменти.',
  ventricularRhythm: 'Широкі комплекси QRS можуть бути при шлуночковому ритмі або шлуночковій тахікардії. Особливо важливо оцінити регулярність, ЧСС, AV-дисоціацію, захоплені або зливні комплекси, гемодинаміку та клінічний стан.',
  pacedRhythm: 'При шлуночковій стимуляції QRS зазвичай широкий і має морфологію, подібну до блокади ніжки. Потрібно оцінити стимуляційні спайки, захоплення шлуночків, регулярність стимуляції та відповідність режиму ЕКС.',
  wpw: 'Для WPW характерні короткий PQ, delta-хвиля та розширений QRS. Якщо є тільки широкий QRS без короткого PQ або delta-хвилі, краще не писати WPW автоматично.',
  hyperkalemia: 'Гіперкаліємія може спричиняти розширення QRS, високі загострені T, зменшення або зникнення P та брадиаритмії. Оцінити калій, ШКФ, препарати та клінічний стан.',
};

const qtFormulaOptions = [
  { value: 'fridericia', label: 'Fridericia', metric: 'qtcFridericia' },
  { value: 'bazett', label: 'Bazett', metric: 'qtcBazett' },
  { value: 'framingham', label: 'Framingham', metric: 'qtcFramingham' },
  { value: 'hodges', label: 'Hodges', metric: 'qtcHodges' },
];

const qtCauseOptions = {
  prolonged: [
    { value: 'medication', label: 'медикаментозне подовження QT' },
    { value: 'electrolytes', label: 'гіпокаліємія / гіпомагніємія' },
    { value: 'longQtSyndrome', label: 'вроджений Long QT syndrome' },
    { value: 'ischemia', label: 'ішемія / гострий коронарний синдром' },
    { value: 'structuralHeartDisease', label: 'структурне захворювання серця' },
  ],
  short: [
    { value: 'hypercalcemia', label: 'гіперкальціємія' },
    { value: 'digitalis', label: 'дигіталісний ефект' },
    { value: 'shortQtSyndrome', label: 'вроджений Short QT syndrome' },
  ],
};

const qtCauseDescriptions = {
  medication: 'Часті групи: антиаритмічні препарати (аміодарон, соталол, хінідин, прокаїнамід), макроліди (азитроміцин, кларитроміцин, еритроміцин), фторхінолони (левофлоксацин, моксифлоксацин), антипсихотики (галоперидол, кветіапін, рисперидон, зипразидон), антидепресанти (циталопрам, есциталопрам, трициклічні антидепресанти), протиблювотні (ондансетрон, домперидон), азоли (флуконазол, вориконазол), метадон.',
  electrolytes: 'Низький калій або магній може подовжувати реполяризацію і підвищувати аритмічний ризик. Доцільно оцінити електроліти, ШКФ, діуретики та втрати рідини.',
  longQtSyndrome: 'Вроджений Long QT syndrome найчастіше описують як LQT1, LQT2 або LQT3. Підказки: сімейний анамнез раптової смерті, синкопе, провокація навантаженням, емоціями, звуком або сном.',
  ischemia: 'Ішемія або гострий коронарний синдром можуть змінювати реполяризацію. QTc потрібно трактувати разом із симптомами, ST-T, тропонінами та динамікою ЕКГ.',
  structuralHeartDisease: 'Структурне захворювання серця може підвищувати аритмічний ризик навіть при помірному подовженні QTc. Варто оцінити ЕхоКГ, анамнез СН, ІХС і попередні ЕКГ.',
  hypercalcemia: 'Гіперкальціємія класично скорочує QT за рахунок вкорочення ST-сегмента. Перевірити кальцій, альбумін і клінічний контекст.',
  digitalis: 'Дигіталісний ефект може супроводжуватися характерними ST-T змінами і відносним скороченням QT. Важливо відрізняти терапевтичний ефект від токсичності.',
  shortQtSyndrome: 'Вроджений Short QT syndrome трапляється рідко. Підказки: дуже короткий QTc, сімейний анамнез раптової смерті, синкопе або фібриляція передсердь у молодому віці.',
};

const leadOptions = [
  { value: 'inferior', label: 'II, III, aVF' },
  { value: 'septal', label: 'V1–V2' },
  { value: 'anterior', label: 'V1–V4' },
  { value: 'anterolateral', label: 'V2–V6' },
  { value: 'lateral', label: 'I, aVL, V5–V6' },
  { value: 'posterior', label: 'V7–V9' },
  { value: 'rightVentricle', label: 'V3R–V4R' },
  { value: 'diffuse', label: 'багато відведень / дифузно' },
];

const stOptions = [
  { value: 'normal', label: 'без значущих змін' },
  { value: 'elevation', label: 'елевація ST' },
  { value: 'depression', label: 'депресія ST' },
  { value: 'nonspecific', label: 'неспецифічні зміни ST' },
];

const stDescriptions = {
  normal: 'Нормальний стартовий варіант: немає значущої елевації або депресії ST.',
  elevation: 'Елевацію ST потрібно оцінювати разом із клінікою, динамікою ЕКГ, тропонінами та критеріями STEMI.',
  depression: 'Депресія ST може відповідати ішемії, перевантаженню, дигіталісному ефекту або вторинним змінам реполяризації.',
  nonspecific: 'Неспецифічні зміни ST краще описувати обережно, особливо якщо немає типової клініки або динаміки.',
};

const tWaveOptions = [
  { value: 'normal', label: 'без гострих ішемічних змін' },
  { value: 'inversion', label: 'інверсія T' },
  { value: 'peaked', label: 'високі загострені T' },
  { value: 'flattened', label: 'згладжені T' },
  { value: 'biphasic', label: 'двофазні T' },
];

const tWaveDescriptions = {
  normal: 'Нормальний стартовий варіант: зубці T без гострих ішемічних змін.',
  inversion: 'Інверсію T оцінюйте за локалізацією, симетричністю, глибиною та динамікою, особливо при болю в грудях.',
  peaked: 'Високі загострені T можуть бути ранньою ішемічною зміною або ознакою гіперкаліємії. Варто співставити з калієм і клінікою.',
  flattened: 'Згладжені T часто неспецифічні; можливі електролітні, медикаментозні або ішемічні причини.',
  biphasic: 'Двофазні T у передніх відведеннях можуть бути клінічно важливими, зокрема при підозрі на Wellens-патерн.',
};

const qWaveOptions = [
  { value: 'absent', label: 'не виявлені' },
  { value: 'present', label: 'наявні' },
];

const qWaveDescriptions = {
  absent: 'Нормальний стартовий варіант: патологічні зубці Q не виявлені.',
  present: 'Патологічні Q можуть відповідати перенесеному інфаркту або іншій структурній причині. Оцінюйте разом з анамнезом, ЕхоКГ і попередніми ЕКГ.',
};

const rightHeartOverloadOptions = [
  { value: 'dominantRV1', label: 'Домінантний R у V1' },
  { value: 'rightAxisDeviation', label: 'Відхилення ЕВС вправо' },
  { value: 'deepSV5V6', label: 'Глибокі S у V5–V6' },
  { value: 'rightPrecordialStrain', label: 'ST-T зміни у V1–V3 за типом перевантаження' },
];

const leftAtrialOverloadOptions = [
  { value: 'wideNotchedPII', label: 'P у II розширений / двогорбий' },
  { value: 'terminalNegativePV1', label: 'Виражена негативна термінальна фаза P у V1' },
];

const rightAtrialOverloadOptions = [
  { value: 'tallPeakedPInferior', label: 'Високий загострений P у II, III, aVF' },
  { value: 'pPulmonale', label: 'P pulmonale' },
];

const normalChecklistValues = {
  rate: '76',
  rrCells: '',
  rhythmType: 'sinus',
  rhythmRegularity: 'regular',
  rhythmText: '',
  rhythmTextEdited: false,
  axisI: 'positive',
  axisII: 'positive',
  axisAvf: 'positive',
  pqMs: '180',
  pqClarification: '',
  qrsMs: '90',
  qrsClarification: '',
  stStatus: 'normal',
  stLeads: '',
  tWaveStatus: 'normal',
  tWaveLeads: '',
  qWaveStatus: 'absent',
  qWaveLeads: '',
  sv1Mm: '',
  rv5v6Mm: '',
  ravlMm: '',
  sv3Mm: '',
  rightHeartOverloadSigns: [],
  leftAtrialOverloadSigns: [],
  rightAtrialOverloadSigns: [],
};

function formatNumber(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(number)) return '';
  return String(Math.round(number));
}

function parsePositiveNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function cellsToMs(cells, paperSpeed) {
  const value = Number(String(cells || '').replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * getSmallCellDurationMs(paperSpeed));
}

function calculateRateFromRrCells(rrCells, paperSpeed) {
  const rrMs = cellsToMs(rrCells, paperSpeed);
  if (!rrMs) return null;
  return Math.round(60000 / rrMs);
}

function getRateStatus(rate) {
  if (!rate) return '';
  if (rate < 60) return 'брадикардія';
  if (rate > 100) return 'тахікардія';
  return '';
}

function getPqStatus(pqMs) {
  const value = Number(formatNumber(pqMs));
  if (!value) return { type: '', label: 'введіть PQ для інтерпретації' };
  if (value < 120) return { type: 'short', label: 'Інтерпретація: вкорочений PQ' };
  if (value > 200) return { type: 'long', label: 'Інтерпретація: подовжений PQ' };
  return { type: 'normal', label: 'Інтерпретація: PQ у межах норми' };
}

function getQrsStatus(qrsMs) {
  const value = Number(formatNumber(qrsMs));
  if (!value) return { type: '', label: 'введіть QRS для інтерпретації' };
  if (value < 60) return { type: 'short', label: 'Інтерпретація: вузький QRS / перевірити коректність виміру' };
  if (value > 110) return { type: 'wide', label: 'Інтерпретація: розширений QRS' };
  return { type: 'normal', label: 'Інтерпретація: QRS у межах норми' };
}

function getPqClarificationLabel(type, value) {
  if (!type || !value) return '';
  return pqClarificationOptions[type]?.find((option) => option.value === value)?.label || '';
}

function getQrsClarificationLabel(value) {
  if (!value) return '';
  return qrsClarificationOptions.find((option) => option.value === value)?.label || '';
}

function getQtFormulaOption(value) {
  return qtFormulaOptions.find((option) => option.value === value) || qtFormulaOptions[0];
}

function getSelectedQtc(qtMetrics, formula) {
  if (!qtMetrics) return null;
  return qtMetrics[getQtFormulaOption(formula).metric] || null;
}

function getQtInterpretation(qtc, sex) {
  if (!qtc) return null;

  if (qtc < 350) {
    return {
      status: 'short',
      label: 'Короткий QTc',
      conclusionLabel: 'короткий',
      toneClass: 'border-amber-100 bg-amber-50 text-amber-950',
      text: 'QTc виглядає коротким. Доцільно перевірити вимірювання, електроліти та клінічний контекст.',
    };
  }

  const prolongedThreshold = sex === 'female' ? 470 : 450;

  if (qtc >= 500) {
    return {
      status: 'markedlyProlonged',
      label: 'Значно подовжений QTc',
      conclusionLabel: 'значно подовжений',
      toneClass: 'border-red-100 bg-red-50 text-red-950',
      text: 'QTc ≥500 мс асоціюється з підвищеним ризиком шлуночкових аритмій. Потрібна клінічна оцінка причин і ризиків.',
    };
  }

  if (qtc > prolongedThreshold) {
    return {
      status: 'prolonged',
      label: 'Подовжений QTc',
      conclusionLabel: 'подовжений',
      toneClass: 'border-amber-100 bg-amber-50 text-amber-950',
      text: 'QTc перевищує орієнтовну межу для статі. Варто оцінити ліки, електроліти, ЧСС і супутні стани.',
    };
  }

  return {
    status: 'normal',
    label: 'QTc у межах орієнтовної норми',
    conclusionLabel: '',
    toneClass: 'border-emerald-100 bg-emerald-50 text-emerald-950',
    text: 'QTc не виглядає подовженим за обраними орієнтирами. Інтерпретувати разом із клінікою та якістю вимірювання.',
  };
}

function getQtCauseGroup(status) {
  if (status === 'short') return 'short';
  if (status === 'prolonged' || status === 'markedlyProlonged') return 'prolonged';
  return '';
}

function getQtCauseLabel(status, value) {
  const group = getQtCauseGroup(status);
  if (!group || !value) return '';
  return qtCauseOptions[group]?.find((option) => option.value === value)?.label || '';
}

function getLeadLabel(value) {
  if (!value) return '';
  return leadOptions.find((option) => option.value === value)?.label || '';
}

function getLeadPhrase(value) {
  const label = getLeadLabel(value);
  if (!label) return '';
  if (value === 'diffuse') return ' у багатьох відведеннях / дифузно';
  return ` у відведеннях ${label}`;
}

function buildStText(values) {
  if (values.stStatus === 'elevation') {
    return `елевація сегмента ST${getLeadPhrase(values.stLeads)}`;
  }
  if (values.stStatus === 'depression') {
    return `депресія сегмента ST${getLeadPhrase(values.stLeads)}`;
  }
  if (values.stStatus === 'nonspecific') {
    return `неспецифічні зміни сегмента ST${getLeadPhrase(values.stLeads)}`;
  }
  return 'сегмент ST без значущої елевації або депресії';
}

function buildTWaveText(values) {
  if (values.tWaveStatus === 'inversion') {
    return `інверсія зубців T${getLeadPhrase(values.tWaveLeads)}`;
  }
  if (values.tWaveStatus === 'peaked') {
    return `високі загострені зубці T${getLeadPhrase(values.tWaveLeads)}`;
  }
  if (values.tWaveStatus === 'flattened') {
    return `згладжені зубці T${getLeadPhrase(values.tWaveLeads)}`;
  }
  if (values.tWaveStatus === 'biphasic') {
    return `двофазні зубці T${getLeadPhrase(values.tWaveLeads)}`;
  }
  return 'зубці T без гострих ішемічних змін';
}

function buildQWaveText(values) {
  if (values.qWaveStatus === 'present') {
    return `патологічні зубці Q${getLeadPhrase(values.qWaveLeads)}`;
  }
  return 'патологічні зубці Q не виявлені';
}

function getHypertrophyCriteria(values, sex) {
  const sv1 = parsePositiveNumber(values.sv1Mm);
  const rv5v6 = parsePositiveNumber(values.rv5v6Mm);
  const ravl = parsePositiveNumber(values.ravlMm);
  const sv3 = parsePositiveNumber(values.sv3Mm);
  const sokolowSum = sv1 !== null && rv5v6 !== null ? sv1 + rv5v6 : null;
  const cornellSum = ravl !== null && sv3 !== null ? ravl + sv3 : null;
  const cornellThreshold = sex === 'female' ? 20 : 28;

  return {
    sokolowSum,
    cornellSum,
    sokolowPositive: sokolowSum !== null && sokolowSum >= 35,
    cornellPositive: cornellSum !== null && cornellSum > cornellThreshold,
    cornellThreshold,
  };
}

function buildHypertrophyTexts(values, sex) {
  const criteria = getHypertrophyCriteria(values, sex);
  const lvhCriteria = [
    criteria.sokolowPositive ? 'Соколов-Лайон' : '',
    criteria.cornellPositive ? 'Корнелльський вольтаж' : '',
  ].filter(Boolean);
  const lines = [];

  if (lvhCriteria.length) {
    lines.push(`ЕКГ відповідає критеріям гіпертрофії лівого шлуночка (${lvhCriteria.join(', ')})`);
  }
  if (values.rightHeartOverloadSigns?.length) {
    lines.push('ЕКГ-ознаки перевантаження правих відділів');
  }
  if (values.leftAtrialOverloadSigns?.length) {
    lines.push('ЕКГ-ознаки перевантаження лівого передсердя');
  }
  if (values.rightAtrialOverloadSigns?.length) {
    lines.push('ЕКГ-ознаки перевантаження правого передсердя');
  }

  return lines;
}

function capitalizeSentence(text) {
  const trimmed = text?.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function getEffectiveRate(values, paperSpeed) {
  const manualRate = formatNumber(values.rate);
  const calculatedRate = calculateRateFromRrCells(values.rrCells, paperSpeed);
  return calculatedRate || Number(manualRate) || null;
}

function buildRhythmText(values, rate) {
  if (values.rhythmType === 'sinus') {
    if (rate && rate < 60) {
      return `Синусова брадикардія, ЧСС ${rate}/хв`;
    }
    if (rate && rate > 100) {
      return `Синусова тахікардія, ЧСС ${rate}/хв`;
    }

    const regularity = values.rhythmRegularity === 'irregular' ? 'нерегулярний' : 'регулярний';
    return `Синусовий ритм, ${regularity}, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'af') {
    return `Фібриляція передсердь, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'flutter') {
    return `Тріпотіння передсердь, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'paced') {
    return `Ритм електрокардіостимулятора, ЧСС ${rate || '__'}/хв`;
  }

  const rhythmLabel = rhythmOptions.find((option) => option.value === values.rhythmType)?.label || 'ритм потребує уточнення';
  if (values.rhythmType === 'other') {
    return `Ритм потребує уточнення, ЧСС ${rate || '__'}/хв`;
  }

  return `${rhythmLabel.charAt(0).toUpperCase()}${rhythmLabel.slice(1)} ритм, ЧСС ${rate || '__'}/хв`;
}

function buildAxisText(values) {
  const { axisI, axisII, axisAvf } = values;

  if (axisI === 'positive' && axisAvf === 'positive') {
    if (axisII === 'isoelectric') {
      return 'електрична вісь серця не відхилена; у II відведенні QRS ізоелектричний (R=S), оцінити разом з іншими відведеннями';
    }
    return 'електрична вісь серця не відхилена';
  }

  if (axisI === 'positive' && axisAvf === 'negative') {
    return axisII === 'positive'
      ? 'електрична вісь серця в межах норми або помірно відхилена вліво'
      : 'електрична вісь серця відхилена вліво';
  }

  if (axisI === 'negative' && axisAvf === 'positive') {
    return 'електрична вісь серця відхилена вправо';
  }

  if (axisI === 'negative' && axisAvf === 'negative') {
    return 'електрична вісь серця різко відхилена';
  }

  return 'електрична вісь серця потребує уточнення за відведеннями кінцівок';
}

function buildQtConclusionText(qtMetrics, qtFormula, qtInterpretation, qtCause) {
  if (!qtMetrics) return '';
  const formulaOption = getQtFormulaOption(qtFormula);
  const qtcValue = qtMetrics[formulaOption.metric];
  const causeLabel = getQtCauseLabel(qtInterpretation?.status, qtCause);
  return [
    `QT ${qtMetrics.qt} мс`,
    `QTc ${formulaOption.label} ${qtcValue} мс`,
    qtInterpretation?.conclusionLabel || '',
    causeLabel ? `можлива причина: ${causeLabel}` : '',
  ].filter(Boolean).join(', ');
}

function buildConclusion(values, paperSpeed, qtMetrics, qtFormula, qtInterpretation, qtCause, sex) {
  const rate = getEffectiveRate(values, paperSpeed);
  const rhythm = values.rhythmText?.trim() || buildRhythmText(values, rate);
  const pqMs = formatNumber(values.pqMs);
  const pqStatus = getPqStatus(values.pqMs);
  const pqClarification = getPqClarificationLabel(pqStatus.type, values.pqClarification);
  const pqText = pqMs
    ? [`PQ ${pqMs} мс`, pqStatus.type === 'short' ? 'вкорочений' : '', pqStatus.type === 'long' ? 'подовжений' : '', pqClarification]
      .filter(Boolean)
      .join(', ')
    : '';
  const qrsMs = formatNumber(values.qrsMs);
  const qrsStatus = getQrsStatus(values.qrsMs);
  const qrsClarification = qrsStatus.type === 'wide' ? getQrsClarificationLabel(values.qrsClarification) : '';
  const qrsText = qrsMs
    ? [`QRS ${qrsMs} мс`, qrsStatus.type === 'wide' ? 'розширений' : '', qrsClarification]
      .filter(Boolean)
      .join(', ')
    : '';
  const qtText = buildQtConclusionText(qtMetrics, qtFormula, qtInterpretation, qtCause);
  const lines = [
    rhythm,
    buildAxisText(values),
    pqText,
    qrsText,
    qtText,
    buildStText(values),
    buildTWaveText(values),
    buildQWaveText(values),
    ...buildHypertrophyTexts(values, sex),
  ].filter(Boolean).map(capitalizeSentence);

  if (!lines.length) {
    return 'Заповніть пункти чек-листа, щоб сформувати короткий структурований висновок.';
  }

  return `${lines.join('. ')}.`;
}

export default function EcgChecklistModule() {
  const [values, setValues] = useState(normalChecklistValues);
  const [qtForm, setQtForm] = useState({
    paperSpeed: '25',
    qt: '420',
    sex: 'male',
    formula: 'fridericia',
    cause: '',
  });
  const [showChamberOverloadDetails, setShowChamberOverloadDetails] = useState(false);
  const calculatedRate = useMemo(
    () => calculateRateFromRrCells(values.rrCells, qtForm.paperSpeed),
    [values.rrCells, qtForm.paperSpeed],
  );
  const effectiveRate = calculatedRate || Number(formatNumber(values.rate)) || null;
  const qtRrMs = useMemo(() => {
    const rrFromCells = cellsToMs(values.rrCells, qtForm.paperSpeed);
    if (rrFromCells) return rrFromCells;
    if (effectiveRate) return Math.round(60000 / effectiveRate);
    return null;
  }, [values.rrCells, qtForm.paperSpeed, effectiveRate]);
  const qtMetricsInput = useMemo(() => buildQtMetricsInput({
    inputMode: 'ms',
    paperSpeed: qtForm.paperSpeed,
    qt: qtForm.qt,
    rr: qtRrMs ? String(qtRrMs) : '',
    heartRate: '',
    sex: qtForm.sex,
  }), [qtForm.paperSpeed, qtForm.qt, qtForm.sex, qtRrMs]);
  const qtMetrics = useMemo(() => calculateQtMetrics(qtMetricsInput), [qtMetricsInput]);
  const selectedQtc = useMemo(() => getSelectedQtc(qtMetrics, qtForm.formula), [qtMetrics, qtForm.formula]);
  const qtInterpretation = useMemo(() => getQtInterpretation(selectedQtc, qtForm.sex), [selectedQtc, qtForm.sex]);
  const conclusion = useMemo(
    () => buildConclusion(values, qtForm.paperSpeed, qtMetrics, qtForm.formula, qtInterpretation, qtForm.cause, qtForm.sex),
    [values, qtForm.paperSpeed, qtMetrics, qtForm.formula, qtInterpretation, qtForm.cause, qtForm.sex],
  );
  const qtNextSteps = useMemo(() => {
    if (!qtMetrics || !qtInterpretation) return [];
    return getQtClinicalNextSteps({ ...qtMetrics, interpretation: qtInterpretation });
  }, [qtMetrics, qtInterpretation]);
  const qtCauseGroup = getQtCauseGroup(qtInterpretation?.status);
  const visibleQtCauseOptions = qtCauseGroup ? qtCauseOptions[qtCauseGroup] : [];
  const qtCauseDescription = visibleQtCauseOptions.some((option) => option.value === qtForm.cause)
    ? qtCauseDescriptions[qtForm.cause]
    : '';
  const rhythmText = useMemo(() => buildRhythmText(values, effectiveRate), [values, effectiveRate]);
  const pqStatus = useMemo(() => getPqStatus(values.pqMs), [values.pqMs]);
  const visiblePqClarificationOptions = pqClarificationOptions[pqStatus.type] || [];
  const pqClarificationDescription = pqClarificationDescriptions[values.pqClarification] || '';
  const qrsStatus = useMemo(() => getQrsStatus(values.qrsMs), [values.qrsMs]);
  const showQrsClarification = qrsStatus.type === 'wide';
  const qrsClarificationDescription = qrsClarificationDescriptions[values.qrsClarification] || '';
  const showStLeads = values.stStatus !== 'normal';
  const showTWaveLeads = values.tWaveStatus !== 'normal';
  const showQWaveLeads = values.qWaveStatus === 'present';
  const stDescription = stDescriptions[values.stStatus] || '';
  const tWaveDescription = tWaveDescriptions[values.tWaveStatus] || '';
  const qWaveDescription = qWaveDescriptions[values.qWaveStatus] || '';
  const hypertrophyCriteria = useMemo(() => getHypertrophyCriteria(values, qtForm.sex), [values, qtForm.sex]);
  const chamberOverloadSignsCount = [
    values.rightHeartOverloadSigns,
    values.leftAtrialOverloadSigns,
    values.rightAtrialOverloadSigns,
  ].reduce((total, list) => total + (Array.isArray(list) ? list.length : 0), 0);

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const toggleArrayValue = (id, value) => {
    setValues((current) => {
      const list = Array.isArray(current[id]) ? current[id] : [];
      const nextList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...current, [id]: nextList };
    });
  };
  const updateRhythmOutput = (value) => {
    setValues((current) => ({ ...current, rhythmText: value, rhythmTextEdited: true }));
  };
  const resetToNormal = () => setValues(normalChecklistValues);
  const updateQtForm = (field, value) => setQtForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (values.rhythmTextEdited && values.rhythmText.trim()) return;
    setValues((current) => {
      const nextText = buildRhythmText(current, effectiveRate);
      if (current.rhythmText === nextText) return current;
      return { ...current, rhythmText: nextText };
    });
  }, [effectiveRate, values.rhythmText, values.rhythmTextEdited, values.rhythmType, values.rhythmRegularity]);

  return (
    <EcgModuleShell
      eyebrow="Чек-лист"
      title="Покроковий аналіз ЕКГ"
      description="Базовий маршрут: ЧСС, ритм, вісь, інтервали, провідність, гіпертрофія, ST-T та патологічні Q."
    >
      <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-emerald-900">
          Чек-лист заповнений приблизною нормою. Змініть лише ті пункти, де на ЕКГ є відхилення.
        </p>
        <button
          type="button"
          onClick={resetToNormal}
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          Повернути норму
        </button>
      </div>

      <div className="space-y-3">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">1. Швидкість плівки та ЧСС</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Швидкість</span>
              <select
                value={qtForm.paperSpeed}
                onChange={(event) => updateQtForm('paperSpeed', event.target.value)}
                className={inputClass}
              >
                <option value="25">25 мм/с</option>
                <option value="50">50 мм/с</option>
              </select>
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                1 маленька клітинка = {getSmallCellDurationMs(qtForm.paperSpeed)} мс
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">ЧСС</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.rate}
                onChange={(event) => update('rate', event.target.value)}
                placeholder="76"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">приблизна норма: 60–100/хв</span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">RR, маленьких клітинок</span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={values.rrCells}
                onChange={(event) => update('rrCells', event.target.value)}
                placeholder="Наприклад: 20"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                якщо RR заповнено, ЧСС буде розрахована автоматично{calculatedRate ? `: ${calculatedRate}/хв` : ''}
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">2. Ритм</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Основний ритм</span>
              <select value={values.rhythmType} onChange={(event) => update('rhythmType', event.target.value)} className={inputClass}>
                {rhythmOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Регулярність</span>
              <select value={values.rhythmRegularity} onChange={(event) => update('rhythmRegularity', event.target.value)} className={inputClass}>
                {regularityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-slate-500">
            Для синусового ритму програма сама формує синусову брадикардію або тахікардію за ЧСС.
          </p>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Текст у висновку</span>
            <textarea
              value={values.rhythmText || rhythmText}
              onChange={(event) => updateRhythmOutput(event.target.value)}
              rows={2}
              className={`${textareaClass} bg-white`}
            />
          </label>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">3. Електрична вісь</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[
              ['axisI', 'I'],
              ['axisII', 'II'],
              ['axisAvf', 'aVF'],
            ].map(([id, label]) => (
              <label key={id} className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">QRS у {label}</span>
                <select value={values[id]} onChange={(event) => update(id, event.target.value)} className={inputClass}>
                  {polarityOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-slate-500">
            Якщо R=S, оберіть “ізоелектричний”; програма сформує обережний висновок.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">4. Інтервал PQ</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">PQ, мс</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.pqMs}
                onChange={(event) => update('pqMs', event.target.value)}
                placeholder="180"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                {pqStatus.label}; приблизна норма: 120–200 мс
              </span>
            </label>
            {visiblePqClarificationOptions.length > 0 ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Уточнення PQ</span>
                <select
                  value={values.pqClarification}
                  onChange={(event) => update('pqClarification', event.target.value)}
                  className={inputClass}
                >
                  <option value="">оберіть, якщо потрібно</option>
                  {visiblePqClarificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {pqClarificationDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {pqClarificationDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">5. Комплекс QRS</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">QRS, мс</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.qrsMs}
                onChange={(event) => update('qrsMs', event.target.value)}
                placeholder="90"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                {qrsStatus.label}; приблизна норма: 60–110 мс
              </span>
            </label>
            {showQrsClarification ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Уточнення QRS</span>
                <select
                  value={values.qrsClarification}
                  onChange={(event) => update('qrsClarification', event.target.value)}
                  className={inputClass}
                >
                  <option value="">оберіть, якщо потрібно</option>
                  {qrsClarificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {showQrsClarification && qrsClarificationDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {qrsClarificationDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">6. QT / QTc</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            RR для QTc береться з верхнього блоку: з RR у клітинках або з введеної ЧСС.
          </p>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">QT, мс</span>
              <input
                type="number"
                min="0"
                step="1"
                value={qtForm.qt}
                onChange={(event) => updateQtForm('qt', event.target.value)}
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                RR для розрахунку: {qtRrMs ? `${qtRrMs} мс` : 'введіть ЧСС або RR у клітинках вище'}
              </span>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Стать</span>
                <select value={qtForm.sex} onChange={(event) => updateQtForm('sex', event.target.value)} className={inputClass}>
                  <option value="male">чоловік</option>
                  <option value="female">жінка</option>
                </select>
                <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                  межа: чоловіки до 450 мс, жінки до 470 мс
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Формула QTc</span>
                <select value={qtForm.formula} onChange={(event) => updateQtForm('formula', event.target.value)} className={inputClass}>
                  {qtFormulaOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                  обрана формула потрапляє у висновок
                </span>
              </label>
            </div>
          </div>

          {qtMetrics ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="rounded-md border border-blue-100 bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Результат</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
                  QTc {getQtFormulaOption(qtForm.formula).label} {selectedQtc} мс
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  QT {qtMetrics.qt} мс, RR {Math.round(qtMetrics.rr * 1000)} мс
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {qtFormulaOptions
                    .filter((option) => option.value !== qtForm.formula)
                    .map((option) => (
                      <p key={option.value} className="rounded-md bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                        {option.label} {qtMetrics[option.metric]} мс
                      </p>
                    ))}
                </div>
              </div>

              <div className={`rounded-md border p-3 ${qtInterpretation?.toneClass || 'border-slate-200 bg-white text-slate-900'}`}>
                <p className="text-sm font-bold">{qtInterpretation?.label}</p>
                <p className="mt-1 text-sm leading-relaxed">{qtInterpretation?.text}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {qtNextSteps.map((step) => (
                    <li key={step}>• {step}</li>
                  ))}
                </ul>
              </div>

              {visibleQtCauseOptions.length > 0 ? (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Можлива причина / контекст</span>
                  <select
                    value={visibleQtCauseOptions.some((option) => option.value === qtForm.cause) ? qtForm.cause : ''}
                    onChange={(event) => updateQtForm('cause', event.target.value)}
                    className={inputClass}
                  >
                    <option value="">оберіть, якщо потрібно</option>
                    {visibleQtCauseOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              ) : null}

              {qtCauseDescription ? (
                <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                  {qtCauseDescription}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
              Введіть QT і ЧСС або RR у клітинках у верхньому блоці.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">7. Сегмент ST</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Оцінка ST</span>
              <select value={values.stStatus} onChange={(event) => update('stStatus', event.target.value)} className={inputClass}>
                {stOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                приблизна норма: без значущої елевації або депресії
              </span>
            </label>

            {showStLeads ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Відведення</span>
                <select value={values.stLeads} onChange={(event) => update('stLeads', event.target.value)} className={inputClass}>
                  <option value="">оберіть відведення</option>
                  {leadOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}

            {stDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {stDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">8. Зубець T</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Оцінка T</span>
              <select value={values.tWaveStatus} onChange={(event) => update('tWaveStatus', event.target.value)} className={inputClass}>
                {tWaveOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                приблизна норма: без гострих ішемічних змін
              </span>
            </label>

            {showTWaveLeads ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Відведення</span>
                <select value={values.tWaveLeads} onChange={(event) => update('tWaveLeads', event.target.value)} className={inputClass}>
                  <option value="">оберіть відведення</option>
                  {leadOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}

            {tWaveDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {tWaveDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">9. Патологічні Q</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Оцінка Q</span>
              <select value={values.qWaveStatus} onChange={(event) => update('qWaveStatus', event.target.value)} className={inputClass}>
                {qWaveOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                приблизна норма: патологічні Q не виявлені
              </span>
            </label>

            {showQWaveLeads ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Відведення</span>
                <select value={values.qWaveLeads} onChange={(event) => update('qWaveLeads', event.target.value)} className={inputClass}>
                  <option value="">оберіть відведення</option>
                  {leadOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}

            {qWaveDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {qWaveDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">10. Ознаки гіпертрофії / перевантаження камер</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            У нормі цей блок нічого не додає до висновку. Якщо критерії виконуються, програма вкаже їх у дужках.
          </p>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Стать для Корнелльського критерію</span>
                <select value={qtForm.sex} onChange={(event) => updateQtForm('sex', event.target.value)} className={inputClass}>
                  <option value="male">чоловік</option>
                  <option value="female">жінка</option>
                </select>
                <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                  синхронізовано з блоком QT / QTc
                </span>
              </label>
              <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium leading-relaxed text-slate-600">
                Соколов-Лайон: S V1 + R V5/V6 ≥35 мм. Корнелльський вольтаж: R aVL + S V3 &gt;28 мм у чоловіків або &gt;20 мм у жінок.
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Соколов-Лайон</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">S V1, мм</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={values.sv1Mm}
                      onChange={(event) => update('sv1Mm', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">R V5/V6, мм</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={values.rv5v6Mm}
                      onChange={(event) => update('rv5v6Mm', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
                <p className={`mt-2 text-sm font-semibold ${hypertrophyCriteria.sokolowPositive ? 'text-blue-800' : 'text-slate-500'}`}>
                  Сума: {hypertrophyCriteria.sokolowSum !== null ? `${hypertrophyCriteria.sokolowSum} мм` : '—'}
                  {hypertrophyCriteria.sokolowPositive ? ' — критерій виконується' : ''}
                </p>
              </div>

              <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Корнелльський вольтаж</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">R aVL, мм</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={values.ravlMm}
                      onChange={(event) => update('ravlMm', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-slate-700">S V3, мм</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={values.sv3Mm}
                      onChange={(event) => update('sv3Mm', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
                <p className={`mt-2 text-sm font-semibold ${hypertrophyCriteria.cornellPositive ? 'text-blue-800' : 'text-slate-500'}`}>
                  Сума: {hypertrophyCriteria.cornellSum !== null ? `${hypertrophyCriteria.cornellSum} мм` : '—'}
                  {hypertrophyCriteria.cornellPositive ? ' — критерій виконується' : `; поріг: >${hypertrophyCriteria.cornellThreshold} мм`}
                </p>
              </div>
            </div>

            <div
              className={`mt-3 rounded-md border transition ${
                showChamberOverloadDetails
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-teal-300 bg-slate-50 hover:border-teal-500'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowChamberOverloadDetails((current) => !current)}
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-teal-50/40"
              >
                <span>
                  <span className={`block text-sm font-bold ${showChamberOverloadDetails ? 'text-teal-900' : 'text-slate-900'}`}>Додаткові ознаки перевантаження камер</span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">
                    Праві відділи, ліве передсердя, праве передсердя
                    {chamberOverloadSignsCount ? `; вибрано: ${chamberOverloadSignsCount}` : ''}
                  </span>
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-bold transition ${
                    showChamberOverloadDetails ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  {showChamberOverloadDetails ? '−' : '+'}
                </span>
              </button>

              {showChamberOverloadDetails ? (
                <div className="grid gap-3 border-t border-teal-300 bg-white p-3 lg:grid-cols-3">
                  {[
                    ['rightHeartOverloadSigns', 'Праві відділи', rightHeartOverloadOptions],
                    ['leftAtrialOverloadSigns', 'Ліве передсердя', leftAtrialOverloadOptions],
                    ['rightAtrialOverloadSigns', 'Праве передсердя', rightAtrialOverloadOptions],
                  ].map(([id, title, options]) => (
                    <div key={id} className="rounded-md border border-slate-200 bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{title}</p>
                      <div className="mt-2 space-y-2">
                        {options.map((option) => (
                          <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={Array.isArray(values[id]) && values[id].includes(option.value)}
                              onChange={() => toggleArrayValue(id, option.value)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h4 className="text-sm font-bold text-blue-900">Структурований висновок</h4>
        <textarea value={conclusion} readOnly rows={4} className={`${textareaClass} mt-3 bg-white`} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Коли діяти негайно</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>STEMI або нова значуща елевація ST у відповідному клінічному контексті.</li>
            <li>Ширококомплексна тахікардія з нестабільністю.</li>
            <li>Виражена брадикардія, AV-блокада високого ступеня або синкопе.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Наступний крок</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Порівняти з попередніми ЕКГ, співставити з симптомами, гемодинамікою, тропонінами,
            електролітами та клінічним контекстом.
          </p>
        </div>
      </div>

      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
