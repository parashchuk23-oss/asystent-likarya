import BmiCalculator from '../../../components/calculators/BmiCalculator';

const siteUrl = 'https://www.asystentlikarya.com.ua';
const pagePath = '/calculators/bmi';
const englishPath = '/en/calculators/bmi';

export const metadata = {
  title: 'Калькулятор ІМТ та оцінка маси тіла | Асистент лікаря',
  description:
    'Розрахунок ІМТ, оцінка окружності талії, кардіометаболічного ризику та орієнтовної цільової маси тіла.',
  alternates: {
    canonical: `${siteUrl}${pagePath}`,
    languages: {
      uk: `${siteUrl}${pagePath}`,
      en: `${siteUrl}${englishPath}`,
    },
  },
  openGraph: {
    title: 'Калькулятор ІМТ та оцінка маси тіла | Асистент лікаря',
    description:
      'ІМТ, окружність талії, кардіометаболічний ризик та практичні наступні кроки для лікаря.',
    url: `${siteUrl}${pagePath}`,
    siteName: 'Асистент лікаря',
    type: 'website',
  },
};

export default function BmiUkrainianPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Клінічний калькулятор
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Калькулятор ІМТ та оцінка маси тіла
          </h1>
        </header>
        <BmiCalculator />
      </div>
    </main>
  );
}
