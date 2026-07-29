import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

function getGaMeasurementId() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return /^G-[A-Z0-9]+$/.test(gaId || '') ? gaId : '';
}

export const metadata = {
  metadataBase: new URL('https://www.asystentlikarya.com.ua'),
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Асистент лікаря',
    description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
    url: '/',
    siteName: 'Асистент лікаря',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Асистент лікаря',
    description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
  },
  icons: {
    icon: [
      { url: '/brand/favicon-v3-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-v3-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-v3-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/brand/favicon-v3-128.png', sizes: '128x128', type: 'image/png' },
    ],
    shortcut: '/brand/favicon-v3-32.png',
    apple: '/brand/favicon-v3-180.png',
  },
  verification: {
    google: 'os6G1fQ5E_gH5K-wL0gjXcs7UvYyKibtthODkrLjMqI',
  },
};

export default function RootLayout({ children }) {
  const gaMeasurementId = getGaMeasurementId();
  const shouldRenderAnalytics = process.env.NODE_ENV === 'production' && gaMeasurementId;

  return (
    <html lang="uk" className="scroll-smooth">
      <body>
        {children}
        {shouldRenderAnalytics ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
