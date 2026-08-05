'use client';

export default function RegulationSearch({ directions, query, selectedDirection, onQueryChange, onDirectionChange }) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1fr_260px]">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Пошук по критеріях</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Наприклад: ТЕЛА, SpO₂, гіпертензивний криз"
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Клінічний напрям</span>
        <select
          value={selectedDirection}
          onChange={(event) => onDirectionChange(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">Усі напрями</option>
          {directions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
