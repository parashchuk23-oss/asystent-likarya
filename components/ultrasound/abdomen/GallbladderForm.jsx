import { abdomenOptions } from '../../../data/ultrasound/abdomenOptions';
import { ModeToggle, NumberField, SelectField, TextField } from './AbdomenFormControls';

function createStone() {
  return { id: `stone-${Date.now()}-${Math.random().toString(16).slice(2)}`, size: '', shadow: 'yes', mobile: 'yes' };
}

function createPolyp() {
  return { id: `polyp-${Date.now()}-${Math.random().toString(16).slice(2)}`, size: '', localization: '' };
}

export default function GallbladderForm({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const addStone = () => update('stones', [...data.stones, createStone()]);
  const addPolyp = () => update('polyps', [...data.polyps, createPolyp()]);
  const updateStone = (id, next) => update('stones', data.stones.map((stone) => (stone.id === id ? next : stone)));
  const updatePolyp = (id, next) => update('polyps', data.polyps.map((polyp) => (polyp.id === id ? next : polyp)));

  return (
    <div>
      <ModeToggle value={data.mode} onChange={(value) => update('mode', value)} />
      <div className="grid gap-3 md:grid-cols-2">
        <SelectField label="Форма" value={data.shape} onChange={(value) => update('shape', value)} options={abdomenOptions.gallbladderShape} />
        <SelectField label="Перегин" value={data.inflection} onChange={(value) => update('inflection', value)} options={abdomenOptions.gallbladderInflection} />
        <NumberField label="Довжина" value={data.length} onChange={(value) => update('length', value)} />
        <NumberField label="Ширина" value={data.width} onChange={(value) => update('width', value)} />
        <NumberField label="Стінка" value={data.wall} onChange={(value) => update('wall', value)} />
        <SelectField label="Вміст" value={data.content} onChange={(value) => update('content', value)} options={abdomenOptions.gallbladderContent} />
      </div>

      {data.mode === 'changed' ? (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-950">Конкременти</h4>
              <button type="button" onClick={addStone} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
                Додати камінь
              </button>
            </div>
            <div className="space-y-3">
              {data.stones.map((stone, index) => (
                <div key={stone.id} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Камінь {index + 1}</span>
                    <button type="button" onClick={() => update('stones', data.stones.filter((item) => item.id !== stone.id))} className="text-xs font-semibold text-red-600">
                      Видалити
                    </button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <NumberField label="Розмір" value={stone.size} onChange={(value) => updateStone(stone.id, { ...stone, size: value })} />
                    <SelectField label="Ехотінь" value={stone.shadow} onChange={(value) => updateStone(stone.id, { ...stone, shadow: value })} options={abdomenOptions.yesNo} />
                    <SelectField label="Рухомість" value={stone.mobile} onChange={(value) => updateStone(stone.id, { ...stone, mobile: value })} options={abdomenOptions.yesNo} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-950">Поліпи</h4>
              <button type="button" onClick={addPolyp} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
                Додати поліп
              </button>
            </div>
            <div className="space-y-3">
              {data.polyps.map((polyp, index) => (
                <div key={polyp.id} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Поліп {index + 1}</span>
                    <button type="button" onClick={() => update('polyps', data.polyps.filter((item) => item.id !== polyp.id))} className="text-xs font-semibold text-red-600">
                      Видалити
                    </button>
                  </div>
                  <NumberField label="Розмір" value={polyp.size} onChange={(value) => updatePolyp(polyp.id, { ...polyp, size: value })} />
                  <TextField label="Локалізація" value={polyp.localization} onChange={(value) => updatePolyp(polyp.id, { ...polyp, localization: value })} />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
