import { thyroidOptions } from '../../data/ultrasound/thyroidOptions';
import FormField from '../FormField';
import { inputClass } from '../formStyles';

function SelectField({ label, value, onChange, options }) {
  return (
    <FormField label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default function ThyroidGeneralForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField
        label="Стан залози"
        value={data.surgeryStatus}
        onChange={(value) => update('surgeryStatus', value)}
        options={thyroidOptions.surgeryStatus}
      />
      <SelectField
        label="Розташування"
        value={data.location}
        onChange={(value) => update('location', value)}
        options={thyroidOptions.location}
      />
      <SelectField
        label="Форма"
        value={data.shape}
        onChange={(value) => update('shape', value)}
        options={thyroidOptions.shape}
      />
      {data.shape === 'other' ? (
        <FormField label="Форма: уточнення">
          <input
            value={data.shapeOther}
            onChange={(event) => update('shapeOther', event.target.value)}
            className={inputClass}
            placeholder="Наприклад: післяопераційні зміни"
          />
        </FormField>
      ) : null}
    </div>
  );
}
