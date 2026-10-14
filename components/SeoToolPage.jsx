import Link from 'next/link';
import Image from 'next/image';

const siteUrl = 'https://www.asystentlikarya.com.ua';

function JsonLd({ title, description, path, faq }) {
  const pageUrl = `${siteUrl}${path}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description,
      url: pageUrl,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Any',
      inLanguage: 'uk',
      isAccessibleForFree: true,
      publisher: {
        '@type': 'Organization',
        name: 'Асистент лікаря',
        url: siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
    />
  );
}

export default function SeoToolPage({
  title,
  description,
  path,
  children,
  faq,
  disclaimer,
  relatedTools = [],
}) {
  return (
    <main className="min-h-screen">
      <JsonLd title={title} description={description} path={path} faq={faq} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-slate-900">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="truncate text-sm font-semibold sm:text-base">Асистент лікаря</span>
          </Link>
          <Link
            href="/"
            className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            На головну
          </Link>
        </header>

        <article className="py-7 sm:py-9">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Клінічний інструмент
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          </header>

          <section className="mt-7" aria-label={title}>
            {children}
          </section>

          <section className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-semibold text-slate-950">Часті питання</h2>
            <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              {faq.map((item) => (
                <details key={item.question} className="group py-4">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                    {item.question}
                  </summary>
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
            <h2 className="font-semibold text-slate-900">Медичний дисклеймер</h2>
            <p className="mt-1">{disclaimer}</p>
          </aside>

          {relatedTools.length > 0 ? (
            <nav className="mt-8 border-t border-slate-200 pt-6" aria-label="Пов’язані інструменти">
              <h2 className="text-base font-semibold text-slate-950">Пов’язані інструменти</h2>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </article>

        <footer className="border-t border-slate-200 py-5 text-xs leading-relaxed text-slate-500">
          Асистент лікаря є допоміжним інструментом для медичних працівників і не замінює
          клінічне рішення лікаря.
        </footer>
      </div>
    </main>
  );
}
