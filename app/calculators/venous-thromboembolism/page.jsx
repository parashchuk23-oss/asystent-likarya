import WellsDimerCalculator from '../../../components/calculators/WellsDimerCalculator';

const siteUrl = 'https://www.asystentlikarya.com.ua';
const pagePath = '/calculators/venous-thromboembolism';
const englishPath = '/en/calculators/venous-thromboembolism';

export const metadata = {
  title: 'Венозна тромбоемболія | Асистент лікаря',
  description:
    'Клінічний модуль для оцінки ТГВ, ТЕЛА, D-димеру, sPESI, Hestia, VTE-BLEED, HERDOO2 та DASH Score.',
  alternates: {
    canonical: `${siteUrl}${pagePath}`,
    languages: {
      uk: `${siteUrl}${pagePath}`,
      en: `${siteUrl}${englishPath}`,
    },
  },
  openGraph: {
    title: 'Венозна тромбоемболія | Асистент лікаря',
    description:
      'Клінічний модуль для оцінки ТГВ, ТЕЛА, D-димеру, sPESI, Hestia, VTE-BLEED, HERDOO2 та DASH Score.',
    url: `${siteUrl}${pagePath}`,
    siteName: 'Асистент лікаря',
    type: 'website',
  },
};

export default function VenousThromboembolismUkrainianPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <a href="/" className="hover:text-blue-700">Головна</a>
        <span className="mx-2">/</span>
        <span>Калькулятори</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-800">Венозна тромбоемболія</span>
      </nav>
      <WellsDimerCalculator />
    </main>
  );
}
