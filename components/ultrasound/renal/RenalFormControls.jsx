import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

export function RenalSelectField({ label, value, onChange, options }) {
  return (
    <FormField className="mb-2" label={label}>
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

export function RenalNumberField({ label, value, onChange, unit = 'мм', norm = '' }) {
  return (
    <FormField className="mb-2" label={label} hint={unit}>
      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {norm ? <p className="mt-1 text-xs font-medium leading-snug text-slate-500">Орієнтир: {norm}</p> : null}
    </FormField>
  );
}

export function RenalTextField({ label, value, onChange, placeholder = '' }) {
  return (
    <FormField className="mb-2" label={label}>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
    </FormField>
  );
}

export function RenalTextareaField({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <FormField className="mb-2" label={label}>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} className={textareaClass} />
    </FormField>
  );
}
