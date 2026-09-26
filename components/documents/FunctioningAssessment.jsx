'use client';

import { functioningCategories, respiratoryAssessmentSections } from '../../data/functioning/respiratoryAssessment';

function ToolCard({ tool, onOpenQuestionnaire }) {
  const [isOpen, setIsOpen] = useState(false);
  const category = functioningCategories[tool.category];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={`tool-${tool.id}`}
        className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-slate-50"
      >
        <div>
          <h4 className="text-base font-bold text-slate-950">{tool.name}</h4>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>
            {category.icon} {category.label}
          </span>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div id={`tool-${tool.id}`} className="space-y-4 border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
          <Detail title="Що вимірює">{tool.measures}</Detail>
          {tool.indications && <Detail title="Основні показання">{tool.indications}</Detail>}
          <Detail title="Що документує для функціональної оцінки">{tool.documents}</Detail>
          {tool.metrics && (
            <Detail title="Основні показники">
              <ul className="list-disc space-y-1 pl-5">
                {tool.metrics.map((metric) => <li key={metric}>{metric}</li>)}
              </ul>
            </Detail>
          )}
          {tool.protocol && <Detail title="Як виконати">{tool.protocol}</Detail>}
          {tool.interpretation && <Detail title="Інтерпретація">{tool.interpretation}</Detail>}
          <Detail title="Обмеження">{tool.limitations}</Detail>
          {tool.licenseNotice && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-semibold text-amber-900">
              {tool.licenseNotice}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900">Джерело</p>
            <a href={tool.source.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-900">
              {tool.source.label}
            </a>
          </div>
          {tool.questionnaireId && onOpenQuestionnaire && (
            <button
              type="button"
              onClick={() => onOpenQuestionnaire(tool.questionnaireId)}
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              {tool.actionLabel || 'Провести 6MWT →'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function Detail({ title, children }) {
  return (
    <div>
      <p className="font-bold text-slate-900">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function FunctioningAssessment({ onOpenQuestionnaire }) {
  const respiratorySection = respiratoryAssessmentSections[0];

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Оцінювання функціонування</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Дихальна система</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Довідковий інструмент для вибору об’єктивних досліджень і валідованих функціональних тестів, якими можна документувати порушення функції та повсякденне обмеження.
        </p>
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950">
          Це не калькулятор групи інвалідності. Інструмент не визначає I, II або III групу та не робить юридичного висновку про право на інвалідність.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-950">{respiratorySection.title}</h3>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{respiratorySection.description}</p>
        </div>

        <div className="grid gap-3">
          {respiratorySection.tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />
          ))}
        </div>

        <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
          {respiratorySection.note}
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
        <h3 className="font-bold text-slate-950">Як користуватися</h3>
        <p className="mt-1">
          Поєднуйте клінічні об’єктивні докази з інструментами, що безпосередньо описують фізичну спроможність або повсякденне функціонування. Остаточну інтерпретацію виконує лікар з урахуванням клінічного контексту та чинної редакції нормативних документів.
        </p>
      </section>
    </div>
  );
}
