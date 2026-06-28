export function calculateBMI(weight, height) {
  const numericWeight = parsePositiveNumber(weight);
  const numericHeight = parsePositiveNumber(height);

  if (numericWeight === null || numericHeight === null) {
    return '';
  }

  const heightInMeters = numericHeight / 100;
  const bmi = numericWeight / (heightInMeters * heightInMeters);

  return String(roundToOneDecimal(bmi));
}

export function getBMICategory(bmi) {
  const numericBmi = parsePositiveNumber(bmi);

  if (numericBmi === null) return null;

  if (numericBmi < 18.5) return 'Недостатня маса тіла.';
  if (numericBmi < 25) return 'Нормальна маса тіла.';
  if (numericBmi < 30) return 'Надмірна маса тіла.';
  if (numericBmi < 35) return 'Ожиріння I ступеня.';
  if (numericBmi < 40) return 'Ожиріння II ступеня.';
  return 'Ожиріння III ступеня.';
}

export function calculateTargetWeightRange(height, currentWeight) {
  const numericHeight = parsePositiveNumber(height);
  const numericWeight = parsePositiveNumber(currentWeight);

  if (numericHeight === null) return null;

  const heightInMeters = numericHeight / 100;
  const heightSquared = heightInMeters * heightInMeters;
  const minNormalWeight = roundToOneDecimal(18.5 * heightSquared);
  const maxNormalWeight = roundToOneDecimal(24.9 * heightSquared);
  const weightForBmi25 = roundToOneDecimal(25 * heightSquared);
  const reductionToBmi25 =
    numericWeight !== null && numericWeight > weightForBmi25
      ? roundToOneDecimal(numericWeight - weightForBmi25)
      : null;

  return {
    normalRange: `${minNormalWeight}–${maxNormalWeight} кг`,
    weightForBmi25: `${weightForBmi25} кг`,
    reductionToBmi25: reductionToBmi25 !== null ? `${reductionToBmi25} кг` : null,
  };
}

export function getWaistRisk(sex, waist) {
  const numericWaist = parsePositiveNumber(waist);

  if (!sex || numericWaist === null) return null;

  if (sex === 'male') {
    if (numericWaist < 94) return { level: 'lower', label: 'нижчий ризик' };
    if (numericWaist < 102) return { level: 'increased', label: 'підвищений ризик' };
    return { level: 'high', label: 'високий ризик' };
  }

  if (sex === 'female') {
    if (numericWaist < 80) return { level: 'lower', label: 'нижчий ризик' };
    if (numericWaist < 88) return { level: 'increased', label: 'підвищений ризик' };
    return { level: 'high', label: 'високий ризик' };
  }

  return null;
}

export function getCardiometabolicRisk(bmi, waistRisk) {
  const numericBmi = parsePositiveNumber(bmi);

  if (numericBmi === null) return null;

  const hasHighWaist = waistRisk?.level === 'high';
  const hasIncreasedWaist = waistRisk?.level === 'increased';

  if (numericBmi >= 35 && hasHighWaist) {
    return {
      level: 'very-high',
      marker: '🔴',
      label: 'дуже високий',
      className: 'border-red-200 bg-red-50 text-red-800',
    };
  }

  if (numericBmi >= 30 || hasHighWaist) {
    return {
      level: 'high',
      marker: '🟠',
      label: 'високий',
      className: 'border-orange-200 bg-orange-50 text-orange-800',
    };
  }

  if (numericBmi >= 25 || hasIncreasedWaist) {
    return {
      level: 'increased',
      marker: '🟡',
      label: 'підвищений',
      className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    };
  }

  return {
    level: 'lower',
    marker: '🟢',
    label: 'нижчий',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  };
}

export function getBMIRecommendations(bmi, waistRisk) {
  const numericBmi = parsePositiveNumber(bmi);
  const needsAdditionalAssessment =
    numericBmi !== null &&
    (numericBmi >= 30 || (numericBmi >= 27 && waistRisk?.level && waistRisk.level !== 'lower'));

  return {
    additionalChecks: [
      'Артеріальний тиск',
      'HbA1c або глюкоза крові',
      'Ліпідограма',
      'АЛТ / АСТ',
      'Креатинін та ШКФ',
      'ACR сечі за наявності ЦД, АГ або ХХН',
    ],
    patientDiscussion: [
      'Зниження маси тіла на 5–10% може мати клінічну користь.',
      'Регулярна фізична активність.',
      'Харчові звички та калорійність раціону.',
      'Сон, стрес і алкоголь.',
      'Контроль ваги та окружності талії в динаміці.',
    ],
    needsAdditionalAssessment,
    additionalAssessmentText:
      'Розглянути додаткову клінічну оцінку кардіометаболічного ризику, супутніх захворювань та можливих варіантів лікування згідно з чинними клінічними рекомендаціями.',
  };
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function parsePositiveNumber(value) {
  if (!hasValue(value)) return null;

  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseNonNegativeNumber(value) {
  if (!hasValue(value)) return null;

  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function normalizeCreatinineToMgDl(creatinine, unit) {
  const parsed = parsePositiveNumber(creatinine);
  if (parsed === null) return null;

  return unit === 'umolL' ? parsed / 88.4 : parsed;
}

function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

export function getGCategory(egfr) {
  if (egfr >= 90) {
    return {
      category: 'G1',
      interpretation: 'Нормальна або висока ШКФ.',
    };
  }

  if (egfr >= 60) {
    return {
      category: 'G2',
      interpretation: 'Легке зниження ШКФ.',
    };
  }

  if (egfr >= 45) {
    return {
      category: 'G3a',
      interpretation: 'Легке або помірне зниження ШКФ.',
    };
  }

  if (egfr >= 30) {
    return {
      category: 'G3b',
      interpretation: 'Помірне або виражене зниження ШКФ.',
    };
  }

  if (egfr >= 15) {
    return {
      category: 'G4',
      interpretation: 'Виражене зниження ШКФ.',
    };
  }

  return {
    category: 'G5',
    interpretation: 'Ниркова недостатність. Потрібна термінова клінічна оцінка.',
  };
}

export function getACategory(acr) {
  const numericAcr = parsePositiveNumber(acr);
  if (numericAcr === null) return null;

  if (numericAcr < 30) {
    return {
      category: 'A1',
      value: numericAcr,
      interpretation: 'Нормальна або незначно підвищена альбумінурія.',
    };
  }

  if (numericAcr <= 300) {
    return {
      category: 'A2',
      value: numericAcr,
      interpretation: 'Помірно підвищена альбумінурія.',
    };
  }

  return {
    category: 'A3',
    value: numericAcr,
    interpretation: 'Виражено підвищена альбумінурія.',
  };
}

export function getKDIGORisk(gCategory, aCategory) {
  if (!gCategory || !aCategory) return null;

  if ((gCategory === 'G1' || gCategory === 'G2') && aCategory === 'A1') {
    return {
      level: 'Низький ризик',
      color: 'green',
      marker: '🟢',
    };
  }

  if (
    ((gCategory === 'G1' || gCategory === 'G2') && aCategory === 'A2') ||
    (gCategory === 'G3a' && aCategory === 'A1')
  ) {
    return {
      level: 'Помірний ризик',
      color: 'yellow',
      marker: '🟡',
    };
  }

  if (
    ((gCategory === 'G1' || gCategory === 'G2') && aCategory === 'A3') ||
    (gCategory === 'G3a' && aCategory === 'A2')
  ) {
    return {
      level: 'Високий ризик',
      color: 'orange',
      marker: '🟠',
    };
  }

  return {
    level: 'Дуже високий ризик',
    color: 'red',
    marker: '🔴',
  };
}

export function calculateCKDEPI(data) {
  const age = parsePositiveNumber(data.age);
  const creatinineMgDl = normalizeCreatinineToMgDl(data.creatinine, data.creatinineUnit);

  if (!age || !data.sex || !creatinineMgDl) return null;

  const isFemale = data.sex === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const creatinineRatio = creatinineMgDl / kappa;

  const egfr =
    142 *
    Math.pow(Math.min(creatinineRatio, 1), alpha) *
    Math.pow(Math.max(creatinineRatio, 1), -1.2) *
    Math.pow(0.9938, age) *
    (isFemale ? 1.012 : 1);

  const roundedEgfr = Math.round(egfr);
  const gCategory = getGCategory(roundedEgfr);

  return {
    egfr: roundedEgfr,
    creatinineMgDl: Math.round(creatinineMgDl * 100) / 100,
    ...gCategory,
  };
}

export function calculateCockcroftGault(data) {
  const age = parsePositiveNumber(data.age);
  const weight = parsePositiveNumber(data.weight);
  const creatinineMgDl = normalizeCreatinineToMgDl(data.creatinine, data.creatinineUnit);

  if (!age || !weight || !data.sex || !creatinineMgDl) return null;

  const baseCrCl = ((140 - age) * weight) / (72 * creatinineMgDl);
  const crCl = data.sex === 'female' ? baseCrCl * 0.85 : baseCrCl;

  return {
    crCl: roundToOneDecimal(crCl),
  };
}

export function getRenalMedicationAdvice(egfr, crcl, potassium) {
  const numericEgfr = parsePositiveNumber(egfr);
  if (numericEgfr === null) return null;

  const numericCrCl = parsePositiveNumber(crcl);
  const numericPotassium = parsePositiveNumber(potassium);
  const category = getGCategory(numericEgfr).category;
  const advice = {
    category,
    egfr: roundToOneDecimal(numericEgfr),
    crcl: numericCrCl === null ? null : roundToOneDecimal(numericCrCl),
    potassium: numericPotassium === null ? null : roundToOneDecimal(numericPotassium),
    preferredOrUseful: [],
    useWithCaution: [],
    avoidOrReview: [],
    doseAdjustmentNeeded: [],
    monitoring: [],
  };

  advice.monitoring.push(
    'Контролювати креатинін та eGFR у динаміці, особливо після початку або зміни терапії, що впливає на функцію нирок.',
    'При гострому пошкодженні нирок або швидкій зміні креатиніну не покладатися лише на розрахункові eGFR і CrCl для вибору дози.',
  );

  if (numericPotassium === null) {
    advice.monitoring.push(
      'Калій не вказаний. Перед застосуванням препаратів, що впливають на калієвий баланс, потрібен актуальний результат.',
    );
  } else {
    advice.monitoring.push(
      `Введений калій: ${roundToOneDecimal(numericPotassium)} ммоль/л. Оцінити його відповідно до референсного діапазону лабораторії та клінічного контексту.`,
    );
  }

  if (category === 'G1' || category === 'G2') {
    advice.preferredOrUseful.push(
      'Дозування більшості препаратів зазвичай не потребує змін лише на підставі eGFR ≥60 мл/хв/1,73 м².',
      'Нефро- та кардіопротективна терапія може застосовуватися за відповідними показами без автоматичної відміни через категорію G1–G2.',
    );
    advice.useWithCaution.push(
      'Навіть при G1–G2 враховувати ACR, калій, супутні захворювання та динаміку креатиніну.',
    );
    advice.avoidOrReview.push(
      'Переглянути регулярне застосування потенційно нефротоксичних препаратів і безрецептурних НПЗП.',
    );
    advice.doseAdjustmentNeeded.push(
      numericCrCl === null
        ? 'CrCl не розрахований. Якщо інструкція прив’язує дозування до Cockcroft-Gault, потрібні маса тіла та розрахунок CrCl.'
        : `CrCl становить ${roundToOneDecimal(numericCrCl)} мл/хв. Для препаратів із дозуванням за Cockcroft-Gault звірити інструкцію.`,
    );
    advice.monitoring.push('Контролювати ACR, калій та креатинін у динаміці за клінічними показами.');
  }

  if (category === 'G3a') {
    advice.preferredOrUseful.push(
      'Нефро- та кардіопротективні класи можуть залишатися корисними за наявності показань; категорія G3a не є автоматичною причиною їх відміни.',
    );
    advice.useWithCaution.push(
      'Метформін: оцінити доцільність, чинну дозу, ризики та частоту контролю eGFR відповідно до інструкції.',
      'ІАПФ, БРА та антагоністи мінералокортикоїдних рецепторів: контролювати калій і креатинін.',
    );
    advice.avoidOrReview.push(
      'Переглянути регулярне застосування НПЗП та одночасне використання кількох потенційно нефротоксичних препаратів.',
    );
    advice.doseAdjustmentNeeded.push(
      'Перевірити дозування препаратів, виведення яких істотно залежить від функції нирок.',
      numericCrCl === null
        ? 'НОАК: CrCl не розрахований. Для оцінки дозування за Cockcroft-Gault потрібно ввести масу тіла.'
        : `НОАК: оцінювати дозування за CrCl Cockcroft-Gault (${roundToOneDecimal(numericCrCl)} мл/хв) та інструкцією конкретного препарату.`,
    );
    advice.monitoring.push('Контролювати eGFR, CrCl за потреби, калій та переносимість терапії.');
  }

  if (category === 'G3b') {
    advice.preferredOrUseful.push(
      'Терапія з доведеною нефро- або кардіопротективною користю може застосовуватися лише за відповідними показами, з перевіркою допустимості та моніторингом.',
    );
    advice.useWithCaution.push(
      'Метформін: не починати без окремої оцінки; при наближенні eGFR до 30 мл/хв/1,73 м² переглянути допустимість, дозу та інструкцію.',
      'ІАПФ, БРА, антагоністи мінералокортикоїдних рецепторів і калійзберігаючі діуретики: підвищена увага до калію та креатиніну.',
    );
    advice.avoidOrReview.push(
      'Уникати регулярного або тривалого застосування НПЗП без окремого обґрунтування користі та ризику.',
      'Переглянути комбінації потенційно нефротоксичних препаратів.',
    );
    advice.doseAdjustmentNeeded.push(
      numericCrCl === null
        ? 'НОАК: дозування не можна оцінити без CrCl Cockcroft-Gault; потрібно ввести масу тіла.'
        : `НОАК: дозування визначати лише після оцінки CrCl Cockcroft-Gault (${roundToOneDecimal(numericCrCl)} мл/хв) та інструкції.`,
      'Дигоксин, соталол і частина антибіотиків можуть потребувати корекції дози або інтервалу введення.',
    );
    advice.monitoring.push(
      'Частіше контролювати функцію нирок, калій, натрій, об’ємний статус і небажані реакції.',
    );
  }

  if (category === 'G4' || category === 'G5') {
    advice.preferredOrUseful.push(
      'Не відміняти всю терапію автоматично: потенційно корисні препарати оцінювати індивідуально за показами, інструкцією та клінічним станом.',
    );
    advice.useWithCaution.push(
      'Калійзберігаючі препарати мають високий ризик гіперкаліємії та потребують окремої оцінки допустимості й моніторингу.',
      'Будь-які препарати з вузьким терапевтичним вікном або істотним нирковим виведенням потребують посиленого контролю.',
    );
    advice.avoidOrReview.push(
      'Уникати НПЗП, якщо немає окремого клінічного обґрунтування та плану контролю.',
      'Метформін протипоказаний при eGFR <30 мл/хв/1,73 м².',
    );
    advice.doseAdjustmentNeeded.push(
      'Обов’язково переглянути всі препарати та активні метаболіти, що виводяться нирками.',
      numericCrCl === null
        ? 'НОАК: CrCl не розрахований. Перевірити покази, отримати CrCl Cockcroft-Gault і звірити інструкцію конкретного препарату.'
        : `НОАК: перевірити покази, CrCl Cockcroft-Gault (${roundToOneDecimal(numericCrCl)} мл/хв) та інструкцію конкретного препарату.`,
      'Дигоксин, соталол, частина антибіотиків та інші нирково еліміновані препарати можуть потребувати суттєвої корекції або альтернативи.',
    );
    advice.monitoring.push(
      'Контролювати eGFR, CrCl за потреби, калій, натрій, кислотно-лужний стан, об’ємний статус і небажані реакції.',
      'Консультація нефролога бажана у відповідному клінічному контексті.',
    );
  }

  return advice;
}

export function calculateCha2ds2Vasc(data) {
  const score =
    (data.heartFailure ? 1 : 0) +
    (data.hypertension ? 1 : 0) +
    (data.age75OrOlder ? 2 : 0) +
    (data.diabetes ? 1 : 0) +
    (data.strokeTiaThromboembolism ? 2 : 0) +
    (data.vascularDisease ? 1 : 0) +
    (data.age65To74 ? 1 : 0) +
    (data.femaleSex ? 1 : 0);

  let interpretation = 'Низький ризик тромбоемболічних подій.';

  if (score === 1) {
    interpretation = 'Проміжний ризик. Потрібна індивідуальна оцінка користі та ризику антикоагуляції.';
  }

  if (score >= 2) {
    interpretation = 'Підвищений ризик тромбоемболічних подій. Антикоагуляція часто розглядається за показами.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateHasBled(data) {
  const score =
    (data.hypertension ? 1 : 0) +
    (data.abnormalRenalFunction ? 1 : 0) +
    (data.abnormalLiverFunction ? 1 : 0) +
    (data.strokeHistory ? 1 : 0) +
    (data.bleedingHistory ? 1 : 0) +
    (data.labileInr ? 1 : 0) +
    (data.ageOver65 ? 1 : 0) +
    (data.drugs ? 1 : 0) +
    (data.alcohol ? 1 : 0);

  let interpretation = 'Низький ризик кровотеч.';

  if (score === 2) {
    interpretation = 'Помірний ризик кровотеч. Варто перевірити та коригувати модифіковані фактори ризику.';
  }

  if (score >= 3) {
    interpretation = 'Високий ризик кровотеч. Потрібна уважна корекція модифікованих факторів та частіший контроль.';
  }

  return {
    score,
    interpretation,
  };
}

function getCha2ds2VascAnnualStrokeRisk(score) {
  const riskByScore = {
    0: '≈0.2%/рік',
    1: '≈0.6%/рік',
    2: '≈2.2%/рік',
    3: '≈3.2%/рік',
    4: '≈4.8%/рік',
    5: '≈7.2%/рік',
    6: '≈9.7%/рік',
    7: '≈11.2%/рік',
    8: '≈10.8%/рік',
    9: '≈12.2%/рік',
  };

  return riskByScore[score] || 'високий орієнтовний ризик';
}

function getCha2ds2VascEscInterpretation(score, sex) {
  const isFemale = sex === 'female';

  if ((!isFemale && score === 0) || (isFemale && score === 1)) {
    return {
      category: 'Низький ризик',
      status: 'lower',
      text:
        'За ESC-орієнтованим підходом антикоагуляція зазвичай не показана, якщо немає інших клінічних причин.',
      anticoagulationLikely: false,
    };
  }

  if ((!isFemale && score === 1) || (isFemale && score === 2)) {
    return {
      category: 'Проміжний ризик',
      status: 'increased',
      text:
        'Антикоагуляцію доцільно розглянути індивідуально з урахуванням додаткових факторів ризику та побажань пацієнта.',
      anticoagulationLikely: true,
    };
  }

  return {
    category: 'Підвищений ризик',
    status: 'high',
    text:
      'Антикоагулянтна терапія зазвичай розглядається за наявності показань і відсутності абсолютних протипоказань.',
    anticoagulationLikely: true,
  };
}

function getHasBledCategory(score) {
  if (score <= 1) {
    return {
      category: 'Низький ризик кровотечі',
      status: 'lower',
    };
  }

  if (score === 2) {
    return {
      category: 'Помірний ризик кровотечі',
      status: 'increased',
    };
  }

  return {
    category: 'Високий ризик кровотечі',
    status: 'high',
  };
}

export function calculateAfAnticoagulationAssessment(data) {
  const age = parsePositiveNumber(data.age);
  const sex = data.sex;

  if (age === null || !sex) return null;

  const cha2ds2VascData = {
    heartFailure: data.heartFailure,
    hypertension: data.hypertension,
    age75OrOlder: age >= 75,
    diabetes: data.diabetes,
    strokeTiaThromboembolism: data.strokeTiaThromboembolism,
    vascularDisease: data.vascularDisease,
    age65To74: age >= 65 && age < 75,
    femaleSex: sex === 'female',
  };

  const hasBledData = {
    hypertension: data.hypertension,
    abnormalRenalFunction: data.abnormalRenalFunction,
    abnormalLiverFunction: data.abnormalLiverFunction,
    strokeHistory: data.strokeTiaThromboembolism,
    bleedingHistory: data.bleedingHistory,
    labileInr: data.labileInr,
    ageOver65: age > 65,
    drugs: data.drugs,
    alcohol: data.alcohol,
  };

  const cha2ds2Vasc = calculateCha2ds2Vasc(cha2ds2VascData);
  const hasBled = calculateHasBled(hasBledData);
  const chaEsc = getCha2ds2VascEscInterpretation(cha2ds2Vasc.score, sex);
  const hasBledCategory = getHasBledCategory(hasBled.score);

  return {
    cha2ds2Vasc: {
      ...cha2ds2Vasc,
      category: chaEsc.category,
      status: chaEsc.status,
      annualStrokeRisk: getCha2ds2VascAnnualStrokeRisk(cha2ds2Vasc.score),
      escInterpretation: chaEsc.text,
      anticoagulationLikely: chaEsc.anticoagulationLikely,
    },
    hasBled: {
      ...hasBled,
      category: hasBledCategory.category,
      status: hasBledCategory.status,
      isHigh: hasBled.score >= 3,
    },
    nextStep: chaEsc.anticoagulationLikely
      ? 'Якщо антикоагуляція розглядається, перед вибором препарату доцільно оцінити функцію нирок, масу тіла, ризик взаємодій і фактори кровотечі.'
      : 'За низького тромбоемболічного ризику антикоагуляція зазвичай не потрібна; доцільний періодичний перегляд ризику при зміні клінічного стану.',
  };
}

export function calculateH2fpef(data) {
  const score =
    (data.obesity ? 2 : 0) +
    (data.multipleAntihypertensives ? 1 : 0) +
    (data.atrialFibrillation ? 3 : 0) +
    (data.pulmonaryHypertension ? 1 : 0) +
    (data.ageOver60 ? 1 : 0) +
    (data.elevatedFillingPressure ? 1 : 0);

  let interpretation = 'Низька ймовірність HFpEF.';

  if (score >= 2 && score <= 5) {
    interpretation = 'Проміжна ймовірність HFpEF.';
  }

  if (score >= 6) {
    interpretation = 'Висока ймовірність HFpEF.';
  }

  return {
    score,
    interpretation,
  };
}

function getH2fpefNextStep(score) {
  if (score <= 1) {
    return 'Низька ймовірність СН зі збереженою ФВ (HFpEF). Доцільно розглянути інші причини задишки та оцінити клінічний контекст.';
  }

  if (score <= 5) {
    return 'Проміжна ймовірність СН зі збереженою ФВ (HFpEF). Потрібна додаткова оцінка: BNP або NT-proBNP, ЕхоКГ, навантажувальне тестування за показами.';
  }

  return 'Висока ймовірність СН зі збереженою ФВ (HFpEF). Потрібна клінічна верифікація, оцінка супутніх станів і пошук факторів декомпенсації.';
}

function getAccAhaHeartFailureStage(data) {
  if (data.accAhaStageChoice === 'stageD') {
    return {
      stage: 'Stage D',
      title: 'Рефрактерна / advanced СН',
      interpretation:
        'Рефрактерні симптоми попри оптимальну терапію або часті госпіталізації. Потрібна спеціалізована оцінка.',
    };
  }

  if (data.accAhaStageChoice === 'stageC') {
    return {
      stage: 'Stage C',
      title: 'Симптомна СН',
      interpretation:
        'Є поточні або попередні симптоми серцевої недостатності на тлі структурного ураження серця.',
    };
  }

  if (data.accAhaStageChoice === 'stageB') {
    return {
      stage: 'Stage B',
      title: 'Пре-СН',
      interpretation:
        'Є структурне ураження серця або підвищені біомаркери, але немає поточних чи попередніх симптомів СН.',
    };
  }

  if (data.accAhaStageChoice === 'stageA') {
    return {
      stage: 'Stage A',
      title: 'Ризик СН',
      interpretation:
        'Є фактори ризику серцевої недостатності без структурного ураження серця та без симптомів.',
    };
  }

  return {
    stage: 'Не визначено',
    title: 'Недостатньо даних',
    interpretation: 'Позначте фактори ризику, структурні зміни або симптоми для орієнтовного staging.',
  };
}

function getNyhaClass(data) {
  if (data.nyhaClassChoice === 'nyha4') {
    return {
      className: 'NYHA IV',
      interpretation: 'Симптоми серцевої недостатності є у спокої.',
    };
  }

  if (data.nyhaClassChoice === 'nyha3') {
    return {
      className: 'NYHA III',
      interpretation: 'Симптоми виникають при меншому, ніж звичайне, фізичному навантаженні.',
    };
  }

  if (data.nyhaClassChoice === 'nyha2') {
    return {
      className: 'NYHA II',
      interpretation: 'Симптоми виникають при звичайному фізичному навантаженні.',
    };
  }

  return {
    className: 'NYHA I',
    interpretation: 'Немає обмеження звичайної фізичної активності симптомами СН.',
  };
}

export function calculateHeartFailureHfpEfAssessment(data) {
  const age = parsePositiveNumber(data.age);
  const height = parsePositiveNumber(data.height);
  const weight = parsePositiveNumber(data.weight);
  const antihypertensiveCount = parseNonNegativeNumber(data.antihypertensiveCount);
  const pasp = parsePositiveNumber(data.pasp);
  const eOverEPrime = parsePositiveNumber(data.eOverEPrime);
  const bmi = height !== null && weight !== null ? calculateBMI(weight, height) : '';
  const numericBmi = parsePositiveNumber(bmi);

  if (age === null || height === null || weight === null) return null;

  const h2fpef = calculateH2fpef({
    obesity: numericBmi !== null && numericBmi > 30,
    multipleAntihypertensives: antihypertensiveCount !== null && antihypertensiveCount >= 2,
    atrialFibrillation: data.atrialFibrillation,
    pulmonaryHypertension: pasp !== null && pasp > 35,
    ageOver60: age > 60,
    elevatedFillingPressure: eOverEPrime !== null && eOverEPrime > 9,
  });

  return {
    bmi,
    h2fpef: {
      ...h2fpef,
      nextStep: getH2fpefNextStep(h2fpef.score),
    },
    accAhaStage: getAccAhaHeartFailureStage(data),
    nyha: getNyhaClass(data),
    additionalChecks: [
      'ЕхоКГ',
      'BNP або NT-proBNP',
      'ЕКГ',
      'Креатинін / ШКФ',
      'Калій / натрій',
      'Hb',
      'ТТГ за показами',
      'Оцінка ФП, ІХС, ожиріння, апное сну',
    ],
    relatedTools: [
      'ШКФ',
      'ІМТ / оцінка маси тіла',
      'SCORE2',
      'ФП / антикоагуляція',
      'Препарати',
    ],
  };
}

export function calculateHeartScore(data) {
  const history = parseNonNegativeNumber(data.history);
  const ecg = parseNonNegativeNumber(data.ecg);
  const age = parseNonNegativeNumber(data.age);
  const riskFactors = parseNonNegativeNumber(data.riskFactors);
  const troponin = parseNonNegativeNumber(data.troponin);

  if ([history, ecg, age, riskFactors, troponin].some((value) => value === null)) {
    return null;
  }

  const score = history + ecg + age + riskFactors + troponin;

  let riskLevel = 'low';
  let riskLabel = 'Низький ризик';
  let maceRisk = 'орієнтовно 0.9–1.7%';
  let interpretation =
    'Низький HEART Score асоціюється з нижчою ймовірністю 30-денних великих серцево-судинних подій, але результат потрібно оцінювати разом із клінічною картиною.';
  let nextSteps = [
    'Розглянути серійний тропонін.',
    'Провести повторну клінічну оцінку.',
    'Повторити ЕКГ за показами.',
    'Визначити подальшу тактику відповідно до клінічної ситуації.',
  ];

  if (score >= 4 && score <= 6) {
    riskLevel = 'intermediate';
    riskLabel = 'Проміжний ризик';
    maceRisk = 'орієнтовно 12–17%';
    interpretation =
      'Проміжний HEART Score потребує уважної повторної оцінки, динаміки тропоніну й ЕКГ та визначення потреби в додатковій діагностиці.';
    nextSteps = [
      'Доцільно оцінити повторні тропоніни.',
      'Оцінити динаміку ЕКГ.',
      'Розглянути консультацію кардіолога.',
      'Оцінити необхідність додаткових тестів відповідно до клінічного контексту.',
    ];
  }

  if (score >= 7) {
    riskLevel = 'high';
    riskLabel = 'Високий ризик';
    maceRisk = 'орієнтовно 50–65%';
    interpretation =
      'Високий HEART Score асоціюється з підвищеною ймовірністю 30-денних великих серцево-судинних подій і потребує невідкладної клінічної оцінки.';
    nextSteps = [
      'Доцільна невідкладна оцінка кардіологом.',
      'Оцінити потребу в госпіталізації згідно з клінічною ситуацією.',
      'Планувати подальше обстеження відповідно до чинних рекомендацій.',
    ];
  }

  return {
    score,
    riskLevel,
    riskLabel,
    maceRisk,
    interpretation,
    nextSteps,
  };
}

export function calculateWellsPe(data) {
  const score =
    (data.clinicalDvtSigns ? 3 : 0) +
    (data.peMoreLikely ? 3 : 0) +
    (data.heartRateOver100 ? 1.5 : 0) +
    (data.immobilizationOrSurgery ? 1.5 : 0) +
    (data.previousDvtPe ? 1.5 : 0) +
    (data.hemoptysis ? 1 : 0) +
    (data.activeCancer ? 1 : 0);

  return {
    score,
    interpretation: score <= 4 ? 'ТЕЛА малоймовірна.' : 'ТЕЛА ймовірна.',
  };
}

export function calculateAgeAdjustedDimer(data) {
  const age = parsePositiveNumber(data.age);
  const dimer = parseNonNegativeNumber(data.dimer);

  if (age === null || dimer === null) return null;

  const threshold = age <= 50 ? 500 : Math.round(age * 10);
  const unitLabel = data.dimerUnit === 'mcgLFeu' ? 'мкг/л FEU' : 'нг/мл FEU';

  return {
    threshold,
    dimer,
    exceedsThreshold: dimer > threshold,
    unitLabel,
  };
}

export function calculateWellsDvt(data) {
  const score =
    (data.activeCancer ? 1 : 0) +
    (data.paralysisOrImmobilization ? 1 : 0) +
    (data.bedriddenOrSurgery ? 1 : 0) +
    (data.localTenderness ? 1 : 0) +
    (data.entireLegSwollen ? 1 : 0) +
    (data.calfSwelling ? 1 : 0) +
    (data.pittingEdema ? 1 : 0) +
    (data.collateralVeins ? 1 : 0) +
    (data.previousDvt ? 1 : 0) -
    (data.alternativeDiagnosis ? 2 : 0);

  return {
    score,
    isLikely: score >= 2,
    interpretation: score >= 2 ? 'ТГВ ймовірний.' : 'ТГВ малоймовірний.',
  };
}

export function calculatePercRule(data) {
  const positiveCriteria = [
    data.ageOver50,
    data.heartRateAtLeast100,
    data.spo2Below95,
    data.unilateralLegSwelling,
    data.hemoptysis,
    data.recentSurgeryOrTrauma,
    data.previousDvtPe,
    data.estrogenUse,
  ].filter(Boolean).length;

  return {
    positiveCriteria,
    isNegative: positiveCriteria === 0,
    interpretation:
      positiveCriteria === 0
        ? 'PERC негативний: усі критерії “ні”.'
        : 'PERC позитивний: є щонайменше один критерій.',
  };
}

export function calculateSpesi(data) {
  const score = [
    data.ageOver80,
    data.cancer,
    data.chronicCardiopulmonaryDisease,
    data.heartRateAtLeast110,
    data.systolicBpBelow100,
    data.spo2Below90,
  ].filter(Boolean).length;

  return {
    score,
    isLowRisk: score === 0,
    interpretation: score === 0 ? 'Низький ризик за sPESI.' : 'Підвищений ризик за sPESI.',
  };
}

export function calculateHestia(data) {
  const positiveCriteria = [
    data.hemodynamicInstability,
    data.needThrombolysisOrEmbolectomy,
    data.activeBleedingOrHighRisk,
    data.needOxygenMoreThan24h,
    data.peDuringAnticoagulation,
    data.severePainIvAnalgesia,
    data.medicalOrSocialAdmissionReason,
    data.crclBelow30,
    data.severeLiverFailure,
    data.pregnancy,
    data.historyHit,
  ].filter(Boolean).length;

  return {
    positiveCriteria,
    isEligibleForOutpatientConsideration: positiveCriteria === 0,
    interpretation:
      positiveCriteria === 0
        ? 'Усі критерії Hestia “ні”: можна розглянути амбулаторне лікування у відповідному клінічному контексті.'
        : 'Є щонайменше один критерій Hestia: амбулаторне лікування не рекомендується за Hestia.',
  };
}

export function calculateVteBleed(data) {
  const score =
    (data.activeCancer ? 2 : 0) +
    (data.maleWithUncontrolledHypertension ? 1 : 0) +
    (data.anemia ? 1.5 : 0) +
    (data.bleedingHistory ? 1.5 : 0) +
    (data.ageAtLeast60 ? 1.5 : 0) +
    (data.renalDysfunction ? 1.5 : 0);

  return {
    score,
    isHighRisk: score >= 2,
    interpretation:
      score >= 2
        ? 'Вищий ризик кровотечі під час антикоагуляції за VTE-BLEED.'
        : 'Нижчий ризик кровотечі під час антикоагуляції за VTE-BLEED.',
  };
}

export function calculateHerdoo2(data) {
  const score = [
    data.legHyperpigmentationEdemaRedness,
    data.elevatedDimer,
    data.bmiAtLeast30,
    data.ageAtLeast65,
  ].filter(Boolean).length;

  if (data.sex !== 'female') {
    return {
      score,
      isApplicable: false,
      interpretation:
        'HERDOO2 не застосовується для чоловіків як інструмент визначення низького ризику рецидиву.',
    };
  }

  return {
    score,
    isApplicable: true,
    interpretation:
      score <= 1
        ? '0–1 критерій: нижчий ризик рецидиву у жінки після першого неспровокованого ВТЕ.'
        : '≥2 критерії: вищий ризик рецидиву.',
  };
}

export function calculateDashScore(data) {
  const score =
    (data.elevatedDimerAfterStopping ? 2 : 0) +
    (data.ageAtMost50 ? 1 : 0) +
    (data.maleSex ? 1 : 0) -
    (data.hormoneAssociatedVteInWomen ? 2 : 0);

  let recurrenceRisk = 'нижчий орієнтовний ризик рецидиву';
  if (score === 2) recurrenceRisk = 'проміжний орієнтовний ризик рецидиву';
  if (score >= 3) recurrenceRisk = 'вищий орієнтовний ризик рецидиву';

  return {
    score,
    recurrenceRisk,
    interpretation:
      'DASH є допоміжною оцінкою ризику рецидиву після завершення антикоагуляції і не визначає тривалість лікування самостійно.',
  };
}

export function getVteNextStep({ scenario, wellsDvt, wellsPe, perc, dimer, hestia, spesi }) {
  if (scenario === 'dvt') {
    if (wellsDvt?.isLikely) {
      return 'Клінічна ймовірність ТГВ висока: розглянути компресійне УЗД вен згідно з клінічним контекстом.';
    }
    if (dimer && !dimer.exceedsThreshold) {
      return 'Низька клінічна ймовірність і D-димер не перевищує віковий поріг: ТГВ менш ймовірний у межах валідованого алгоритму.';
    }
    if (dimer?.exceedsThreshold) {
      return 'D-димер перевищує віковий поріг: розглянути компресійне УЗД вен.';
    }
    return 'Для наступного кроку оцініть D-димер або розгляньте візуалізацію за клінічними показами.';
  }

  if (scenario === 'pe') {
    if (wellsPe?.score > 4) {
      return 'За Wells PE ТЕЛА ймовірна: D-димер не використовується для самостійного виключення, розглянути КТ-ангіографію або іншу діагностику.';
    }
    if (perc?.isNegative) {
      return 'Низька клінічна ймовірність і PERC негативний: ТЕЛА малоймовірна, D-димер може бути не потрібний.';
    }
    if (dimer && !dimer.exceedsThreshold) {
      return 'Клінічна ймовірність невисока, але PERC позитивний; D-димер не перевищує віковий поріг і може підтримувати виключення ТЕЛА в межах алгоритму.';
    }
    if (dimer?.exceedsThreshold) {
      return 'D-димер перевищує віковий поріг: розглянути КТ-ангіографію або іншу діагностику згідно з клінічним контекстом.';
    }
    return 'PERC позитивний або не застосовується: оцініть D-димер або перейдіть до візуалізації за клінічними показами.';
  }

  if (scenario === 'confirmedPe') {
    if (spesi?.isLowRisk && hestia?.isEligibleForOutpatientConsideration) {
      return 'sPESI низький і всі критерії Hestia “ні”: можна розглянути амбулаторне лікування у відповідному клінічному контексті.';
    }
    return 'Потрібна оцінка ризику, гемодинаміки, потреби госпіталізації та безпеки подальшої тактики.';
  }

  return 'Оцініть баланс ризику рецидиву ВТЕ та кровотечі. Рішення щодо тривалості антикоагуляції приймається індивідуально.';
}

export function calculateFractureRisk(data) {
  const parseNumber = (value) => {
    if (!hasValue(value)) return null;
    const parsed = Number(String(value).replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const factorCount = [
    data.ageAtLeast50,
    data.postmenopausalWoman,
    data.manAtLeast70,
    data.lowEnergyFracture,
    data.heightLoss,
    data.longTermGlucocorticoids,
    data.rheumatoidArthritis,
    data.lowBodyWeight,
    data.smoking,
    data.excessiveAlcohol,
    data.parentalHipFracture,
    data.secondaryOsteoporosis,
  ].filter(Boolean).length;

  const femoralNeckTScore = parseNumber(data.femoralNeckTScore);
  const lumbarTScore = parseNumber(data.lumbarTScore);
  const validTScores = [femoralNeckTScore, lumbarTScore].filter((value) => value !== null);
  const lowestTScore = validTScores.length > 0 ? Math.min(...validTScores) : null;

  let riskLevel = 'low';
  let riskLabel = 'Низький ризик';
  let riskInterpretation = 'Наразі позначено небагато факторів ризику.';

  if (factorCount >= 2) {
    riskLevel = 'moderate';
    riskLabel = 'Помірний ризик';
    riskInterpretation = 'Є кілька факторів ризику, доцільне уточнення ризику та потреби в DXA/FRAX.';
  }

  if (factorCount >= 4 || data.lowEnergyFracture || (lowestTScore !== null && lowestTScore <= -2.5)) {
    riskLevel = 'high';
    riskLabel = 'Високий ризик';
    riskInterpretation = 'Є значущі фактори ризику або DXA-критерій, потрібна клінічна верифікація та оцінка тактики.';
  }

  let dxaInterpretation =
    'За відсутності DXA ризик можна уточнити за допомогою офіційного FRAX.';

  if (lowestTScore !== null) {
    if (lowestTScore <= -2.5) {
      dxaInterpretation = 'T-score ≤ -2.5 відповідає DXA-критерію остеопорозу у відповідному клінічному контексті.';
    } else if (lowestTScore < -1) {
      dxaInterpretation = 'T-score від -1.0 до -2.5 відповідає зниженій мінеральній щільності кісткової тканини.';
    } else {
      dxaInterpretation = 'T-score ≥ -1.0 зазвичай відповідає нормальній мінеральній щільності кісткової тканини.';
    }
  }

  const nextStepsByRisk = {
    low: [
      'Фізична активність.',
      'Профілактика падінь.',
      'Адекватне споживання кальцію.',
      'Оцінка вітаміну D за показами.',
    ],
    moderate: [
      'Виконати DXA.',
      'Оцінити ризик через офіційний FRAX або локально валідований інструмент.',
      'Виключити вторинний остеопороз.',
    ],
    high: [
      'Підтвердити діагноз.',
      'Оцінити показання до лікування.',
      'Розглянути консультацію спеціаліста.',
    ],
  };

  return {
    factorCount,
    riskLevel,
    riskLabel,
    riskInterpretation,
    femoralNeckTScore,
    lumbarTScore,
    lowestTScore,
    dxaInterpretation,
    nextSteps: nextStepsByRisk[riskLevel],
  };
}

function sumNumericAnswers(answers) {
  return Object.values(answers).reduce((total, value) => total + Number(value || 0), 0);
}

export function calculateGad7(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Мінімальна тривога.';

  if (score >= 5 && score <= 9) {
    interpretation = 'Легка тривога.';
  }

  if (score >= 10 && score <= 14) {
    interpretation = 'Помірна тривога. Доцільна клінічна оцінка.';
  }

  if (score >= 15) {
    interpretation = 'Виражена тривога. Потрібна клінічна оцінка та визначення подальшої тактики.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculatePhq9(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Мінімальні депресивні симптоми.';

  if (score >= 5 && score <= 9) {
    interpretation = 'Легкі депресивні симптоми.';
  }

  if (score >= 10 && score <= 14) {
    interpretation = 'Помірні депресивні симптоми. Доцільна клінічна оцінка.';
  }

  if (score >= 15 && score <= 19) {
    interpretation = 'Помірно виражені депресивні симптоми. Потрібна клінічна оцінка.';
  }

  if (score >= 20) {
    interpretation = 'Виражені депресивні симптоми. Потрібна клінічна оцінка та визначення подальшої тактики.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateFindrisc(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Низький ризик розвитку цукрового діабету 2 типу протягом 10 років.';

  if (score >= 7 && score <= 11) {
    interpretation = 'Помірно підвищений ризик розвитку цукрового діабету 2 типу.';
  }

  if (score >= 12 && score <= 14) {
    interpretation = 'Помірний ризик розвитку цукрового діабету 2 типу.';
  }

  if (score >= 15 && score <= 20) {
    interpretation = 'Високий ризик розвитку цукрового діабету 2 типу.';
  }

  if (score > 20) {
    interpretation = 'Дуже високий ризик розвитку цукрового діабету 2 типу.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateAuditC(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Низька ймовірність ризикованого вживання алкоголю.';

  if (score >= 3 && score <= 4) {
    interpretation = 'Можливе ризиковане вживання алкоголю. Доцільно уточнити анамнез.';
  }

  if (score >= 5) {
    interpretation = 'Підвищений ризик проблемного вживання алкоголю. Потрібна клінічна оцінка.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateFagerstrom(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Низька нікотинова залежність.';

  if (score >= 3 && score <= 4) {
    interpretation = 'Низько-помірна нікотинова залежність.';
  }

  if (score >= 5 && score <= 7) {
    interpretation = 'Помірна нікотинова залежність.';
  }

  if (score >= 8) {
    interpretation = 'Висока нікотинова залежність.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateStopBang(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Низький ризик обструктивного апное сну.';

  if (score >= 3 && score <= 4) {
    interpretation = 'Проміжний ризик обструктивного апное сну.';
  }

  if (score >= 5) {
    interpretation = 'Високий ризик обструктивного апное сну.';
  }

  return {
    score,
    interpretation,
  };
}

export function calculateEpworth(answers) {
  const score = sumNumericAnswers(answers);

  let interpretation = 'Нормальний рівень денної сонливості.';

  if (score >= 11 && score <= 12) {
    interpretation = 'Легка надмірна денна сонливість.';
  }

  if (score >= 13 && score <= 15) {
    interpretation = 'Помірна надмірна денна сонливість.';
  }

  if (score >= 16) {
    interpretation = 'Виражена надмірна денна сонливість.';
  }

  return {
    score,
    interpretation,
  };
}
