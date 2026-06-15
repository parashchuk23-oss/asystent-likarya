'use client';

export default function ConclusionEditor({ conclusion, onChange }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="mb-3 border-b border-blue-100 pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Документ
        </p>
        <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950">Заключення</h2>
        <p className="mt-1 text-sm text-slate-500">
          Заключення формується лікарем на основі введених даних.
        </p>
      </div>

      <textarea
        value={conclusion}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Тут буде текст заключення..."
        className="min-h-[520px] w-full resize-y rounded-md border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </section>
  );
}
