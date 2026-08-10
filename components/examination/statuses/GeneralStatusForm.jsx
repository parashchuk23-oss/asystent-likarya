import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

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

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

export default function GeneralStatusForm({ formData, onChange }) {
  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <div className="grid gap-3 lg:grid-cols-2">
          <FormField label="Загальний стан" className="mb-0">
            <RadioPills
              name="generalCondition"
              value={formData.generalCondition}
              options={['задовільний', 'відносно задовільний', 'середньої тяжкості', 'тяжкий']}
              onChange={(value) => onChange('generalCondition', value)}
            />
          </FormField>

          <FormField label="Додатково до стану" className="mb-0">
            <TextInput
              value={formData.generalConditionNote}
              onChange={(value) => onChange('generalConditionNote', value)}
              placeholder="Наприклад: за рахунок больового синдрому"
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Свідомість і положення
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Свідомість" className="mb-0">
            <TextInput
              value={formData.consciousness}
              onChange={(value) => onChange('consciousness', value)}
            />
          </FormField>

          <FormField label="Положення" className="mb-0">
            <TextInput
              value={formData.patientPosition}
              onChange={(value) => onChange('patientPosition', value)}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Шкіра, слизові, набряки
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Шкірні покриви" className="mb-0">
            <TextInput
              value={formData.skinCondition}
              onChange={(value) => onChange('skinCondition', value)}
            />
          </FormField>

          <FormField label="Видимі слизові" className="mb-0">
            <TextInput
              value={formData.mucousMembranes}
              onChange={(value) => onChange('mucousMembranes', value)}
            />
          </FormField>

          <FormField label="Периферичні набряки" className="mb-0">
            <TextInput
              value={formData.peripheralEdema}
              onChange={(value) => onChange('peripheralEdema', value)}
              placeholder="Наприклад: не виявлені"
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Лімфатичні вузли і щитоподібна залоза
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Лімфатичні вузли" className="mb-0">
            <TextInput
              value={formData.lymphNodes}
              onChange={(value) => onChange('lymphNodes', value)}
            />
          </FormField>

          <FormField label="Щитоподібна залоза" className="mb-0">
            <TextInput
              value={formData.thyroid}
              onChange={(value) => onChange('thyroid', value)}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Антропометрія
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          <FormField label="Тип будови тіла" className="mb-0">
            <select
              value={formData.bodyType}
              onChange={(event) => onChange('bodyType', event.target.value)}
              className={inputClass}
            >
              <option value="нормостенічний">нормостенічний</option>
              <option value="астенічний">астенічний</option>
              <option value="гіперстенічний">гіперстенічний</option>
            </select>
          </FormField>

          <FormField label="Зріст" hint="см" className="mb-0">
            <input
              type="number"
              value={formData.height}
              onChange={(event) => onChange('height', event.target.value)}
              placeholder="170"
              min="100"
              max="250"
              className={inputClass}
            />
          </FormField>

          <FormField label="Маса тіла" hint="кг" className="mb-0">
            <input
              type="number"
              value={formData.weight}
              onChange={(event) => onChange('weight', event.target.value)}
              placeholder="75"
              min="20"
              max="300"
              className={inputClass}
            />
          </FormField>

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
          Живіт
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Живіт" className="mb-0">
            <TextInput
              value={formData.abdomen}
              onChange={(value) => onChange('abdomen', value)}
            />
          </FormField>

          <FormField label="Печінка" className="mb-0">
            <TextInput
              value={formData.liver}
              onChange={(value) => onChange('liver', value)}
            />
          </FormField>

          <FormField label="Селезінка" className="mb-0">
            <TextInput
              value={formData.spleen}
              onChange={(value) => onChange('spleen', value)}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Фізіологічні відправлення
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Дефекація" className="mb-0">
            <TextInput
              value={formData.defecation}
              onChange={(value) => onChange('defecation', value)}
            />
          </FormField>

          <FormField label="Сечовипускання" className="mb-0">
            <TextInput
              value={formData.urination}
              onChange={(value) => onChange('urination', value)}
            />
          </FormField>

          <FormField label="Симптом поколочування" className="mb-0">
            <TextInput
              value={formData.cvsSymptom}
              onChange={(value) => onChange('cvsSymptom', value)}
            />
          </FormField>
        </div>
      </section>
    </div>
  );
}
