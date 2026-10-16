import SeoToolPage from './SeoToolPage';
import { prioritySeoTools } from '../utils/prioritySeoTools';

export default function PrioritySeoToolPage({ toolId, children }) {
  const config = prioritySeoTools[toolId];

  return (
    <SeoToolPage
      title={config.title}
      description={config.description}
      path={config.path}
      faq={config.faq}
      disclaimer={config.disclaimer}
      relatedTools={config.relatedTools}
    >
      <div className="mx-auto max-w-5xl">
        {children}
        <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby={`${toolId}-sources`}>
          <h2 id={`${toolId}-sources`} className="text-lg font-semibold text-slate-950">
            Методика та джерела
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {config.sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Клінічний перегляд: 16 жовтня 2026 року.</p>
        </section>
      </div>
    </SeoToolPage>
  );
}
