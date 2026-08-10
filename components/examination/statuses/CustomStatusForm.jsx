import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

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

      <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-6 text-slate-600">
        Довільний опис редагується у загальному полі “Текст статусу” під усіма обраними статусами.
      </p>
    </div>
  );
}
