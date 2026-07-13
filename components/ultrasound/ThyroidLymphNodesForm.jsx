import { thyroidOptions } from '../../data/ultrasound/thyroidOptions';
import FormField from '../FormField';
import { inputClass } from '../formStyles';

export default function ThyroidLymphNodesForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const toggleZone = (zone) => {
    update('zones', data.zones.includes(zone) ? data.zones.filter((item) => item !== zone) : [...data.zones, zone]);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <FormField className="mb-2" label="Стан">
          <select value={data.status} onChange={(event) => update('status', event.target.value)} className={inputClass}>
            <option value="notEnlarged">не збільшені</option>
            <option value="enlarged">збільшені</option>
          </select>
        </FormField>
        <FormField className="mb-2" label="Максимальна коротка вісь" hint="мм">
          <input
            type="number"
            min="0"
            step="0.1"
            value={data.shortAxisMax}
            onChange={(event) => update('shortAxisMax', event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {thyroidOptions.lymphZones.map((zone) => (
          <label key={zone.value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={data.zones.includes(zone.value)}
              onChange={() => toggleZone(zone.value)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            {zone.label}
          </label>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <FormField className="mb-2" label="Структура">
          <select value={data.structure} onChange={(event) => update('structure', event.target.value)} className={inputClass}>
            <option value="без особливостей">без особливостей</option>
            <option value="помірні реактивні зміни">помірні реактивні зміни</option>
            <option value="знижена ехогенність">знижена ехогенність</option>
            <option value="диференціація збережена">диференціація збережена</option>
            <option value="диференціація нечітка">диференціація нечітка</option>
            <option value="диференціація порушена">диференціація порушена</option>
          </select>
        </FormField>
        <FormField className="mb-2" label="Кровотік">
          <select value={data.bloodFlow} onChange={(event) => update('bloodFlow', event.target.value)} className={inputClass}>
            <option value="центральний">центральний</option>
            <option value="периферичний">периферичний</option>
            <option value="не визначається">не визначається</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}
