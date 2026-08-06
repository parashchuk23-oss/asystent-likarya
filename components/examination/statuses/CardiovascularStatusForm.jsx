import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

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

      <FormField label="Аускультація серця" hint="тони, шуми">
        <textarea
          value={formData.heartAuscultation}
          onChange={(event) => onChange('heartAuscultation', event.target.value)}
          rows={3}
          className={textareaClass}
        />
      </FormField>

      {mode !== 'short' ? (
        <FormField label="Набряки">
          <input
            type="text"
            value={formData.edema}
            onChange={(event) => onChange('edema', event.target.value)}
            placeholder="не виявлені"
            className={inputClass}
          />
        </FormField>
      ) : null}
    </div>
  );
}
