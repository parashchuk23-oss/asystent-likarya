import { rosnerBloodPressureModelData } from '../data/pediatrics/rosnerBloodPressureModelData.js';

const COEFFICIENT_INDEX = {
  sex: 0,
  type: 1,
  quantile: 2,
  intercept: 3,
  height: 4,
  heightSpline1: 5,
  heightSpline2: 6,
  heightSpline3: 7,
  age: 8,
  ageSpline1: 9,
  ageSpline2: 10,
  ageSpline3: 11,
  interaction: 12,
  interactionSpline1: 13,
  interactionSpline2: 14,
  interactionSpline3: 15,
};

const SEX_PARAMETERS = {
  M: {
    heightKnots: [107.8, 140, 154.5, 166.4, 179.1],
    ageKnots: [5.06, 10.79, 13.22, 14.51, 17.3],
    interactionKnots: [-15, 8.9, 50.375, 112.684, 250.04],
    interactionHeightCenter: 150,
  },
  F: {
    heightKnots: [106.7, 140.7, 154, 160.5, 168.9],
    ageKnots: [5, 10.7, 13.16, 14.51, 17.33],
    interactionKnots: [6.701, 16.438, 46.8, 84.46, 203.608],
    interactionHeightCenter: 147,
  },
};

function restrictedCubicSpline(value, knots, scale) {
  const [knot1, knot2, knot3, knot4, knot5] = knots;
  const positiveCube = (knot) => Math.max(value - knot, 0) ** 3;
  const basis = (knot) => (
    positiveCube(knot)
    - positiveCube(knot4) * (knot5 - knot) / (knot5 - knot4)
    + positiveCube(knot5) * (knot4 - knot) / (knot5 - knot4)
  ) / scale;

  return [basis(knot1), basis(knot2), basis(knot3)];
}

function getModelInputs({ sex, ageYearsDecimal, heightCm }) {
  const parameters = SEX_PARAMETERS[sex];
  const heightSplines = restrictedCubicSpline(heightCm, parameters.heightKnots, 100);
  const ageSplines = restrictedCubicSpline(ageYearsDecimal, parameters.ageKnots, 100);
  const interaction = (ageYearsDecimal - 10) * (
    heightCm - parameters.interactionHeightCenter
  );
  const interactionSplines = restrictedCubicSpline(
    interaction,
    parameters.interactionKnots,
    100 ** 2,
  );

  return {
    heightSplines,
    ageSplines,
    interaction,
    interactionSplines,
  };
}

function predictQuantiles({ sex, ageYearsDecimal, heightCm, type }) {
  const inputs = getModelInputs({ sex, ageYearsDecimal, heightCm });

  return rosnerBloodPressureModelData.coefficients
    .filter((row) => row[COEFFICIENT_INDEX.sex] === sex && row[COEFFICIENT_INDEX.type] === type)
    .sort((left, right) => (
      left[COEFFICIENT_INDEX.quantile] - right[COEFFICIENT_INDEX.quantile]
    ))
    .map((row) => (
      row[COEFFICIENT_INDEX.intercept]
      + row[COEFFICIENT_INDEX.height] * heightCm
      + row[COEFFICIENT_INDEX.heightSpline1] * inputs.heightSplines[0]
      + row[COEFFICIENT_INDEX.heightSpline2] * inputs.heightSplines[1]
      + row[COEFFICIENT_INDEX.heightSpline3] * inputs.heightSplines[2]
      + row[COEFFICIENT_INDEX.age] * ageYearsDecimal
      + row[COEFFICIENT_INDEX.ageSpline1] * inputs.ageSplines[0]
      + row[COEFFICIENT_INDEX.ageSpline2] * inputs.ageSplines[1]
      + row[COEFFICIENT_INDEX.ageSpline3] * inputs.ageSplines[2]
      + row[COEFFICIENT_INDEX.interaction] * inputs.interaction
      + row[COEFFICIENT_INDEX.interactionSpline1] * inputs.interactionSplines[0]
      + row[COEFFICIENT_INDEX.interactionSpline2] * inputs.interactionSplines[1]
      + row[COEFFICIENT_INDEX.interactionSpline3] * inputs.interactionSplines[2]
    ));
}

function findHeightReference({ sex, ageInMonths }) {
  const sexNumber = sex === 'M' ? 1 : 2;
  const referenceAgeMonth = Math.round(ageInMonths) + 0.5;
  const rows = ageInMonths < 24
    ? rosnerBloodPressureModelData.infantHeightRows
    : rosnerBloodPressureModelData.mainHeightRows;

  return rows.find((row) => row[0] === sexNumber && row[1] === referenceAgeMonth) || null;
}

function getHeightLimits({ sex, ageInMonths }) {
  const reference = findHeightReference({ sex, ageInMonths });
  if (!reference) return null;

  const [, , l, m, s] = reference;
  const calculateHeight = (zScore) => {
    if (l === 0) return m * Math.exp(s * zScore);
    return m * (1 + l * s * zScore) ** (1 / l);
  };

  return {
    min: calculateHeight(-3.09),
    max: calculateHeight(3.09),
  };
}

function getNearestPercentile(value, predictions) {
  let nearestIndex = 0;

  for (let index = 1; index < predictions.length; index += 1) {
    const difference = Math.abs(value - predictions[index]);
    const nearestDifference = Math.abs(value - predictions[nearestIndex]);
    if (difference <= nearestDifference) nearestIndex = index;
  }

  return nearestIndex + 1;
}

export function calculateRosnerBloodPressureModel({
  sex,
  ageInMonths,
  heightCm,
  systolic,
  diastolic,
}) {
  const ageYearsDecimal = ageInMonths / 12;
  const heightLimits = getHeightLimits({ sex, ageInMonths });

  if (
    !heightLimits
    || heightCm < heightLimits.min
    || heightCm > heightLimits.max
  ) {
    return {
      status: 'out-of-range',
      heightLimits,
    };
  }

  const systolicPredictions = predictQuantiles({
    sex,
    ageYearsDecimal,
    heightCm,
    type: 'sys',
  });
  const diastolicPredictions = predictQuantiles({
    sex,
    ageYearsDecimal,
    heightCm,
    type: 'dia',
  });

  return {
    status: 'ready',
    systolicPercentile: getNearestPercentile(systolic, systolicPredictions),
    diastolicPercentile: getNearestPercentile(diastolic, diastolicPredictions),
    thresholds: {
      systolic: {
        p90: systolicPredictions[89],
        p95: systolicPredictions[94],
        p95Plus12: systolicPredictions[94] + 12,
      },
      diastolic: {
        p90: diastolicPredictions[89],
        p95: diastolicPredictions[94],
        p95Plus12: diastolicPredictions[94] + 12,
      },
    },
    source: rosnerBloodPressureModelData.metadata,
  };
}
