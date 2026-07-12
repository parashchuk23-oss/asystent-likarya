import { thyroidOptions } from '../../data/ultrasound/thyroidOptions';
import FormField from '../FormField';
import { inputClass } from '../formStyles';

function DimensionInputs({ value, onChange }) {
  const update = (field, nextValue) => onChange({ ...value, [field]: nextValue });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FormField label="Довжина" hint="мм">
        <input type="number" min="0" step="0.1" value={value.length} onChange={(event) => update('length', event.target.value)} className={inputClass} />
      </FormField>
      <FormField label="Товщина" hint="мм">
        <input type="number" min="0" step="0.1" value={value.thickness} onChange={(event) => update('thickness', event.target.value)} className={inputClass} />
      </FormField>
      <FormField label="Ширина" hint="мм">
        <input type="number" min="0" step="0.1" value={value.width} onChange={(event) => update('width', event.target.value)} className={inputClass} />
      </FormField>
    </div>
  );
}

export default function ThyroidPerithyroidForm({ items, onAdd, onUpdate, onRemove }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onAdd} className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white">
        Додати перитиреоїдне утворення
      </button>

      {!items.length ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Додаткові перитиреоїдні утворення не додані.</p>
      ) : null}

      {items.map((item, index) => {
        const update = (field, value) => onUpdate(item.id, { ...item, [field]: value });
        const toggleDifferential = (value) => {
          update('differential', item.differential.includes(value) ? item.differential.filter((entry) => entry !== value) : [...item.differential, value]);
        };

        return (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-bold text-slate-950">Перитиреоїдне утворення {index + 1}</h4>
              <button type="button" onClick={() => onRemove(item.id)} className="text-sm font-semibold text-red-600">
                Видалити
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Локалізація">
                <input value={item.localization} onChange={(event) => update('localization', event.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Форма">
                <input value={item.shape} onChange={(event) => update('shape', event.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Ехогенність">
                <input value={item.echogenicity} onChange={(event) => update('echogenicity', event.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Контури">
                <input value={item.contours} onChange={(event) => update('contours', event.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Кровотік">
                <input value={item.bloodFlow} onChange={(event) => update('bloodFlow', event.target.value)} className={inputClass} />
              </FormField>
              <FormField label="Компресія">
                <select value={item.compression} onChange={(event) => update('compression', event.target.value)} className={inputClass}>
                  <option value="стискається">стискається</option>
                  <option value="не стискається">не стискається</option>
                  <option value="не оцінено">не оцінено</option>
                </select>
              </FormField>
            </div>

            <DimensionInputs value={item.dimensions} onChange={(value) => update('dimensions', value)} />

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="mb-3 text-sm font-bold text-slate-950">Диференційний ряд</h5>
              <div className="grid gap-2 md:grid-cols-2">
                {thyroidOptions.differential.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={item.differential.includes(option.value)}
                      onChange={() => toggleDifferential(option.value)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {item.differential.includes('other') ? (
                <input
                  value={item.differentialOther}
                  onChange={(event) => update('differentialOther', event.target.value)}
                  className={`${inputClass} mt-3`}
                  placeholder="Інший варіант"
                />
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
