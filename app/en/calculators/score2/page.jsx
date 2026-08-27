import Score2CalculatorEnglish from '../../../../components/calculators/Score2CalculatorEnglish';

const siteUrl = 'https://www.asystentlikarya.com.ua';
const pagePath = '/en/calculators/score2';
const ukrainianPath = '/score2';

export const metadata = {
  title: 'SCORE2 Cardiovascular Risk Calculator | Asystent Likarya',
  description:
    'SCORE2, SCORE2-OP, SCORE2-Diabetes, SMART Risk Score, and CKD risk modifiers for cardiovascular-risk assessment.',
  alternates: {
    canonical: `${siteUrl}${pagePath}`,
    languages: {
      en: `${siteUrl}${pagePath}`,
      uk: `${siteUrl}${ukrainianPath}`,
    },
  },
  openGraph: {
    title: 'SCORE2 Cardiovascular Risk Calculator | Asystent Likarya',
    description:
      'SCORE2, SCORE2-OP, SCORE2-Diabetes, SMART Risk Score, and CKD risk modifiers for cardiovascular-risk assessment.',
    url: `${siteUrl}${pagePath}`,
    siteName: 'Asystent Likarya',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'SCORE2 Cardiovascular Risk Calculator | Asystent Likarya',
    description:
      'SCORE2, SCORE2-OP, SCORE2-Diabetes, SMART Risk Score, and CKD risk modifiers for cardiovascular-risk assessment.',
  },
};

export default function Score2EnglishPage() {
  return <Score2CalculatorEnglish />;
}
