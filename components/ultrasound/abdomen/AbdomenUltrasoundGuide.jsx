'use client';

const sections = [
  {
    title: '1. Підготовка і техніка',
    summary: 'Умови, що впливають на якість дослідження',
    items: [
      'За можливості виконуйте планове дослідження натще; враховуйте терміновість, клінічний стан і локальні правила підготовки.',
      'Оглядайте органи в кількох площинах і положеннях пацієнта; використовуйте дихальні проби та зміну положення для жовчного міхура за потреби.',
      'Якщо візуалізація обмежена газом, конституцією або болем, прямо зазначте це в протоколі.',
    ],
  },
  {
    title: '2. Обов’язковий огляд',
    summary: 'Що має бути в повному протоколі ОЧП',
    items: [
      'Печінка: розміри, контури, ехогенність, структура, портальна та печінкові вени, внутрішньопечінкові протоки.',
      'Жовчний міхур і холедох: форма, стінка, вміст, рухомість конкрементів, акустична тінь і діаметр протоки.',
      'Підшлункова залоза та селезінка: доступність огляду, розміри, структура, протоки або судини та вогнищеві зміни.',
      'Окремо оцініть вільну рідину й значущі лімфатичні вузли у доступних ділянках.',
    ],
  },
  {
    title: '3. Вогнищеві зміни',
    summary: 'Як описувати утворення без передчасного діагнозу',
    items: [
      'Вкажіть орган, сегмент або локалізацію, три розміри, контури, ехогенність, структуру, акустичні ефекти та кровотік за показаннями.',
      'Для множинних однотипних утворень опишіть кількість або поширеність і детально охарактеризуйте найбільше чи найбільш підозріле.',
      'Не встановлюйте гістологічний діагноз лише за сірошкальним зображенням; зазначайте потребу в уточненні, якщо ознаки неспецифічні.',
    ],
  },
  {
    title: '4. Поліпи жовчного міхура',
    summary: 'Морфологія, розмір і динаміка за SRU 2022',
    items: [
      'Вимірюйте максимальний розмір, описуйте ніжку або сидячу форму та товщину прилеглої стінки.',
      'Не плутайте поліп із рухомим конкрементом, сладжем або аденоміоматозом; за сумніву оптимізуйте техніку та підготовку.',
      'Тактика залежить від морфологічної категорії, розміру й росту; збільшення на 4 мм або більше протягом 12 місяців вважається швидким ростом за SRU.',
    ],
  },
];

const checklist = [
  'показання та обмеження візуалізації;',
  'послідовний опис усіх досліджених органів;',
  'розміри й локалізація кожної значущої знахідки;',
  'порівняння з попереднім дослідженням, якщо воно доступне;',
  'короткий висновок без дублювання всього опису;',
  'конкретна рекомендація лише тоді, коли вона обґрунтована.',
];

const errors = [
  'Називати підвищену ехогенність печінки стеатозом без урахування інших ознак і клінічного контексту.',
  'Описувати холедох як розширений без зазначення фактичного діаметра та клінічних умов.',
  'Вважати дифузні зміни підшлункової залози самостійним клінічним діагнозом.',
  'Рекомендувати однаковий контроль усім поліпам жовчного міхура незалежно від морфології та розміру.',
];

const atlasItems = [
  {
    title: 'Стеатоз печінки', image: '/images/abdomen-atlas/fatty-liver.jpg', alt: 'УЗ-зображення стеатозу печінки з порівнянням ехогенності печінки та нирки',
    findings: 'Паренхіма печінки виразно ехогенніша за кірковий шар правої нирки.',
    caution: 'Оцінюйте також затухання променя, судинний малюнок і видимість діафрагми; одна ознака не визначає ступінь стеатозу.',
    source: 'https://commons.wikimedia.org/wiki/File:Steatosis_hepatis_-_Sonographie_001.jpg', author: 'Hellerhoff', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    title: 'Конкремент жовчного міхура', image: '/images/abdomen-atlas/gallstone.jpg', alt: 'УЗ-зображення конкременту жовчного міхура з акустичною тінню',
    findings: 'Гіперехогенний конкремент формує чітку задню акустичну тінь.',
    caution: 'Перевірте рухомість у різних положеннях і відрізняйте конкремент від поліпа, сладжу та артефактів.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasound_image_of_gallbladder_stone_Gallstone_091937515.jpg', author: 'Nevit Dilmen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    title: 'Поліп жовчного міхура', image: '/images/abdomen-atlas/gallbladder-polyp.png', alt: 'УЗ-зображення поліпа жовчного міхура',
    findings: 'Пристінкове утворення фіксоване до стінки жовчного міхура.',
    caution: 'Для тактики потрібні максимальний розмір, морфологія, товщина прилеглої стінки й порівняння з попереднім УЗД.',
    source: 'https://commons.wikimedia.org/wiki/File:GBPolyp.png', author: 'James Heilman, MD', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'Вільна рідина', image: '/images/abdomen-atlas/ascites.jpg', alt: 'УЗ-зображення вільної рідини в черевній порожнині',
    findings: 'Анехогенна рідина візуалізується між структурами черевної порожнини.',
    caution: 'УЗД підтверджує наявність рідини, але причина визначається лише з урахуванням клінічних і лабораторних даних.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasound_Scan_ND_232.jpg', author: 'Nevit Dilmen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
];

export default function AbdomenUltrasoundGuide({ onBack, onOpenTool }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">← До інструментів УЗД ОЧП</button>
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Практична пам’ятка</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Як виконати й описати УЗД ОЧП</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Стислий алгоритм повного дослідження, стандартизованого опису та перевірки протоколу.</p>
      </section>
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {sections.map((section, index) => <details key={section.title} open={index === 0} className="group border-b border-slate-200 last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5"><span><span className="block font-bold text-slate-950">{section.title}</span><span className="mt-1 block text-sm text-slate-500">{section.summary}</span></span><span className="text-xl font-semibold text-teal-700 group-open:rotate-45">+</span></summary><ul className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-slate-700 sm:px-5 sm:pb-5">{section.items.map((item) => <li key={item} className="flex gap-2"><span className="text-teal-700">•</span><span>{item}</span></li>)}</ul></details>)}
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-teal-200 bg-teal-50/40 p-4 sm:p-5"><h4 className="font-bold text-slate-950">Перед завершенням протоколу</h4><ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">{checklist.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-teal-700">✓</span><span>{item}</span></li>)}</ul></section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"><h4 className="font-bold text-slate-950">Типові помилки</h4><ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">{errors.map((item) => <li key={item} className="flex gap-2"><span className="font-bold text-slate-400">—</span><span>{item}</span></li>)}</ul></section>
      </div>
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Навчальний УЗ-атлас</p><h4 className="mt-2 text-lg font-bold text-slate-950">Поширені ультразвукові знахідки</h4>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">{atlasItems.map((item) => <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white"><a href={item.image} target="_blank" rel="noreferrer" className="block bg-black"><img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-contain" /></a><div className="p-4"><h5 className="font-bold text-slate-950">{item.title}</h5><p className="mt-2 text-sm leading-relaxed text-slate-700"><span className="font-semibold">Що видно:</span> {item.findings}</p><p className="mt-2 text-sm leading-relaxed text-slate-600"><span className="font-semibold">Важливо:</span> {item.caution}</p><p className="mt-3 text-xs leading-relaxed text-slate-500">Джерело: <a href={item.source} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Wikimedia Commons, {item.author}</a> · <a href={item.licenseUrl} target="_blank" rel="noreferrer" className="underline">{item.license}</a> · зображення не змінено.</p></div></article>)}</div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5"><h4 className="font-bold text-slate-950">Перейти до роботи</h4><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => onOpenTool('protocol')} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Повний протокол</button><button type="button" onClick={() => onOpenTool('polyps')} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700">Оцінити поліп</button></div></section>
      <p className="text-xs leading-relaxed text-slate-500">Клінічні джерела: <a href="https://www.aium.org/resources/practice-parameters" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">AIUM: Abdomen or Retroperitoneum</a> та <a href="https://pubs.rsna.org/doi/10.1148/radiol.213079" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">SRU 2022: Gallbladder Polyps</a>. Дата клінічного перегляду: 17.10.2026.</p>
    </div>
  );
}
