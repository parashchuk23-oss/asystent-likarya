import Link from 'next/link';
import AppTabs from '../../components/AppTabs';

const title = 'Пошук засобів реабілітації — Асистент лікаря';
const description =
  'Пошук засобів реабілітації за кодом МКХ-10 або назвою діагнозу з показаннями, протипоказаннями та посиланнями на наказ №774/2691.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/rehabilitation-aids' },
  openGraph: {
    title,
    description,
    url: '/rehabilitation-aids',
    siteName: 'Асистент лікаря',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: '/brand/facebook-intro-post.png',
        width: 1080,
        height: 1080,
        alt: 'Асистент лікаря — цифровий робочий простір лікаря',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/brand/facebook-intro-post.png'],
  },
};

export default function RehabilitationAidsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:py-4">
        <AppTabs
          initialTab="documents"
          initialDocumentArea="functioning"
          initialRehabilitationSearchOpen
        />

        <footer className="mt-6 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-xs leading-relaxed text-slate-500 shadow-sm shadow-slate-200/60">
          <p>
            Діагноз лише звужує нормативний перелік і не є автоматичним призначенням.
            Конкретний засіб визначають після індивідуального функціонального оцінювання.
          </p>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <Link href="/" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
              На головну сторінку
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
