import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { NumberField, SelectField } from './AbdomenFormControls';
import LesionListForm from './LesionListForm';

export default function SpleenForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <NumberField label="Довжина" value={data.length} onChange={(value) => update('length', value)} norm="до 120 мм" />
        <NumberField label="Ширина" value={data.width} onChange={(value) => update('width', value)} norm="до 60 мм" />
        <NumberField label="Селезінкова вена" value={data.splenicVein} onChange={(value) => update('splenicVein', value)} norm="до 10 мм" />
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField label="Ехогенність" value={data.echogenicity} onChange={(value) => update('echogenicity', value)} options={abdomenOptions.echogenicity} />
          <SelectField label="Структура" value={data.structure} onChange={(value) => update('structure', value)} options={abdomenOptions.structure} />
        </div>
        <LesionListForm title="Додаткові утворення" items={data.lesions} onChange={(items) => update('lesions', items)} />
      </div>
    </div>
  );
}
