import VteCalculatorEnglish from '../../../../components/calculators/VteCalculatorEnglish';

const siteUrl = 'https://www.asystentlikarya.com.ua';
const pagePath = '/en/calculators/venous-thromboembolism';
const ukrainianPath = '/calculators/venous-thromboembolism';

export const metadata = {
  title: 'Venous Thromboembolism Calculators | Asystent Likarya',
  description:
    'Clinical calculators for pulmonary embolism and venous thromboembolism, including Wells Score, PERC, age-adjusted D-dimer, sPESI, Hestia, VTE-BLEED, HERDOO2, and DASH Score.',
  alternates: {
    canonical: `${siteUrl}${pagePath}`,
    languages: {
      en: `${siteUrl}${pagePath}`,
      uk: `${siteUrl}${ukrainianPath}`,
    },
  },
  openGraph: {
    title: 'Venous Thromboembolism Calculators | Asystent Likarya',
    description:
      'Clinical calculators for pulmonary embolism and venous thromboembolism, including Wells Score, PERC, age-adjusted D-dimer, sPESI, Hestia, VTE-BLEED, HERDOO2, and DASH Score.',
    url: `${siteUrl}${pagePath}`,
    siteName: 'Asystent Likarya',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Venous Thromboembolism Calculators | Asystent Likarya',
    description:
      'Clinical calculators for pulmonary embolism and venous thromboembolism, including Wells Score, PERC, age-adjusted D-dimer, sPESI, Hestia, VTE-BLEED, HERDOO2, and DASH Score.',
  },
};

export default function VenousThromboembolismEnglishPage() {
  return <VteCalculatorEnglish />;
}
