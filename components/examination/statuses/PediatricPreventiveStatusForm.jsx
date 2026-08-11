import FormField from '../../FormField';
import { inputClass } from '../../formStyles';
import { PresetField } from './StatusPresetFields';

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
  vision: ['гострота зору без скарг / видимих порушень', 'потребує уточнення гостроти зору', 'користується окулярами / лінзами'],
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

export default function PediatricPreventiveStatusForm({ formData, onChange }) {
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

          <PresetField
            label="Зір"
            value={formData.pediatricVision}
            options={presets.vision}
            onChange={(value) => onChange('pediatricVision', value)}
          />

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
