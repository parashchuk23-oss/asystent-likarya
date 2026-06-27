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

export function calculateFractureRisk(data) {
  const age = parsePositiveNumber(data.age);
  const weight = parsePositiveNumber(data.weight);
  const height = parsePositiveNumber(data.height);

  if (age === null || weight === null || height === null || !data.sex) return null;

  const factorCount = [
    data.previousFracture,
    data.parentalHipFracture,
    data.currentSmoking,
    data.glucocorticoids,
    data.rheumatoidArthritis,
    data.secondaryOsteoporosis,
    data.alcoholThreeOrMore,
  ].filter(Boolean).length;

  let interpretation = 'Нижчий орієнтовний ризик.';

  if (factorCount >= 2 && factorCount <= 3) {
    interpretation = 'Помірний орієнтовний ризик.';
  }

  if (factorCount >= 4 || data.previousFracture) {
    interpretation = 'Високий орієнтовний ризик.';
  }

  const parsedTScore = hasValue(data.femoralNeckTScore)
    ? Number(String(data.femoralNeckTScore).replace(',', '.'))
    : null;

  return {
    factorCount,
    bmi: calculateBMI(weight, height),
    tScore: Number.isFinite(parsedTScore) ? parsedTScore : null,
    interpretation,
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
