import './globals.css';

export const metadata = {
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
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
