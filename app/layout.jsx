import './globals.css';

export const metadata = {
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
  icons: {
    icon: [
      { url: '/brand/logo-mark.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/brand/favicon-128.png', sizes: '128x128', type: 'image/png' },
    ],
    shortcut: '/brand/favicon-32.png',
    apple: '/brand/favicon-128.png',
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
