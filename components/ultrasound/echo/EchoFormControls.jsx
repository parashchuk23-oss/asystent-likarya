import FormField from '../../FormField';
import { inputClass, textareaClass } from '../../formStyles';

export function EchoSelectField({ label, value, onChange, options, hint = '' }) {
  return (
    <FormField className="mb-2" label={label} hint={hint}>
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

export function EchoNumberField({ label, value, onChange, unit = '', norm = '', step = '0.1' }) {
  return (
    <FormField className="mb-2" label={label} hint={unit}>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
      {norm ? <p className="mt-1 text-xs font-medium leading-snug text-slate-500">Орієнтир: {norm}</p> : null}
    </FormField>
  );
}

export function EchoReadonlyField({ label, value, unit = '' }) {
  return (
    <FormField className="mb-2" label={label}>
      <div className={`${inputClass} flex items-center bg-slate-100 font-semibold text-slate-950`}>
        {value === null || value === undefined || value === '' ? '—' : `${value}${unit}`}
      </div>
    </FormField>
  );
}

export function EchoTextareaField({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <FormField className="mb-2" label={label}>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} className={textareaClass} />
    </FormField>
  );
}

export function DerivedValue({ label, value, unit = '', note = '' }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value === null || value === undefined || value === '' ? '—' : `${value}${unit}`}</p>
      {note ? <p className="mt-1 text-xs leading-snug text-slate-500">{note}</p> : null}
    </div>
  );
}
