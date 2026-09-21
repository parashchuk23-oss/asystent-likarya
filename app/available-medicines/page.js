import Link from 'next/link';
import AppTabs from '../../components/AppTabs';

const title = 'Доступні ліки — Асистент лікаря';
const description =
  'Пошук препаратів програми реімбурсації за МНН, торговою назвою, дозуванням та упаковкою.';

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/available-medicines',
  },
  openGraph: {
    title,
    description,
    url: '/available-medicines',
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

export default function AvailableMedicinesPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:py-4">
        <AppTabs initialTab="drugs" initialDrugSection="available" />

        <footer className="mt-6 rounded-lg border border-slate-200/80 bg-white/90 p-4 text-xs leading-relaxed text-slate-500 shadow-sm shadow-slate-200/60">
          <p>
            Дані модуля мають довідковий характер. Перед оформленням рецепта перевіряйте
            актуальність переліку та умови програми реімбурсації.
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
