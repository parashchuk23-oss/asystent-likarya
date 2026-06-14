import AppTabs from '../components/AppTabs';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">Асистент лікаря</h1>
          <p className="mt-1 text-sm text-slate-500">
            Веб-інструменти для медичних працівників: калькулятори, опитувальники та клінічні підказки.
          </p>
        </header>
        <AppTabs />

        <footer className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
          Асистент лікаря є допоміжним інструментом для медичних працівників. Результати
          калькуляторів, опитувальників та AI-згенеровані тексти не замінюють клінічне
          рішення лікаря.
        </footer>
      </div>
    </main>
  );
}
