'use client';

import { COPAYMENT_FILTERS, MEDICINE_SORTS } from '../../utils/availableMedicines';

export default function AvailableMedicinesToolbar({
  query,
  onQueryChange,
  copaymentFilter,
  onCopaymentFilterChange,
  sortMode,
  onSortModeChange,
  rowsPerPage,
  onRowsPerPageChange,
}) {
  return (
    <div className="space-y-4 rounded-md border border-slate-200 bg-white p-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          Пошук
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Пошук за діючою речовиною або торговою назвою"
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-800">Фільтр</span>
          <select
            value={copaymentFilter}
            onChange={(event) => onCopaymentFilterChange(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value={COPAYMENT_FILTERS.all}>Усі препарати</option>
            <option value={COPAYMENT_FILTERS.free}>Без доплати</option>
            <option value={COPAYMENT_FILTERS.paid}>З доплатою</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-800">Сортування</span>
          <select
            value={sortMode}
            onChange={(event) => onSortModeChange(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value={MEDICINE_SORTS.default}>За діючою речовиною</option>
            <option value={MEDICINE_SORTS.copaymentAsc}>Від найменшої доплати</option>
            <option value={MEDICINE_SORTS.copaymentDesc}>Від найбільшої доплати</option>
            <option value={MEDICINE_SORTS.activeIngredient}>За діючою речовиною</option>
            <option value={MEDICINE_SORTS.tradeName}>За торговою назвою</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-800">Рядків на сторінці</span>
          <select
            value={rowsPerPage}
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
    </div>
  );
}
