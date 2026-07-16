import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

export function SelectField({ label, value, onChange, options }) {
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

export function NumberField({ label, value, onChange, unit = 'мм' }) {
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
    </FormField>
  );
}

export function TextField({ label, value, onChange, placeholder = '' }) {
  return (
    <FormField className="mb-2" label={label}>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
    </FormField>
  );
}

export function TextareaField({ label, value, onChange, placeholder = '' }) {
  return (
    <FormField className="mb-2" label={label}>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className={textareaClass} />
    </FormField>
  );
}

export function ModeToggle({ value, onChange }) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2">
      {[
        ['normal', 'Без особливостей'],
        ['changed', 'Зміни'],
      ].map(([mode, label]) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
            value === mode
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function CheckboxGroup({ options, values, onChange }) {
  const toggle = (value) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onChange={() => toggle(option.value)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
