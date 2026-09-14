import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assessPediatricBloodPressure,
  classifyPediatricBloodPressure,
} from '../utils/pediatricBloodPressure.js';
import { calculateRosnerBloodPressureModel } from '../utils/rosnerPediatricBloodPressure.js';

const goldenFixtures = [
  { sex: 'M', ageInMonths: 72, heightCm: 128.2, systolic: 87.166, diastolic: 57.9352, systolicPercentile: 9, diastolicPercentile: 48 },
  { sex: 'F', ageInMonths: 108, heightCm: 123.5, systolic: 88.714, diastolic: 44.7809, systolicPercentile: 28, diastolicPercentile: 14 },
  { sex: 'M', ageInMonths: 132, heightCm: 145.9, systolic: 111.714, diastolic: 51.9091, systolicPercentile: 85, diastolicPercentile: 17 },
  { sex: 'M', ageInMonths: 84, heightCm: 121.3, systolic: 91.714, diastolic: 51.9091, systolicPercentile: 33, diastolicPercentile: 29 },
  { sex: 'M', ageInMonths: 84, heightCm: 121.2, systolic: 69.166, diastolic: 43.9352, systolicPercentile: 1, diastolicPercentile: 9 },
  { sex: 'F', ageInMonths: 84, heightCm: 120.5, systolic: 88.714, diastolic: 56.7809, systolicPercentile: 27, diastolicPercentile: 51 },
  { sex: 'F', ageInMonths: 12.2083 * 12, heightCm: 149.1, systolic: 116.673, diastolic: 59.2037, systolicPercentile: 90, diastolicPercentile: 42 },
  { sex: 'F', ageInMonths: 11.2909 * 12, heightCm: 160, systolic: 114, diastolic: 70, systolicPercentile: 77, diastolicPercentile: 75 },
  { sex: 'F', ageInMonths: 6.3874 * 12, heightCm: 127, systolic: 96, diastolic: 50, systolicPercentile: 45, diastolicPercentile: 21 },
];

test('JS port reproduces author-provided SAS golden fixtures', () => {
  for (const fixture of goldenFixtures) {
    const result = calculateRosnerBloodPressureModel(fixture);
    assert.equal(result.status, 'ready');
    assert.equal(result.systolicPercentile, fixture.systolicPercentile);
    assert.equal(result.diastolicPercentile, fixture.diastolicPercentile);
  }
});

test('model agrees with representative AAP Tables 4-5 cells within printed-value rounding', () => {
  const tableFixtures = [
    { sex: 'M', ageInMonths: 12, heightCm: 82.4, p90: [100, 53], p95: [103, 55] },
    { sex: 'F', ageInMonths: 12, heightCm: 80.8, p90: [100, 56], p95: [103, 60] },
    { sex: 'M', ageInMonths: 60, heightCm: 112.4, p90: [106, 65], p95: [109, 69] },
    { sex: 'F', ageInMonths: 60, heightCm: 111.5, p90: [107, 67], p95: [110, 71] },
    { sex: 'M', ageInMonths: 120, heightCm: 141.3, p90: [112, 74], p95: [116, 77] },
    { sex: 'F', ageInMonths: 120, heightCm: 141, p90: [112, 73], p95: [116, 76] },
    { sex: 'M', ageInMonths: 144, heightCm: 152.7, p90: [117, 75], p95: [121, 78] },
    { sex: 'F', ageInMonths: 144, heightCm: 154.8, p90: [118, 75], p95: [122, 78] },
  ];

  for (const fixture of tableFixtures) {
    const result = calculateRosnerBloodPressureModel({
      ...fixture,
      systolic: 100,
      diastolic: 60,
    });
    const comparisons = [
      [result.thresholds.systolic.p90, fixture.p90[0]],
      [result.thresholds.diastolic.p90, fixture.p90[1]],
      [result.thresholds.systolic.p95, fixture.p95[0]],
      [result.thresholds.diastolic.p95, fixture.p95[1]],
    ];
    for (const [actual, printed] of comparisons) assert.ok(Math.abs(actual - printed) < 1);
  }
});

test('12 years 11 months uses the full model; 13 years uses fixed thresholds', () => {
  const child = classifyPediatricBloodPressure({ sex: 'male', ageYears: 12, ageMonths: 11, heightCm: 160, systolic: 120, diastolic: 70 });
  const adolescent = classifyPediatricBloodPressure({ sex: 'male', ageYears: 13, ageMonths: 0, heightCm: null, systolic: 120, diastolic: 70 });
  assert.equal(child.mode, 'aap-2017-full');
  assert.equal(adolescent.mode, 'aap-2017-fixed-13-plus');
  assert.equal(adolescent.category, 'elevated');
});

test('higher systolic category determines the final category', () => {
  const result = classifyPediatricBloodPressure({ sex: 'male', ageYears: 10, ageMonths: 0, heightCm: 141.3, systolic: 130, diastolic: 60 });
  assert.equal(result.systolicCategory, 'stage2');
  assert.equal(result.diastolicCategory, 'normal');
  assert.equal(result.category, 'stage2');
});

test('higher diastolic category determines the final category', () => {
  const result = classifyPediatricBloodPressure({ sex: 'female', ageYears: 10, ageMonths: 0, heightCm: 141, systolic: 100, diastolic: 80 });
  assert.equal(result.systolicCategory, 'normal');
  assert.equal(result.diastolicCategory, 'stage1');
  assert.equal(result.category, 'stage1');
});

test('absolute AAP boundaries are applied from the highest category', () => {
  const base = { sex: 'male', ageYears: 12, ageMonths: 0, heightCm: 165.5 };
  assert.equal(classifyPediatricBloodPressure({ ...base, systolic: 120, diastolic: 70 }).systolicCategory, 'elevated');
  assert.equal(classifyPediatricBloodPressure({ ...base, systolic: 130, diastolic: 70 }).systolicCategory, 'stage1');
  assert.equal(classifyPediatricBloodPressure({ ...base, systolic: 140, diastolic: 70 }).systolicCategory, 'stage2');
  assert.equal(classifyPediatricBloodPressure({ ...base, systolic: 100, diastolic: 80 }).diastolicCategory, 'stage1');
  assert.equal(classifyPediatricBloodPressure({ ...base, systolic: 100, diastolic: 90 }).diastolicCategory, 'stage2');
});

test('missing height blocks the full model but not the fixed adolescent mode', () => {
  const child = classifyPediatricBloodPressure({ sex: 'female', ageYears: 8, ageMonths: 0, heightCm: '', systolic: 105, diastolic: 65 });
  const adolescent = classifyPediatricBloodPressure({ sex: 'female', ageYears: 13, ageMonths: 0, heightCm: '', systolic: 110, diastolic: 70 });
  assert.equal(child.status, 'missing-height');
  assert.equal(adolescent.status, 'ready');
});

test('invalid and out-of-model inputs fail safely', () => {
  assert.equal(classifyPediatricBloodPressure({ sex: '', ageYears: 8, ageMonths: 0, heightCm: 130, systolic: 100, diastolic: 60 }).status, 'missing-sex');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: '', ageMonths: 0, heightCm: 130, systolic: 100, diastolic: 60 }).status, 'missing-age');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 8, ageMonths: 0, heightCm: 'not-a-height', systolic: 100, diastolic: 60 }).status, 'invalid-height');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 8, ageMonths: 0, heightCm: 130, systolic: Number.NaN, diastolic: 60 }).status, 'invalid-bp');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 8, ageMonths: 0, heightCm: 130, systolic: 80, diastolic: 80 }).status, 'invalid-bp');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 8, ageMonths: 0, heightCm: 220, systolic: 100, diastolic: 60 }).status, 'out-of-range');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 0, ageMonths: 11, heightCm: 75, systolic: 90, diastolic: 50 }).status, 'out-of-range');
  assert.equal(classifyPediatricBloodPressure({ sex: 'male', ageYears: 18, ageMonths: 0, heightCm: 175, systolic: 120, diastolic: 70 }).status, 'out-of-range');
});

test('form adapter validates BP syntax and systolic greater than diastolic', () => {
  assert.equal(assessPediatricBloodPressure({ bloodPressure: 'abc', sex: 'чоловіча', ageYears: 8, ageMonths: 0, heightCm: 130 }).status, 'invalid-bp');
  assert.equal(assessPediatricBloodPressure({ bloodPressure: '70/80', sex: 'чоловіча', ageYears: 8, ageMonths: 0, heightCm: 130 }).status, 'invalid-bp');
});
