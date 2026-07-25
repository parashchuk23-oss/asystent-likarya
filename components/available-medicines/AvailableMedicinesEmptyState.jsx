'use client';

export default function AvailableMedicinesEmptyState({ hasData, hasFilters }) {
  const message = hasData
    ? 'За вашим запитом препаратів не знайдено.'
    : 'Перелік препаратів тимчасово недоступний.';

  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
      <p className="font-semibold text-slate-800">{message}</p>
      {!hasData ? (
        <p className="mt-2">
          Після завантаження офіційного переліку дані з’являться в цій таблиці без зміни інтерфейсу.
        </p>
      ) : hasFilters ? (
        <p className="mt-2">Спробуйте змінити пошуковий запит, фільтр або сортування.</p>
      ) : null}
    </div>
  );
}
