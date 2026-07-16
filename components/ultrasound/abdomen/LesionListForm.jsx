import { NumberField, TextareaField, TextField } from './AbdomenFormControls';

function createLesion() {
  return {
    id: `lesion-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    localization: '',
    length: '',
    width: '',
    description: '',
  };
}

export default function LesionListForm({ title, items, onChange }) {
  const add = () => onChange([...items, createLesion()]);
  const update = (id, next) => onChange(items.map((item) => (item.id === id ? next : item)));
  const remove = (id) => onChange(items.filter((item) => item.id !== id));

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-slate-950">{title}</h4>
        <button type="button" onClick={add} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
          Додати утворення
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-md border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Утворення {index + 1}</span>
              <button type="button" onClick={() => remove(item.id)} className="text-xs font-semibold text-red-600">
                Видалити
              </button>
            </div>
            <TextField label="Локалізація" value={item.localization} onChange={(value) => update(item.id, { ...item, localization: value })} />
            <div className="grid gap-3 md:grid-cols-2">
              <NumberField label="Довжина" value={item.length} onChange={(value) => update(item.id, { ...item, length: value })} />
              <NumberField label="Ширина" value={item.width} onChange={(value) => update(item.id, { ...item, width: value })} />
            </div>
            <TextareaField label="Опис" value={item.description} onChange={(value) => update(item.id, { ...item, description: value })} />
          </div>
        ))}
      </div>
    </section>
  );
}
