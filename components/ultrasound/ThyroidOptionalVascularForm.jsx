import FormField from '../FormField';
import { inputClass, textareaClass } from '../formStyles';

export default function ThyroidOptionalVascularForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateGroup = (group, field, value) => update(group, { ...data[group], [field]: value });

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 p-4">
        <label className="flex items-center gap-3 text-sm font-bold text-slate-950">
          <input
            type="checkbox"
            checked={data.jugularEnabled}
            onChange={(event) => update('jugularEnabled', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Внутрішні яремні вени
        </label>
        {data.jugularEnabled ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <FormField className="mb-2" label="Діаметр праворуч" hint="мм">
              <input value={data.jugular.rightDiameter} onChange={(event) => updateGroup('jugular', 'rightDiameter', event.target.value)} className={inputClass} />
            </FormField>
            <FormField className="mb-2" label="Діаметр ліворуч" hint="мм">
              <input value={data.jugular.leftDiameter} onChange={(event) => updateGroup('jugular', 'leftDiameter', event.target.value)} className={inputClass} />
            </FormField>
            <FormField className="mb-2" label="Стан">
              <select value={data.jugular.dilation} onChange={(event) => updateGroup('jugular', 'dilation', event.target.value)} className={inputClass}>
                <option value="не розширені">не розширені</option>
                <option value="розширені">розширені</option>
              </select>
            </FormField>
            <FormField className="mb-2" label="Компресія">
              <select value={data.jugular.compression} onChange={(event) => updateGroup('jugular', 'compression', event.target.value)} className={inputClass}>
                <option value="стискаються повністю">стискаються повністю</option>
                <option value="стискаються частково">стискаються частково</option>
                <option value="не стискаються">не стискаються</option>
              </select>
            </FormField>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 p-4">
        <label className="flex items-center gap-3 text-sm font-bold text-slate-950">
          <input
            type="checkbox"
            checked={data.carotidEnabled}
            onChange={(event) => update('carotidEnabled', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          Загальні сонні артерії
        </label>
        {data.carotidEnabled ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <FormField className="mb-2" label="Хід">
              <select value={data.carotid.course} onChange={(event) => updateGroup('carotid', 'course', event.target.value)} className={inputClass}>
                <option value="прямолінійний">прямолінійний</option>
                <option value="звивистий">звивистий</option>
              </select>
            </FormField>
            <FormField className="mb-2" label="Інтима">
              <select value={data.carotid.intima} onChange={(event) => updateGroup('carotid', 'intima', event.target.value)} className={inputClass}>
                <option value="чітко диференціюється">чітко диференціюється</option>
                <option value="диференціація порушена">диференціація порушена</option>
                <option value="потовщена">потовщена</option>
                <option value="не потовщена">не потовщена</option>
              </select>
            </FormField>
            <FormField className="mb-2" label="КІМ праворуч" hint="мм">
              <input value={data.carotid.cimtRight} onChange={(event) => updateGroup('carotid', 'cimtRight', event.target.value)} className={inputClass} />
            </FormField>
            <FormField className="mb-2" label="КІМ ліворуч" hint="мм">
              <input value={data.carotid.cimtLeft} onChange={(event) => updateGroup('carotid', 'cimtLeft', event.target.value)} className={inputClass} />
            </FormField>
            <FormField className="mb-2" label="Біфуркація">
              <select value={data.carotid.bifurcation} onChange={(event) => updateGroup('carotid', 'bifurcation', event.target.value)} className={inputClass}>
                <option value="без локального потовщення">без локального потовщення</option>
                <option value="локальне потовщення праворуч">локальне потовщення праворуч</option>
                <option value="локальне потовщення ліворуч">локальне потовщення ліворуч</option>
                <option value="локальне потовщення з обох боків">локальне потовщення з обох боків</option>
              </select>
            </FormField>
            <FormField className="mb-2" label="Бляшки">
              <select value={data.carotid.plaques} onChange={(event) => updateGroup('carotid', 'plaques', event.target.value)} className={inputClass}>
                <option value="notDetected">не виявлені</option>
                <option value="detected">виявлені</option>
              </select>
            </FormField>
            {data.carotid.plaques === 'detected' ? (
              <div className="md:col-span-2">
                <FormField className="mb-2" label="Опис бляшок">
                  <textarea
                    value={data.carotid.plaqueDescription}
                    onChange={(event) => updateGroup('carotid', 'plaqueDescription', event.target.value)}
                    rows={3}
                    className={textareaClass}
                  />
                </FormField>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
