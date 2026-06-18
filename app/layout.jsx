import './globals.css';

export const metadata = {
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
  icons: {
    icon: [
      { url: '/brand/favicon-v2-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/brand/favicon-v2-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-v2-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/brand/favicon-v2-128.png', sizes: '128x128', type: 'image/png' },
    ],
    shortcut: '/brand/favicon-v2-32.png',
    apple: '/brand/favicon-v2-180.png',
  },
  verification: {
    google: 'os6G1fQ5E_gH5K-wL0gjXcs7UvYyKibtthODkrLjMqI',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
