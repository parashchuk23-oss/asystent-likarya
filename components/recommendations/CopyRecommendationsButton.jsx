'use client';

export default function CopyRecommendationsButton({
  text,
  label = 'Копіювати',
  onCopied,
  disabled = false,
  variant = 'primary',
}) {
  async function handleCopy() {
    if (!text || disabled) return;

    try {
      await navigator.clipboard.writeText(text);
      onCopied?.('Скопійовано.');
    } catch {
      onCopied?.('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const className =
    variant === 'secondary'
      ? 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
      : 'rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500';

  return (
    <button type="button" onClick={handleCopy} disabled={disabled || !text} className={className}>
      {label}
    </button>
  );
}
