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

function isYes(value) {
  return value === 'так';
}

function isNo(value) {
  return value === 'ні';
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

function getLifestyleRecommendations(interpretation) {
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
      'Розглянути можливість ліпідознижувальної терапії, контроль ліпідограми через 2 місяці.'
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

export function calculateScore2Risk(data) {
  const age = parsePositiveNumber(data.age);
  const egfr = parsePositiveNumber(data.egfr);
  const missingStopFactors = [];

  if (!hasValue(data.diabetes)) missingStopFactors.push('цукровий діабет');
  if (!hasValue(data.establishedASCVD)) missingStopFactors.push('встановлене атеросклеротичне захворювання');
  if (!hasValue(data.chronicKidneyDisease)) missingStopFactors.push('хронічна хвороба нирок');

  if (isYes(data.establishedASCVD)) {
    const interpretation = 'дуже високий';

    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason: 'Встановлене атеросклеротичне серцево-судинне захворювання.',
      recommendations: getLifestyleRecommendations(interpretation),
      missing: [],
    };
  }

  if (isYes(data.diabetes)) {
    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation: 'окрема оцінка при цукровому діабеті',
      ldlTarget: null,
      reason: 'Для пацієнтів із цукровим діабетом потрібна окрема оцінка кардіоваскулярного ризику.',
      recommendations: getLifestyleRecommendations('високий'),
      missing: [],
    };
  }

  if (isYes(data.chronicKidneyDisease) || (egfr !== null && egfr < 30)) {
    const interpretation = 'дуже високий';

    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason: egfr !== null && egfr < 30 ? `ШКФ ${egfr} мл/хв/1,73 м².` : 'Хронічна хвороба нирок.',
      recommendations: getLifestyleRecommendations(interpretation),
      missing: [],
    };
  }

  if (egfr !== null && egfr < 60) {
    const interpretation = 'високий';

    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation,
      ldlTarget: getLdlTarget(interpretation),
      reason: `Знижена ШКФ ${egfr} мл/хв/1,73 м².`,
      recommendations: getLifestyleRecommendations(interpretation),
      missing: [],
    };
  }

  if (missingStopFactors.length > 0) {
    return {
      shouldCalculate: false,
      riskPercent: null,
      interpretation: 'недостатньо даних',
      ldlTarget: null,
      reason: 'Спочатку потрібно уточнити стоп-фактори.',
      recommendations: [],
      missing: missingStopFactors,
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
    reason: `Розраховано за ${modelName} для первинної профілактики.`,
    recommendations: getLifestyleRecommendations(interpretation),
    missing: [],
  };
}
