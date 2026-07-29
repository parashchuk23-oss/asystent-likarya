import { renalSelectOptions } from '../../../data/ultrasound/renalOptions';
import { RenalNumberField, RenalSelectField, RenalTextareaField, RenalTextField } from './RenalFormControls';

export default function RenalKidneyForm({ title, data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h4 className="text-base font-bold text-slate-950">{title}</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <RenalSelectField label="Розташування" value={data.position} onChange={(value) => update('position', value)} options={renalSelectOptions.kidneyPosition} />
          {data.position === 'moderatePtosis' ? (
            <RenalTextField label="Уточнення опущення" value={data.ptosisNote} onChange={(value) => update('ptosisNote', value)} placeholder="наприклад: до 25 мм" />
          ) : null}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-sm font-bold text-slate-950">Розміри</h4>
        <p className="mt-1 text-xs font-medium text-slate-500">Орієнтир норми: 90-120 x 40-60 мм. У протокол ця підказка не додається.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <RenalNumberField label="Довжина" value={data.length} onChange={(value) => update('length', value)} norm="90-120 мм" />
          <RenalNumberField label="Ширина" value={data.width} onChange={(value) => update('width', value)} norm="40-60 мм" />
          <RenalNumberField label="Паренхіма" value={data.parenchyma} onChange={(value) => update('parenchyma', value)} norm="орієнтовно 14-20 мм" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <RenalSelectField label="Контури" value={data.contours} onChange={(value) => update('contours', value)} options={renalSelectOptions.contours} />
        <RenalSelectField label="Чіткість контурів" value={data.contourClarity} onChange={(value) => update('contourClarity', value)} options={renalSelectOptions.contourClarity} />
        <RenalSelectField label="Корково-мозкова диференціація" value={data.corticomedullary} onChange={(value) => update('corticomedullary', value)} options={renalSelectOptions.corticomedullary} />
        <RenalSelectField label="Нирковий синус" value={data.sinusEchogenicity} onChange={(value) => update('sinusEchogenicity', value)} options={renalSelectOptions.sinusEchogenicity} />
        <RenalSelectField label="Судинний малюнок" value={data.vascularPattern} onChange={(value) => update('vascularPattern', value)} options={renalSelectOptions.vascularPattern} />
        <RenalSelectField label="Чашечки, лоханка" value={data.collectingSystem} onChange={(value) => update('collectingSystem', value)} options={renalSelectOptions.collectingSystem} />
      </div>

      {data.collectingSystem === 'dilated' ? (
        <RenalTextareaField label="Опис розширення ЧМС" value={data.collectingSystemDetails} onChange={(value) => update('collectingSystemDetails', value)} placeholder="ступінь, сторона, лоханка, чашечки" />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <RenalSelectField label="Додаткові утворення" value={data.lesionsStatus} onChange={(value) => update('lesionsStatus', value)} options={renalSelectOptions.findingStatus} />
        <RenalSelectField label="Конкременти" value={data.stonesStatus} onChange={(value) => update('stonesStatus', value)} options={renalSelectOptions.findingStatus} />
      </div>

      {data.lesionsStatus === 'present' ? (
        <RenalTextareaField label="Опис додаткових утворень" value={data.lesionsDetails} onChange={(value) => update('lesionsDetails', value)} placeholder="локалізація, розміри, ехоструктура" />
      ) : null}

      {data.stonesStatus === 'present' ? (
        <RenalTextareaField label="Опис конкрементів" value={data.stonesDetails} onChange={(value) => update('stonesDetails', value)} placeholder="локалізація, розміри, ехо-тінь" />
      ) : null}

      <RenalSelectField
        label="Поодинокі гіперехогенні включення до 2 мм без ехо-тіні на фоні ЧМС"
        value={data.microInclusions}
        onChange={(value) => update('microInclusions', value)}
        options={renalSelectOptions.yesNo}
      />
    </div>
  );
}
