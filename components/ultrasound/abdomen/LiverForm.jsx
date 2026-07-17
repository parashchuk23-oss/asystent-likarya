import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { CheckboxGroup, NumberField, SelectField, TextField } from './AbdomenFormControls';

export default function LiverForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <NumberField label="Права частка" value={data.rightLobeLength} onChange={(value) => update('rightLobeLength', value)} norm="до 155 мм" />
        <NumberField label="Ліва частка" value={data.leftLobeLength} onChange={(value) => update('leftLobeLength', value)} norm="до 80 мм" />
        <NumberField label="Хвостата частка" value={data.caudateLobe} onChange={(value) => update('caudateLobe', value)} norm="до 35 мм" />
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField label="Контури" value={data.contours} onChange={(value) => update('contours', value)} options={abdomenOptions.contours} />
          <SelectField label="Ехогенність" value={data.echogenicity} onChange={(value) => update('echogenicity', value)} options={abdomenOptions.echogenicity} />
          <SelectField label="Структура" value={data.structure} onChange={(value) => update('structure', value)} options={abdomenOptions.structure} />
        </div>

        {data.structure === 'heterogeneous' ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <h4 className="mb-2 text-sm font-bold text-slate-950">Ознаки неоднорідності</h4>
            <CheckboxGroup options={abdomenOptions.liverChanges} values={data.changes} onChange={(values) => update('changes', values)} />
            {data.changes.includes('other') ? (
              <div className="mt-3">
                <TextField label="Інше" value={data.otherChange} onChange={(value) => update('otherChange', value)} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <NumberField label="Портальна вена" value={data.portalVein} onChange={(value) => update('portalVein', value)} norm="до 13 мм" />
        <SelectField
          label="Печінкові вени"
          value={data.hepaticVeins}
          onChange={(value) => update('hepaticVeins', value)}
          options={[
            { value: 'notDilated', label: 'не розширені' },
            { value: 'dilated', label: 'розширені' },
          ]}
        />
        <SelectField
          label="Жовчні протоки"
          value={data.bileDucts}
          onChange={(value) => update('bileDucts', value)}
          options={[
            { value: 'notDilated', label: 'не розширені' },
            { value: 'dilated', label: 'розширені' },
          ]}
        />
      </div>
    </div>
  );
}
