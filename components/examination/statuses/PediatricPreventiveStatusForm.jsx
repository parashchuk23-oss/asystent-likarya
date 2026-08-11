import FormField from '../../FormField';
import { inputClass } from '../../formStyles';
import { PresetField } from './StatusPresetFields';
import { calculatePediatricGrowthAssessment } from '../../../utils/growthAssessment';
import { assessPediatricBloodPressure } from '../../../utils/pediatricBloodPressure';

const presets = {
  generalCondition: ['задовільний', 'відносно задовільний', 'середньої тяжкості'],
  skinCondition: ['чисті, блідо-рожеві', 'бліді', 'гіперемовані', 'висип не виявлено'],
  mucousMembranes: [
    'видимі слизові рожеві, вологі',
    'видимі слизові бліді',
    'видимі слизові гіперемовані',
    'видимі слизові сухі',
  ],
  lymphNodes: ['не збільшені', 'збільшені шийні', 'збільшені підщелепні', 'збільшені пахвові'],
  oralCavity: ['зів рожевий, мигдалики чисті', 'зів гіперемований', 'мигдалики збільшені', 'слизова ротової порожнини суха'],
  heartSounds: [
    'тони серця ритмічні, звучні',
    'тони серця ритмічні, приглушені',
    'тони серця аритмічні',
  ],
  heartMurmurs: [
    'шуми не вислуховуються',
    'систолічний шум вислуховується',
    'функціональний шум під питанням',
  ],
  breathSounds: [
    'дихання везикулярне, проводиться з обох боків',
    'дихання жорстке, проводиться з обох боків',
    'дихання ослаблене з обох боків',
  ],
  lungWheezes: [
    'хрипи не вислуховуються',
    'сухі хрипи вислуховуються',
    'вологі хрипи вислуховуються',
  ],
  abdomen: ["живіт м'який, безболісний", "живіт м'який, болючий", 'живіт здутий'],
  posture: ['постава без видимих порушень', 'порушення постави', 'сколіотична постава під питанням'],
  footArch: ['склепіння стопи без видимих порушень', 'плоскостопість під питанням', 'порушення склепіння стопи'],
  hearing: ['слух на шепітну мову збережений', 'потребує уточнення слуху', 'зниження слуху під питанням'],
  dentalStatus: ['стоматологічний огляд рекомендований планово', 'карієс під питанням', 'скарги стоматологічного профілю відсутні'],
  pediculosis: ['ознак педикульозу не виявлено', 'потребує огляду на педикульоз', 'виявлені ознаки педикульозу'],
  physicalEducationGroup: [
    'основна група',
    'підготовча група',
    'спеціальна група',
    'тимчасово звільнений(а) від фізичних навантажень',
    'потребує додаткової оцінки перед визначенням групи',
  ],
  conclusion: [
    'Ознак гострого захворювання на момент огляду не виявлено.',
    'Потребує додаткової клінічної оцінки за результатами огляду.',
    'Потребує консультації профільного спеціаліста за результатами огляду.',
  ],
};

function NumberField({ label, hint, value, onChange, placeholder, min, max, step }) {
  return (
    <FormField label={label} hint={hint} className="mb-0">
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={inputClass}
      />
    </FormField>
  );
}

function getAssessmentCardClass(tone) {
  if (tone === 'danger') {
    return 'border-rose-200 bg-rose-50 text-rose-900';
  }

  if (tone === 'warning' || tone === 'notice') {
    return 'border-amber-200 bg-amber-50 text-amber-900';
  }

  return 'border-teal-100 bg-teal-50 text-teal-900';
}

export default function PediatricPreventiveStatusForm({ formData, onChange }) {
  const growthAssessment = calculatePediatricGrowthAssessment({
    sex: formData.pediatricSex,
    ageYears: formData.pediatricAgeYears,
    ageMonths: formData.pediatricAgeMonths,
    height: formData.pediatricHeight,
    weight: formData.pediatricWeight,
  });
  const bloodPressureAssessment = assessPediatricBloodPressure({
    bloodPressure: formData.pediatricBloodPressure,
    sex: formData.pediatricSex,
    ageYears: formData.pediatricAgeYears,
    ageMonths: formData.pediatricAgeMonths,
  });

  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Загальні показники
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          <PresetField
            label="Загальний стан"
            value={formData.pediatricGeneralCondition}
            options={presets.generalCondition}
            onChange={(value) => onChange('pediatricGeneralCondition', value)}
          />

          <NumberField
            label="Вік"
            hint="років"
            value={formData.pediatricAgeYears}
            onChange={(value) => onChange('pediatricAgeYears', value)}
            placeholder="10"
            min="0"
            max="17"
          />

          <NumberField
            label="Місяці"
            hint="додатково"
            value={formData.pediatricAgeMonths}
            onChange={(value) => onChange('pediatricAgeMonths', value)}
            placeholder="0"
            min="0"
            max="11"
          />

          <FormField label="Стать" className="mb-0">
            <select
              value={formData.pediatricSex}
              onChange={(event) => onChange('pediatricSex', event.target.value)}
              className={inputClass}
            >
              <option value="">не обрано</option>
              <option value="хлопчик">хлопчик</option>
              <option value="дівчинка">дівчинка</option>
            </select>
          </FormField>

          <NumberField
            label="Температура"
            hint="°C"
            value={formData.pediatricTemperature}
            onChange={(value) => onChange('pediatricTemperature', value)}
            placeholder="36.6"
            min="30"
            max="45"
            step="0.1"
          />

          <NumberField
            label="Зріст"
            hint="см"
            value={formData.pediatricHeight}
            onChange={(value) => onChange('pediatricHeight', value)}
            placeholder="130"
            min="40"
            max="220"
          />

          <NumberField
            label="Маса тіла"
            hint="кг"
            value={formData.pediatricWeight}
            onChange={(value) => onChange('pediatricWeight', value)}
            placeholder="28"
            min="2"
            max="180"
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3 text-sm font-semibold leading-relaxed text-slate-700">
            <span className="text-slate-900">ІМТ:</span>{' '}
            {growthAssessment.bmi?.value
              ? `${growthAssessment.bmi.value} кг/м²`
              : 'буде розраховано після введення зросту і маси тіла'}.
            <br />
            У дітей ІМТ оцінюється за віком і статтю, а не за дорослими межами.
          </div>

          <div className="rounded-lg border border-teal-100 bg-teal-50/70 p-3 text-sm font-semibold leading-relaxed text-slate-700">
            Оцінка виконується за WHO Growth Reference 2007 для дітей 5-19 років; підхід
            відповідає принципу оцінювання за віком і статтю, передбаченому наказом МОЗ
            України №1590.
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Автоматична оцінка фізичного розвитку
          </p>
          {growthAssessment.status === 'ready' ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-700">
                <span className="block text-slate-900">Зріст для віку</span>
                {growthAssessment.height ? (
                  <>
                    {growthAssessment.height.category}
                    <br />
                    <span className="text-xs text-slate-500">
                      z-score: {growthAssessment.height.zScore}; приблизно {growthAssessment.height.percentile}
                      -й перцентиль
                    </span>
                  </>
                ) : (
                  'введіть зріст'
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-700">
                <span className="block text-slate-900">ІМТ для віку</span>
                {growthAssessment.bmi ? (
                  <>
                    {growthAssessment.bmi.category}
                    <br />
                    <span className="text-xs text-slate-500">
                      z-score: {growthAssessment.bmi.zScore}; приблизно {growthAssessment.bmi.percentile}-й
                      перцентиль
                    </span>
                  </>
                ) : (
                  'введіть зріст і масу тіла'
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold leading-relaxed text-slate-500">
              {growthAssessment.message}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Соматичний статус і шкільний скринінг
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <PresetField
            label="Шкірні покриви"
            value={formData.pediatricSkinCondition}
            options={presets.skinCondition}
            onChange={(value) => onChange('pediatricSkinCondition', value)}
          />

          <PresetField
            label="Видимі слизові"
            value={formData.pediatricMucousMembranes}
            options={presets.mucousMembranes}
            onChange={(value) => onChange('pediatricMucousMembranes', value)}
          />

          <PresetField
            label="Лімфатичні вузли"
            value={formData.pediatricLymphNodes}
            options={presets.lymphNodes}
            onChange={(value) => onChange('pediatricLymphNodes', value)}
          />

          <PresetField
            label="Ротова порожнина"
            value={formData.pediatricOralCavity}
            options={presets.oralCavity}
            onChange={(value) => onChange('pediatricOralCavity', value)}
          />

          <PresetField
            label="Живіт"
            value={formData.pediatricAbdomen}
            options={presets.abdomen}
            onChange={(value) => onChange('pediatricAbdomen', value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Зір OD" className="mb-0">
              <input
                type="text"
                inputMode="decimal"
                value={formData.pediatricVisionOd}
                onChange={(event) => onChange('pediatricVisionOd', event.target.value)}
                placeholder="1.0"
                className={inputClass}
              />
            </FormField>

            <FormField label="Зір OS" className="mb-0">
              <input
                type="text"
                inputMode="decimal"
                value={formData.pediatricVisionOs}
                onChange={(event) => onChange('pediatricVisionOs', event.target.value)}
                placeholder="1.0"
                className={inputClass}
              />
            </FormField>
          </div>

          <PresetField
            label="Слух"
            value={formData.pediatricHearing}
            options={presets.hearing}
            onChange={(value) => onChange('pediatricHearing', value)}
          />

          <PresetField
            label="Постава"
            value={formData.pediatricPosture}
            options={presets.posture}
            onChange={(value) => onChange('pediatricPosture', value)}
          />

          <PresetField
            label="Склепіння стопи"
            value={formData.pediatricFootArch}
            options={presets.footArch}
            onChange={(value) => onChange('pediatricFootArch', value)}
          />

          <PresetField
            label="Стоматологічний статус"
            value={formData.pediatricDentalStatus}
            options={presets.dentalStatus}
            onChange={(value) => onChange('pediatricDentalStatus', value)}
          />

          <PresetField
            label="Педикульоз"
            value={formData.pediatricPediculosis}
            options={presets.pediculosis}
            onChange={(value) => onChange('pediatricPediculosis', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Серцево-судинна і респіраторна системи
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="АТ" hint="мм рт. ст." className="mb-0">
            <input
              type="text"
              inputMode="numeric"
              value={formData.pediatricBloodPressure}
              onChange={(event) => onChange('pediatricBloodPressure', event.target.value)}
              placeholder="100/60"
              className={inputClass}
            />
            <div
              className={`mt-2 rounded-lg border p-2 text-xs font-semibold leading-relaxed ${getAssessmentCardClass(
                bloodPressureAssessment.tone,
              )}`}
            >
              {bloodPressureAssessment.status === 'ready' ? (
                <>
                  <span className="block text-sm">{bloodPressureAssessment.category}</span>
                  {bloodPressureAssessment.threshold && (
                    <span className="block text-slate-600">
                      Скринінговий поріг: {bloodPressureAssessment.threshold.systolic}/
                      {bloodPressureAssessment.threshold.diastolic} мм рт. ст.
                    </span>
                  )}
                  <span className="block">{bloodPressureAssessment.interpretation}</span>
                </>
              ) : (
                bloodPressureAssessment.message
              )}
            </div>
          </FormField>

          <NumberField
            label="ЧСС"
            hint="уд/хв"
            value={formData.pediatricHeartRate}
            onChange={(value) => onChange('pediatricHeartRate', value)}
            placeholder="82"
            min="30"
            max="240"
          />

          <NumberField
            label="ЧД"
            hint="за хв"
            value={formData.pediatricRespiratoryRate}
            onChange={(value) => onChange('pediatricRespiratoryRate', value)}
            placeholder="18"
            min="4"
            max="80"
          />

          <PresetField
            label="Тони серця"
            value={formData.pediatricHeartSounds}
            options={presets.heartSounds}
            onChange={(value) => onChange('pediatricHeartSounds', value)}
          />

          <PresetField
            label="Шуми"
            value={formData.pediatricHeartMurmurs}
            options={presets.heartMurmurs}
            onChange={(value) => onChange('pediatricHeartMurmurs', value)}
          />

          <PresetField
            label="Дихання"
            value={formData.pediatricBreathSounds}
            options={presets.breathSounds}
            onChange={(value) => onChange('pediatricBreathSounds', value)}
          />

          <PresetField
            label="Хрипи"
            value={formData.pediatricLungWheezes}
            options={presets.lungWheezes}
            onChange={(value) => onChange('pediatricLungWheezes', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Фізична культура і висновок
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Група для фізкультури"
            value={formData.pediatricPhysicalEducationGroup}
            options={presets.physicalEducationGroup}
            onChange={(value) => onChange('pediatricPhysicalEducationGroup', value)}
          />

          <PresetField
            label="Висновок"
            value={formData.pediatricConclusion}
            options={presets.conclusion}
            onChange={(value) => onChange('pediatricConclusion', value)}
          />
        </div>
      </section>
    </div>
  );
}
