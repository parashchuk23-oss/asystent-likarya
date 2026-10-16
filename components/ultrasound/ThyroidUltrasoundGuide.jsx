'use client';

const sections = [
  {
    title: '1. Підготовка і техніка',
    summary: 'Положення пацієнта, датчик і стандартні площини',
    items: [
      'Уточніть показання, попередні УЗД, операції та результати пункції, якщо вони є.',
      'Положення пацієнта — лежачи або напівлежачи з помірним розгинанням шиї; використовуйте високочастотний лінійний датчик.',
      'Огляньте кожну частку в поперечній і поздовжній площинах, перешийок — щонайменше в поперечній площині.',
      'Зберігайте однакову техніку вимірювання під час контрольних досліджень.',
    ],
  },
  {
    title: '2. Що має бути оцінено',
    summary: 'Розміри, паренхіма, утворення та прилеглі структури',
    items: [
      'Для кожної частки запишіть три максимальні розміри; окремо виміряйте передньозадню товщину перешийка.',
      'Оцініть розташування, контури, ехогенність, однорідність паренхіми та васкуляризацію за показаннями.',
      'Опишіть значущі вогнищеві та перитиреоїдні утворення, післяопераційні зміни й прилеглі м’які тканини.',
      'Оцініть регіонарні лімфатичні вузли; патологічні вузли опишіть окремо.',
    ],
  },
  {
    title: '3. Вузол за ACR TI-RADS',
    summary: 'П’ять ознак, розмір, категорія і тактика',
    items: [
      'Зазначте локалізацію та три розміри вузла; для тактики використовується максимальний діаметр.',
      'Послідовно оцініть склад, ехогенність, форму в поперечній площині, контури та ехогенні фокуси.',
      'Вкажіть суму балів, категорію TR1–TR5 і рекомендацію з урахуванням розміру.',
      'При множинних вузлах не потрібно детально описувати кожен: пріоритет мають найбільш підозрілі та клінічно значущі утворення.',
    ],
  },
  {
    title: '4. Лімфатичні вузли',
    summary: 'Коли недостатньо написати лише «збільшені»',
    items: [
      'Для патологічного вузла вкажіть бік і шийну зону, розміри та коротку вісь.',
      'Опишіть форму, ехогенність, стан жирового хілюса, кістозні зміни або кальцинати та характер кровотоку.',
      'Не робіть остаточного морфологічного діагнозу лише за ультразвуковою картиною.',
    ],
  },
];

const finalChecklist = [
  'показання та порівняння з попереднім дослідженням;',
  'розміри обох часток і перешийка;',
  'ехогенність та однорідність паренхіми;',
  'опис значущих вузлів із категорією ACR TI-RADS;',
  'стан регіонарних лімфатичних вузлів;',
  'короткий висновок і конкретна рекомендація, якщо вона потрібна.',
];

const commonErrors = [
  'Оцінювати вузол за судинністю або внутрішньою однорідністю замість п’яти ознак ACR TI-RADS.',
  'Писати категорію TI-RADS без максимального розміру та відповідної тактики.',
  'Називати дифузну неоднорідність конкретним тиреоїдитом без клініко-лабораторного підтвердження.',
  'Описувати лімфовузол лише як «збільшений» без локалізації та морфологічних ознак.',
];

export default function ThyroidUltrasoundGuide({ onBack, onOpenTool }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
        ← До інструментів ЩЗ
      </button>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Практична пам’ятка</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Як виконати й описати УЗД щитоподібної залози</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Мінімальний послідовний алгоритм для повного дослідження та стандартизованого протоколу. Пам’ятка не замінює професійну підготовку лікаря УЗД.
        </p>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {sections.map((section, index) => (
          <details key={section.title} open={index === 0} className="group border-b border-slate-200 last:border-b-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 sm:px-5">
              <span>
                <span className="block font-bold text-slate-950">{section.title}</span>
                <span className="mt-1 block text-sm text-slate-500">{section.summary}</span>
              </span>
              <span aria-hidden="true" className="text-xl font-semibold text-teal-700 group-open:rotate-45">+</span>
            </summary>
            <ul className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-slate-700 sm:px-5 sm:pb-5">
              {section.items.map((item) => <li key={item} className="flex gap-2"><span className="text-teal-700">•</span><span>{item}</span></li>)}
            </ul>
          </details>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-teal-200 bg-teal-50/40 p-4 sm:p-5">
          <h4 className="font-bold text-slate-950">Перед завершенням протоколу</h4>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            {finalChecklist.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-teal-700">✓</span><span>{item}</span></li>)}
          </ul>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <h4 className="font-bold text-slate-950">Типові помилки</h4>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            {commonErrors.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-slate-400">—</span><span>{item}</span></li>)}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <h4 className="font-bold text-slate-950">Перейти до роботи</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => onOpenTool('protocol')} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Повний протокол</button>
          <button type="button" onClick={() => onOpenTool('volume')} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700">Розрахувати об’єм</button>
          <button type="button" onClick={() => onOpenTool('tirads')} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700">Розрахувати ACR TI-RADS</button>
        </div>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">
        Джерела: <a href="https://www.aium.org/resources/practice-parameters" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">AIUM Practice Parameters: Thyroid and Extracranial Head and Neck</a> та <a href="https://www.acr.org/clinical-resources/clinical-tools-and-reference/reporting-and-data-systems/ti-rads" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">ACR TI-RADS</a>. Дата клінічного перегляду: 16.10.2026.
      </p>
    </div>
  );
}
