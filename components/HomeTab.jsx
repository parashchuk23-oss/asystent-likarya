'use client';

const productSections = [
  {
    tabId: 'assistant',
    title: 'Асистент лікаря',
    description: 'Структурована форма консультації та підготовки медичного заключення.',
  },
  {
    tabId: 'calculators',
    title: 'Калькулятори',
    description: 'SCORE2, ШКФ, CHA₂DS₂-VASc, HAS-BLED та інші клінічні розрахунки.',
  },
  {
    tabId: 'questionnaires',
    title: 'Опитувальники',
    description: 'GAD-7, PHQ-9, FINDRISC, AUDIT-C, STOP-Bang та інші шкали.',
  },
  {
    tabId: 'drugs',
    title: 'Препарати',
    description: 'Практичний довідник лікаря з короткими клінічними відмінностями препаратів.',
  },
  {
    tabId: 'diseases',
    title: 'Хвороби',
    description: 'Конструктор діагнозів, МКХ-10 підказки та редаговані рекомендації.',
  },
];

export default function HomeTab({ onSelectTab }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <img
            src="/brand/logo-mark.png"
            alt="Логотип Асистента лікаря"
            className="h-14 w-14 shrink-0 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Асистент лікаря</h1>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Цифровий робочий простір лікаря.
            </p>
          </div>
        </div>

        <div className="mt-4 max-w-4xl space-y-3 text-sm leading-6 text-slate-600 sm:text-base">
          <p>
            Все необхідне для щоденної клінічної роботи в одному місці: калькулятори,
            опитувальники, практичні довідники препаратів, алгоритми та інструменти для
            підготовки медичної документації.
          </p>
          <p className="font-medium text-slate-700">
            Мета продукту — менше часу витрачати на пошук інформації і більше — на себе.
          </p>
        </div>
      </section>

      <section aria-labelledby="home-products-title">
        <h2 id="home-products-title" className="text-base font-semibold text-slate-950">
          Розділи продукту
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {productSections.map((section) => (
            <button
              key={section.tabId}
              type="button"
              onClick={() => onSelectTab(section.tabId)}
              className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm shadow-slate-200/50 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="block text-sm font-semibold text-slate-950">{section.title}</span>
              <span className="mt-1 block text-sm leading-5 text-slate-600">
                {section.description}
              </span>
              <span className="mt-3 inline-flex text-sm font-semibold text-blue-700">
                Перейти
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
