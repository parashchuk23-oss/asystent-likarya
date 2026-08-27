import BmiCalculatorEnglish from '../../../../components/calculators/BmiCalculatorEnglish';

const siteUrl = 'https://www.asystentlikarya.com.ua';
const pagePath = '/en/calculators/bmi';

export const metadata = {
  title: 'BMI and Body Weight Assessment Calculator | Asystent Likarya',
  description:
    'BMI calculator with waist circumference, target weight, cardiometabolic-risk orientation, and practical next steps for clinicians.',
  alternates: {
    canonical: `${siteUrl}${pagePath}`,
    languages: {
      en: `${siteUrl}${pagePath}`,
    },
  },
  openGraph: {
    title: 'BMI and Body Weight Assessment Calculator | Asystent Likarya',
    description:
      'BMI calculator with waist circumference, target weight, cardiometabolic-risk orientation, and practical next steps for clinicians.',
    url: `${siteUrl}${pagePath}`,
    siteName: 'Asystent Likarya',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BMI and Body Weight Assessment Calculator | Asystent Likarya',
    description:
      'BMI calculator with waist circumference, target weight, cardiometabolic-risk orientation, and practical next steps for clinicians.',
  },
};

export default function BmiEnglishPage() {
  return <BmiCalculatorEnglish />;
}
