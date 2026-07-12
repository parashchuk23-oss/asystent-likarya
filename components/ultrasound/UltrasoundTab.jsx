'use client';

import ThyroidUltrasoundModule from './ThyroidUltrasoundModule';

export default function UltrasoundTab() {
  return (
    <div className="space-y-4">
      <article className="overflow-hidden rounded-lg border border-teal-300 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">УЗД</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">Щитоподібна залоза</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Структурований протокол із розрахунком об’єму, описом вузлів, лімфатичних вузлів,
            висновком та рекомендаціями для подальшого редагування лікарем.
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <ThyroidUltrasoundModule />
        </div>
      </article>
    </div>
  );
}
