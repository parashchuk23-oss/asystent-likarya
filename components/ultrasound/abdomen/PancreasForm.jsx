import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { NumberField, SelectField, TextField } from './AbdomenFormControls';
import LesionListForm from './LesionListForm';

export default function PancreasForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        <NumberField label="Головка" value={data.head} onChange={(value) => update('head', value)} />
        <NumberField label="Тіло" value={data.body} onChange={(value) => update('body', value)} />
        <NumberField label="Хвіст" value={data.tail} onChange={(value) => update('tail', value)} />
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField label="Контури" value={data.contours} onChange={(value) => update('contours', value)} options={abdomenOptions.contours} />
          <SelectField label="Ехогенність" value={data.echogenicity} onChange={(value) => update('echogenicity', value)} options={abdomenOptions.echogenicity} />
          <SelectField label="Структура" value={data.structure} onChange={(value) => update('structure', value)} options={abdomenOptions.structure} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField label="Вірсунгова протока" value={data.wirsung} onChange={(value) => update('wirsung', value)} />
          <TextField
            label="Парапанкреатична клітковина"
            value={data.peripancreaticTissue}
            onChange={(value) => update('peripancreaticTissue', value)}
          />
        </div>
        <LesionListForm title="Об’ємні утворення" items={data.lesions} onChange={(items) => update('lesions', items)} />
      </div>
    </div>
  );
}
