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

function InclusionField({ values, other, onChange, onOtherChange }) {
  const toggle = (value) => {
    if (value === 'absent') {
      onChange(['absent']);
      return;
    }
    const nextValues = values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values.filter((item) => item !== 'absent'), value];
    onChange(nextValues.length ? nextValues : ['absent']);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h5 className="mb-3 text-sm font-bold text-slate-950">Включення</h5>
      <div className="grid gap-2 md:grid-cols-2">
        {thyroidOptions.noduleInclusions.map((option) => (
          <label key={option.value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium">
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
      {values.includes('other') ? (
        <input value={other} onChange={(event) => onOtherChange(event.target.value)} className={`${inputClass} mt-3`} placeholder="Уточнення" />
      ) : null}
    </div>
  );
}

function Dimensions({ value, onChange }) {
  const update = (field, nextValue) => onChange({ ...value, [field]: nextValue });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ['length', 'Довжина'],
        ['thickness', 'Товщина'],
        ['width', 'Ширина'],
      ].map(([field, label]) => (
        <FormField key={field} label={label} hint="мм">
          <input
            type="number"
            min="0"
            step="0.1"
            value={value[field]}
            onChange={(event) => update(field, event.target.value)}
            className={inputClass}
          />
        </FormField>
      ))}
    </div>
  );
}

export default function ThyroidNoduleForm({ nodules, onAdd, onUpdate, onRemove }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onAdd('right')} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white">
          Додати вузол правої частки
        </button>
        <button type="button" onClick={() => onAdd('left')} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white">
          Додати вузол лівої частки
        </button>
        <button type="button" onClick={() => onAdd('isthmus')} className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          Додати вузол перешийка
        </button>
      </div>

      {!nodules.length ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Вузлові утворення не додані.</p>
      ) : null}

      {nodules.map((nodule, index) => {
        const update = (field, value) => onUpdate(nodule.id, { ...nodule, [field]: value });

        return (
          <article key={nodule.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-bold text-slate-950">Вузол {index + 1}</h4>
              <button type="button" onClick={() => onRemove(nodule.id)} className="text-sm font-semibold text-red-600">
                Видалити
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Локалізація" value={nodule.lobe} onChange={(value) => update('lobe', value)} options={thyroidOptions.noduleLobe} />
              <SelectField
                label="Рівень"
                value={nodule.location}
                onChange={(value) => update('location', value)}
                options={thyroidOptions.noduleLocation}
              />
              {nodule.location === 'other' ? (
                <FormField label="Локалізація: уточнення">
                  <input value={nodule.locationOther} onChange={(event) => update('locationOther', event.target.value)} className={inputClass} />
                </FormField>
              ) : null}
              <SelectField label="Тип" value={nodule.type} onChange={(value) => update('type', value)} options={thyroidOptions.noduleType} />
              <SelectField
                label="Ехогенність"
                value={nodule.echogenicity}
                onChange={(value) => update('echogenicity', value)}
                options={thyroidOptions.noduleEchogenicity}
              />
              <SelectField label="Форма" value={nodule.shape} onChange={(value) => update('shape', value)} options={thyroidOptions.noduleShape} />
              <SelectField
                label="Орієнтація"
                value={nodule.orientation}
                onChange={(value) => update('orientation', value)}
                options={thyroidOptions.noduleOrientation}
              />
              <SelectField label="Контур" value={nodule.contour} onChange={(value) => update('contour', value)} options={thyroidOptions.noduleContour} />
              <SelectField label="Чіткість" value={nodule.clarity} onChange={(value) => update('clarity', value)} options={thyroidOptions.clarity} />
              <SelectField
                label="Структура"
                value={nodule.structure}
                onChange={(value) => update('structure', value)}
                options={thyroidOptions.noduleStructure}
              />
              <SelectField label="Кровотік" value={nodule.bloodFlow} onChange={(value) => update('bloodFlow', value)} options={thyroidOptions.bloodFlow} />
              <SelectField label="ACR TI-RADS" value={nodule.tirads} onChange={(value) => update('tirads', value)} options={thyroidOptions.tirads} />
            </div>

            <div className="mt-2">
              <Dimensions value={nodule.dimensions} onChange={(value) => update('dimensions', value)} />
            </div>
            <InclusionField
              values={nodule.inclusions}
              other={nodule.inclusionOther}
              onChange={(values) => update('inclusions', values)}
              onOtherChange={(value) => update('inclusionOther', value)}
            />
          </article>
        );
      })}
    </div>
  );
}
