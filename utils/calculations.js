export function calculateBMI(weight, height) {
  const numericWeight = Number(weight);
  const numericHeight = Number(height);

  if (!numericWeight || !numericHeight) {
    return '';
  }

  const heightInMeters = numericHeight / 100;
  const bmi = numericWeight / (heightInMeters * heightInMeters);

  return String(Math.round(bmi * 10) / 10);
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
