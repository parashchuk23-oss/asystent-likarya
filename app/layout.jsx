import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.NODE_ENV === 'production';

export const metadata = {
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
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
  return (
    <html lang="uk" className="scroll-smooth">
      <body>
        {children}
        {isProduction && gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
