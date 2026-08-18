function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 1) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function calculateBsa(heightCm, weightKg) {
  const height = numberOrNull(heightCm);
  const weight = numberOrNull(weightKg);
  if (!height || !weight) return null;
  return round(Math.sqrt((height * weight) / 3600), 2);
}

export function calculateEf(edv, esv) {
  const endDiastolicVolume = numberOrNull(edv);
  const endSystolicVolume = numberOrNull(esv);
  if (!endDiastolicVolume || endSystolicVolume === null || endSystolicVolume >= endDiastolicVolume) return null;
  return round(((endDiastolicVolume - endSystolicVolume) / endDiastolicVolume) * 100);
}

export function calculateTeichholzVolume(lvDimensionMm) {
  const dimensionCm = numberOrNull(lvDimensionMm) / 10;
  if (!dimensionCm) return null;
  return round((7 * dimensionCm ** 3) / (2.4 + dimensionCm));
}

export function calculateFractionalShortening(lvidd, lvids) {
  const diastole = numberOrNull(lvidd);
  const systole = numberOrNull(lvids);
  if (!diastole || systole === null || systole >= diastole) return null;
  return round(((diastole - systole) / diastole) * 100);
}

export function calculateLvMass({ lvidd, ivsd, lvpwd }) {
  const lviddCm = numberOrNull(lvidd) / 10;
  const ivsdCm = numberOrNull(ivsd) / 10;
  const lvpwdCm = numberOrNull(lvpwd) / 10;
  if (!lviddCm || !ivsdCm || !lvpwdCm) return null;
  return round(0.8 * (1.04 * ((lviddCm + ivsdCm + lvpwdCm) ** 3 - lviddCm ** 3)) + 0.6);
}

export function calculateRwt({ lvidd, lvpwd }) {
  const diastole = numberOrNull(lvidd);
  const posteriorWall = numberOrNull(lvpwd);
  if (!diastole || !posteriorWall) return null;
  return round((2 * posteriorWall) / diastole, 2);
}

export function calculateIndexedValue(value, bsa) {
  const numericValue = numberOrNull(value);
  const bodySurfaceArea = numberOrNull(bsa);
  if (!numericValue || !bodySurfaceArea) return null;
  return round(numericValue / bodySurfaceArea);
}

export function calculateStrokeVolume(edv, esv) {
  const endDiastolicVolume = numberOrNull(edv);
  const endSystolicVolume = numberOrNull(esv);
  if (!endDiastolicVolume || endSystolicVolume === null || endSystolicVolume >= endDiastolicVolume) return null;
  return round(endDiastolicVolume - endSystolicVolume);
}

export function calculateCardiacOutput(strokeVolume, heartRate) {
  const sv = numberOrNull(strokeVolume);
  const hr = numberOrNull(heartRate);
  if (!sv || !hr) return null;
  return round((sv * hr) / 1000, 2);
}

export function calculateGradient(velocity) {
  const v = numberOrNull(velocity);
  if (!v) return null;
  return round(4 * v ** 2);
}

export function calculateRvsp(trVmax, rap) {
  const gradient = calculateGradient(trVmax);
  const rightAtrialPressure = numberOrNull(rap);
  if (gradient === null || rightAtrialPressure === null) return null;
  return round(gradient + rightAtrialPressure);
}

export function calculateIvcCollapse(maxDiameter, minDiameter) {
  const max = numberOrNull(maxDiameter);
  const min = numberOrNull(minDiameter);
  if (!max || min === null || min > max) return null;
  return round(((max - min) / max) * 100);
}

export function calculateRatio(numerator, denominator) {
  const top = numberOrNull(numerator);
  const bottom = numberOrNull(denominator);
  if (!top || !bottom) return null;
  return round(top / bottom, 2);
}

export function calculateAva({ lvotDiameter, lvotVti, avVti }) {
  const diameter = numberOrNull(lvotDiameter);
  const lvot = numberOrNull(lvotVti);
  const av = numberOrNull(avVti);
  if (!diameter || !lvot || !av) return null;
  const lvotArea = Math.PI * (diameter / 20) ** 2;
  return round((lvotArea * lvot) / av, 2);
}

export function getLvGeometry({ lvMassIndex, rwt, sex }) {
  if (lvMassIndex === null || rwt === null) return '';
  const massLimit = sex === 'female' ? 95 : 115;
  const increasedMass = lvMassIndex > massLimit;
  const increasedRwt = rwt > 0.42;
  if (!increasedMass && !increasedRwt) return 'нормальна геометрія ЛШ';
  if (!increasedMass && increasedRwt) return 'концентричне ремоделювання ЛШ';
  if (increasedMass && increasedRwt) return 'концентрична гіпертрофія ЛШ';
  return 'ексцентрична гіпертрофія ЛШ';
}

function calculateLinearLvDerived(values, bsa, sex) {
  const teichholzEdv = calculateTeichholzVolume(values.lvidd);
  const teichholzEsv = calculateTeichholzVolume(values.lvids);
  const teichholzEf = calculateEf(teichholzEdv, teichholzEsv);
  const strokeVolume = calculateStrokeVolume(teichholzEdv, teichholzEsv);
  const cardiacOutput = calculateCardiacOutput(strokeVolume, values.heartRate);
  const fs = calculateFractionalShortening(values.lvidd, values.lvids);
  const lvMass = calculateLvMass(values);
  const lvMassIndex = calculateIndexedValue(lvMass, bsa);
  const rwt = calculateRwt(values);

  return {
    teichholzEdv,
    teichholzEsv,
    teichholzEf,
    strokeVolume,
    cardiacOutput,
    edvi: calculateIndexedValue(teichholzEdv, bsa),
    esvi: calculateIndexedValue(teichholzEsv, bsa),
    fs,
    lvMass,
    lvMassIndex,
    rwt,
    lvGeometry: getLvGeometry({ lvMassIndex, rwt, sex }),
  };
}

export function calculateEchoDerived(data) {
  const bsa = calculateBsa(data.basic.height, data.basic.weight);
  const simpsonEf = calculateEf(data.leftVentricle.edv, data.leftVentricle.esv);
  const teichholzEf = calculateEf(data.leftVentricle.teichholzEdv, data.leftVentricle.teichholzEsv);
  const fs = calculateFractionalShortening(data.leftVentricle.lvidd, data.leftVentricle.lvids);
  const lvMass = calculateLvMass(data.leftVentricle);
  const lvMassIndex = calculateIndexedValue(lvMass, bsa);
  const rwt = calculateRwt(data.leftVentricle);
  const eA = calculateRatio(data.diastolic.e, data.diastolic.a);
  const avgEPrime =
    numberOrNull(data.diastolic.ePrimeSeptal) && numberOrNull(data.diastolic.ePrimeLateral)
      ? round((numberOrNull(data.diastolic.ePrimeSeptal) + numberOrNull(data.diastolic.ePrimeLateral)) / 2)
      : null;
  const eOverEPrime = avgEPrime ? calculateRatio(data.diastolic.e, avgEPrime) : null;
  const lavi = calculateIndexedValue(data.leftAtrium.volume, bsa);
  const trGradient = calculateGradient(data.tricuspidValve.trVmax);
  const rvsp = calculateRvsp(data.tricuspidValve.trVmax, data.ivc.rap);
  const ivcCollapse = calculateIvcCollapse(data.ivc.maxDiameter, data.ivc.minDiameter);
  const avPeakGradient = calculateGradient(data.aorticValve.vmax);
  const ava = calculateAva(data.aorticValve);

  return {
    bsa,
    simpsonEf,
    teichholzEf,
    fs,
    lvMass,
    lvMassIndex,
    rwt,
    lvGeometry: getLvGeometry({ lvMassIndex, rwt, sex: data.basic.sex }),
    eA,
    avgEPrime,
    eOverEPrime,
    lavi,
    trGradient,
    rvsp,
    ivcCollapse,
    avPeakGradient,
    ava,
    focusedLinear: calculateLinearLvDerived(data.focused || {}, bsa, data.basic.sex),
  };
}
