import { renalSelectOptions } from '../../../data/ultrasound/renalOptions';
import { RenalNumberField, RenalSelectField, RenalTextareaField } from './RenalFormControls';

export default function RenalUrinaryTractForm({ ureters, arteries, bladder, onUretersChange, onArteriesChange, onBladderChange }) {
  const updateUreters = (field, value) => onUretersChange({ ...ureters, [field]: value });
  const updateArteries = (field, value) => onArteriesChange({ ...arteries, [field]: value });
  const updateBladder = (field, value) => onBladderChange({ ...bladder, [field]: value });

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-base font-bold text-slate-950">Сечоводи</h4>
        <div className="mt-3">
          <RenalSelectField label="Стан" value={ureters.status} onChange={(value) => updateUreters('status', value)} options={renalSelectOptions.uretersStatus} />
          {ureters.status === 'dilated' ? (
            <RenalTextareaField label="Опис розширення" value={ureters.details} onChange={(value) => updateUreters('details', value)} placeholder="сторона, діаметр, рівень, причина якщо видно" />
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-base font-bold text-slate-950">Ниркові артерії</h4>
        <div className="mt-3">
          <RenalSelectField label="Дані за стеноз" value={arteries.stenosis} onChange={(value) => updateArteries('stenosis', value)} options={renalSelectOptions.arteryStenosis} />
          {arteries.stenosis === 'yes' ? (
            <RenalTextareaField label="Опис" value={arteries.details} onChange={(value) => updateArteries('details', value)} placeholder="сторона, локалізація, додаткові ознаки" />
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="text-base font-bold text-slate-950">Сечовий міхур</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <RenalNumberField label="Об'єм" unit="мл" value={bladder.volume} onChange={(value) => updateBladder('volume', value)} />
          <RenalNumberField label="Стінка" value={bladder.wallThickness} onChange={(value) => updateBladder('wallThickness', value)} norm="до 3 мм при наповненому міхурі" />
          <RenalNumberField label="Залишкова сеча" unit="мл" value={bladder.residualVolume} onChange={(value) => updateBladder('residualVolume', value)} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <RenalSelectField label="Стінки" value={bladder.wallStatus} onChange={(value) => updateBladder('wallStatus', value)} options={renalSelectOptions.bladderWall} />
          <RenalSelectField label="Вміст" value={bladder.content} onChange={(value) => updateBladder('content', value)} options={renalSelectOptions.bladderContent} />
          <RenalSelectField label="Патологічні утворення / конкременти" value={bladder.pathologyStatus} onChange={(value) => updateBladder('pathologyStatus', value)} options={renalSelectOptions.findingStatus} />
          <RenalSelectField label="Вічка сечоводів" value={bladder.uretericOrifices} onChange={(value) => updateBladder('uretericOrifices', value)} options={renalSelectOptions.uretericOrifices} />
        </div>
        {bladder.content === 'heterogeneous' ? (
          <RenalTextareaField label="Причина неоднорідності вмісту" value={bladder.contentDetails} onChange={(value) => updateBladder('contentDetails', value)} placeholder="суспензія, згустки, осад" />
        ) : null}
        {bladder.pathologyStatus === 'present' ? (
          <RenalTextareaField label="Опис патологічних утворень / конкрементів" value={bladder.pathologyDetails} onChange={(value) => updateBladder('pathologyDetails', value)} placeholder="локалізація, розміри, рухомість" />
        ) : null}
      </section>
    </div>
  );
}
