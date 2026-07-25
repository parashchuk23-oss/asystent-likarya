'use client';

export default function AvailableMedicinesPagination({
  page,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) {
  const firstVisible = totalItems > 0 ? startIndex + 1 : 0;
  const lastVisible = Math.min(endIndex, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Показано {firstVisible}–{lastVisible} із {totalItems} препаратів
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Назад
        </button>
        <span className="min-w-20 text-center font-semibold text-slate-900">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Далі
        </button>
      </div>
    </div>
  );
}
