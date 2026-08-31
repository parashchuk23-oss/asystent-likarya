import Link from 'next/link';

export default function LanguageSwitch({ current = 'uk', ukrainianHref, englishHref, className = '' }) {
  const languages = [
    { id: 'uk', label: 'UA', href: ukrainianHref },
    { id: 'en', label: 'EN', href: englishHref },
  ];

  return (
    <div
      className={`inline-flex rounded-md border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm shadow-slate-100 ${className}`}
      aria-label="Перемикач мови"
    >
      {languages.map((language) => {
        const isActive = current === language.id;
        const sharedClassName = `rounded px-2 py-1 transition ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`;

        return isActive ? (
          <span key={language.id} className={sharedClassName} aria-current="page">
            {language.label}
          </span>
        ) : (
          <Link key={language.id} href={language.href} className={sharedClassName}>
            {language.label}
          </Link>
        );
      })}
    </div>
  );
}
