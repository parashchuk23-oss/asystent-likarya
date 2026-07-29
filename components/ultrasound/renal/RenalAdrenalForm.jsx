import { renalSelectOptions } from '../../../data/ultrasound/renalOptions';
import { RenalSelectField, RenalTextareaField } from './RenalFormControls';

export default function RenalAdrenalForm({ title, data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      <RenalSelectField label={title} value={data.status} onChange={(value) => update('status', value)} options={renalSelectOptions.adrenalStatus} />
      {data.status === 'changed' ? (
        <RenalTextareaField label="Опис змін" value={data.details} onChange={(value) => update('details', value)} placeholder="розміри, структура, локалізація" />
      ) : null}
    </div>
  );
}
