'use client';

import { useMemo, useState } from 'react';
import {
  COPAYMENT_FILTERS,
  MEDICINE_SORTS,
  filterMedicines,
  normalizeMedicines,
  paginateMedicines,
  sortMedicines,
} from '../../utils/availableMedicines';
import {
  availableMedicines,
  availableMedicinesMetadata,
} from '../../data/availableMedicines/availableMedicines';
import AvailableMedicinesEmptyState from './AvailableMedicinesEmptyState';
import AvailableMedicinesPagination from './AvailableMedicinesPagination';
import AvailableMedicinesTable from './AvailableMedicinesTable';
import AvailableMedicinesToolbar from './AvailableMedicinesToolbar';

export default function AvailableMedicinesModule() {
  const [query, setQuery] = useState('');
  const [copaymentFilter, setCopaymentFilter] = useState(COPAYMENT_FILTERS.all);
  const [sortMode, setSortMode] = useState(MEDICINE_SORTS.default);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(1);

  const normalizedMedicines = useMemo(() => normalizeMedicines(availableMedicines), []);
  const hasData = normalizedMedicines.length > 0;

  const filteredMedicines = useMemo(
    () => sortMedicines(filterMedicines(normalizedMedicines, query, copaymentFilter), sortMode),
    [normalizedMedicines, query, copaymentFilter, sortMode],
  );

  const paginated = useMemo(
    () => paginateMedicines(filteredMedicines, page, rowsPerPage),
    [filteredMedicines, page, rowsPerPage],
  );

  function resetPageAndRun(callback) {
    setPage(1);
    callback();
  }

  const hasFilters = Boolean(query.trim()) || copaymentFilter !== COPAYMENT_FILTERS.all;

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-blue-100 bg-blue-50/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Реімбурсація
        </p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950">Доступні ліки</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Модуль відображає інформацію з завантаженого переліку програми реімбурсації.
          Перевіряйте актуальність даних перед оформленням рецепта.
        </p>
        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-700">Перелік актуальний станом на: </span>
            {availableMedicinesMetadata.validAsOf || 'немає даних'}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Джерело: </span>
            {availableMedicinesMetadata.sourceUrl ? (
              <a
                href={availableMedicinesMetadata.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
              >
                {availableMedicinesMetadata.sourceName}
              </a>
            ) : (
              availableMedicinesMetadata.sourceName
            )}
          </p>
        </div>
      </header>

      <AvailableMedicinesToolbar
        query={query}
        onQueryChange={(value) => resetPageAndRun(() => setQuery(value))}
        copaymentFilter={copaymentFilter}
        onCopaymentFilterChange={(value) => resetPageAndRun(() => setCopaymentFilter(value))}
        sortMode={sortMode}
        onSortModeChange={(value) => resetPageAndRun(() => setSortMode(value))}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(value) => resetPageAndRun(() => setRowsPerPage(value))}
      />

      {paginated.items.length > 0 ? (
        <>
          <AvailableMedicinesTable medicines={paginated.items} />
          <AvailableMedicinesPagination
            page={paginated.page}
            totalPages={paginated.totalPages}
            totalItems={filteredMedicines.length}
            startIndex={paginated.startIndex}
            endIndex={paginated.endIndex}
            onPageChange={setPage}
          />
        </>
      ) : (
        <AvailableMedicinesEmptyState hasData={hasData} hasFilters={hasFilters} />
      )}
    </section>
  );
}
