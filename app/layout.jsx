import './globals.css';

export const metadata = {
  title: 'Асистент лікаря',
  description: 'Веб-інструменти для медичних працівників: калькулятори, опитувальники та асистент лікаря.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
