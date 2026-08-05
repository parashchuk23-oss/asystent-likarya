'use client';

import { useMemo, useState } from 'react';

const copyToClipboard = async (text) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(text);
  return true;
};

export default function ReferralTemplateBuilder({ criterionBlock, selectedCriteria }) {
  const [copied, setCopied] = useState(false);

  const referralText = useMemo(() => {
    const selectedText = selectedCriteria.length
      ? selectedCriteria.map((criterion) => `- ${criterionBlock.name}. ${criterion}`).join('\n')
      : 'критерії не позначені лікарем';

    return [
      'Направлення на госпіталізацію',
      '',
      `Підстава: критерії госпіталізації МОЗ України, наказ №1044 від 30.07.2026, ${criterionBlock.pdfSection}, стор. ${criterionBlock.pdfPages}.`,
      '',
      `Виявлені критерії:\n${selectedText}`,
    ].join('\n');
  }, [criterionBlock, selectedCriteria]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(referralText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Текст для копіювання</p>
      <textarea
        value={referralText}
        readOnly
        rows={selectedCriteria.length ? Math.min(10, selectedCriteria.length + 6) : 6}
        className="mt-3 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm leading-6 text-slate-800"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        {copied ? 'Скопійовано' : 'Копіювати направлення'}
      </button>
    </div>
  );
}
