'use client';

import { useState } from 'react';
import ReferralTemplateBuilder from './ReferralTemplateBuilder';

const copyToClipboard = async (text) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(text);
  return true;
};

export default function RegulationSection({ block }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [copied, setCopied] = useState(false);

  const sourceLine = `${block.pdfSection}, стор. ${block.pdfPages}`;
  const criteriaText = [
    `${block.name}.`,
    `Напрям: ${block.direction}.`,
    `Джерело: ${sourceLine}.`,
    ...block.criteria.map((criterion) => `- ${criterion}`),
  ].join('\n');

  const handleCopyCriteria = async () => {
    const ok = await copyToClipboard(criteriaText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const toggleCriterion = (criterion) => {
    setSelectedCriteria((current) =>
      current.includes(criterion) ? current.filter((item) => item !== criterion) : [...current, criterion],
    );
  };

  return (
    <article
      id={block.id}
      className={`scroll-mt-24 rounded-lg border bg-white shadow-sm transition ${
        isOpen
          ? 'border-teal-500 bg-teal-50 shadow-sm shadow-slate-200/60'
          : 'border-teal-300 shadow-sm shadow-slate-200/60 hover:border-teal-500'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-teal-50/40"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{block.direction}</p>
          <h3 className={`mt-2 text-lg font-bold ${isOpen ? 'text-teal-900' : 'text-slate-950'}`}>{block.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {block.decisionType} · {sourceLine}
          </p>
        </div>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xl font-bold transition ${
            isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
          }`}
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-teal-300 bg-white p-4">
          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Критерії</h4>
              <ul className="mt-3 space-y-2">
                {block.criteria.map((criterion) => (
                  <li key={criterion}>
                    <label className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCriteria.includes(criterion)}
                        onChange={() => toggleCriterion(criterion)}
                        className="mt-1 h-4 w-4 shrink-0"
                      />
                      <span>{criterion}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {block.notes?.length > 0 && (
                <div className="mt-4 rounded-md border border-amber-100 bg-amber-50 px-3 py-2">
                  <p className="text-sm font-bold text-amber-900">Примітка</p>
                  <ul className="mt-1 space-y-1 text-sm leading-6 text-amber-900">
                    {block.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Що оцінити лікарю</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {block.assessment.map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {item}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyCriteria}
                className="mt-4 w-full rounded-md border border-teal-200 bg-white px-3 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
              >
                {copied ? 'Критерії скопійовано' : 'Копіювати критерії'}
              </button>
            </aside>
          </div>

          <ReferralTemplateBuilder criterionBlock={block} selectedCriteria={selectedCriteria} />
        </div>
      )}
    </article>
  );
}
