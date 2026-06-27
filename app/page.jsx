import Link from 'next/link';
import AppTabs from '../components/AppTabs';

const popularTools = [
  { href: '/egfr', label: 'ШКФ (CKD-EPI)' },
  { href: '/score2', label: 'SCORE2' },
  { href: '/gad7', label: 'GAD-7' },
  { href: '/phq9', label: 'PHQ-9' },
  { href: '/findrisk', label: 'FINDRISK' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:py-4">
        <AppTabs />

        <section className="mt-6 border-y border-slate-200 py-4" aria-labelledby="popular-tools-title">
          <h2 id="popular-tools-title" className="text-sm font-semibold text-slate-900">
            Популярні інструменти
          </h2>
          <nav className="mt-2 flex flex-wrap gap-x-5 gap-y-2" aria-label="Популярні інструменти">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="text-sm font-medium text-blue-700 transition hover:text-blue-800 hover:underline"
              >
                {tool.label}
              </Link>
            ))}
          </nav>
        </section>

        <footer className="mt-6 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-xs leading-relaxed text-slate-500 shadow-sm shadow-slate-200/60">
          <p>
            Асистент лікаря є допоміжним інструментом для медичних працівників. Результати
            калькуляторів та опитувальників не замінюють клінічне рішення лікаря.
          </p>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-semibold text-slate-700">Асистент лікаря v1.0</p>
              <p>Оновлено: червень 2026</p>
            </div>
            <Link href="/about" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
              Про проєкт
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
