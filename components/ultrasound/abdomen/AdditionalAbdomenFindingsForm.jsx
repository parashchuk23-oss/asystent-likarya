import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { SelectField, TextareaField, TextField } from './AbdomenFormControls';

export default function AdditionalAbdomenFindingsForm({ freeFluid, lymphNodes, hollowOrgans, onFreeFluidChange, onLymphNodesChange, onHollowOrgansChange }) {
  const updateFreeFluid = (field, value) => onFreeFluidChange({ ...freeFluid, [field]: value });
  const updateLymphNodes = (field, value) => onLymphNodesChange({ ...lymphNodes, [field]: value });

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <h4 className="mb-3 font-bold text-slate-950">Вільна рідина</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <SelectField label="Стан" value={freeFluid.status} onChange={(value) => updateFreeFluid('status', value)} options={abdomenOptions.yesNo} />
          {freeFluid.status === 'yes' ? (
            <TextField label="Локалізація" value={freeFluid.localization} onChange={(value) => updateFreeFluid('localization', value)} />
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <h4 className="mb-3 font-bold text-slate-950">Лімфовузли</h4>
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField label="Стан" value={lymphNodes.status} onChange={(value) => updateLymphNodes('status', value)} options={abdomenOptions.yesNo} />
          {lymphNodes.status === 'yes' ? (
            <>
              <TextField label="Розміри" value={lymphNodes.size} onChange={(value) => updateLymphNodes('size', value)} />
              <TextField label="Локалізація" value={lymphNodes.localization} onChange={(value) => updateLymphNodes('localization', value)} />
            </>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <h4 className="mb-3 font-bold text-slate-950">Порожнисті органи</h4>
        <TextareaField
          label="Вільний опис"
          value={hollowOrgans.text}
          onChange={(value) => onHollowOrgansChange({ ...hollowOrgans, text: value })}
          placeholder="Наприклад: без видимих патологічних змін у доступних для огляду відділах"
        />
      </section>
    </div>
  );
}
