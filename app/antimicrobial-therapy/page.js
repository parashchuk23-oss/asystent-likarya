import Link from 'next/link';
import AppTabs from '../../components/AppTabs';

const title = 'Антимікробна терапія для первинної допомоги — Асистент лікаря';
const description =
  'Клінічний навігатор антимікробної терапії для первинної медичної допомоги: показання, режими, тривалість, дитячі дози та джерела.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/antimicrobial-therapy' },
  openGraph: {
    title,
    description,
    url: '/antimicrobial-therapy',
    siteName: 'Асистент лікаря',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: '/content/clinical-cases/antimicrobial-primary-care/03-find-condition.png',
        width: 1080,
        height: 1080,
        alt: 'Антимікробна терапія для первинної медичної допомоги',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/content/clinical-cases/antimicrobial-primary-care/03-find-condition.png'],
  },
};

export default function AntimicrobialTherapyPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:py-4">
        <AppTabs initialTab="drugs" initialDrugSection="antimicrobial" />

        <footer className="mt-6 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-xs leading-relaxed text-slate-500 shadow-sm shadow-slate-200/60">
          <p>
            Довідник не призначає антибіотик автоматично. Перед лікуванням перевіряйте алергії,
            вагітність, вік, масу тіла, функцію нирок і печінки, взаємодії, локальну
            резистентність та офіційну інструкцію.
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
