'use client';

import { useState } from 'react';
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
  calculateWellsDvt,
  calculateWellsPe,
  getVteNextStep,
} from '../../utils/calculations';

const scenarioOptions = [
  { id: 'dvt', title: 'Підозра на ТГВ' },
  { id: 'pe', title: 'Підозра на ТЕЛА' },
  { id: 'confirmedPe', title: 'Підтверджена ТЕЛА' },
  { id: 'longTerm', title: 'Довгострокове ведення ВТЕ' },
];

const initialFormData = {
  scenario: 'dvt',
  age: '',
  dimer: '',
  dimerUnit: 'ngMlFeu',
  dvtActiveCancer: false,
  paralysisOrImmobilization: false,
  bedriddenOrSurgery: false,
  localTenderness: false,
  entireLegSwollen: false,
  calfSwelling: false,
  pittingEdema: false,
  collateralVeins: false,
  previousDvt: false,
  alternativeDiagnosis: false,
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

const dvtFields = [
  { key: 'dvtActiveCancer', title: 'Активне онкологічне захворювання', points: '+1' },
  { key: 'paralysisOrImmobilization', title: 'Парез / параліч / іммобілізація нижньої кінцівки', points: '+1' },
  { key: 'bedriddenOrSurgery', title: 'Постільний режим або велика операція', points: '+1' },
  { key: 'localTenderness', title: 'Болючість уздовж глибоких вен', points: '+1' },
  { key: 'entireLegSwollen', title: 'Набряк усієї ноги', points: '+1' },
  { key: 'calfSwelling', title: 'Набряк гомілки >3 см порівняно з іншою ногою', points: '+1' },
  { key: 'pittingEdema', title: 'Пітинг-набряк на симптомній нозі', points: '+1' },
  { key: 'collateralVeins', title: 'Колатеральні поверхневі вени', points: '+1' },
  { key: 'previousDvt', title: 'Попередній ТГВ', points: '+1' },
  { key: 'alternativeDiagnosis', title: 'Альтернативний діагноз не менш ймовірний', points: '−2' },
];

const peFields = [
  { key: 'clinicalDvtSigns', title: 'Клінічні ознаки ТГВ', points: '+3' },
  { key: 'peMoreLikely', title: 'Альтернативний діагноз менш ймовірний, ніж ТЕЛА', points: '+3' },
  { key: 'heartRateOver100', title: 'ЧСС >100/хв', points: '+1.5' },
  { key: 'immobilizationOrSurgery', title: 'Іммобілізація ≥3 днів або операція за останні 4 тижні', points: '+1.5' },
  { key: 'previousDvtPe', title: 'Попередній ТГВ/ТЕЛА', points: '+1.5' },
  { key: 'hemoptysis', title: 'Кровохаркання', points: '+1' },
  { key: 'peActiveCancer', title: 'Активне онкологічне захворювання', points: '+1' },
];

const percFields = [
  { key: 'percAgeOver50', title: 'Вік ≥50 років' },
  { key: 'percHeartRateAtLeast100', title: 'ЧСС ≥100/хв' },
  { key: 'percSpo2Below95', title: 'SpO₂ <95%' },
  { key: 'percUnilateralLegSwelling', title: 'Односторонній набряк ноги' },
  { key: 'percHemoptysis', title: 'Кровохаркання' },
  { key: 'percRecentSurgeryOrTrauma', title: 'Нещодавня операція або травма' },
  { key: 'percPreviousDvtPe', title: 'Попередній ТГВ/ТЕЛА' },
  { key: 'percEstrogenUse', title: 'Використання естрогенів' },
];

const spesiFields = [
  { key: 'spesiAgeOver80', title: 'Вік >80 років' },
  { key: 'spesiCancer', title: 'Онкологічне захворювання' },
  { key: 'spesiChronicCardiopulmonaryDisease', title: 'Хронічна СН або хронічне захворювання легень' },
  { key: 'spesiHeartRateAtLeast110', title: 'ЧСС ≥110/хв' },
  { key: 'spesiSystolicBpBelow100', title: 'САТ <100 мм рт. ст.' },
  { key: 'spesiSpo2Below90', title: 'SpO₂ <90%' },
];

const hestiaFields = [
  { key: 'hestiaHemodynamicInstability', title: 'Гемодинамічна нестабільність' },
  { key: 'hestiaNeedThrombolysisOrEmbolectomy', title: 'Потреба в тромболізисі або емболектомії' },
  { key: 'hestiaActiveBleedingOrHighRisk', title: 'Активна кровотеча або високий ризик кровотечі' },
  { key: 'hestiaNeedOxygenMoreThan24h', title: 'Потреба в кисні понад 24 години' },
  { key: 'hestiaPeDuringAnticoagulation', title: 'ТЕЛА під час антикоагуляції' },
  { key: 'hestiaSeverePainIvAnalgesia', title: 'Сильний біль із потребою у внутрішньовенних анальгетиках' },
  { key: 'hestiaMedicalOrSocialAdmissionReason', title: 'Медичні або соціальні причини для госпіталізації' },
  { key: 'hestiaCrclBelow30', title: 'CrCl <30 мл/хв' },
  { key: 'hestiaSevereLiverFailure', title: 'Важка печінкова недостатність' },
  { key: 'hestiaPregnancy', title: 'Вагітність' },
  { key: 'hestiaHistoryHit', title: 'Гепарин-індукована тромбоцитопенія в анамнезі' },
];

const vteBleedFields = [
  { key: 'vteBleedActiveCancer', title: 'Активне онкологічне захворювання', points: '+2' },
  { key: 'vteBleedMaleWithUncontrolledHypertension', title: 'Чоловік із неконтрольованою АГ', points: '+1' },
  { key: 'vteBleedAnemia', title: 'Анемія', points: '+1.5' },
  { key: 'vteBleedBleedingHistory', title: 'Кровотеча в анамнезі', points: '+1.5' },
  { key: 'vteBleedAgeAtLeast60', title: 'Вік ≥60 років', points: '+1.5' },
  { key: 'vteBleedRenalDysfunction', title: 'Ниркова дисфункція', points: '+1.5' },
];

const herdoo2Fields = [
  { key: 'herdoo2LegChanges', title: 'Гіперпігментація / набряк / почервоніння ноги' },
  { key: 'herdoo2ElevatedDimer', title: 'D-димер підвищений' },
  { key: 'herdoo2BmiAtLeast30', title: 'BMI ≥30' },
  { key: 'herdoo2AgeAtLeast65', title: 'Вік ≥65' },
];

const dashFields = [
  { key: 'dashElevatedDimerAfterStopping', title: 'Підвищений D-димер після припинення антикоагуляції', points: '+2' },
  { key: 'dashAgeAtMost50', title: 'Вік ≤50 років', points: '+1' },
  { key: 'dashMaleSex', title: 'Чоловіча стать', points: '+1' },
  { key: 'dashHormoneAssociatedVteInWomen', title: 'ВТЕ, пов’язана з гормональною терапією у жінок', points: '−2' },
];

const checkList = [
  'SpO₂',
  'АТ',
  'ЧСС',
  'ЕКГ',
  'D-димер',
  'Креатинін / ШКФ',
  'Hb',
  'Тромбоцити',
  'Тропонін / BNP за показами',
  'Компресійне УЗД вен',
  'КТ-ангіографія за показами',
];

const relatedTools = ['ШКФ', 'ФП / антикоагуляція', 'Препарати → НОАК', 'ІМТ', 'SCORE2'];

function CheckboxCard({ title, points, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
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

function DimerInputs({ formData, onChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FormField label="Вік" hint="років">
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

      <FormField label="D-димер">
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

      <FormField label="Одиниці D-димеру">
        <select
          value={formData.dimerUnit}
          onChange={(event) => onChange('dimerUnit', event.target.value)}
          className={inputClass}
        >
          <option value="ngMlFeu">нг/мл FEU</option>
          <option value="mcgLFeu">мкг/л FEU</option>
        </select>
      </FormField>
    </div>
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

export default function WellsDimerCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setResult(null);
  }

  function handleScenarioChange(scenario) {
    setFormData((current) => ({
      ...current,
      scenario,
    }));
    setResult(null);
  }

  function handleCalculate() {
    let nextResult = {};

    if (formData.scenario === 'dvt') {
      const wellsDvt = calculateWellsDvt({
        activeCancer: formData.dvtActiveCancer,
        paralysisOrImmobilization: formData.paralysisOrImmobilization,
        bedriddenOrSurgery: formData.bedriddenOrSurgery,
        localTenderness: formData.localTenderness,
        entireLegSwollen: formData.entireLegSwollen,
        calfSwelling: formData.calfSwelling,
        pittingEdema: formData.pittingEdema,
        collateralVeins: formData.collateralVeins,
        previousDvt: formData.previousDvt,
        alternativeDiagnosis: formData.alternativeDiagnosis,
      });
      const dimer = calculateAgeAdjustedDimer(formData);
      nextResult = {
        wellsDvt,
        dimer,
        nextStep: getVteNextStep({ scenario: 'dvt', wellsDvt, dimer }),
      };
    }

    if (formData.scenario === 'pe') {
      const wellsPe = calculateWellsPe({
        clinicalDvtSigns: formData.clinicalDvtSigns,
        peMoreLikely: formData.peMoreLikely,
        heartRateOver100: formData.heartRateOver100,
        immobilizationOrSurgery: formData.immobilizationOrSurgery,
        previousDvtPe: formData.previousDvtPe,
        hemoptysis: formData.hemoptysis,
        activeCancer: formData.peActiveCancer,
      });
      const perc = wellsPe.score <= 4
        ? calculatePercRule({
            ageOver50: formData.percAgeOver50,
            heartRateAtLeast100: formData.percHeartRateAtLeast100,
            spo2Below95: formData.percSpo2Below95,
            unilateralLegSwelling: formData.percUnilateralLegSwelling,
            hemoptysis: formData.percHemoptysis,
            recentSurgeryOrTrauma: formData.percRecentSurgeryOrTrauma,
            previousDvtPe: formData.percPreviousDvtPe,
            estrogenUse: formData.percEstrogenUse,
          })
        : null;
      const dimer = !perc?.isNegative ? calculateAgeAdjustedDimer(formData) : null;
      nextResult = {
        wellsPe,
        perc,
        dimer,
        nextStep: getVteNextStep({ scenario: 'pe', wellsPe, perc, dimer }),
      };
    }

    if (formData.scenario === 'confirmedPe') {
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
      nextResult = {
        spesi,
        hestia,
        nextStep: getVteNextStep({ scenario: 'confirmedPe', spesi, hestia }),
      };
    }

    if (formData.scenario === 'longTerm') {
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
      nextResult = {
        vteBleed,
        herdoo2,
        dash,
        nextStep: getVteNextStep({ scenario: 'longTerm' }),
      };
    }

    setResult(nextResult);
  }

  function handleClear() {
    setFormData(initialFormData);
    setResult(null);
  }

  return (
    <>
      <div className="mb-5 rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-semibold text-slate-950">Венозна тромбоемболія</h2>
        <p className="mt-1">
          Оцінка ймовірності ТГВ / ТЕЛА, D-димер та подальший клінічний маршрут.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {scenarioOptions.map((scenario) => (
          <button
            type="button"
            key={scenario.id}
            onClick={() => handleScenarioChange(scenario.id)}
            className={`rounded-md border px-3 py-3 text-left text-sm font-semibold transition ${
              formData.scenario === scenario.id
                ? 'border-blue-300 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            {scenario.title}
          </button>
        ))}
      </div>

      {formData.scenario === 'dvt' && (
        <section className="mt-4 space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Wells DVT</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {dvtFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  points={field.points}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Age-adjusted D-димер</h3>
            <div className="mt-4">
              <DimerInputs formData={formData} onChange={handleChange} />
            </div>
          </div>
        </section>
      )}

      {formData.scenario === 'pe' && (
        <section className="mt-4 space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Wells PE</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {peFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  points={field.points}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">PERC Rule</h3>
            <p className="mt-1 text-sm text-slate-600">
              Використовується лише при низькій клінічній ймовірності ТЕЛА.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {percFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Age-adjusted D-димер</h3>
            <div className="mt-4">
              <DimerInputs formData={formData} onChange={handleChange} />
            </div>
          </div>
        </section>
      )}

      {formData.scenario === 'confirmedPe' && (
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">sPESI</h3>
            <div className="mt-4 grid gap-3">
              {spesiFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Hestia criteria</h3>
            <div className="mt-4 grid gap-3">
              {hestiaFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {formData.scenario === 'longTerm' && (
        <section className="mt-4 space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">VTE-BLEED</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {vteBleedFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  points={field.points}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">HERDOO2</h3>
            <p className="mt-1 text-sm text-slate-600">
              Лише для жінок після першого неспровокованого епізоду ВТЕ.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField label="Стать для HERDOO2">
                <select
                  value={formData.herdoo2Sex}
                  onChange={(event) => handleChange('herdoo2Sex', event.target.value)}
                  className={inputClass}
                >
                  <option value="female">Жінка</option>
                  <option value="male">Чоловік</option>
                </select>
              </FormField>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {herdoo2Fields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">DASH Score</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {dashFields.map((field) => (
                <CheckboxCard
                  key={field.key}
                  title={field.title}
                  points={field.points}
                  checked={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
      </div>

      {result && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {result.wellsDvt && (
              <ResultCard title="Wells DVT" value={result.wellsDvt.score} subtitle={result.wellsDvt.interpretation}>
                <p>{result.wellsDvt.isLikely ? 'Клінічна ймовірність висока.' : 'Клінічна ймовірність низька.'}</p>
              </ResultCard>
            )}
            {result.wellsPe && (
              <ResultCard title="Wells PE" value={result.wellsPe.score} subtitle={result.wellsPe.interpretation}>
                <p>Дворівнева інтерпретація: ≤4 — ТЕЛА малоймовірна, &gt;4 — ТЕЛА ймовірна.</p>
              </ResultCard>
            )}
            {result.perc && (
              <ResultCard
                title="PERC"
                value={result.perc.isNegative ? '−' : '+'}
                subtitle={result.perc.interpretation}
              >
                <p>Позитивних критеріїв: {result.perc.positiveCriteria}.</p>
              </ResultCard>
            )}
            {result.dimer && (
              <ResultCard
                title="D-димер"
                value={`${result.dimer.threshold} ${result.dimer.unitLabel}`}
                subtitle={result.dimer.exceedsThreshold ? 'Перевищує віковий поріг' : 'Не перевищує віковий поріг'}
              >
                <p>Введене значення: {result.dimer.dimer} {result.dimer.unitLabel}.</p>
              </ResultCard>
            )}
            {result.spesi && (
              <ResultCard title="sPESI" value={result.spesi.score} subtitle={result.spesi.interpretation}>
                <p>{result.spesi.isLowRisk ? '0 балів.' : '≥1 бал.'}</p>
              </ResultCard>
            )}
            {result.hestia && (
              <ResultCard
                title="Hestia"
                value={result.hestia.positiveCriteria}
                subtitle={result.hestia.interpretation}
              >
                <p>Позитивних критеріїв: {result.hestia.positiveCriteria}.</p>
              </ResultCard>
            )}
            {result.vteBleed && (
              <ResultCard
                title="VTE-BLEED"
                value={result.vteBleed.score}
                subtitle={result.vteBleed.interpretation}
              >
                <p>Поріг вищого ризику: ≥2 бали.</p>
              </ResultCard>
            )}
            {result.herdoo2 && (
              <ResultCard
                title="HERDOO2"
                value={result.herdoo2.score}
                subtitle={result.herdoo2.interpretation}
              >
                <p>{result.herdoo2.isApplicable ? 'Інструмент застосований.' : 'Є попередження щодо застосування.'}</p>
              </ResultCard>
            )}
            {result.dash && (
              <ResultCard title="DASH" value={result.dash.score} subtitle={result.dash.recurrenceRisk}>
                <p>{result.dash.interpretation}</p>
              </ResultCard>
            )}
          </div>

          <section className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
            <h3 className="font-semibold text-slate-950">Наступний крок</h3>
            <p className="mt-2">{result.nextStep}</p>
          </section>
        </div>
      )}

      <section className="mt-5 rounded-md border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-950">Що перевірити</h3>
        <Chips items={checkList} />
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-950">Пов’язані інструменти</h3>
        <Chips items={relatedTools} />
      </section>

      <p className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Модуль оцінки венозної тромбоемболії є допоміжним інструментом для лікаря.
        Результати шкал Wells, PERC, sPESI, Hestia, VTE-BLEED, HERDOO2 та DASH не
        встановлюють і не виключають діагноз самостійно. Остаточне рішення щодо
        D-димеру, візуалізації, госпіталізації та антикоагулянтної терапії приймається
        лікарем з урахуванням клінічного стану пацієнта, локальних протоколів та чинних
        рекомендацій.
      </p>
    </>
  );
}
