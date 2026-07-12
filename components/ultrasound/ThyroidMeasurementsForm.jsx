import { thyroidOptions } from '../../data/ultrasound/thyroidOptions';
import { formatDecimal, getCalculatedVolumes, validatePositiveNumber } from '../../utils/ultrasound/thyroidCalculations';
import FormField from '../FormField';
import { inputClass } from '../formStyles';

function NumberField({ label, value, onChange, max = 200 }) {
  return (
    <FormField label={label} hint="мм" error={validatePositiveNumber(value, { max })}>
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

function LobeFields({ title, value, volume, onChange }) {
  const update = (field, nextValue) => onChange({ ...value, [field]: nextValue });

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-semibold text-slate-950">{title}</h4>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          {volume ? `${formatDecimal(volume)} см³` : 'об’єм —'}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <NumberField label="Довжина" value={value.length} onChange={(nextValue) => update('length', nextValue)} />
        <NumberField label="Товщина" value={value.thickness} onChange={(nextValue) => update('thickness', nextValue)} />
        <NumberField label="Ширина" value={value.width} onChange={(nextValue) => update('width', nextValue)} />
      </div>
    </div>
  );
}

export default function ThyroidMeasurementsForm({ data, onChange }) {
  const volumes = getCalculatedVolumes(data);
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <LobeFields title="Права частка" value={data.right} volume={volumes.rightVolume} onChange={(value) => update('right', value)} />
        <LobeFields title="Ліва частка" value={data.left} volume={volumes.leftVolume} onChange={(value) => update('left', value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <NumberField
          label="Перешийок"
          value={data.isthmus.thickness}
          onChange={(value) => update('isthmus', { ...data.isthmus, thickness: value })}
          max={80}
        />
        <FormField label="Статус перешийка">
          <select
            value={data.isthmus.status}
            onChange={(event) => update('isthmus', { ...data.isthmus, status: event.target.value })}
            className={inputClass}
          >
            {thyroidOptions.isthmusStatus.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Сумарний об’єм">
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
            {volumes.totalVolume ? `${formatDecimal(volumes.totalVolume)} см³` : 'Буде розраховано автоматично'}
          </div>
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Статус сумарного об’єму">
          <select
            value={data.totalVolumeStatus}
            onChange={(event) => update('totalVolumeStatus', event.target.value)}
            className={inputClass}
          >
            {thyroidOptions.volumeStatus.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Збільшена приблизно на" hint="% від обраної норми, необов’язково">
          <input
            type="number"
            min="0"
            step="1"
            value={data.enlargementPercent}
            onChange={(event) => update('enlargementPercent', event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>
    </div>
  );
}
