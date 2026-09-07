'use client';

import { useState } from 'react';

const protectionClasses = [
  {
    id: 'acei-arb',
    title: 'ІАПФ / БРА',
    use: 'Артеріальна гіпертензія при ХХН, альбумінурія, серцева недостатність та інші відповідні кардіологічні показання.',
    mechanism:
      'Знижують внутрішньоклубочковий тиск і альбумінурію, завдяки чому можуть сповільнювати прогресування ХХН.',
    tip:
      'Контролювати креатинін / eGFR і калій до початку та через 2–4 тижні після старту або підвищення дози. Не комбінувати ІАПФ із БРА. Початкове зниження eGFR не завжди вимагає відміни.',
  },
  {
    id: 'sglt2',
    title: 'Інгібітори SGLT2',
    use: 'ХХН, цукровий діабет 2 типу та серцева недостатність — за показаннями конкретного препарату.',
    mechanism:
      'Відновлюють тубулогломерулярний зворотний зв’язок, знижують внутрішньоклубочковий тиск і сповільнюють зниження eGFR.',
    tip:
      'Після початку можливе невелике раннє зниження eGFR. Оцінити об’ємний статус, ризик генітальних інфекцій і кетоацидозу; враховувати правила тимчасового припинення при гострому тяжкому стані, тривалому голодуванні або великому оперативному втручанні.',
  },
  {
    id: 'finerenone',
    title: 'Фінеренон',
    use: 'Цукровий діабет 2 типу та ХХН зі стійкою альбумінурією на тлі максимально переносимої терапії ІАПФ або БРА.',
    mechanism:
      'Селективно блокує мінералокортикоїдні рецептори та зменшує запальні й фібротичні процеси у нирках і серцево-судинній системі.',
    tip:
      'Перед початком перевірити eGFR і калій, надалі контролювати калій. Допустимість застосування визначати за актуальною інструкцією та супутньою терапією.',
  },
  {
    id: 'glp1',
    title: 'Агоністи рецепторів GLP-1',
    use: 'Переважно при цукровому діабеті 2 типу, особливо за високого серцево-судинного ризику, ожиріння або недостатнього контролю глікемії.',
    mechanism:
      'Зменшують альбумінурію та серцево-судинний ризик; ниркова користь частково пов’язана зі впливом на глікемію, масу тіла й артеріальний тиск.',
    tip:
      'Доказовість і ниркові обмеження залежать від конкретного препарату. Враховувати шлунково-кишкові небажані реакції та ризик дегідратації.',
  },
];

export default function RenalProtectionClasses() {
  const [openCard, setOpenCard] = useState('sglt2');

  return (
    <section className="mt-4 border-t border-blue-100 pt-4" aria-labelledby="renal-protection-title">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Довідник класів
        </p>
        <h2 id="renal-protection-title" className="mt-1 text-base font-semibold tracking-tight text-slate-950">
          Нефро- та кардіопротекція
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-600">
          Коли застосовують клас, механізм клінічної користі та практична підказка для контролю.
        </p>
      </div>

      <div className="space-y-2">
        {protectionClasses.map((item) => {
          const isOpen = openCard === item.id;
          const panelId = `renal-protection-${item.id}`;

          return (
            <article
              key={item.id}
              className={`overflow-hidden rounded-md border transition ${
                isOpen
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-teal-300 bg-white hover:border-teal-500'
              }`}
            >
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 px-3 py-3 text-left transition hover:bg-teal-50/40"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenCard((current) => (current === item.id ? null : item.id))}
              >
                <span>
                  <span className={`block text-sm font-semibold ${isOpen ? 'text-teal-900' : 'text-slate-950'}`}>
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{item.use}</span>
                </span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xl leading-none transition ${
                    isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div id={panelId} className="space-y-3 border-t border-teal-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700">
                  <div>
                    <h3 className="font-semibold text-slate-900">Механізм користі</h3>
                    <p className="mt-1">{item.mechanism}</p>
                  </div>
                  <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2.5">
                    <h3 className="font-semibold text-blue-950">Практична підказка</h3>
                    <p className="mt-1 text-slate-700">{item.tip}</p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Джерела:{' '}
        <a
          href="https://kdigo.org/guidelines/ckd-evaluation-and-management/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          KDIGO 2024 CKD
        </a>{' '}
        та{' '}
        <a
          href="https://kdigo.org/guidelines/diabetes-ckd/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-700 underline-offset-2 hover:underline"
        >
          KDIGO Diabetes in CKD
        </a>
        . Картки не є автоматичним призначенням лікування.
      </p>
    </section>
  );
}
