import AppTabs from '../components/AppTabs';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <header className="mb-5 rounded-lg border border-blue-100/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Clinical workspace
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Асистент лікаря
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Веб-інструменти для медичних працівників: консультації, калькулятори,
                опитувальники та клінічні підказки в одному робочому просторі.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Для клінічного використання
            </div>
          </div>
        </header>
        <AppTabs />

        <footer className="mt-6 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-xs leading-relaxed text-slate-500 shadow-sm shadow-slate-200/60">
          Асистент лікаря є допоміжним інструментом для медичних працівників. Результати
          калькуляторів, опитувальників та AI-згенеровані тексти не замінюють клінічне
          рішення лікаря.
        </footer>
      </div>
    </main>
  );
}
