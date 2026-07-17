import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { NumberField, SelectField } from './AbdomenFormControls';

export default function CommonBileDuctForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <NumberField label="Діаметр" value={data.diameter} onChange={(value) => update('diameter', value)} norm="до 6 мм" />
      <SelectField label="Просвіт" value={data.lumen} onChange={(value) => update('lumen', value)} options={abdomenOptions.commonBileDuctLumen} />
    </div>
  );
}
