'use client';

import { useState } from 'react';
import { calculateScore2Risk } from '../../utils/score2';
import FormField from '../FormField';
import { inputClass } from '../formStyles';

const initialRiskData = {
  patientScenario: '',
  diabetes: 'ні',
  establishedASCVD: 'ні',
  chronicKidneyDisease: 'ні',
  egfr: '',
  acr: '',
  diabetesDiagnosisAge: '',
  hba1c: '',
  hba1cUnit: 'percent',
  smartDiabetes: 'ні',
  smartCoronaryDisease: 'так',
  smartCerebrovascularDisease: 'ні',
  smartPeripheralArteryDisease: 'ні',
  smartAbdominalAorticAneurysm: 'ні',
  yearsSinceFirstEvent: '',
  hsCrp: '',
  age: '',
  sex: '',
  smoking: 'ні',
  systolicBP: '',
  totalCholesterol: '',
  hdl: '',
  lipidsUnit: 'mmolL',
};

const interpretationLabels = {
  низький: 'low',
  середній: 'moderate',
  високий: 'high',
  'дуже високий': 'very high',
  'помірний залишковий ризик': 'moderate residual risk',
  'високий залишковий ризик': 'high residual risk',
  'дуже високий залишковий ризик': 'very high residual risk',
  'екстремально високий залишковий ризик': 'extremely high residual risk',
  'SCORE2 не застосовується': 'SCORE2 is not applicable',
  'SCORE2-Diabetes не застосовується': 'SCORE2-Diabetes is not applicable',
  'індивідуальна оцінка': 'individual clinical assessment',
  'недостатньо даних': 'insufficient data',
  'перевірте дані': 'check the entered data',
};

const missingFieldLabels = {
  вік: 'age',
  стать: 'sex',
  куріння: 'smoking status',
  'систолічний АТ': 'systolic blood pressure',
  'загальний холестерин': 'total cholesterol',
  ЛПВЩ: 'HDL cholesterol',
  'вік встановлення ЦД': 'age at diabetes diagnosis',
  ШКФ: 'eGFR',
  'років від першої СС-події': 'years since first cardiovascular event',
  'цукровий діабет': 'diabetes',
  'тип встановленого ССЗ': 'type of established cardiovascular disease',
};

const recommendationLabels = {
  'Зменшити в раціоні яєчні жовтки, субпродукти, жирні сорти м’яса та жирні молочні продукти.':
    'Reduce egg yolks, organ meats, fatty meats, and high-fat dairy products.',
  'Морська риба 2 рази на тиждень.': 'Sea fish twice per week.',
  'Збільшити в раціоні цільнозернові продукти, бобові, горох, фрукти, ягоди та овочі.':
    'Increase whole grains, legumes, peas, fruit, berries, and vegetables.',
  'Контроль глюкози крові. По можливості обмежити солодощі.':
    'Check blood glucose. Limit sweets where possible.',
  'За наявності надлишкової маси тіла рекомендовано поступове зниження ваги на 5-10% протягом 6 місяців.':
    'If excess body weight is present, gradual 5-10% weight reduction over 6 months may be beneficial.',
  'Контроль сечової кислоти за клінічної потреби.': 'Check uric acid when clinically relevant.',
  'Виключити алкоголь або максимально обмежити його. При курінні - повна відмова від куріння.':
    'Avoid or substantially limit alcohol. If the patient smokes, complete smoking cessation is recommended.',
  'Контроль АТ. Цільовий рівень АТ - не більше 140/80 мм рт.ст.':
    'Monitor blood pressure. Target BP: no more than 140/80 mmHg.',
  'Контроль ліпідограми через 3-6 місяців.': 'Repeat lipid profile in 3-6 months.',
};

function translateInterpretation(value) {
  return interpretationLabels[value] || value || '';
}

function translateMissing(fields = []) {
  return fields.map((field) => missingFieldLabels[field] || field);
}

function translateLdlTarget(target) {
  if (!target) return null;
  return target.replace('ммоль/л', 'mmol/L');
}

function translateRecommendation(recommendation) {
  if (recommendationLabels[recommendation]) return recommendationLabels[recommendation];

  if (recommendation.startsWith('Розглянути можливість ліпідознижувальної терапії')) {
    return recommendation
      .replace(
        'Розглянути можливість ліпідознижувальної терапії, контроль ліпідограми через 2 місяці.',
        'Consider lipid-lowering therapy and repeat lipid profile in 2 months.'
      )
      .replace('Цільовий рівень ЛПНЩ:', 'LDL-C target:')
      .replace('ммоль/л', 'mmol/L');
  }

  return recommendation;
}

function getEnglishReason(result) {
  if (!result) return '';

  if (result.modelName === 'SMART Risk Score') {
    return result.riskPercent === null
      ? 'Established atherosclerotic cardiovascular disease is a secondary-prevention scenario. Additional data are needed for local SMART Risk Score estimation.'
      : 'Estimated with SMART Risk Score for a patient with established atherosclerotic cardiovascular disease. SCORE2 is not used in this scenario.';
  }

  if (result.modelName === 'SCORE2-Diabetes') {
    return 'Estimated with SCORE2-Diabetes for a patient with type 2 diabetes and no established atherosclerotic cardiovascular disease.';
  }

  if (result.interpretation === 'SCORE2-Diabetes не застосовується') {
    return 'SCORE2-Diabetes is intended for patients with type 2 diabetes aged 40-69 years.';
  }

  if (result.interpretation === 'SCORE2 не застосовується') {
    return 'SCORE2 is intended for patients aged 40-69 years.';
  }

  if (result.interpretation === 'індивідуальна оцінка') {
    return 'Use individual clinical assessment outside the validated age range.';
  }

  if (result.interpretation === 'недостатньо даних') {
    return 'There is not enough information to calculate the score.';
  }

  if (result.interpretation === 'перевірте дані') {
    return 'Age at diabetes diagnosis cannot be greater than current age.';
  }

  if (result.ckdModifier?.level === 'veryHigh' || result.ckdModifier?.level === 'high') {
    return 'CKD or albuminuria meets criteria for elevated cardiovascular risk and should be interpreted with the full clinical picture.';
  }

  return `Estimated with ${result.modelName || 'SCORE2'} for primary prevention.`;
}

function CheckboxField({ label, checked, onChange, className = '' }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function InlineCheckboxField({ label, checked, onChange }) {
  return (
    <div className="mb-0">
      <div className="mb-1.5 min-h-[1.25rem]" aria-hidden="true" />
      <CheckboxField
        label={label}
        checked={checked}
        onChange={onChange}
        className="min-h-[2.25rem] items-center py-2"
      />
    </div>
  );
}

function ScenarioCard({ title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2.5 text-left transition ${
        active
          ? 'border-blue-300 bg-blue-50 shadow-sm shadow-blue-100'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50'
      }`}
    >
      <span className="block text-sm font-semibold text-slate-950">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span>
    </button>
  );
}

function DiabetesDetailsDropdown({ riskData, onChange }) {
  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/70 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
        SCORE2-Diabetes data
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Age at diabetes diagnosis">
          <input
            type="number"
            value={riskData.diabetesDiagnosisAge}
            onChange={(event) => onChange('diabetesDiagnosisAge', event.target.value)}
            className={inputClass}
            placeholder="50"
            min="1"
          />
        </FormField>

        <FormField label="eGFR" hint="mL/min/1.73 m²">
          <input
            type="number"
            value={riskData.egfr}
            onChange={(event) => onChange('egfr', event.target.value)}
            className={inputClass}
            placeholder="75"
            min="1"
          />
        </FormField>

        <FormField label="HbA1c">
          <input
            type="number"
            value={riskData.hba1c}
            onChange={(event) => onChange('hba1c', event.target.value)}
            className={inputClass}
            placeholder="7.0"
            min="1"
            step="0.1"
          />
        </FormField>

        <FormField label="HbA1c unit">
          <select
            value={riskData.hba1cUnit}
            onChange={(event) => onChange('hba1cUnit', event.target.value)}
            className={inputClass}
          >
            <option value="percent">%</option>
            <option value="mmolMol">mmol/mol</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}

function SecondaryPreventionDropdown({ riskData, onChange }) {
  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/70 p-3 text-sm leading-6 text-slate-700">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
        Secondary prevention / SMART
      </p>
      <p className="mt-2">
        SCORE2 is not used when atherosclerotic cardiovascular disease is already established. You can estimate
        10-year residual risk with SMART Risk Score below.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <InlineCheckboxField
          label="Diabetes"
          checked={riskData.smartDiabetes === 'так'}
          onChange={(checked) => onChange('smartDiabetes', checked ? 'так' : 'ні')}
        />

        <FormField label="Years since first CV event" className="mb-0">
          <input
            type="number"
            value={riskData.yearsSinceFirstEvent}
            onChange={(event) => onChange('yearsSinceFirstEvent', event.target.value)}
            className={inputClass}
            placeholder="5"
            min="0"
            step="0.1"
          />
        </FormField>

        <FormField label="eGFR" hint="mL/min/1.73 m²" className="mb-0">
          <input
            type="number"
            value={riskData.egfr}
            onChange={(event) => onChange('egfr', event.target.value)}
            className={inputClass}
            placeholder="75"
            min="1"
          />
        </FormField>

        <FormField label="hsCRP" hint="mg/L" className="mb-0">
          <input
            type="number"
            value={riskData.hsCrp}
            onChange={(event) => onChange('hsCrp', event.target.value)}
            className={inputClass}
            placeholder="2"
            min="0.1"
            step="0.1"
          />
        </FormField>
      </div>

      <div className="mt-3 rounded-md border border-white bg-white/75 p-3">
        <p className="mb-2 font-semibold text-slate-900">Type of established ASCVD</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <CheckboxField
            label="Coronary artery disease"
            checked={riskData.smartCoronaryDisease === 'так'}
            onChange={(checked) => onChange('smartCoronaryDisease', checked ? 'так' : 'ні')}
          />
          <CheckboxField
            label="Stroke / TIA"
            checked={riskData.smartCerebrovascularDisease === 'так'}
            onChange={(checked) => onChange('smartCerebrovascularDisease', checked ? 'так' : 'ні')}
          />
          <CheckboxField
            label="Peripheral artery disease"
            checked={riskData.smartPeripheralArteryDisease === 'так'}
            onChange={(checked) => onChange('smartPeripheralArteryDisease', checked ? 'так' : 'ні')}
          />
          <CheckboxField
            label="Abdominal aortic aneurysm"
            checked={riskData.smartAbdominalAorticAneurysm === 'так'}
            onChange={(checked) => onChange('smartAbdominalAorticAneurysm', checked ? 'так' : 'ні')}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href="https://www.escardio.org/Education/ESC-Prevention-of-CVD-Programme/Risk-assessment/SMART-Risk-Score"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          Open SMART Risk Score
        </a>
        <a
          href="https://u-prevent.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Open U-Prevent
        </a>
      </div>

      <div className="mt-3 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-5 text-slate-700">
        <p>
          This is a local supportive implementation of SMART Risk Score based on the published model by
          Dorresteijn et al., Heart 2013. It is not an official ESC or U-Prevent calculator.
        </p>
        <p className="mt-1">For an external alternative, use U-Prevent.</p>
      </div>
    </div>
  );
}

function SexCheckboxes({ value, onChange }) {
  return (
    <FormField label="Sex">
      <div className="grid gap-2 sm:grid-cols-2">
        <CheckboxField
          label="Male"
          checked={value === 'чоловік'}
          onChange={(checked) => onChange(checked ? 'чоловік' : '')}
        />
        <CheckboxField
          label="Female"
          checked={value === 'жінка'}
          onChange={(checked) => onChange(checked ? 'жінка' : '')}
        />
      </div>
    </FormField>
  );
}

function ScenarioCalculatorPanel({
  scenario,
  riskData,
  onChange,
  onCalculate,
  onClear,
  isCalculateEnabled,
  primaryButtonClass,
  secondaryButtonClass,
}) {
  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/40 p-3">
      <div className="space-y-3">
        {scenario === 'diabetes' && <DiabetesDetailsDropdown riskData={riskData} onChange={onChange} />}
        {scenario === 'establishedASCVD' && (
          <SecondaryPreventionDropdown riskData={riskData} onChange={onChange} />
        )}

        <div className="rounded-md border border-slate-200 bg-white p-3">
          <CheckboxField
            label="CKD / known reduced eGFR or albuminuria"
            checked={riskData.chronicKidneyDisease === 'так'}
            onChange={(checked) => onChange('chronicKidneyDisease', checked ? 'так' : 'ні')}
          />
          {riskData.chronicKidneyDisease === 'так' && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {scenario === 'primary' && (
                <FormField label="eGFR" hint="mL/min/1.73 m²">
                  <input
                    type="number"
                    value={riskData.egfr}
                    onChange={(event) => onChange('egfr', event.target.value)}
                    className={inputClass}
                    placeholder="75"
                    min="1"
                  />
                </FormField>
              )}
              <FormField label="ACR" hint="mg/g">
                <input
                  type="number"
                  value={riskData.acr}
                  onChange={(event) => onChange('acr', event.target.value)}
                  className={inputClass}
                  placeholder="20"
                  min="0"
                  step="0.1"
                />
              </FormField>
            </div>
          )}
        </div>

        <div className="grid gap-3 border-t border-blue-100 pt-3 sm:grid-cols-2">
          <FormField label="Age">
            <input
              type="number"
              value={riskData.age}
              onChange={(event) => onChange('age', event.target.value)}
              className={inputClass}
              placeholder="55"
              min="1"
            />
          </FormField>
          <SexCheckboxes value={riskData.sex} onChange={(value) => onChange('sex', value)} />
          <InlineCheckboxField
            label="Current smoking"
            checked={riskData.smoking === 'так'}
            onChange={(checked) => onChange('smoking', checked ? 'так' : 'ні')}
          />
          <FormField label="Systolic BP" hint="mmHg">
            <input
              type="number"
              value={riskData.systolicBP}
              onChange={(event) => onChange('systolicBP', event.target.value)}
              className={inputClass}
              placeholder="140"
              min="50"
            />
          </FormField>
          <FormField label="Total cholesterol">
            <input
              type="number"
              value={riskData.totalCholesterol}
              onChange={(event) => onChange('totalCholesterol', event.target.value)}
              className={inputClass}
              placeholder="5.2"
              min="0"
              step="0.1"
            />
          </FormField>
          <FormField label="HDL cholesterol">
            <input
              type="number"
              value={riskData.hdl}
              onChange={(event) => onChange('hdl', event.target.value)}
              className={inputClass}
              placeholder="1.2"
              min="0"
              step="0.1"
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-2 border-t border-blue-100 pt-3 sm:flex-row">
          <button
            type="button"
            onClick={onCalculate}
            disabled={!isCalculateEnabled}
            className={primaryButtonClass}
          >
            Calculate
          </button>
          <button type="button" onClick={onClear} className={secondaryButtonClass}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function hasCkdData(data) {
  return data.chronicKidneyDisease === 'так' && (hasPositiveNumber(data.egfr) || hasPositiveNumber(data.acr));
}

function canCalculateRisk(data) {
  if (!data.patientScenario) return false;
  if (data.patientScenario === 'diabetes' || data.patientScenario === 'establishedASCVD') return true;
  if (hasCkdData(data)) return true;

  return (
    hasPositiveNumber(data.age) &&
    hasValue(data.sex) &&
    hasValue(data.smoking) &&
    hasPositiveNumber(data.systolicBP) &&
    hasPositiveNumber(data.totalCholesterol) &&
    hasPositiveNumber(data.hdl)
  );
}

function CkdModifierBlock({ ckdModifier }) {
  if (!ckdModifier) return null;

  const details = [
    ckdModifier.egfr !== null ? `eGFR ${ckdModifier.egfr} mL/min/1.73 m² (${ckdModifier.egfrCategory})` : null,
    ckdModifier.acr !== null ? `ACR ${ckdModifier.acr} mg/g (${ckdModifier.acrCategory})` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-slate-800">
      <p className="font-semibold text-teal-800">CKD / ACR as a risk modifier</p>
      <p className="mt-1">
        {ckdModifier.level === 'modifier'
          ? 'CKD or albuminuria is present and should be considered together with SCORE2 and the overall clinical picture.'
          : 'CKD or albuminuria meets criteria for high or very high cardiovascular risk.'}
      </p>
      {details.length > 0 && <p className="mt-1 text-slate-600">{details.join(', ')}.</p>}
    </div>
  );
}

export default function Score2CalculatorEnglish() {
  const [riskData, setRiskData] = useState(initialRiskData);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const isCalculateEnabled = canCalculateRisk(riskData);
  const primaryButtonClass =
    'w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto';
  const secondaryButtonClass =
    'w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto';

  function handleChange(field, value) {
    setRiskData((current) => ({
      ...current,
      [field]: value,
    }));
    setCalculatedResult(null);
  }

  function handleScenarioChange(patientScenario) {
    setRiskData((current) => ({
      ...current,
      patientScenario: current.patientScenario === patientScenario ? '' : patientScenario,
      diabetes: current.patientScenario !== patientScenario && patientScenario === 'diabetes' ? 'так' : 'ні',
      establishedASCVD:
        current.patientScenario !== patientScenario && patientScenario === 'establishedASCVD' ? 'так' : 'ні',
    }));
    setCalculatedResult(null);
  }

  function handleCalculate() {
    if (!isCalculateEnabled) return;
    setCalculatedResult(calculateScore2Risk(riskData));
  }

  function handleClear() {
    setRiskData(initialRiskData);
    setCalculatedResult(null);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-teal-200 bg-white p-4 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Cardiovascular risk</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">SCORE2 / SCORE2-OP</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          SCORE2, SCORE2-OP, SCORE2-Diabetes, SMART Risk Score, and CKD risk modifiers for clinical
          cardiovascular-risk discussion.
        </p>
      </section>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/60">
          <div className="space-y-3">
            <p className="mb-2 text-sm font-semibold text-slate-800">Clinical scenario</p>
            <div className="grid gap-2">
              <ScenarioCard
                title="Primary prevention"
                description="SCORE2 / SCORE2-OP for patients without established ASCVD and without diabetes."
                active={riskData.patientScenario === 'primary'}
                onClick={() => handleScenarioChange('primary')}
              />
              {riskData.patientScenario === 'primary' && (
                <ScenarioCalculatorPanel
                  scenario="primary"
                  riskData={riskData}
                  onChange={handleChange}
                  onCalculate={handleCalculate}
                  onClear={handleClear}
                  isCalculateEnabled={isCalculateEnabled}
                  primaryButtonClass={primaryButtonClass}
                  secondaryButtonClass={secondaryButtonClass}
                />
              )}
              <ScenarioCard
                title="Type 2 diabetes"
                description="SCORE2-Diabetes for patients aged 40-69 years with type 2 diabetes and no established ASCVD."
                active={riskData.patientScenario === 'diabetes'}
                onClick={() => handleScenarioChange('diabetes')}
              />
              {riskData.patientScenario === 'diabetes' && (
                <ScenarioCalculatorPanel
                  scenario="diabetes"
                  riskData={riskData}
                  onChange={handleChange}
                  onCalculate={handleCalculate}
                  onClear={handleClear}
                  isCalculateEnabled={isCalculateEnabled}
                  primaryButtonClass={primaryButtonClass}
                  secondaryButtonClass={secondaryButtonClass}
                />
              )}
              <ScenarioCard
                title="Established ASCVD"
                description="SMART Risk Score for patients with coronary disease, myocardial infarction, stroke, TIA, or peripheral artery disease."
                active={riskData.patientScenario === 'establishedASCVD'}
                onClick={() => handleScenarioChange('establishedASCVD')}
              />
              {riskData.patientScenario === 'establishedASCVD' && (
                <ScenarioCalculatorPanel
                  scenario="establishedASCVD"
                  riskData={riskData}
                  onChange={handleChange}
                  onCalculate={handleCalculate}
                  onClear={handleClear}
                  isCalculateEnabled={isCalculateEnabled}
                  primaryButtonClass={primaryButtonClass}
                  secondaryButtonClass={secondaryButtonClass}
                />
              )}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm shadow-slate-200/60">
          <div className="mb-3 border-b border-blue-100 pb-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Result</p>
            <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950">Clinical summary</h2>
          </div>

          {calculatedResult ? (
            <div className="space-y-3 text-sm leading-relaxed text-slate-900">
              {calculatedResult.riskPercent !== null && (
                <p>
                  <span className="font-semibold">{calculatedResult.modelName || 'SCORE2'}:</span>{' '}
                  {calculatedResult.riskPercent} %
                </p>
              )}
              <p>
                <span className="font-semibold">Cardiovascular risk:</span>{' '}
                {translateInterpretation(calculatedResult.interpretation)}
              </p>
              <p>
                <span className="font-semibold">Reason:</span> {getEnglishReason(calculatedResult)}
              </p>
              {calculatedResult.modelName === 'SMART Risk Score' && (
                <div className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm leading-6 text-slate-700">
                  <p className="font-semibold text-slate-900">SMART Risk Score disclaimer</p>
                  <p>
                    This is a local supportive implementation based on the published model by Dorresteijn et al.,
                    Heart 2013. It is not an official ESC or U-Prevent calculator.
                  </p>
                  <p className="mt-1">Source: Dorresteijn JAN et al. Heart. 2013;99:866-872.</p>
                </div>
              )}
              {calculatedResult.missing?.length > 0 && (
                <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold">Complete these fields:</span>{' '}
                  {translateMissing(calculatedResult.missing).join(', ')}.
                </p>
              )}
              <CkdModifierBlock ckdModifier={calculatedResult.ckdModifier} />
              {calculatedResult.ldlTarget && (
                <p>
                  <span className="font-semibold">LDL-C target:</span> {translateLdlTarget(calculatedResult.ldlTarget)}
                </p>
              )}
              {calculatedResult.recommendations.length > 0 && (
                <div>
                  <p className="font-semibold">Recommendations:</p>
                  {calculatedResult.patientInfo && (
                    <p className="mt-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm leading-6 text-slate-700">
                      Cholesterol contributes to atherosclerotic plaque formation in arteries. Lowering cholesterol
                      helps reduce the risk of myocardial infarction, stroke, and progression of atherosclerosis.
                    </p>
                  )}
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    {calculatedResult.recommendations.map((recommendation) => (
                      <li key={recommendation}>{translateRecommendation(recommendation)}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Enter patient data and click “Calculate”.</p>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">How to use this module</h2>
        <p className="mt-2">
          Choose the clinical scenario first. The relevant calculator opens directly under the selected scenario,
          while other scenarios remain collapsed.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>SCORE2 / SCORE2-OP: primary prevention without established ASCVD and without diabetes.</li>
          <li>SCORE2-Diabetes: type 2 diabetes, age 40-69 years, no established ASCVD.</li>
          <li>SMART Risk Score: established atherosclerotic cardiovascular disease.</li>
          <li>CKD and albuminuria can modify cardiovascular-risk interpretation.</li>
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        SCORE2, SCORE2-OP, SCORE2-Diabetes, SMART Risk Score, and CKD risk modifiers are supportive clinical tools.
        They do not replace clinical assessment, guideline review, medication contraindication checks, or an
        individualized prevention decision made by the physician.
      </section>
    </div>
  );
}
