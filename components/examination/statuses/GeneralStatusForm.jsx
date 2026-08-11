import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

const generalConditionOptions = ['задовільний', 'відносно задовільний', 'середньої тяжкості', 'тяжкий'];

const presets = {
  consciousness: ['свідомість ясна', 'свідомість сплутана', 'оглушення', 'сопор', 'кома'],
  patientPosition: ['положення активне', 'положення пасивне', 'положення вимушене', 'ортопное'],
  skinCondition: ['чисті, блідо-рожеві', 'бліді', 'гіперемовані', 'ціанотичні', 'жовтушні', 'висип не виявлено'],
  mucousMembranes: [
    'видимі слизові рожеві, вологі',
    'видимі слизові бліді',
    'видимі слизові гіперемовані',
    'видимі слизові сухі',
    'видимі слизові ціанотичні',
  ],
  peripheralEdema: [
    '',
    'периферичні набряки не виявлені',
    'пастозність гомілок',
    'набряки стоп',
    'набряки гомілок',
    'набряки нижніх кінцівок',
    'генералізовані набряки',
  ],
  lymphNodes: ['не збільшені', 'збільшені шийні', 'збільшені підщелепні', 'збільшені пахвові', 'збільшені пахвинні'],
  thyroid: [
    'не збільшена, безболісна при пальпації',
    'збільшена',
    'пальпаторно вузлові утворення',
    'болісна при пальпації',
  ],
  oralCavity: ['зів рожевий, мигдалики чисті', 'зів гіперемований', 'слизова ротової порожнини суха', 'язик вологий'],
  bodyType: ['нормостенічний', 'астенічний', 'гіперстенічний'],
  heartAuscultation: [
    'Тони серця ритмічні, звучні. Шуми не вислуховуються.',
    'Тони серця ритмічні, приглушені. Шуми не вислуховуються.',
    'Тони серця аритмічні. Шуми не вислуховуються.',
    'Тони серця ритмічні. Систолічний шум вислуховується.',
    'Тони серця ритмічні. Діастолічний шум вислуховується.',
    'Тони серця аритмічні. Систолічний шум вислуховується.',
  ],
  abdomen: ["живіт м'який, безболісний", "живіт м'який, болючий", 'живіт здутий', 'живіт напружений'],
  liver: ['печінка не збільшена', 'печінка збільшена', 'край печінки пальпується біля краю реберної дуги'],
  spleen: ['селезінка не пальпується', 'селезінка пальпується', 'селезінка збільшена'],
  defecation: ['без особливостей', 'закрепи', 'діарея', 'нестійкі випорожнення'],
  urination: ['без особливостей', 'часте сечовипускання', 'болісне сечовипускання', 'ніктурія'],
  cvsSymptom: [
    'симптом поколочування негативний з обох боків',
    'симптом поколочування позитивний справа',
    'симптом поколочування позитивний зліва',
    'симптом поколочування позитивний з обох боків',
  ],
};

function RadioPills({ name, value, options, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition ${
            value === option
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 cursor-pointer text-blue-600"
          />
          <span className="text-sm font-medium">{option}</span>
        </label>
      ))}
    </div>
  );
}

function PresetField({ label, value, options, onChange }) {
  return (
    <FormField label={label} className="mb-0">
      <select
        value={options.includes(value) ? value : options[0] || ''}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option || 'empty'} value={option}>
            {option || 'не вносити в текст'}
          </option>
        ))}
      </select>
    </FormField>
  );
}

function NumberField({ label, hint, value, onChange, placeholder, min, max }) {
  return (
    <FormField label={label} hint={hint} className="mb-0">
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={inputClass}
      />
    </FormField>
  );
}

export default function GeneralStatusForm({ formData, onChange }) {
  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <FormField label="Загальний стан" className="mb-0">
          <RadioPills
            name="generalCondition"
            value={formData.generalCondition}
            options={generalConditionOptions}
            onChange={(value) => onChange('generalCondition', value)}
          />
        </FormField>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Свідомість і положення
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Свідомість"
            value={formData.consciousness}
            options={presets.consciousness}
            onChange={(value) => onChange('consciousness', value)}
          />

          <PresetField
            label="Положення"
            value={formData.patientPosition}
            options={presets.patientPosition}
            onChange={(value) => onChange('patientPosition', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Шкіра і слизові
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Шкірні покриви"
            value={formData.skinCondition}
            options={presets.skinCondition}
            onChange={(value) => onChange('skinCondition', value)}
          />

          <PresetField
            label="Видимі слизові"
            value={formData.mucousMembranes}
            options={presets.mucousMembranes}
            onChange={(value) => onChange('mucousMembranes', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Лімфатичні вузли і щитоподібна залоза
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <PresetField
            label="Лімфатичні вузли"
            value={formData.lymphNodes}
            options={presets.lymphNodes}
            onChange={(value) => onChange('lymphNodes', value)}
          />

          <PresetField
            label="Щитоподібна залоза"
            value={formData.thyroid}
            options={presets.thyroid}
            onChange={(value) => onChange('thyroid', value)}
          />

          <PresetField
            label="Ротова порожнина"
            value={formData.oralCavity}
            options={presets.oralCavity}
            onChange={(value) => onChange('oralCavity', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Антропометрія
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          <PresetField
            label="Тип будови тіла"
            value={formData.bodyType}
            options={presets.bodyType}
            onChange={(value) => onChange('bodyType', value)}
          />

          <NumberField
            label="Зріст"
            hint="см"
            value={formData.height}
            onChange={(value) => onChange('height', value)}
            placeholder="170"
            min="100"
            max="250"
          />

          <NumberField
            label="Маса тіла"
            hint="кг"
            value={formData.weight}
            onChange={(value) => onChange('weight', value)}
            placeholder="75"
            min="20"
            max="300"
          />

          <FormField label="ІМТ" hint="кг/м²" className="mb-0">
            <input
              type="text"
              value={formData.bmi}
              readOnly
              placeholder="Автоматично"
              className={`${inputClass} bg-slate-50 text-slate-600`}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Серцево-судинний статус
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Артеріальний тиск" hint="мм рт. ст." className="mb-0">
            <input
              type="text"
              inputMode="numeric"
              value={formData.bloodPressure}
              onChange={(event) => onChange('bloodPressure', event.target.value)}
              placeholder="120/80"
              className={inputClass}
            />
          </FormField>

          <NumberField
            label="ЧСС"
            hint="уд/хв"
            value={formData.heartRate}
            onChange={(value) => onChange('heartRate', value)}
            placeholder="72"
            min="20"
            max="300"
          />

          <PresetField
            label="Аускультація серця"
            value={formData.heartAuscultation}
            options={presets.heartAuscultation}
            onChange={(value) => onChange('heartAuscultation', value)}
          />

          <PresetField
            label="Периферичні набряки"
            value={formData.peripheralEdema}
            options={presets.peripheralEdema}
            onChange={(value) => onChange('peripheralEdema', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Живіт
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <PresetField
            label="Живіт"
            value={formData.abdomen}
            options={presets.abdomen}
            onChange={(value) => onChange('abdomen', value)}
          />

          <PresetField
            label="Печінка"
            value={formData.liver}
            options={presets.liver}
            onChange={(value) => onChange('liver', value)}
          />

          <PresetField
            label="Селезінка"
            value={formData.spleen}
            options={presets.spleen}
            onChange={(value) => onChange('spleen', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Фізіологічні відправлення
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <PresetField
            label="Дефекація"
            value={formData.defecation}
            options={presets.defecation}
            onChange={(value) => onChange('defecation', value)}
          />

          <PresetField
            label="Сечовипускання"
            value={formData.urination}
            options={presets.urination}
            onChange={(value) => onChange('urination', value)}
          />

          <PresetField
            label="Симптом поколочування"
            value={formData.cvsSymptom}
            options={presets.cvsSymptom}
            onChange={(value) => onChange('cvsSymptom', value)}
          />
        </div>
      </section>
    </div>
  );
}
