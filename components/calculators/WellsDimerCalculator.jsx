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
  getVteAnticoagulationDurationAdvice,
  getVteNextStep,
} from '../../utils/calculations';

const scenarioOptions = [
  {
    id: 'dvt',
    title: 'Підозра на ТГВ',
    description: 'Біль / набряк кінцівки, оцінка до D-димеру або компресійного УЗД вен.',
  },
  {
    id: 'pe',
    title: 'Підозра на ТЕЛА',
    description: 'Задишка, біль у грудях, тахікардія або інші ознаки можливої легеневої емболії.',
  },
  {
    id: 'confirmedPe',
    title: 'Підтверджена ТЕЛА',
    description: 'Після підтвердження діагнозу: ризик ускладнень і можливість амбулаторної тактики.',
  },
  {
    id: 'longTerm',
    title: 'Довгострокове ведення ВТЕ',
    description: 'Оцінка ризику кровотечі та рецидиву при тривалій або завершеній антикоагуляції.',
  },
];

const toolInfo = {
  wellsDvt: {
    purpose: 'Wells DVT оцінює клінічну ймовірність тромбозу глибоких вен до інструментальної верифікації.',
    when: 'Використовуйте при болю, набряку або асиметрії нижньої кінцівки, коли ТГВ є одним із можливих діагнозів.',
    action: 'Результат допомагає вирішити, чи достатньо D-димеру в алгоритмі, чи варто переходити до компресійного УЗД вен.',
  },
  wellsPe: {
    purpose: 'Wells PE оцінює клінічну ймовірність ТЕЛА до D-димеру або КТ-ангіографії.',
    when: 'Використовуйте при підозрі на ТЕЛА, якщо пацієнт гемодинамічно стабільний і немає очевидної потреби в невідкладній візуалізації.',
    action: 'При високій імовірності D-димер не використовують як єдиний спосіб виключення ТЕЛА; доцільно розглядати візуалізацію.',
  },
  perc: {
    purpose: 'PERC допомагає уникнути зайвого D-димеру у пацієнтів із низькою клінічною ймовірністю ТЕЛА.',
    when: 'Застосовуйте лише після клінічного рішення, що ймовірність ТЕЛА низька.',
    action: 'Якщо всі критерії “ні”, ТЕЛА менш імовірна; якщо хоча б один критерій “так”, переходьте до D-димеру або іншої оцінки.',
  },
  dimer: {
    purpose: 'Age-adjusted D-димер порівнює D-димер із віковим порогом, щоб зменшити кількість хибнопозитивних результатів у старших пацієнтів.',
    when: 'Корисний при низькій або проміжній клінічній імовірності. Не підтверджує ВТЕ самостійно.',
    action: 'Негативний результат може підтримати виключення ВТЕ в межах алгоритму; позитивний результат є підставою розглянути візуалізацію.',
  },
  spesi: {
    purpose: 'sPESI не діагностує ТЕЛА, а оцінює короткостроковий ризик після підтвердження ТЕЛА.',
    when: 'Використовуйте після підтвердження ТЕЛА для первинної оцінки ризику ускладнень.',
    action: '0 балів підтримує нижчий ризик; ≥1 бал підказує потребу уважнішої оцінки та часто стаціонарної тактики.',
  },
  hestia: {
    purpose: 'Hestia визначає, чи є критерії, які роблять амбулаторне лікування ТЕЛА небажаним.',
    when: 'Використовуйте після підтвердження ТЕЛА, коли розглядається можливість амбулаторного ведення.',
    action: 'Якщо хоча б один критерій “так”, амбулаторне лікування за Hestia не рекомендується.',
  },
  vteBleed: {
    purpose: 'VTE-BLEED оцінює ризик кровотечі під час антикоагулянтної терапії при ВТЕ.',
    when: 'Корисний при плануванні або перегляді тривалої антикоагуляції.',
    action: 'Вищий ризик не означає автоматичну відміну антикоагуляції, а підказує знайти модифіковані фактори кровотечі.',
  },
  herdoo2: {
    purpose: 'HERDOO2 оцінює ризик рецидиву у жінок після першого неспровокованого епізоду ВТЕ.',
    when: 'Не використовуйте для чоловіків як інструмент визначення низького ризику.',
    action: '0–1 критерій у жінки може підтримувати нижчий ризик рецидиву; ≥2 критерії підказують вищий ризик.',
  },
  dash: {
    purpose: 'DASH дає орієнтовну оцінку ризику рецидиву після завершення антикоагуляції.',
    when: 'Використовуйте як допоміжну підказку при обговоренні тривалості терапії, а не як самостійне рішення.',
    action: 'Результат потрібно поєднувати з причиною ВТЕ, ризиком кровотечі, побажаннями пацієнта та клінічним контекстом.',
  },
  duration: {
    purpose: 'Цей блок структурує рішення щодо тривалості антикоагуляції після первинної фази лікування ВТЕ.',
    when: 'Використовуйте після встановленої ТГВ / ТЕЛА, коли потрібно переглянути терапію після перших 3 місяців.',
    action: 'Результат показує клінічний орієнтир: завершення після 3 місяців, індивідуальний перегляд або розгляд продовженої терапії.',
  },
};

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
  vteDurationEventType: 'pe',
  vteDurationDvtLocation: 'notApplicable',
  vteMajorSurgery: false,
  vteMajorTrauma: false,
  vteLowerLimbOrPelvicFracture: false,
  vteHospitalImmobilization: false,
  vteBedRestAcuteIllness: false,
  vteLongTravel: false,
  vteTemporaryReducedMobility: false,
  vteEstrogenTherapy: false,
  vtePregnancyPostpartum: false,
  vteMinorSurgeryOrTrauma: false,
  vteAcuteInfectionInflammation: false,
  vteActiveCancerPersistent: false,
  vteCancerTreatment: false,
  vteAntiphospholipidSyndrome: false,
  vteChronicImmobilization: false,
  vteRecurrentVte: false,
  vteVteDuringAnticoagulation: false,
  vteStrongThrombophilia: false,
  vteChronicInflammatoryDisease: false,
  vteNoObviousFactor: false,
  vteDurationThrombocytopenia: false,
  vteDurationCrclBelow30: false,
  vteDurationNsaidOrAntiplatelet: false,
  vteDurationAgeOver75: false,
  vteDurationFrequentFalls: false,
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

const durationEventTypeOptions = [
  { value: 'dvt', label: 'ТГВ' },
  { value: 'pe', label: 'ТЕЛА' },
  { value: 'dvtPe', label: 'ТГВ + ТЕЛА' },
  { value: 'recurrentVte', label: 'Рецидивна ВТЕ' },
];

const durationDvtLocationOptions = [
  { value: 'notApplicable', label: 'Не застосовується / невідомо' },
  { value: 'distal', label: 'Дистальний ТГВ' },
  { value: 'proximal', label: 'Проксимальний ТГВ' },
];

const durationRiskFactorGroups = [
  {
    title: 'Велика тимчасова причина',
    items: [
      { key: 'vteMajorSurgery', title: 'Велика операція за останні 3 місяці', group: 'majorTransient' },
      { key: 'vteMajorTrauma', title: 'Велика травма', group: 'majorTransient' },
      { key: 'vteLowerLimbOrPelvicFracture', title: 'Перелом нижньої кінцівки / таза', group: 'majorTransient' },
      { key: 'vteHospitalImmobilization', title: 'Госпіталізація з тривалою іммобілізацією', group: 'majorTransient' },
      { key: 'vteBedRestAcuteIllness', title: 'Постільний режим ≥3 днів через гострий стан', group: 'majorTransient' },
    ],
  },
  {
    title: 'Мала тимчасова причина',
    items: [
      { key: 'vteLongTravel', title: 'Тривала подорож / сидіння >8 год', group: 'minorTransient' },
      { key: 'vteTemporaryReducedMobility', title: 'Тимчасове зниження рухливості без госпіталізації', group: 'minorTransient' },
      { key: 'vteEstrogenTherapy', title: 'Естрогенвмісна терапія', group: 'minorTransient' },
      { key: 'vtePregnancyPostpartum', title: 'Вагітність / післяпологовий період', group: 'minorTransient' },
      { key: 'vteMinorSurgeryOrTrauma', title: 'Мала операція / травма', group: 'minorTransient' },
      { key: 'vteAcuteInfectionInflammation', title: 'Гостре інфекційне або запальне захворювання', group: 'minorTransient' },
    ],
  },
  {
    title: 'Сталий або високий фактор ризику',
    items: [
      { key: 'vteActiveCancerPersistent', title: 'Активне онкологічне захворювання', group: 'activeCancer' },
      { key: 'vteCancerTreatment', title: 'Триває протипухлинне лікування', group: 'activeCancer' },
      { key: 'vteAntiphospholipidSyndrome', title: 'Антифосфоліпідний синдром', group: 'antiphospholipidSyndrome' },
      { key: 'vteChronicImmobilization', title: 'Хронічна іммобілізація', group: 'persistent' },
      { key: 'vteRecurrentVte', title: 'Рецидивна ВТЕ', group: 'recurrentVte' },
      { key: 'vteVteDuringAnticoagulation', title: 'ВТЕ на фоні попередньої антикоагуляції', group: 'recurrentVte' },
      { key: 'vteStrongThrombophilia', title: 'Відомий сильний тромбофілічний фактор', group: 'persistent' },
      { key: 'vteChronicInflammatoryDisease', title: 'Хронічне запальне / аутоімунне захворювання з активністю', group: 'persistent' },
    ],
  },
  {
    title: 'Очевидного фактора не було',
    items: [
      {
        key: 'vteNoObviousFactor',
        title: 'Не було операції, травми, іммобілізації, вагітності, естрогенів, активного раку або іншого очевидного фактора',
        group: 'unprovoked',
      },
    ],
  },
];

const additionalBleedingFactors = [
  { key: 'vteDurationThrombocytopenia', title: 'Тромбоцитопенія' },
  { key: 'vteDurationCrclBelow30', title: 'CrCl <30 мл/хв' },
  { key: 'vteDurationNsaidOrAntiplatelet', title: 'НПЗП або антитромбоцитарні препарати' },
  { key: 'vteDurationAgeOver75', title: 'Вік >75 років' },
  { key: 'vteDurationFrequentFalls', title: 'Часті падіння / високий травматичний ризик' },
];

const durationRiskFactorKeys = durationRiskFactorGroups.flatMap((group) => group.items.map((item) => item.key));

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

function RiskFactorDropdown({ group, formData, onChange }) {
  const selectedCount = group.items.filter((item) => formData[item.key]).length;

  return (
    <details className="group rounded-md border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-slate-900 transition hover:bg-teal-50/60">
        <span>{group.title}</span>
        <span className="flex items-center gap-3 text-xs font-semibold text-slate-500">
          {selectedCount > 0 ? `${selectedCount} вибрано` : 'не вибрано'}
          <span className="text-lg leading-none text-teal-700 group-open:hidden">+</span>
          <span className="hidden text-lg leading-none text-teal-700 group-open:inline">−</span>
        </span>
      </summary>
      <div className="border-t border-slate-100 p-3">
        <div className="grid gap-3 lg:grid-cols-2">
          {group.items.map((field) => (
            <CheckboxCard
              key={field.key}
              title={field.title}
              checked={formData[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
          ))}
        </div>
      </div>
    </details>
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

function ToolIntro({ info }) {
  return (
    <div className="mt-2 rounded-md border border-teal-100 bg-teal-50/70 p-3 text-sm leading-6 text-slate-700">
      <p>{info.purpose}</p>
      <p className="mt-1">
        <span className="font-semibold text-slate-900">Коли:</span> {info.when}
      </p>
      <p className="mt-1">
        <span className="font-semibold text-slate-900">Як використати:</span> {info.action}
      </p>
    </div>
  );
}

function ResultExplanation({ meaning, action }) {
  return (
    <div className="mt-3 space-y-2 rounded-md border border-white/70 bg-white/70 p-3 text-sm leading-6 text-slate-700">
      <p>
        <span className="font-semibold text-slate-900">Що означає:</span> {meaning}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Що робити далі:</span> {action}
      </p>
    </div>
  );
}

function DimerInputs({ formData, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
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

function getSelectedDurationRiskFactors(data) {
  return durationRiskFactorGroups
    .flatMap((group) => group.items)
    .filter((item) => data[item.key])
    .map((item) => ({
      group: item.group,
      label: item.title,
      resolved: item.group === 'majorTransient' || item.group === 'minorTransient',
    }));
}

function getSelectedBleedingFactors(data) {
  const vteBleedItems = vteBleedFields
    .filter((item) => data[item.key])
    .map((item) => item.title);
  const additionalItems = additionalBleedingFactors
    .filter((item) => data[item.key])
    .map((item) => item.title);

  return {
    vteBleedItems,
    additionalItems,
    allItems: [...vteBleedItems, ...additionalItems],
  };
}

export default function WellsDimerCalculator() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const vteBleedPreview = calculateVteBleed({
    activeCancer: formData.vteBleedActiveCancer,
    maleWithUncontrolledHypertension: formData.vteBleedMaleWithUncontrolledHypertension,
    anemia: formData.vteBleedAnemia,
    bleedingHistory: formData.vteBleedBleedingHistory,
    ageAtLeast60: formData.vteBleedAgeAtLeast60,
    renalDysfunction: formData.vteBleedRenalDysfunction,
  });
  const selectedBleedingFactors = getSelectedBleedingFactors(formData);
  const durationRiskFactorPreview = getVteAnticoagulationDurationAdvice({
    eventType: formData.vteDurationEventType,
    dvtLocation: formData.vteDurationDvtLocation,
    riskFactors: getSelectedDurationRiskFactors(formData),
    vteBleedScore: vteBleedPreview.score,
    vteBleedHighRisk: vteBleedPreview.isHighRisk,
    previousBleeding: formData.vteBleedBleedingHistory,
    lowHemoglobin: formData.vteBleedAnemia,
    thrombocytopenia: formData.vteDurationThrombocytopenia,
    crclBelow30: formData.vteDurationCrclBelow30,
    nsaidOrAntiplatelet: formData.vteDurationNsaidOrAntiplatelet,
    ageOver75: formData.vteDurationAgeOver75,
    frequentFalls: formData.vteDurationFrequentFalls,
  });

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      ...(field === 'vteNoObviousFactor' && value
        ? Object.fromEntries(durationRiskFactorKeys.filter((key) => key !== 'vteNoObviousFactor').map((key) => [key, false]))
        : {}),
      ...(field !== 'vteNoObviousFactor' && durationRiskFactorKeys.includes(field) && value
        ? { vteNoObviousFactor: false }
        : {}),
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
      const durationAdvice = getVteAnticoagulationDurationAdvice({
        eventType: formData.vteDurationEventType,
        dvtLocation: formData.vteDurationDvtLocation,
        riskFactors: getSelectedDurationRiskFactors(formData),
        vteBleedScore: vteBleed.score,
        vteBleedHighRisk: vteBleed.isHighRisk,
        previousBleeding: formData.vteBleedBleedingHistory,
        lowHemoglobin: formData.vteBleedAnemia,
        thrombocytopenia: formData.vteDurationThrombocytopenia,
        crclBelow30: formData.vteDurationCrclBelow30,
        nsaidOrAntiplatelet: formData.vteDurationNsaidOrAntiplatelet,
        ageOver75: formData.vteDurationAgeOver75,
        frequentFalls: formData.vteDurationFrequentFalls,
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
        durationAdvice,
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
            className={`rounded-md border px-3 py-2.5 text-left text-sm font-semibold transition ${
              formData.scenario === scenario.id
                ? 'border-blue-300 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            {scenario.title}
            <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
              {scenario.description}
            </span>
          </button>
        ))}
      </div>

      {formData.scenario === 'dvt' && (
        <section className="mt-3 space-y-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Wells DVT</h3>
            <ToolIntro info={toolInfo.wellsDvt} />
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
            <ToolIntro info={toolInfo.dimer} />
            <div className="mt-4">
              <DimerInputs formData={formData} onChange={handleChange} />
            </div>
          </div>
        </section>
      )}

      {formData.scenario === 'pe' && (
        <section className="mt-3 space-y-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Wells PE</h3>
            <ToolIntro info={toolInfo.wellsPe} />
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
            <ToolIntro info={toolInfo.perc} />
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
            <ToolIntro info={toolInfo.dimer} />
            <div className="mt-4">
              <DimerInputs formData={formData} onChange={handleChange} />
            </div>
          </div>
        </section>
      )}

      {formData.scenario === 'confirmedPe' && (
        <section className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">sPESI</h3>
            <ToolIntro info={toolInfo.spesi} />
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
            <ToolIntro info={toolInfo.hestia} />
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
        <section className="mt-3 space-y-3">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">Тривалість антикоагуляції після ВТЕ</h3>
            <ToolIntro info={toolInfo.duration} />
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <FormField label="Тип події">
                <select
                  value={formData.vteDurationEventType}
                  onChange={(event) => handleChange('vteDurationEventType', event.target.value)}
                  className={inputClass}
                >
                  {durationEventTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Локалізація ТГВ">
                <select
                  value={formData.vteDurationDvtLocation}
                  onChange={(event) => handleChange('vteDurationDvtLocation', event.target.value)}
                  className={inputClass}
                >
                  {durationDvtLocationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="mt-4 rounded-md border border-teal-200 bg-teal-50/40 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  1. Що могло спровокувати ВТЕ?
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Позначте конкретні ситуації у випадаючих списках. Програма сама віднесе їх
                  до великого тимчасового, малого тимчасового або сталого / високого фактора ризику.
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {durationRiskFactorGroups.map((group) => (
                  <RiskFactorDropdown
                    key={group.title}
                    group={group}
                    formData={formData}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">VTE-BLEED</h3>
            <ToolIntro info={toolInfo.vteBleed} />
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
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Додаткові фактори обережності
              </p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {additionalBleedingFactors.map((field) => (
                  <CheckboxCard
                    key={field.key}
                    title={field.title}
                    checked={formData[field.key]}
                    onChange={(value) => handleChange(field.key, value)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-950">HERDOO2</h3>
            <ToolIntro info={toolInfo.herdoo2} />
            <div className="mt-3 grid gap-3 md:grid-cols-2">
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
            <ToolIntro info={toolInfo.dash} />
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

          <div className="rounded-md border border-teal-200 bg-teal-50/70 p-4 text-sm leading-6 text-slate-800">
            <h3 className="font-semibold text-slate-950">Тривалість антикоагуляції</h3>
            <p className="mt-2 font-semibold text-teal-900">{durationRiskFactorPreview.riskFactorSummary.title}</p>
            {durationRiskFactorPreview.riskFactorSummary.selected.length > 0 ? (
              <p className="mt-1">
                <span className="font-semibold text-slate-900">Позначені фактори:</span>{' '}
                {durationRiskFactorPreview.riskFactorSummary.selected.join(', ')}.
              </p>
            ) : (
              <p className="mt-1">Позначені фактори: не вказані.</p>
            )}
            <p className="mt-1 text-slate-600">{durationRiskFactorPreview.riskFactorSummary.note}</p>
            <div className="mt-3 border-t border-teal-100 pt-3">
              <p className="font-semibold text-slate-900">
                VTE-BLEED: {vteBleedPreview.score} {vteBleedPreview.score === 1 ? 'бал' : 'балів'} —{' '}
                {vteBleedPreview.isHighRisk ? 'вищий ризик кровотечі' : 'нижчий ризик кровотечі'}.
              </p>
              {selectedBleedingFactors.allItems.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {selectedBleedingFactors.vteBleedItems.length > 0 ? (
                    <p>
                      <span className="font-semibold text-slate-900">Фактори VTE-BLEED:</span>{' '}
                      {selectedBleedingFactors.vteBleedItems.join(', ')}.
                    </p>
                  ) : null}
                  {selectedBleedingFactors.additionalItems.length > 0 ? (
                    <p>
                      <span className="font-semibold text-slate-900">Додаткові фактори кровотечі:</span>{' '}
                      {selectedBleedingFactors.additionalItems.join(', ')}.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-1 text-slate-600">Фактори кровотечі: не позначені.</p>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 lg:grid-cols-3">
            {result.wellsDvt && (
              <ResultCard title="Wells DVT" value={result.wellsDvt.score} subtitle={result.wellsDvt.interpretation}>
                <ResultExplanation
                  meaning={
                    result.wellsDvt.isLikely
                      ? 'Клінічна ймовірність ТГВ вища; шкала не підтверджує діагноз, але підвищує потребу у візуальній перевірці.'
                      : 'Клінічна ймовірність ТГВ нижча; у поєднанні з негативним D-димером це може підтримати виключення ТГВ.'
                  }
                  action={
                    result.wellsDvt.isLikely
                      ? 'Розглянути компресійне УЗД вен або іншу діагностику згідно з клінічним контекстом.'
                      : 'Оцінити D-димер; якщо він не перевищує віковий поріг, ТГВ менш імовірний у межах алгоритму.'
                  }
                />
              </ResultCard>
            )}
            {result.wellsPe && (
              <ResultCard title="Wells PE" value={result.wellsPe.score} subtitle={result.wellsPe.interpretation}>
                <ResultExplanation
                  meaning="Дворівнева інтерпретація: ≤4 — ТЕЛА малоймовірна, >4 — ТЕЛА ймовірна."
                  action={
                    result.wellsPe.score > 4
                      ? 'Не використовувати D-димер як єдиний спосіб виключення; розглянути КТ-ангіографію або іншу візуалізацію.'
                      : 'Якщо клінічна ймовірність низька, оцінити PERC; якщо PERC позитивний, перейти до D-димеру.'
                  }
                />
              </ResultCard>
            )}
            {result.perc && (
              <ResultCard
                title="PERC"
                value={result.perc.isNegative ? '−' : '+'}
                subtitle={result.perc.interpretation}
              >
                <ResultExplanation
                  meaning={`Позитивних критеріїв: ${result.perc.positiveCriteria}. PERC корисний тільки при низькій клінічній ймовірності ТЕЛА.`}
                  action={
                    result.perc.isNegative
                      ? 'За низької клінічної ймовірності ТЕЛА може бути менш імовірною, D-димер часто не потрібний.'
                      : 'Перейти до D-димеру або іншої діагностики залежно від клінічного контексту.'
                  }
                />
              </ResultCard>
            )}
            {result.dimer && (
              <ResultCard
                title="D-димер"
                value={`${result.dimer.threshold} ${result.dimer.unitLabel}`}
                subtitle={result.dimer.exceedsThreshold ? 'Перевищує віковий поріг' : 'Не перевищує віковий поріг'}
              >
                <p>Введене значення: {result.dimer.dimer} {result.dimer.unitLabel}.</p>
                <ResultExplanation
                  meaning={
                    result.dimer.exceedsThreshold
                      ? 'Позитивний D-димер не підтверджує ВТЕ, але не дозволяє її спокійно виключити в цьому алгоритмі.'
                      : 'D-димер не перевищує віковий поріг і може підтримати виключення ВТЕ при низькій або проміжній імовірності.'
                  }
                  action={
                    result.dimer.exceedsThreshold
                      ? 'Розглянути компресійне УЗД вен, КТ-ангіографію або інший маршрут залежно від сценарію.'
                      : 'Зіставити з клінічною ймовірністю; при високій імовірності не покладатися лише на D-димер.'
                  }
                />
              </ResultCard>
            )}
            {result.spesi && (
              <ResultCard title="sPESI" value={result.spesi.score} subtitle={result.spesi.interpretation}>
                <ResultExplanation
                  meaning={result.spesi.isLowRisk ? '0 балів відповідає нижчому короткостроковому ризику.' : '≥1 бал відповідає підвищеному короткостроковому ризику.'}
                  action={
                    result.spesi.isLowRisk
                      ? 'Далі оцінити Hestia, гемодинаміку, сатурацію, кровотечі, функцію нирок і соціальну безпеку.'
                      : 'Розглянути стаціонарну тактику або поглиблену оцінку ризику згідно з локальним протоколом.'
                  }
                />
              </ResultCard>
            )}
            {result.hestia && (
              <ResultCard
                title="Hestia"
                value={result.hestia.positiveCriteria}
                subtitle={result.hestia.interpretation}
              >
                <ResultExplanation
                  meaning={`Позитивних критеріїв: ${result.hestia.positiveCriteria}. Hestia шукає причини, через які амбулаторне лікування ТЕЛА небажане.`}
                  action={
                    result.hestia.isEligibleForOutpatientConsideration
                      ? 'Якщо sPESI низький і немає інших ризиків, можна розглянути амбулаторну тактику у відповідному клінічному контексті.'
                      : 'Амбулаторне лікування за Hestia не рекомендується; оцінити потребу госпіталізації.'
                  }
                />
              </ResultCard>
            )}
            {result.durationAdvice && (
              <ResultCard
                title="Тривалість антикоагуляції"
                value={result.durationAdvice.minimumDuration}
                subtitle={result.durationAdvice.summary}
              >
                <ResultExplanation
                  meaning={result.durationAdvice.explanation}
                  action={result.durationAdvice.nextSteps.join('; ')}
                />
                {result.durationAdvice.cautionItems.length > 0 && (
                  <div className="rounded-md border border-blue-100 bg-white/80 p-3">
                    <p className="font-semibold text-slate-900">Фактори обережності:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {result.durationAdvice.cautionItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </ResultCard>
            )}
            {result.vteBleed && (
              <ResultCard
                title="VTE-BLEED"
                value={result.vteBleed.score}
                subtitle={result.vteBleed.interpretation}
              >
                <ResultExplanation
                  meaning="Поріг вищого ризику: ≥2 бали. Це оцінка ризику кровотечі під час антикоагуляції."
                  action="Не скасовувати антикоагуляцію автоматично; перевірити модифіковані фактори кровотечі, АТ, Hb, ниркову функцію, НПЗП та взаємодії."
                />
              </ResultCard>
            )}
            {result.herdoo2 && (
              <ResultCard
                title="HERDOO2"
                value={result.herdoo2.score}
                subtitle={result.herdoo2.interpretation}
              >
                <ResultExplanation
                  meaning={result.herdoo2.isApplicable ? 'Інструмент застосований для жінки після першого неспровокованого епізоду ВТЕ.' : 'Для чоловіків HERDOO2 не є інструментом визначення низького ризику.'}
                  action="Використати лише як допоміжну підказку при обговоренні ризику рецидиву та тривалості антикоагуляції."
                />
              </ResultCard>
            )}
            {result.dash && (
              <ResultCard title="DASH" value={result.dash.score} subtitle={result.dash.recurrenceRisk}>
                <ResultExplanation
                  meaning={result.dash.interpretation}
                  action="Поєднати з причиною ВТЕ, ризиком кровотечі, HERDOO2/VTE-BLEED за потреби та побажаннями пацієнта."
                />
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
        встановлюють і не виключають діагноз самостійно. Підказка щодо тривалості
        антикоагуляції структурує клінічне рішення, але не є автоматичним призначенням
        або відміною лікування. Остаточне рішення щодо D-димеру, візуалізації,
        госпіталізації та антикоагулянтної терапії приймається лікарем з урахуванням
        клінічного стану пацієнта, локальних протоколів та чинних рекомендацій.
      </p>
    </>
  );
}
