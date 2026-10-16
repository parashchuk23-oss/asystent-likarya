const siteUrl = 'https://www.asystentlikarya.com.ua';

const commonDisclaimer =
  'Результат є допоміжним інструментом і не встановлює діагноз або лікування самостійно. Остаточне рішення приймає лікар з урахуванням клінічного контексту та чинних рекомендацій.';

export const prioritySeoTools = {
  'has-bled': {
    path: '/has-bled',
    title: 'Калькулятор HAS-BLED',
    shortTitle: 'HAS-BLED',
    description: 'Оцініть фактори ризику кровотечі у пацієнта з фібриляцією передсердь перед або під час антикоагулянтної терапії.',
    disclaimer: 'Високий HAS-BLED не є автоматичною причиною відмовляти в антикоагуляції. Шкала допомагає виявити модифіковані фактори ризику та визначити потребу в частішому контролі.',
    faq: [
      { question: 'Що оцінює HAS-BLED?', answer: 'Шкала структурує клінічні фактори, пов’язані з ризиком значущої кровотечі у пацієнтів із фібриляцією передсердь.' },
      { question: 'Чи є високий бал протипоказанням до антикоагуляції?', answer: 'Ні. Він має спонукати до корекції модифікованих факторів ризику та планування належного спостереження.' },
      { question: 'Коли потрібно повторювати оцінювання?', answer: 'Ризик переглядають при зміні лікування, супутніх захворювань, функції нирок або печінки та після кровотечі.' },
    ],
    sources: [
      { label: 'ESC Clinical Practice Guidelines: Atrial Fibrillation', href: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Atrial-Fibrillation' },
      { label: 'Оригінальна валідація HAS-BLED (Chest, 2010)', href: 'https://pubmed.ncbi.nlm.nih.gov/20299623/' },
    ],
    relatedTools: [{ href: '/cha2ds2-vasc', label: 'CHA₂DS₂-VASc' }, { href: '/egfr', label: 'Калькулятор ШКФ' }],
  },
  'heart-score': {
    path: '/heart-score', title: 'Калькулятор HEART Score', shortTitle: 'HEART Score',
    description: 'Структурована оцінка ризику великих серцево-судинних подій у дорослого пацієнта з недиференційованим болем у грудях.',
    disclaimer: 'HEART Score не застосовують замість невідкладної оцінки при STEMI, гемодинамічній нестабільності або іншому очевидному ургентному стані.',
    faq: [
      { question: 'Що входить до HEART Score?', answer: 'Анамнез, ЕКГ, вік, фактори ризику та тропонін.' },
      { question: 'Для кого призначена шкала?', answer: 'Для дорослих із недиференційованим болем у грудях після первинної клінічної оцінки.' },
      { question: 'Чи можна використовувати HEART без тропоніну?', answer: 'Повний HEART Score потребує результату тропоніну та його правильного зіставлення з референтною межею лабораторії.' },
    ],
    sources: [{ label: 'Оригінальна публікація HEART Score', href: 'https://pubmed.ncbi.nlm.nih.gov/18665203/' }],
    relatedTools: [{ href: '/score2', label: 'SCORE2' }, { href: '/egfr', label: 'Калькулятор ШКФ' }],
  },
  h2fpef: {
    path: '/h2fpef', title: 'Калькулятор H₂FPEF', shortTitle: 'H₂FPEF',
    description: 'Оцініть імовірність серцевої недостатності зі збереженою фракцією викиду в пацієнта з незрозумілою задишкою.',
    disclaimer: commonDisclaimer,
    faq: [
      { question: 'Що оцінює H₂FPEF?', answer: 'Шкала оцінює ймовірність HFpEF у пацієнта з незрозумілою задишкою за клінічними та ехокардіографічними показниками.' },
      { question: 'Чи встановлює шкала діагноз HFpEF?', answer: 'Ні. Проміжний результат зазвичай потребує додаткової функціональної або гемодинамічної оцінки.' },
      { question: 'Чи потрібна ехокардіографія?', answer: 'Так, два компоненти шкали залежать від ехокардіографічних показників.' },
    ],
    sources: [{ label: 'Reddy et al. H₂FPEF Score (Circulation, 2018)', href: 'https://pubmed.ncbi.nlm.nih.gov/29792299/' }],
    relatedTools: [{ href: '/6mwt', label: '6MWT' }, { href: '/egfr', label: 'Калькулятор ШКФ' }],
  },
  frax: {
    path: '/frax', title: 'Оцінка ризику переломів FRAX', shortTitle: 'FRAX',
    description: 'Оцініть клінічні фактори ризику остеопоротичних переломів і перейдіть до офіційного українського калькулятора FRAX.',
    disclaimer: 'Сайт не відтворює закритий алгоритм FRAX і не підміняє офіційний калькулятор. Пороги втручання залежать від країни, віку та клінічних рекомендацій.',
    faq: [
      { question: 'Що прогнозує FRAX?', answer: '10-річну ймовірність великого остеопоротичного перелому та перелому стегна.' },
      { question: 'Чи обов’язкова DXA?', answer: 'Ні, оцінювання можливе без мінеральної щільності кісткової тканини, але показник шийки стегна може уточнити результат.' },
      { question: 'Де виконується розрахунок?', answer: 'У модулі доступний прямий перехід до офіційного калькулятора FRAX.' },
    ],
    sources: [{ label: 'Офіційний калькулятор FRAX', href: 'https://frax.shef.ac.uk/FRAX/' }],
    relatedTools: [{ href: '/calculators/bmi', label: 'Калькулятор ІМТ' }, { href: '/6mwt', label: '6MWT' }],
  },
  'stop-bang': {
    path: '/stop-bang', title: 'Опитувальник STOP-Bang', shortTitle: 'STOP-Bang',
    description: 'Швидкий скринінг ризику обструктивного апное сну за вісьмома клінічними ознаками.',
    disclaimer: 'STOP-Bang оцінює ризик, але не діагностує обструктивне апное сну та не замінює дослідження сну.',
    faq: [
      { question: 'Що показує STOP-Bang?', answer: 'Рівень ризику обструктивного апное сну за вісьмома ознаками.' },
      { question: 'Чи підтверджує високий бал діагноз?', answer: 'Ні. Для підтвердження потрібна клінічна оцінка та дослідження сну за показаннями.' },
      { question: 'Скільки запитань містить шкала?', answer: 'Вісім відповідей «так» або «ні».' },
    ],
    sources: [{ label: 'Валідація STOP-Bang (Anesthesiology, 2008)', href: 'https://pubmed.ncbi.nlm.nih.gov/19293698/' }],
    relatedTools: [{ href: '/epworth', label: 'Шкала Епворт' }, { href: '/calculators/bmi', label: 'Калькулятор ІМТ' }],
  },
  'audit-c': {
    path: '/audit-c', title: 'Опитувальник AUDIT-C', shortTitle: 'AUDIT-C',
    description: 'Короткий скринінг ризикованого вживання алкоголю за трьома запитаннями.',
    disclaimer: 'AUDIT-C є скринінгом і не встановлює розлад, пов’язаний із вживанням алкоголю. Позитивний результат потребує клінічного уточнення.',
    faq: [
      { question: 'Скільки запитань містить AUDIT-C?', answer: 'Три запитання про частоту, кількість та епізоди значного вживання алкоголю.' },
      { question: 'Чи встановлює тест залежність?', answer: 'Ні. Він виявляє підвищений ризик і визначає потребу в подальшому оцінюванні.' },
      { question: 'Хто має інтерпретувати результат?', answer: 'Медичний працівник разом з анамнезом, клінічною ситуацією та безпекою пацієнта.' },
    ],
    sources: [{ label: 'Валідація AUDIT-C', href: 'https://pubmed.ncbi.nlm.nih.gov/12695273/' }],
    relatedTools: [{ href: '/gad7', label: 'GAD-7' }, { href: '/phq9', label: 'PHQ-9' }],
  },
  fagerstrom: {
    path: '/fagerstrom', title: 'Тест Фагерстрема', shortTitle: 'Тест Фагерстрема',
    description: 'Оцініть вираженість нікотинової залежності за коротким стандартизованим опитувальником.',
    disclaimer: 'Результат допомагає планувати підтримку відмови від куріння, але не замінює оцінку готовності, супутніх станів і протипоказань.',
    faq: [
      { question: 'Що оцінює тест Фагерстрема?', answer: 'Ступінь фізичної залежності від нікотину.' },
      { question: 'Чи визначає бал конкретне лікування?', answer: 'Ні. Вибір допомоги залежить також від готовності до відмови, анамнезу й клінічних обмежень.' },
      { question: 'Для чого корисний результат?', answer: 'Для структурування короткого втручання та плану підтримки відмови від куріння.' },
    ],
    sources: [{ label: 'Fagerström Test for Nicotine Dependence', href: 'https://pubmed.ncbi.nlm.nih.gov/11027948/' }],
    relatedTools: [{ href: '/score2', label: 'SCORE2' }, { href: '/audit-c', label: 'AUDIT-C' }],
  },
  epworth: {
    path: '/epworth', title: 'Шкала сонливості Епворт', shortTitle: 'Epworth',
    description: 'Оцініть суб’єктивну ймовірність засинання у восьми типових повсякденних ситуаціях.',
    disclaimer: 'Шкала оцінює денну сонливість, але не визначає її причину й не діагностує апное сну.',
    faq: [
      { question: 'Що оцінює шкала Епворт?', answer: 'Суб’єктивну схильність до засинання у восьми повсякденних ситуаціях.' },
      { question: 'Чи діагностує вона апное сну?', answer: 'Ні. Денна сонливість має різні причини, а апное сну потребує окремого оцінювання.' },
      { question: 'Чим доповнити оцінку?', answer: 'За підозри на апное сну доречно оцінити клінічні симптоми та STOP-Bang.' },
    ],
    sources: [{ label: 'Johns MW. Epworth Sleepiness Scale', href: 'https://pubmed.ncbi.nlm.nih.gov/1798888/' }],
    relatedTools: [{ href: '/stop-bang', label: 'STOP-Bang' }, { href: '/phq9', label: 'PHQ-9' }],
  },
  'barthel-index': {
    path: '/barthel-index', title: 'Індекс Бартел', shortTitle: 'Індекс Бартел',
    description: 'Оцініть фактичну незалежність людини у десяти базових активностях повсякденного життя.',
    disclaimer: 'Загальний бал не встановлює діагноз, групу інвалідності або потребу в конкретному засобі чи виді допомоги автоматично.',
    faq: [
      { question: 'Що оцінює індекс Бартел?', answer: 'Фактичну незалежність у базових активностях повсякденного життя.' },
      { question: 'Скільки компонентів потрібно заповнити?', answer: 'Усі десять компонентів.' },
      { question: 'Чи визначає бал групу інвалідності?', answer: 'Ні. Це функціональна оцінка, а не автоматичне адміністративне рішення.' },
    ],
    sources: [{ label: 'Академія НСЗУ — інструменти функціонального оцінювання', href: 'https://academy.nszu.gov.ua/pluginfile.php/415054/mod_page/content/101/%D0%86%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%20%D0%A4%D0%9E.pdf' }],
    relatedTools: [{ href: '/whodas-2', label: 'WHODAS 2.0' }, { href: '/rehabilitation-aids', label: 'Засоби реабілітації' }],
  },
  'whodas-2': {
    path: '/whodas-2', title: 'WHODAS 2.0 — 36 пунктів', shortTitle: 'WHODAS 2.0',
    description: 'Оцініть труднощі функціонування за шістьма доменами протягом останніх 30 днів.',
    disclaimer: 'Результат 0–100 описує вираженість труднощів функціонування, але не встановлює діагноз, інвалідність або потребу в конкретній допомозі.',
    faq: [
      { question: 'Що оцінює WHODAS 2.0?', answer: 'Функціонування у шести доменах протягом останніх 30 днів.' },
      { question: 'Чи включаються питання про роботу?', answer: 'Вони враховуються лише для людини, яка працює або навчається.' },
      { question: 'Чи застосовується автоматична категорія тяжкості?', answer: 'Ні. Показуються загальний результат і результати доменів без автоматичного адміністративного висновку.' },
    ],
    sources: [{ label: 'WHO Disability Assessment Schedule 2.0', href: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule' }],
    relatedTools: [{ href: '/barthel-index', label: 'Індекс Бартел' }, { href: '/rehabilitation-aids', label: 'Засоби реабілітації' }],
  },
  mmrc: {
    path: '/mmrc', title: 'Шкала задишки mMRC', shortTitle: 'mMRC',
    description: 'Оцініть вплив задишки на ходьбу та звичну повсякденну активність за шкалою 0–4.',
    disclaimer: 'mMRC описує функціональний вплив задишки, але не визначає її причину та не замінює оцінку гострих небезпечних станів.',
    faq: [
      { question: 'Що оцінює mMRC?', answer: 'Наскільки задишка обмежує ходьбу та звичну активність.' },
      { question: 'Скільки градацій має шкала?', answer: 'П’ять: від 0 до 4.' },
      { question: 'Чи є mMRC тестом функції легень?', answer: 'Ні. Це суб’єктивна функціональна оцінка, яку доповнюють клінічними й об’єктивними дослідженнями.' },
    ],
    sources: [{ label: 'GOLD Report and Pocket Guide', href: 'https://goldcopd.org/2026-gold-report-and-pocket-guide/' }],
    relatedTools: [{ href: '/bode-index', label: 'Індекс BODE' }, { href: '/6mwt', label: '6MWT' }],
  },
  'bode-index': {
    path: '/bode-index', title: 'Калькулятор індексу BODE', shortTitle: 'BODE',
    description: 'Комплексна оцінка при ХОЗЛ за ІМТ, бронхообструкцією, задишкою mMRC та дистанцією 6MWT.',
    disclaimer: 'BODE застосовують у контексті підтвердженого ХОЗЛ. Він не замінює спірометрію, оцінку загострення або індивідуальний прогноз.',
    faq: [
      { question: 'Які показники входять до BODE?', answer: 'ІМТ, ОФВ₁, задишка за mMRC і дистанція 6-хвилинного тесту ходьби.' },
      { question: 'Чи можна розрахувати BODE без спірометрії?', answer: 'Ні, для повного розрахунку потрібен відсоток належного ОФВ₁.' },
      { question: 'Для кого призначений індекс?', answer: 'Для комплексної оцінки пацієнтів із підтвердженим ХОЗЛ у стабільному клінічному контексті.' },
    ],
    sources: [{ label: 'Celli et al. BODE Index (NEJM, 2004)', href: 'https://www.nejm.org/doi/full/10.1056/NEJMoa021322' }],
    relatedTools: [{ href: '/mmrc', label: 'Шкала mMRC' }, { href: '/6mwt', label: '6MWT' }, { href: '/calculators/bmi', label: 'ІМТ' }],
  },
};

export function createPriorityToolMetadata(toolId) {
  const tool = prioritySeoTools[toolId];
  const url = `${siteUrl}${tool.path}`;
  const title = `${tool.title} | Асистент лікаря`;

  return {
    title,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: { title: tool.title, description: tool.description, url, siteName: 'Асистент лікаря', locale: 'uk_UA', type: 'website' },
    twitter: { card: 'summary_large_image', title: tool.title, description: tool.description },
  };
}
