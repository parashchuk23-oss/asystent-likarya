'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import {
  calculateAgeAdjustedDimer,
  calculateDashScore,
  calculateHerdoo2,
  calculateHestia,
  calculatePercRule,
  calculateSpesi,
  calculateVteBleed,
  calculateWellsPe,
} from '../../utils/calculations';

const initialFormData = {
  scenario: null,
  age: '',
  dimer: '',
  dimerUnit: 'ngMlFeu',
  clinicalDvtSigns: false,
  peMoreLikely: false,
  heartRateOver100: false,
  immobilizationOrSurgery: false,
  previousDvtPe: false,
  hemoptysis: false,
  peActiveCancer: false,
  percAgeOver50: false,
  percHeartRateAtLeast100: false,
  percSpo2Below95: false,
  percUnilateralLegSwelling: false,
  percHemoptysis: false,
  percRecentSurgeryOrTrauma: false,
  percPreviousDvtPe: false,
  percEstrogenUse: false,
  spesiAgeOver80: false,
  spesiCancer: false,
  spesiChronicCardiopulmonaryDisease: false,
  spesiHeartRateAtLeast110: false,
  spesiSystolicBpBelow100: false,
  spesiSpo2Below90: false,
  hestiaHemodynamicInstability: false,
  hestiaNeedThrombolysisOrEmbolectomy: false,
  hestiaActiveBleedingOrHighRisk: false,
  hestiaNeedOxygenMoreThan24h: false,
  hestiaPeDuringAnticoagulation: false,
  hestiaSeverePainIvAnalgesia: false,
  hestiaMedicalOrSocialAdmissionReason: false,
  hestiaCrclBelow30: false,
  hestiaSevereLiverFailure: false,
  hestiaPregnancy: false,
  hestiaHistoryHit: false,
  vteBleedActiveCancer: false,
  vteBleedMaleWithUncontrolledHypertension: false,
  vteBleedAnemia: false,
  vteBleedBleedingHistory: false,
  vteBleedAgeAtLeast60: false,
  vteBleedRenalDysfunction: false,
  herdoo2Sex: 'female',
  herdoo2LegChanges: false,
  herdoo2ElevatedDimer: false,
  herdoo2BmiAtLeast30: false,
  herdoo2AgeAtLeast65: false,
  dashElevatedDimerAfterStopping: false,
  dashAgeAtMost50: false,
  dashMaleSex: false,
  dashHormoneAssociatedVteInWomen: false,
};

const scenarios = [
  {
    id: 'suspectedPe',
    title: 'Suspected Pulmonary Embolism',
    description: 'PERC Rule, Wells Score for PE, and age-adjusted D-dimer.',
  },
  {
    id: 'confirmedPe',
    title: 'Confirmed Pulmonary Embolism',
    description: 'sPESI and Hestia Criteria after PE has been confirmed.',
  },
  {
    id: 'anticoagulation',
    title: 'Anticoagulation and Risk Assessment',
    description: 'VTE-BLEED bleeding risk during anticoagulant therapy.',
  },
  {
    id: 'recurrence',
    title: 'Risk of VTE Recurrence',
    description: 'HERDOO2 and DASH Score for recurrence-risk discussion.',
  },
];

const wellsPeFields = [
  { key: 'clinicalDvtSigns', title: 'Clinical signs of DVT', points: '+3' },
  { key: 'peMoreLikely', title: 'An alternative diagnosis is less likely than PE', points: '+3' },
  { key: 'heartRateOver100', title: 'Heart rate >100/min', points: '+1.5' },
  { key: 'immobilizationOrSurgery', title: 'Immobilization ≥3 days or surgery in the previous 4 weeks', points: '+1.5' },
  { key: 'previousDvtPe', title: 'Previous DVT or PE', points: '+1.5' },
  { key: 'hemoptysis', title: 'Hemoptysis', points: '+1' },
  { key: 'peActiveCancer', title: 'Active cancer', points: '+1' },
];

const percFields = [
  { key: 'percAgeOver50', title: 'Age ≥50 years' },
  { key: 'percHeartRateAtLeast100', title: 'Heart rate ≥100/min' },
  { key: 'percSpo2Below95', title: 'Oxygen saturation <95%' },
  { key: 'percUnilateralLegSwelling', title: 'Unilateral leg swelling' },
  { key: 'percHemoptysis', title: 'Hemoptysis' },
  { key: 'percRecentSurgeryOrTrauma', title: 'Recent surgery or trauma' },
  { key: 'percPreviousDvtPe', title: 'Previous DVT or PE' },
  { key: 'percEstrogenUse', title: 'Estrogen use' },
];

const spesiFields = [
  { key: 'spesiAgeOver80', title: 'Age >80 years' },
  { key: 'spesiCancer', title: 'Cancer' },
  { key: 'spesiChronicCardiopulmonaryDisease', title: 'Chronic heart failure or chronic lung disease' },
  { key: 'spesiHeartRateAtLeast110', title: 'Heart rate ≥110/min' },
  { key: 'spesiSystolicBpBelow100', title: 'Systolic blood pressure <100 mmHg' },
  { key: 'spesiSpo2Below90', title: 'Oxygen saturation <90%' },
];

const hestiaFields = [
  { key: 'hestiaHemodynamicInstability', title: 'Hemodynamic instability' },
  { key: 'hestiaNeedThrombolysisOrEmbolectomy', title: 'Need for thrombolysis or embolectomy' },
  { key: 'hestiaActiveBleedingOrHighRisk', title: 'Active bleeding or high bleeding risk' },
  { key: 'hestiaNeedOxygenMoreThan24h', title: 'Need for oxygen for more than 24 hours' },
  { key: 'hestiaPeDuringAnticoagulation', title: 'PE while on anticoagulation' },
  { key: 'hestiaSeverePainIvAnalgesia', title: 'Severe pain requiring intravenous analgesia' },
  { key: 'hestiaMedicalOrSocialAdmissionReason', title: 'Medical or social reason for admission' },
  { key: 'hestiaCrclBelow30', title: 'Creatinine clearance <30 mL/min' },
  { key: 'hestiaSevereLiverFailure', title: 'Severe liver failure' },
  { key: 'hestiaPregnancy', title: 'Pregnancy' },
  { key: 'hestiaHistoryHit', title: 'History of heparin-induced thrombocytopenia' },
];

const vteBleedFields = [
  { key: 'vteBleedActiveCancer', title: 'Active cancer', points: '+2' },
  { key: 'vteBleedMaleWithUncontrolledHypertension', title: 'Male patient with uncontrolled hypertension', points: '+1' },
  { key: 'vteBleedAnemia', title: 'Anemia', points: '+1.5' },
  { key: 'vteBleedBleedingHistory', title: 'History of bleeding', points: '+1.5' },
  { key: 'vteBleedAgeAtLeast60', title: 'Age ≥60 years', points: '+1.5' },
  { key: 'vteBleedRenalDysfunction', title: 'Renal dysfunction', points: '+1.5' },
];

const herdoo2Fields = [
  { key: 'herdoo2LegChanges', title: 'Hyperpigmentation, edema, or redness in either leg' },
  { key: 'herdoo2ElevatedDimer', title: 'Elevated D-dimer' },
  { key: 'herdoo2BmiAtLeast30', title: 'BMI ≥30 kg/m²' },
  { key: 'herdoo2AgeAtLeast65', title: 'Age ≥65 years' },
];

const dashFields = [
  { key: 'dashElevatedDimerAfterStopping', title: 'Abnormal D-dimer after stopping anticoagulation', points: '+2' },
  { key: 'dashAgeAtMost50', title: 'Age ≤50 years', points: '+1' },
  { key: 'dashMaleSex', title: 'Male sex', points: '+1' },
  { key: 'dashHormoneAssociatedVteInWomen', title: 'Hormone-associated VTE in women', points: '−2' },
];

const relatedTools = ['eGFR', 'AF anticoagulation', 'BMI', 'Cardiovascular risk'];
const checklist = ['Blood pressure', 'Heart rate', 'Oxygen saturation', 'ECG', 'D-dimer', 'Creatinine / eGFR', 'Hemoglobin', 'Platelets', 'Troponin / BNP when indicated', 'Compression venous ultrasound', 'CT pulmonary angiography when indicated'];

function CheckboxCard({ title, points, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
      <span className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>{title}</span>
      </span>
      {points ? <span className="shrink-0 text-slate-500">{points}</span> : null}
    </label>
  );
}

function FieldGrid({ fields, formData, onChange }) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      {fields.map((field) => (
        <CheckboxCard
          key={field.key}
          title={field.title}
          points={field.points}
          checked={formData[field.key]}
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </div>
  );
}

function ToolCard({ title, description, children }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      {children}
    </section>
  );
}

function ResultCard({ title, value, subtitle, children }) {
  return (
    <section className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-3xl font-bold text-blue-800">{value}</p>
      <p className="mt-1 font-semibold text-slate-900">{subtitle}</p>
      <div className="mt-3 space-y-2 leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function Chips({ items }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
          {item}
        </span>
      ))}
    </div>
  );
}

function DimerInputs({ formData, onChange }) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <FormField label="Age" hint="years">
        <input
          type="number"
          value={formData.age}
          onChange={(event) => onChange('age', event.target.value)}
          className={inputClass}
          placeholder="65"
          min="1"
          step="1"
        />
      </FormField>

      <FormField label="D-dimer">
        <input
          type="number"
          value={formData.dimer}
          onChange={(event) => onChange('dimer', event.target.value)}
          className={inputClass}
          placeholder="500"
          min="0"
          step="0.1"
        />
      </FormField>

      <FormField label="D-dimer units">
        <select
          value={formData.dimerUnit}
          onChange={(event) => onChange('dimerUnit', event.target.value)}
          className={inputClass}
        >
          <option value="ngMlFeu">ng/mL FEU</option>
          <option value="mcgLFeu">mcg/L FEU</option>
        </select>
      </FormField>
    </div>
  );
}

function englishWellsPe(result) {
  return result.score <= 4 ? 'PE unlikely.' : 'PE likely.';
}

function englishPerc(result) {
  return result.isNegative
    ? 'PERC negative: all criteria are absent.'
    : 'PERC positive: at least one criterion is present.';
}

function englishSpesi(result) {
  return result.score === 0 ? 'Low risk by sPESI.' : 'Elevated risk by sPESI.';
}

function englishHestia(result) {
  return result.positiveCriteria === 0
    ? 'All Hestia criteria are absent; outpatient management may be considered in the appropriate clinical context.'
    : 'At least one Hestia criterion is present; outpatient management is not recommended by Hestia.';
}

function englishVteBleed(result) {
  return result.isHighRisk
    ? 'Higher bleeding risk during anticoagulation by VTE-BLEED.'
    : 'Lower bleeding risk during anticoagulation by VTE-BLEED.';
}

function englishHerdoo2(result, sex) {
  if (sex !== 'female') {
    return 'HERDOO2 is not used in men as a low-risk rule for recurrence.';
  }

  return result.score <= 1
    ? '0–1 criterion: lower recurrence risk in a woman after a first unprovoked VTE.'
    : '≥2 criteria: higher recurrence risk.';
}

function englishDash(score) {
  if (score === 2) return 'Intermediate estimated recurrence risk.';
  if (score >= 3) return 'Higher estimated recurrence risk.';
  return 'Lower estimated recurrence risk.';
}

export default function VteCalculatorEnglish() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);

  const previews = useMemo(() => {
    const wellsPe = calculateWellsPe({
      clinicalDvtSigns: formData.clinicalDvtSigns,
      peMoreLikely: formData.peMoreLikely,
      heartRateOver100: formData.heartRateOver100,
      immobilizationOrSurgery: formData.immobilizationOrSurgery,
      previousDvtPe: formData.previousDvtPe,
      hemoptysis: formData.hemoptysis,
      activeCancer: formData.peActiveCancer,
    });
    const perc = calculatePercRule({
      ageOver50: formData.percAgeOver50,
      heartRateAtLeast100: formData.percHeartRateAtLeast100,
      spo2Below95: formData.percSpo2Below95,
      unilateralLegSwelling: formData.percUnilateralLegSwelling,
      hemoptysis: formData.percHemoptysis,
      recentSurgeryOrTrauma: formData.percRecentSurgeryOrTrauma,
      previousDvtPe: formData.percPreviousDvtPe,
      estrogenUse: formData.percEstrogenUse,
    });
    const spesi = calculateSpesi({
      ageOver80: formData.spesiAgeOver80,
      cancer: formData.spesiCancer,
      chronicCardiopulmonaryDisease: formData.spesiChronicCardiopulmonaryDisease,
      heartRateAtLeast110: formData.spesiHeartRateAtLeast110,
      systolicBpBelow100: formData.spesiSystolicBpBelow100,
      spo2Below90: formData.spesiSpo2Below90,
    });
    const hestia = calculateHestia({
      hemodynamicInstability: formData.hestiaHemodynamicInstability,
      needThrombolysisOrEmbolectomy: formData.hestiaNeedThrombolysisOrEmbolectomy,
      activeBleedingOrHighRisk: formData.hestiaActiveBleedingOrHighRisk,
      needOxygenMoreThan24h: formData.hestiaNeedOxygenMoreThan24h,
      peDuringAnticoagulation: formData.hestiaPeDuringAnticoagulation,
      severePainIvAnalgesia: formData.hestiaSeverePainIvAnalgesia,
      medicalOrSocialAdmissionReason: formData.hestiaMedicalOrSocialAdmissionReason,
      crclBelow30: formData.hestiaCrclBelow30,
      severeLiverFailure: formData.hestiaSevereLiverFailure,
      pregnancy: formData.hestiaPregnancy,
      historyHit: formData.hestiaHistoryHit,
    });
    const vteBleed = calculateVteBleed({
      activeCancer: formData.vteBleedActiveCancer,
      maleWithUncontrolledHypertension: formData.vteBleedMaleWithUncontrolledHypertension,
      anemia: formData.vteBleedAnemia,
      bleedingHistory: formData.vteBleedBleedingHistory,
      ageAtLeast60: formData.vteBleedAgeAtLeast60,
      renalDysfunction: formData.vteBleedRenalDysfunction,
    });
    const herdoo2 = calculateHerdoo2({
      sex: formData.herdoo2Sex,
      legHyperpigmentationEdemaRedness: formData.herdoo2LegChanges,
      elevatedDimer: formData.herdoo2ElevatedDimer,
      bmiAtLeast30: formData.herdoo2BmiAtLeast30,
      ageAtLeast65: formData.herdoo2AgeAtLeast65,
    });
    const dash = calculateDashScore({
      elevatedDimerAfterStopping: formData.dashElevatedDimerAfterStopping,
      ageAtMost50: formData.dashAgeAtMost50,
      maleSex: formData.dashMaleSex,
      hormoneAssociatedVteInWomen: formData.dashHormoneAssociatedVteInWomen,
    });

    return { wellsPe, perc, spesi, hestia, vteBleed, herdoo2, dash };
  }, [formData]);

  function handleChange(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setResult(null);
  }

  function handleScenarioChange(scenario) {
    setFormData((current) => ({ ...current, scenario }));
    setResult(null);
  }

  function handleCalculate() {
    const dimer = calculateAgeAdjustedDimer(formData);
    const next = { scenario: formData.scenario, dimer, ...previews };
    setResult(next);
  }

  function handleReset() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <div>
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span>Calculators</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-800">Venous Thromboembolism</span>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-1 text-xs font-semibold">
          <Link href="/calculators/venous-thromboembolism" className="rounded px-2 py-1 text-slate-600 hover:bg-slate-50">UA</Link>
          <span className="text-slate-300">|</span>
          <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">EN</span>
        </div>
      </nav>

      <header className="rounded-lg border border-teal-300 bg-white p-5 shadow-sm shadow-slate-200/60">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Venous Thromboembolism</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Clinical calculators for the diagnosis, risk stratification, treatment planning, and follow-up of venous thromboembolism.
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          PERC Rule · Wells Score for PE · Age-Adjusted D-Dimer · sPESI · Hestia Criteria · VTE-BLEED · HERDOO2 · DASH Score
        </p>
      </header>

      <section className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => handleScenarioChange(scenario.id)}
            className={`rounded-md border px-3 py-3 text-left text-sm transition ${
              formData.scenario === scenario.id
                ? 'border-blue-300 bg-blue-50 text-blue-900'
                : 'border-teal-300 bg-white text-slate-700 hover:border-teal-500 hover:bg-teal-50/40'
            }`}
          >
            <span className="block font-semibold">{scenario.title}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{scenario.description}</span>
          </button>
        ))}
      </section>

      {!formData.scenario ? (
        <section className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Select a clinical scenario to open the relevant calculators. No calculator is open by default.
        </section>
      ) : null}

      {formData.scenario === 'suspectedPe' && (
        <section className="mt-4 space-y-3">
          <ToolCard
            title="Wells Score for Pulmonary Embolism"
            description="Estimates clinical probability of PE before D-dimer or imaging. In this module, ≤4 means PE unlikely and >4 means PE likely."
          >
            <FieldGrid fields={wellsPeFields} formData={formData} onChange={handleChange} />
          </ToolCard>
          <ToolCard
            title="PERC Rule"
            description="Use only when the clinician has already judged PE probability to be low. If all criteria are absent, D-dimer may not be required."
          >
            <FieldGrid fields={percFields} formData={formData} onChange={handleChange} />
          </ToolCard>
          <ToolCard
            title="Age-Adjusted D-Dimer"
            description="Compares D-dimer with an age-adjusted FEU threshold. It supports exclusion of VTE only within the appropriate clinical-probability algorithm."
          >
            <DimerInputs formData={formData} onChange={handleChange} />
          </ToolCard>
        </section>
      )}

      {formData.scenario === 'confirmedPe' && (
        <section className="mt-4 space-y-3">
          <ToolCard
            title="sPESI"
            description="sPESI does not diagnose PE. It estimates short-term risk after pulmonary embolism has been confirmed."
          >
            <FieldGrid fields={spesiFields} formData={formData} onChange={handleChange} />
          </ToolCard>
          <ToolCard
            title="Hestia Criteria"
            description="Hestia identifies criteria that make outpatient PE treatment undesirable."
          >
            <FieldGrid fields={hestiaFields} formData={formData} onChange={handleChange} />
          </ToolCard>
        </section>
      )}

      {formData.scenario === 'anticoagulation' && (
        <section className="mt-4 space-y-3">
          <ToolCard
            title="VTE-BLEED"
            description="Assesses bleeding risk during anticoagulation for VTE. A higher score is not an automatic reason to stop anticoagulation; it highlights modifiable bleeding risks."
          >
            <FieldGrid fields={vteBleedFields} formData={formData} onChange={handleChange} />
          </ToolCard>
        </section>
      )}

      {formData.scenario === 'recurrence' && (
        <section className="mt-4 space-y-3">
          <ToolCard
            title="HERDOO2"
            description="Used mainly in women after a first unprovoked VTE when discussing recurrence risk after initial anticoagulation."
          >
            <div className="mt-4 max-w-md">
              <FormField label="Sex for HERDOO2">
                <select
                  value={formData.herdoo2Sex}
                  onChange={(event) => handleChange('herdoo2Sex', event.target.value)}
                  className={inputClass}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </FormField>
            </div>
            <FieldGrid fields={herdoo2Fields} formData={formData} onChange={handleChange} />
          </ToolCard>
          <ToolCard
            title="DASH Score"
            description="A supportive recurrence-risk estimate after stopping anticoagulation. It should not determine treatment duration by itself."
          >
            <FieldGrid fields={dashFields} formData={formData} onChange={handleChange} />
          </ToolCard>
        </section>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!formData.scenario}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Reset
        </button>
      </div>

      {result ? (
        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          {result.scenario === 'suspectedPe' ? (
            <>
              <ResultCard title="Wells Score for PE" value={result.wellsPe.score} subtitle={englishWellsPe(result.wellsPe)}>
                <p>Interpretation: ≤4 means PE unlikely; &gt;4 means PE likely.</p>
                <p>Next step: if PE is likely, D-dimer should not be used as the only rule-out test; consider imaging according to the clinical context.</p>
              </ResultCard>
              <ResultCard title="PERC Rule" value={result.perc.isNegative ? 'Negative' : 'Positive'} subtitle={englishPerc(result.perc)}>
                <p>Positive criteria: {result.perc.positiveCriteria}.</p>
                <p>PERC is useful only after a low pre-test probability has been established clinically.</p>
              </ResultCard>
              {result.dimer ? (
                <ResultCard
                  title="Age-Adjusted D-Dimer"
                  value={`${result.dimer.threshold} ${result.dimer.unitLabel === 'мкг/л FEU' ? 'mcg/L FEU' : 'ng/mL FEU'}`}
                  subtitle={result.dimer.exceedsThreshold ? 'Above threshold' : 'Not above threshold'}
                >
                  <p>Entered value: {result.dimer.dimer} {result.dimer.unitLabel === 'мкг/л FEU' ? 'mcg/L FEU' : 'ng/mL FEU'}.</p>
                  <p>A positive D-dimer does not confirm VTE; it supports moving to imaging when clinically appropriate.</p>
                </ResultCard>
              ) : null}
            </>
          ) : null}

          {result.scenario === 'confirmedPe' ? (
            <>
              <ResultCard title="sPESI" value={result.spesi.score} subtitle={englishSpesi(result.spesi)}>
                <p>0 points indicates lower short-term risk; ≥1 point indicates elevated short-term risk.</p>
              </ResultCard>
              <ResultCard title="Hestia Criteria" value={result.hestia.positiveCriteria} subtitle={englishHestia(result.hestia)}>
                <p>Positive criteria: {result.hestia.positiveCriteria}.</p>
                <p>If any Hestia criterion is present, outpatient PE treatment is not recommended by Hestia.</p>
              </ResultCard>
            </>
          ) : null}

          {result.scenario === 'anticoagulation' ? (
            <ResultCard title="VTE-BLEED" value={result.vteBleed.score} subtitle={englishVteBleed(result.vteBleed)}>
              <p>Higher bleeding risk threshold: ≥2 points.</p>
              <p>Use the result to identify modifiable bleeding-risk factors rather than to automatically stop anticoagulation.</p>
            </ResultCard>
          ) : null}

          {result.scenario === 'recurrence' ? (
            <>
              <ResultCard title="HERDOO2" value={result.herdoo2.score} subtitle={englishHerdoo2(result.herdoo2, formData.herdoo2Sex)}>
                <p>HERDOO2 is a supportive recurrence-risk tool and is not a stand-alone treatment decision.</p>
              </ResultCard>
              <ResultCard title="DASH Score" value={result.dash.score} subtitle={englishDash(result.dash.score)}>
                <p>DASH is a supportive estimate after stopping anticoagulation and should be combined with bleeding risk and patient preferences.</p>
              </ResultCard>
            </>
          ) : null}
        </section>
      ) : null}

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4">
        <h2 className="font-semibold text-slate-950">What to check</h2>
        <Chips items={checklist} />
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold text-slate-950">Related tools</h2>
        <Chips items={relatedTools} />
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <h2 className="font-semibold text-slate-950">References</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Wells clinical prediction rules for PE and DVT.</li>
          <li>PERC Rule for low-risk suspected pulmonary embolism.</li>
          <li>Age-adjusted D-dimer threshold in FEU units.</li>
          <li>sPESI and Hestia criteria for confirmed pulmonary embolism.</li>
          <li>VTE-BLEED, HERDOO2, and DASH Score as supportive risk-assessment tools.</li>
        </ul>
      </section>

      <p className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        This venous thromboembolism module is a supportive clinical tool for physicians. Wells, PERC, age-adjusted D-dimer, sPESI, Hestia, VTE-BLEED, HERDOO2, and DASH Score do not establish or exclude a diagnosis by themselves. Final decisions about D-dimer testing, imaging, hospitalization, anticoagulation, treatment duration, and follow-up must be made by the physician based on the patient’s clinical condition, local protocols, and current guidelines.
      </p>
    </div>
  );
}
