import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

export function PresetField({ label, value, options, onChange, hint }) {
  return (
    <FormField label={label} hint={hint} className="mb-0">
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
