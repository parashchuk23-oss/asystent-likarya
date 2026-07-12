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

function CheckboxGrid({ options, values, onChange }) {
  const toggle = (value) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
        >
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

export default function ThyroidParenchymaForm({ appearance, parenchyma, vascularization, onAppearanceChange, onParenchymaChange, onVascularizationChange }) {
  const updateAppearance = (field, value) => onAppearanceChange({ ...appearance, [field]: value });
  const updateParenchyma = (field, value) => onParenchymaChange({ ...parenchyma, [field]: value });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField label="Контури" value={appearance.contour} onChange={(value) => updateAppearance('contour', value)} options={thyroidOptions.contour} />
        <SelectField label="Чіткість контурів" value={appearance.clarity} onChange={(value) => updateAppearance('clarity', value)} options={thyroidOptions.clarity} />
        <SelectField label="Капсула" value={appearance.capsule} onChange={(value) => updateAppearance('capsule', value)} options={thyroidOptions.capsule} />
        <SelectField label="Ехогенність" value={appearance.echogenicity} onChange={(value) => updateAppearance('echogenicity', value)} options={thyroidOptions.echogenicity} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Паренхіма"
          value={parenchyma.structure}
          onChange={(value) => updateParenchyma('structure', value)}
          options={thyroidOptions.parenchymaStructure}
        />
        <SelectField label="Васкуляризація" value={vascularization} onChange={onVascularizationChange} options={thyroidOptions.vascularization} />
      </div>

      {parenchyma.structure === 'diffuselyHeterogeneous' ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-bold text-slate-950">Ознаки неоднорідності</h4>
          <CheckboxGrid
            options={thyroidOptions.parenchymaFeatures}
            values={parenchyma.features}
            onChange={(values) => updateParenchyma('features', values)}
          />
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <FormField label="Гіпоехогенні ділянки до" hint="мм">
              <input
                type="number"
                min="0"
                step="0.1"
                value={parenchyma.hypoechoicSize}
                onChange={(event) => updateParenchyma('hypoechoicSize', event.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Фіброзні ділянки до" hint="мм">
              <input
                type="number"
                min="0"
                step="0.1"
                value={parenchyma.fibroticSize}
                onChange={(event) => updateParenchyma('fibroticSize', event.target.value)}
                className={inputClass}
              />
            </FormField>
            {parenchyma.features.includes('other') ? (
              <FormField label="Інше">
                <input value={parenchyma.other} onChange={(event) => updateParenchyma('other', event.target.value)} className={inputClass} />
              </FormField>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
