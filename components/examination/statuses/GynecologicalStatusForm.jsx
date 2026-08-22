import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

const gynPresets = {
  externalGenitals: [
    'зовнішні статеві органи без особливостей',
    'гіперемія зовнішніх статевих органів',
    'набряк зовнішніх статевих органів',
    'висипання / ерозії зовнішніх статевих органів',
    'патологічні виділення в ділянці зовнішніх статевих органів',
    'огляд зовнішніх статевих органів не проводився',
  ],
  speculumExam: [
    'шийка матки без видимих патологічних змін',
    'шийка матки гіперемована',
    'ектопія шийки матки',
    'ерозивні зміни шийки матки',
    'поліпоподібне утворення шийки матки',
    'контактна кровоточивість шийки матки',
    'виділення з цервікального каналу',
    'огляд у дзеркалах не проводився',
  ],
  discharge: [
    'виділення фізіологічні',
    'виділення відсутні',
    'виділення слизові',
    'виділення слизово-гнійні',
    'виділення сирнисті',
    'виділення кров’янисті',
    'виділення з неприємним запахом',
  ],
  uterus: [
    'матка нормальних розмірів, рухома, безболісна',
    'матка збільшена',
    'матка болюча при пальпації',
    'матка обмежено рухома',
    'бімануальне дослідження матки не проводилось',
  ],
  adnexa: [
    'придатки без особливостей',
    'болючість у ділянці правих придатків',
    'болючість у ділянці лівих придатків',
    'болючість у ділянці придатків з обох боків',
    'пальпується об’ємне утворення в проєкції придатків',
    'придатки не пальпуються',
    'бімануальне дослідження придатків не проводилось',
  ],
  tenderness: [
    'болючість при зміщенні шийки матки відсутня',
    'болючість при зміщенні шийки матки',
    'болючість у правій здухвинній ділянці',
    'болючість у лівій здухвинній ділянці',
    'болючість у нижніх відділах живота',
  ],
};

function PresetField({ label, value, options, onChange }) {
  return (
    <FormField label={label} className="mb-0">
      <select
        value={options.includes(value) ? value : options[0]}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default function GynecologicalStatusForm({ formData, onChange }) {
  return (
    <div className="space-y-3">
      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Огляд
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Зовнішні статеві органи"
            value={formData.gynExternalGenitals}
            options={gynPresets.externalGenitals}
            onChange={(value) => onChange('gynExternalGenitals', value)}
          />

          <PresetField
            label="Огляд у дзеркалах"
            value={formData.gynSpeculumExam}
            options={gynPresets.speculumExam}
            onChange={(value) => onChange('gynSpeculumExam', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
          Виділення і бімануальне дослідження
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Виділення"
            value={formData.gynDischarge}
            options={gynPresets.discharge}
            onChange={(value) => onChange('gynDischarge', value)}
          />

          <PresetField
            label="Матка"
            value={formData.gynUterus}
            options={gynPresets.uterus}
            onChange={(value) => onChange('gynUterus', value)}
          />

          <PresetField
            label="Придатки"
            value={formData.gynAdnexa}
            options={gynPresets.adnexa}
            onChange={(value) => onChange('gynAdnexa', value)}
          />

          <PresetField
            label="Болючість"
            value={formData.gynTenderness}
            options={gynPresets.tenderness}
            onChange={(value) => onChange('gynTenderness', value)}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <FormField label="Додатково" className="mb-0">
          <textarea
            value={formData.gynExamNote}
            onChange={(event) => onChange('gynExamNote', event.target.value)}
            placeholder="Короткий довільний опис, якщо потрібно."
            rows={3}
            className={textareaClass}
          />
        </FormField>
      </section>
    </div>
  );
}
