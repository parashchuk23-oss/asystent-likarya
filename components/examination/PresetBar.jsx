import { examinationPresets } from '../../data/examination/presets';

export default function PresetBar({ onApplyPreset }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Швидкі набори</p>
        <h3 className="mt-1 text-base font-semibold text-slate-950">Типові сценарії прийому</h3>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {examinationPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50"
          >
            <span className="block text-sm font-semibold text-slate-950">{preset.title}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
