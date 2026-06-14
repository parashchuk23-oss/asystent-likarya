'use client';

export default function ConclusionEditor({ conclusion, onChange }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-slate-900">Заключення</h2>
        <p className="mt-1 text-sm text-slate-500">
          На Етапі 1 це редаговане поле. AI буде підключено на наступному етапі.
        </p>
      </div>

      <textarea
        value={conclusion}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Тут буде текст заключення..."
        className="min-h-[520px] w-full resize-y rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </section>
  );
}
