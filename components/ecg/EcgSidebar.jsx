export default function EcgSidebar({ modules, activeModule, onSelect }) {
  return (
    <nav className="space-y-2">
      {modules.map((module) => {
        const isActive = activeModule === module.id;

        return (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelect(module.id)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              isActive
                ? 'border-blue-200 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold">{module.title}</span>
              {module.status === 'soon' ? (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  незабаром
                </span>
              ) : null}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-500">{module.description}</span>
          </button>
        );
      })}
    </nav>
  );
}
