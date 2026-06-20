import Link from 'next/link';

export const metadata = {
  title: 'Про проєкт | Асистент лікаря',
  description:
    'Про Асистент лікаря — цифровий робочий простір із клінічними калькуляторами, опитувальниками та інструментами для медичних працівників.',
  alternates: {
    canonical: 'https://asystent-likarya.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-slate-900">
            <img src="/brand/logo-mark.png" alt="" className="h-9 w-9 shrink-0 object-contain" />
            <span className="truncate text-sm font-semibold sm:text-base">Асистент лікаря</span>
          </Link>
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            На головну
          </Link>
        </header>

        <article className="py-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Про продукт
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Про проєкт «Асистент лікаря»
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Асистент лікаря — це сучасний цифровий робочий простір, який об’єднує клінічні
            калькулятори, шкали ризику, опитувальники та форму для підготовки лікарського
            заключення.
          </p>

          <div className="mt-8 space-y-7 border-t border-slate-200 pt-7">
            <section>
              <h2 className="text-lg font-semibold text-slate-950">Для кого створений продукт</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Проєкт орієнтований на сімейних лікарів, терапевтів, кардіологів,
                ендокринологів, інтернів та інших медичних працівників, яким потрібні швидкі
                й зрозумілі інструменти для щоденної практики.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-950">Лікарем для лікарів</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Асистент лікаря створюється лікарем для лікарів. Основний орієнтир —
                практична користь, доказовість, економія часу та спокійний професійний
                інтерфейс без зайвих кроків.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-950">Клінічна відповідальність</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Сайт є допоміжним інструментом і не замінює клінічне рішення лікаря.
                Результати потрібно оцінювати разом з анамнезом, оглядом, лабораторними
                даними та чинними клінічними рекомендаціями.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-950">AI-функції</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                AI-функції поки не підключені в публічній версії. Заключення формується
                лікарем на основі введених даних і залишається під повним контролем лікаря.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
