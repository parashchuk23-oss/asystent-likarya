import Link from 'next/link';
import AppTabs from '../components/AppTabs';

const productCapabilities = [
  {
    icon: '🩺',
    title: 'Прийом',
    description: 'Структурована форма консультації.',
  },
  {
    icon: '🧮',
    title: 'Калькулятори',
    description: 'Клінічні розрахунки та оцінка ризику.',
  },
  {
    icon: '📋',
    title: 'Опитувальники',
    description: 'Психометричні та клінічні шкали.',
  },
  {
    icon: '💊',
    title: 'Препарати',
    description: 'Практичний довідник лікаря.',
  },
  {
    icon: '📚',
    title: 'Алгоритми',
    description: 'Покрокові клінічні алгоритми.',
    badge: 'Незабаром',
  },
];

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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <header className="rounded-lg border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-200/70 sm:p-6">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4">
              <img
                src="/brand/logo-mark.png"
                alt="Логотип Асистента лікаря"
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                  Асистент лікаря
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-base">
                  Цифровий робочий простір лікаря.
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Все необхідне для щоденної клінічної роботи в одному місці: калькулятори,
              клінічні алгоритми, практичні довідники, опитувальники та структуровані форми.
            </p>
            <a
              href="#workspace"
              className="mt-5 inline-flex rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Почати роботу
            </a>
          </div>
        </header>

        <section className="mt-5" aria-labelledby="inside-title">
          <h2 id="inside-title" className="text-base font-semibold text-slate-950">
            Що є всередині
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {productCapabilities.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-200/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.badge ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workspace" className="mt-5 scroll-mt-4" aria-label="Робоча область">
          <AppTabs />
        </section>

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
