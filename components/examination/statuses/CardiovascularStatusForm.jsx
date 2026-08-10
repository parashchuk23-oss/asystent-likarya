import FormField from '../../FormField';
import { inputClass } from '../../formStyles';
import { PresetField } from './StatusPresetFields';

const heartAuscultationOptions = [
  'Тони серця ритмічні, звучні. Шуми не вислуховуються.',
  'Тони серця ритмічні, приглушені. Шуми не вислуховуються.',
  'Тони серця аритмічні. Шуми не вислуховуються.',
  'Тони серця ритмічні. Систолічний шум вислуховується.',
  'Тони серця ритмічні. Діастолічний шум вислуховується.',
  'Тони серця аритмічні. Систолічний шум вислуховується.',
];

const edemaOptions = [
  '',
  'не виявлені',
  'пастозність стоп',
  'пастозність гомілок',
  'набряки стоп',
  'набряки гомілок',
  'набряки нижніх кінцівок',
  'генералізовані набряки',
];

export default function CardiovascularStatusForm({ formData, onChange, mode }) {
  return (
    <div className="space-y-1">
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Артеріальний тиск" hint="мм рт. ст.">
          <input
            type="text"
            inputMode="numeric"
            value={formData.bloodPressure}
            onChange={(event) => onChange('bloodPressure', event.target.value)}
            placeholder="120/80"
            className={inputClass}
          />
        </FormField>

        <FormField label="ЧСС" hint="уд/хв">
          <input
            type="number"
            value={formData.heartRate}
            onChange={(event) => onChange('heartRate', event.target.value)}
            placeholder="72"
            min="20"
            max="300"
            className={inputClass}
          />
        </FormField>
      </div>

      <PresetField
        label="Аускультація серця"
        hint="тони, шуми"
        value={formData.heartAuscultation}
        options={heartAuscultationOptions}
        onChange={(value) => onChange('heartAuscultation', value)}
        placeholder="Наприклад: тони серця аритмічні, систолічний шум на верхівці"
      />

      {mode !== 'short' ? (
        <PresetField
          label="Набряки"
          value={formData.edema}
          options={edemaOptions}
          onChange={(value) => onChange('edema', value)}
          placeholder="Наприклад: набряки гомілок до середньої третини"
        />
      ) : null}
    </div>
  );
}
