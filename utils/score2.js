const SCORE2_COEFFICIENTS = {
  male: {
    age: 0.3742,
    smoking: 0.6012,
    sbp: 0.2777,
    totalCholesterol: 0.1458,
    hdl: -0.2698,
    smokingAge: -0.0755,
    sbpAge: -0.0255,
    totalCholesterolAge: -0.0281,
    hdlAge: 0.0426,
    baselineSurvival: 0.9605,
    recalibrationScale1: 0.5836,
    recalibrationScale2: 0.8294,
  },
  female: {
    age: 0.4648,
    smoking: 0.7744,
    sbp: 0.3131,
    totalCholesterol: 0.1002,
    hdl: -0.2606,
    smokingAge: -0.1088,
    sbpAge: -0.0277,
    totalCholesterolAge: -0.0226,
    hdlAge: 0.0613,
    baselineSurvival: 0.9776,
    recalibrationScale1: 0.9412,
    recalibrationScale2: 0.8329,
  },
};

const SCORE2_OP_COEFFICIENTS = {
  male: {
    age: 0.0634,
    diabetes: 0.4245,
    smoking: 0.3524,
    sbp: 0.0094,
    totalCholesterol: 0.085,
    hdl: -0.3564,
    diabetesAge: -0.0174,
    smokingAge: -0.0247,
    sbpAge: -0.0005,
    totalCholesterolAge: 0.0073,
    hdlAge: 0.0091,
    baselineSurvival: 0.7576,
    meanLinearPredictor: 0.0929,
    recalibrationScale1: 0.05,
    recalibrationScale2: 0.7,
  },
  female: {
    age: 0.0789,
    diabetes: 0.601,
    smoking: 0.4921,
    sbp: 0.0102,
    totalCholesterol: 0.0605,
    hdl: -0.304,
    diabetesAge: -0.0107,
    smokingAge: -0.0255,
    sbpAge: -0.0004,
    totalCholesterolAge: -0.0009,
    hdlAge: 0.0154,
    baselineSurvival: 0.8082,
    meanLinearPredictor: 0.229,
    recalibrationScale1: 0.38,
    recalibrationScale2: 0.69,
  },
};

const SCORE2_DIABETES_COEFFICIENTS = {
  male: {
    age: 0.5368,
    smoking: 0.4774,
    sbp: 0.1322,
    diabetes: 0.6457,
    totalCholesterol: 0.1102,
    hdl: -0.1087,
    smokingAge: -0.0672,
    sbpAge: -0.0268,
    diabetesAgeInteraction: -0.0983,
    totalCholesterolAge: -0.0181,
    hdlAge: 0.0095,
    diabetesDiagnosisAge: -0.0998,
    hba1c: 0.0955,
    egfr: -0.0591,
    egfrSquared: 0.0058,
    hba1cAge: -0.0134,
    egfrAge: 0.0115,
    baselineSurvival: 0.9605,
    recalibrationScale1: 0.5836,
    recalibrationScale2: 0.8294,
  },
  female: {
    age: 0.6624,
    smoking: 0.6139,
    sbp: 0.1421,
    diabetes: 0.8096,
    totalCholesterol: 0.1127,
    hdl: -0.1568,
    smokingAge: -0.1122,
    sbpAge: -0.0167,
    diabetesAgeInteraction: -0.1272,
    totalCholesterolAge: -0.02,
    hdlAge: 0.0186,
    diabetesDiagnosisAge: -0.118,
    hba1c: 0.1173,
    egfr: -0.064,
    egfrSquared: 0.0062,
    hba1cAge: -0.0196,
    egfrAge: 0.0169,
    baselineSurvival: 0.9776,
    recalibrationScale1: 0.9412,
    recalibrationScale2: 0.8329,
  },
};

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function parsePositiveNumber(value) {
  if (!hasValue(value)) return null;

  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function toMmolL(value, unit, conversionFactor) {
  const parsed = parsePositiveNumber(value);
  if (parsed === null) return null;

  return unit === 'mgDl' ? parsed / conversionFactor : parsed;
}

function toHba1cMmolMol(value, unit) {
  const parsed = parsePositiveNumber(value);
  if (parsed === null) return null;

  return unit === 'percent' ? 10.93 * parsed - 23.5 : parsed;
}

function isYes(value) {
  return value === 'так';
}

function isNo(value) {
  return value === 'ні';
}

function normalizePatientScenario(data) {
  if (data.patientScenario === 'diabetes') return 'diabetes';
  if (data.patientScenario === 'establishedASCVD') return 'establishedASCVD';
  if (isYes(data.diabetes)) return 'diabetes';
  if (isYes(data.establishedASCVD)) return 'establishedASCVD';
  return 'primary';
}

function normalizeSex(sex) {
  if (sex === 'чоловік') return 'male';
  if (sex === 'жінка') return 'female';
  return '';
}

function interpretScore2Risk(age, riskPercent) {
  if (age >= 70) {
    if (riskPercent < 7.5) return 'середній';
    if (riskPercent < 15) return 'високий';
    return 'дуже високий';
  }

  if (age < 50) {
    if (riskPercent < 1) return 'низький';
    if (riskPercent < 2.5) return 'середній';
    if (riskPercent < 7.5) return 'високий';
    return 'дуже високий';
  }

  if (riskPercent < 2.5) return 'низький';
  if (riskPercent < 5) return 'середній';
  if (riskPercent < 10) return 'високий';
  return 'дуже високий';
}

function getLdlTarget(interpretation) {
  if (interpretation === 'низький') return '<3.0 ммоль/л';
  if (interpretation === 'середній') return '<2.4 ммоль/л';
  if (interpretation === 'високий') return '<1.8 ммоль/л';
  if (interpretation === 'дуже високий') return '<1.4 ммоль/л';
  return null;
}

const cholesterolPatientInfo =
  'Холестерин сприяє утворенню атеросклеротичних бляшок у судинах. Його зниження допомагає зменшити ризик інфаркту, інсульту та прогресування атеросклерозу.';

function getLifestyleRecommendations(interpretation) {
  const ldlTarget = getLdlTarget(interpretation);
  const recommendations = [
    'Зменшити в раціоні яєчні жовтки, субпродукти, жирні сорти м’яса та жирні молочні продукти.',
    'Морська риба 2 рази на тиждень.',
    'Збільшити в раціоні цільнозернові продукти, бобові, горох, фрукти, ягоди та овочі.',
    'Контроль глюкози крові. По можливості обмежити солодощі.',
    'За наявності надлишкової маси тіла рекомендовано поступове зниження ваги на 5-10% протягом 6 місяців.',
    'Контроль сечової кислоти за клінічної потреби.',
    'Виключити алкоголь або максимально обмежити його. При курінні - повна відмова від куріння.',
    'Контроль АТ. Цільовий рівень АТ - не більше 140/80 мм рт.ст.',
  ];

  if (interpretation === 'високий' || interpretation === 'дуже високий') {
    recommendations.push(
      `Розглянути можливість ліпідознижувальної терапії, контроль ліпідограми через 2 місяці. Цільовий рівень ЛПНЩ: ${ldlTarget}.`
    );
  } else {
    recommendations.push('Контроль ліпідограми через 3-6 місяців.');
  }

  return recommendations;
}

function getMissingScore2Fields(data) {
  const missing = [];

  if (!parsePositiveNumber(data.age)) missing.push('вік');
  if (!normalizeSex(data.sex)) missing.push('стать');
  if (!isYes(data.smoking) && !isNo(data.smoking)) missing.push('куріння');
  if (!parsePositiveNumber(data.systolicBP)) missing.push('систолічний АТ');
  if (!parsePositiveNumber(data.totalCholesterol)) missing.push('загальний холестерин');
  if (!parsePositiveNumber(data.hdl)) missing.push('ЛПВЩ');

  return missing;
}

function getMissingScore2DiabetesFields(data) {
  const missing = getMissingScore2Fields(data);

  if (!parsePositiveNumber(data.diabetesDiagnosisAge)) missing.push('вік встановлення ЦД');
  if (!toHba1cMmolMol(data.hba1c, data.hba1cUnit)) missing.push('HbA1c');
  if (!parsePositiveNumber(data.egfr)) missing.push('ШКФ');

  return missing;
}

function getEgfrCategory(egfr) {
  if (egfr === null) return null;
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

function getAcrCategory(acr) {
  if (acr === null) return null;
  if (acr < 30) return 'A1';
  if (acr <= 300) return 'A2';
  return 'A3';
}

export function getCkdCardiovascularRiskModifier(data) {
  const egfr = parsePositiveNumber(data.egfr);
  const acr = parsePositiveNumber(data.acr);
  const hasCkd = isYes(data.chronicKidneyDisease) || (egfr !== null && egfr < 60) || (acr !== null && acr >= 30);

  if (!hasCkd) return null;

  const egfrCategory = getEgfrCategory(egfr);
  const acrCategory = getAcrCategory(acr);
  const details = [];

  if (egfr !== null) details.push(`ШКФ ${egfr} мл/хв/1,73 м² (${egfrCategory})`);
  if (acr !== null) details.push(`ACR ${acr} мг/г (${acrCategory})`);

  const hasAlbuminuria = acr !== null && acr >= 30;
  const hasSevereAlbuminuria = acr !== null && acr > 300;

  let level = 'modifier';
  let interpretation = 'ХХН як модифікатор ризику';
  let reason =
    'Є дані за ХХН або альбумінурію. Це варто врахувати разом із SCORE2 та загальною клінічною картиною.';

  if ((egfr !== null && egfr < 30) || (egfr !== null && egfr >= 30 && egfr < 45 && hasAlbuminuria)) {
    level = 'veryHigh';
    interpretation = 'дуже високий';
    reason = 'ХХН відповідає критеріям дуже високого серцево-судинного ризику.';
  } else if (
    (egfr !== null && egfr >= 30 && egfr < 45) ||
    (egfr !== null && egfr >= 45 && egfr < 60 && hasAlbuminuria) ||
    (egfr !== null && egfr >= 60 && hasSevereAlbuminuria)
  ) {
    level = 'high';
    interpretation = 'високий';
    reason = 'ХХН або альбумінурія відповідає критеріям високого серцево-судинного ризику.';
  }

  return {
    level,
    interpretation,
    reason,
    egfr,
    acr,
    egfrCategory,
    acrCategory,
    details,
  };
}

function calculateRawScore2Risk(data) {
  const age = parsePositiveNumber(data.age);
  const sex = normalizeSex(data.sex);
  const smoking = isYes(data.smoking) ? 1 : 0;
  const sbp = parsePositiveNumber(data.systolicBP);
  const totalCholesterol = toMmolL(data.totalCholesterol, data.lipidsUnit, 38.67);
  const hdl = toMmolL(data.hdl, data.lipidsUnit, 38.67);
  const coefficients = SCORE2_COEFFICIENTS[sex];

  const centeredAge = (age - 60) / 5;
  const centeredSbp = (sbp - 120) / 20;
  const centeredTotalCholesterol = totalCholesterol - 6;
  const centeredHdl = (hdl - 1.3) / 0.5;

  const linearPredictor =
    coefficients.age * centeredAge +
    coefficients.smoking * smoking +
    coefficients.sbp * centeredSbp +
    coefficients.totalCholesterol * centeredTotalCholesterol +
    coefficients.hdl * centeredHdl +
    coefficients.smokingAge * centeredAge * smoking +
    coefficients.sbpAge * centeredAge * centeredSbp +
    coefficients.totalCholesterolAge * centeredAge * centeredTotalCholesterol +
    coefficients.hdlAge * centeredAge * centeredHdl;

  const uncalibratedRisk = 1 - Math.pow(coefficients.baselineSurvival, Math.exp(linearPredictor));
  const calibratedRisk =
    1 -
    Math.exp(
      -Math.exp(
        coefficients.recalibrationScale1 +
          coefficients.recalibrationScale2 * Math.log(-Math.log(1 - uncalibratedRisk))
      )
    );

  return Math.round(calibratedRisk * 1000) / 10;
}

function calculateRawScore2OpRisk(data) {
  const age = parsePositiveNumber(data.age);
  const sex = normalizeSex(data.sex);
  const smoking = isYes(data.smoking) ? 1 : 0;
  const diabetes = isYes(data.diabetes) ? 1 : 0;
  const sbp = parsePositiveNumber(data.systolicBP);
  const totalCholesterol = toMmolL(data.totalCholesterol, data.lipidsUnit, 38.67);
  const hdl = toMmolL(data.hdl, data.lipidsUnit, 38.67);
  const coefficients = SCORE2_OP_COEFFICIENTS[sex];

  const centeredAge = age - 73;
  const centeredSbp = sbp - 150;
  const centeredTotalCholesterol = totalCholesterol - 6;
  const centeredHdl = hdl - 1.4;

  const linearPredictor =
    coefficients.age * centeredAge +
    coefficients.diabetes * diabetes +
    coefficients.smoking * smoking +
    coefficients.sbp * centeredSbp +
    coefficients.totalCholesterol * centeredTotalCholesterol +
    coefficients.hdl * centeredHdl +
    coefficients.diabetesAge * centeredAge * diabetes +
    coefficients.smokingAge * centeredAge * smoking +
    coefficients.sbpAge * centeredAge * centeredSbp +
    coefficients.totalCholesterolAge * centeredAge * centeredTotalCholesterol +
    coefficients.hdlAge * centeredAge * centeredHdl;

  const uncalibratedRisk =
    1 - Math.pow(coefficients.baselineSurvival, Math.exp(linearPredictor - coefficients.meanLinearPredictor));
  const calibratedRisk =
    1 -
    Math.exp(
      -Math.exp(
        coefficients.recalibrationScale1 +
          coefficients.recalibrationScale2 * Math.log(-Math.log(1 - uncalibratedRisk))
      )
    );

  return Math.round(calibratedRisk * 1000) / 10;
}

function calculateRawScore2DiabetesRisk(data) {
  const age = parsePositiveNumber(data.age);
  const sex = normalizeSex(data.sex);
  const smoking = isYes(data.smoking) ? 1 : 0;
  const diabetes = 1;
  const sbp = parsePositiveNumber(data.systolicBP);
  const totalCholesterol = toMmolL(data.totalCholesterol, data.lipidsUnit, 38.67);
  const hdl = toMmolL(data.hdl, data.lipidsUnit, 38.67);
  const diabetesDiagnosisAge = parsePositiveNumber(data.diabetesDiagnosisAge);
  const hba1c = toHba1cMmolMol(data.hba1c, data.hba1cUnit);
  const egfr = parsePositiveNumber(data.egfr);
  const coefficients = SCORE2_DIABETES_COEFFICIENTS[sex];

  const centeredAge = (age - 60) / 5;
  const centeredSbp = (sbp - 120) / 20;
  const centeredTotalCholesterol = totalCholesterol - 6;
  const centeredHdl = (hdl - 1.3) / 0.5;
  const centeredDiabetesDiagnosisAge = (diabetesDiagnosisAge - 50) / 5;
  const centeredHba1c = (hba1c - 31) / 9.34;
  const centeredEgfr = (Math.log(egfr) - 4.5) / 0.15;

  const linearPredictor =
    coefficients.age * centeredAge +
    coefficients.smoking * smoking +
    coefficients.sbp * centeredSbp +
    coefficients.diabetes * diabetes +
    coefficients.totalCholesterol * centeredTotalCholesterol +
    coefficients.hdl * centeredHdl +
    coefficients.smokingAge * centeredAge * smoking +
    coefficients.sbpAge * centeredAge * centeredSbp +
    coefficients.diabetesAgeInteraction * centeredAge * diabetes +
    coefficients.totalCholesterolAge * centeredAge * centeredTotalCholesterol +
    coefficients.hdlAge * centeredAge * centeredHdl +
    coefficients.diabetesDiagnosisAge * diabetes * centeredDiabetesDiagnosisAge +
    coefficients.hba1c * centeredHba1c +
    coefficients.egfr * centeredEgfr +
    coefficients.egfrSquared * centeredEgfr * centeredEgfr +
    coefficients.hba1cAge * centeredHba1c * centeredAge +
    coefficients.egfrAge * centeredEgfr * centeredAge;

  const uncalibratedRisk = 1 - Math.pow(coefficients.baselineSurvival, Math.exp(linearPredictor));
  const calibratedRisk =
    1 -
    Math.exp(
      -Math.exp(
        coefficients.recalibrationScale1 +
          coefficients.recalibrationScale2 * Math.log(-Math.log(1 - uncalibratedRisk))
      )
    );

  return Math.round(calibratedRisk * 1000) / 10;
}

function interpretScore2DiabetesRisk(riskPercent) {
  if (riskPercent < 5) return 'низький';
  if (riskPercent < 10) return 'середній';
  if (riskPercent < 20) return 'високий';
  return 'дуже високий';
}

export function calculateScore2Risk(data) {
  const age = parsePositiveNumber(data.age);
  const patientScenario = normalizePatientScenario(data);
  const ckdModifier = getCkdCardiovascularRiskModifier(data);

  if (patientScenario === 'establishedASCVD') {
    const interpretation = 'дуже високий';

    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason:
        'Встановлене атеросклеротичне серцево-судинне захворювання: це сценарій вторинної профілактики. SCORE2 не застосовується; для кількісної оцінки залишкового ризику доцільно використовувати SMART Risk Score / SMART2.',
      recommendations: getLifestyleRecommendations(interpretation),
      patientInfo: cholesterolPatientInfo,
      ckdModifier,
      missing: [],
    };
  }

  if (patientScenario === 'diabetes') {
    if (ckdModifier?.level === 'veryHigh') {
      const interpretation = ckdModifier.interpretation;

      return {
        shouldCalculate: false,
        riskPercent: null,
        interpretation,
        ldlTarget: getLdlTarget(interpretation),
        reason: `${ckdModifier.reason} ${ckdModifier.details.join(', ')}.`,
        recommendations: getLifestyleRecommendations(interpretation),
        patientInfo: cholesterolPatientInfo,
        ckdModifier,
        missing: [],
      };
    }

    if (age !== null && age < 40) {
      return {
        shouldCalculate: false,
        riskPercent: null,
        interpretation: 'SCORE2-Diabetes не застосовується',
        ldlTarget: null,
        reason: 'SCORE2-Diabetes застосовується для пацієнтів із ЦД 2 типу віком 40-69 років.',
        recommendations: [],
        ckdModifier,
        missing: [],
      };
    }

    if (age !== null && age > 69) {
      return {
        shouldCalculate: false,
        riskPercent: null,
        interpretation: 'індивідуальна оцінка',
        ldlTarget: null,
        reason: 'SCORE2-Diabetes валідований для віку 40-69 років.',
        recommendations: [],
        ckdModifier,
        missing: [],
      };
    }

    const missingScore2DiabetesFields = getMissingScore2DiabetesFields(data);
    if (missingScore2DiabetesFields.length > 0) {
      return {
        shouldCalculate: false,
        riskPercent: null,
        interpretation: 'недостатньо даних',
        ldlTarget: null,
        reason: 'Недостатньо даних для розрахунку SCORE2-Diabetes.',
        recommendations: [],
        ckdModifier,
        missing: missingScore2DiabetesFields,
      };
    }

    const diabetesDiagnosisAge = parsePositiveNumber(data.diabetesDiagnosisAge);
    if (diabetesDiagnosisAge > age) {
      return {
        shouldCalculate: false,
        riskPercent: null,
        interpretation: 'перевірте дані',
        ldlTarget: null,
        reason: 'Вік встановлення ЦД не може бути більшим за поточний вік.',
        recommendations: [],
        ckdModifier,
        missing: [],
      };
    }

    const riskPercent = calculateRawScore2DiabetesRisk(data);
    const interpretation = interpretScore2DiabetesRisk(riskPercent);

    return {
      shouldCalculate: true,
      modelName: 'SCORE2-Diabetes',
      riskPercent,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason:
        'Розраховано за SCORE2-Diabetes для пацієнта з ЦД 2 типу без встановленого атеросклеротичного ССЗ.',
      recommendations: getLifestyleRecommendations(interpretation),
      patientInfo: cholesterolPatientInfo,
      ckdModifier,
      missing: [],
    };
  }

  if (ckdModifier?.level === 'veryHigh' || ckdModifier?.level === 'high') {
    const interpretation = ckdModifier.interpretation;

    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason: `${ckdModifier.reason} ${ckdModifier.details.join(', ')}.`,
      recommendations: getLifestyleRecommendations(interpretation),
      patientInfo: cholesterolPatientInfo,
      ckdModifier,
      missing: [],
    };
  }

  if (age !== null && age < 40) {
    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation: 'SCORE2 не застосовується',
      ldlTarget: null,
      reason: 'SCORE2 застосовується для віку 40-69 років.',
      recommendations: [],
      ckdModifier,
      missing: [],
    };
  }

  if (age !== null && age > 89) {
    return {
      shouldCalculate: false,
      riskPercent: null,
      modelName: null,
      interpretation: 'індивідуальна оцінка',
      ldlTarget: null,
      reason: 'SCORE2-OP застосовується для віку 70-89 років.',
      recommendations: [],
      ckdModifier,
      missing: [],
    };
  }

  const missingScore2Fields = getMissingScore2Fields(data);
  if (missingScore2Fields.length > 0) {
    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation: 'недостатньо даних',
      ldlTarget: null,
      reason: 'Недостатньо даних для розрахунку SCORE2.',
      recommendations: [],
      ckdModifier,
      missing: missingScore2Fields,
    };
  }

  const modelName = age >= 70 ? 'SCORE2-OP' : 'SCORE2';
  const riskPercent = age >= 70 ? calculateRawScore2OpRisk(data) : calculateRawScore2Risk(data);
  const interpretation = interpretScore2Risk(age, riskPercent);

  return {
    shouldCalculate: true,
    modelName,
    riskPercent,
    interpretation,
    ldlTarget: getLdlTarget(interpretation),
    reason:
      ckdModifier?.level === 'modifier'
        ? `Розраховано за ${modelName} для первинної профілактики. ХХН/ACR враховуйте як додатковий модифікатор ризику.`
        : `Розраховано за ${modelName} для первинної профілактики.`,
    recommendations: getLifestyleRecommendations(interpretation),
    patientInfo: cholesterolPatientInfo,
    ckdModifier,
    missing: [],
  };
}
