'use client';

export default function MentalHealthSkillEditor({ value, onChange, onRestore }) {
  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[26rem] w-full resize-y rounded-md border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900 shadow-sm shadow-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="button"
        onClick={onRestore}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
      >
        Відновити початковий текст
      </button>
    </div>
  );
}
