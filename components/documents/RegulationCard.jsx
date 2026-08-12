'use client';

export default function RegulationCard({ regulation, isActive, onSelect }) {
  const structuredCount = regulation.sections?.filter((section) => section.status === 'structured').length || 0;
  const plannedCount = regulation.sections?.filter((section) => section.status === 'planned').length || 0;
  const isMedicineBenefit = regulation.viewer === 'medicine-benefit-1303';
  const documentType = regulation.documentType || 'Наказ';
  const authority = regulation.authorityShort || 'МОЗ України';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
        isActive
          ? 'border-teal-300 bg-teal-50/70 shadow-sm'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">{authority}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-950">
        {documentType} №{regulation.number}
      </h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">{regulation.date}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{regulation.title}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
        {isMedicineBenefit ? (
          <>
            <span className="rounded-full bg-white px-3 py-1 text-teal-700 ring-1 ring-teal-200">
              групи населення: {regulation.populationGroups.length}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-blue-700 ring-1 ring-blue-200">
              захворювання: {regulation.diseaseCategories.length}
            </span>
          </>
        ) : (
          <>
            <span className="rounded-full bg-white px-3 py-1 text-teal-700 ring-1 ring-teal-200">
              структуровано: {structuredCount}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-slate-500 ring-1 ring-slate-200">
              у черзі: {plannedCount}
            </span>
          </>
        )}
      </div>
    </button>
  );
}
