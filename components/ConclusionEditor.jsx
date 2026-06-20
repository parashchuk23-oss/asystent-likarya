'use client';

import AccordionSection from './AccordionSection';

export default function ConclusionEditor({ conclusion, onChange, isOpen, onToggle }) {
  return (
    <AccordionSection
      id="conclusion"
      title="Заключення"
      subtitle="Заключення формується лікарем на основі введених даних"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <textarea
        value={conclusion}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Тут буде текст заключення..."
        className="min-h-[520px] w-full resize-y rounded-md border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </AccordionSection>
  );
}
