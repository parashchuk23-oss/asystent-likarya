import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

export default function CustomStatusForm({ formData, onChange }) {
  return (
    <div className="space-y-1">
      <FormField label="Назва статусу">
        <input
          type="text"
          value={formData.customTitle}
          onChange={(event) => onChange('customTitle', event.target.value)}
          placeholder="Наприклад: Локальний статус"
          className={inputClass}
        />
      </FormField>

      <FormField label="Текст статусу">
        <textarea
          value={formData.customText}
          onChange={(event) => onChange('customText', event.target.value)}
          placeholder="Введіть довільний опис без автоматичної інтерпретації."
          rows={5}
          className={textareaClass}
        />
      </FormField>
    </div>
  );
}
