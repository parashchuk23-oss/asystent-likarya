const sources = {
  niceStroke: { label: 'NICE NG236 — Stroke rehabilitation: swallowing', url: 'https://www.nice.org.uk/guidance/ng236/chapter/Recommendations' },
  niceNutrition: { label: 'NICE CG32 — Nutrition support for adults', url: 'https://www.nice.org.uk/guidance/cg32/chapter/Recommendations' },
  niceBowel: { label: 'NICE CG49 — Faecal incontinence in adults', url: 'https://www.nice.org.uk/guidance/cg49/chapter/Recommendations' },
  iddsi: { label: 'IDDSI Framework and Testing Methods', url: 'https://www.iddsi.org/resources/framework-documents' },
  whodas: { label: 'WHO Disability Assessment Schedule 2.0', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule' },
};

const tools = {
  swallowingScreen: {
    id: 'digestive-swallowing-screen', name: 'Клінічний скринінг ковтання', category: 'clinical',
    measures: 'Ознаки порушення безпечного й ефективного ковтання їжі, рідини та ліків.',
    indications: 'Інсульт, неврологічне захворювання, кашель під час їди, зміна голосу, повторні пневмонії, тривале або утруднене ковтання.',
    documents: 'Рівень свідомості, контроль слини, голос, кашель, ознаки утруднення та потребу в повній оцінці фахівцем.',
    metrics: ['контроль слини й оральна фаза', 'кашель або задишка під час їди', 'зміна голосу після ковтання', 'тривалість і втома під час приймання їжі'],
    limitations: 'Нормальний клінічний скринінг не виключає тиху аспірацію. Пробу з їжею або рідиною проводить лише підготовлений фахівець за чинним протоколом.',
    safety: 'При неможливості захистити дихальні шляхи, вираженій задишці, повторному задусі або підозрі на аспірацію пероральну пробу припиняють і організовують термінову профільну оцінку.',
    source: sources.niceStroke,
  },
  oralIntake: {
    id: 'digestive-oral-intake', name: 'Функціональний рівень приймання їжі', category: 'supportive',
    measures: 'Що пацієнт фактично може безпечно споживати, скільки часу це займає і яка допомога потрібна.',
    indications: 'Дисфагія, зміна консистенції, зондове харчування або контроль відновлення приймання їжі.',
    documents: 'Шлях харчування, дозволені консистенції, обсяг споживання, допомогу, позиціонування та нагляд.',
    limitations: 'Це структурований опис, а не відтворення захищеної шкали; безпечність консистенції визначає фахівець після повної оцінки.',
    source: sources.niceStroke,
  },
  iddsi: {
    id: 'digestive-iddsi', name: 'Консистенції IDDSI', category: 'clinical',
    measures: 'Стандартизований рівень густини рідини та текстури їжі.',
    indications: 'Коли після оцінки ковтання призначено модифіковану консистенцію.',
    documents: 'Окремий рівень IDDSI для рідини й їжі, спосіб перевірки, температуру подачі та потребу в нагляді.',
    protocol: 'Використовуйте актуальні офіційні визначення і методи тестування IDDSI; перевіряйте продукт у тих умовах, у яких його подають пацієнту.',
    limitations: 'IDDSI стандартизує консистенцію, але не визначає, який рівень безпечний для конкретної людини.',
    source: sources.iddsi,
  },
  nutritionRisk: {
    id: 'digestive-nutrition-risk', name: 'Ризик недостатнього харчування', category: 'clinical',
    measures: 'ІМТ, ненавмисну втрату маси та тривалість суттєво зниженого споживання.',
    indications: 'Зменшення апетиту, схуднення, дисфагія, погане загоєння, тривала хвороба або підвищені потреби.',
    documents: 'Поточну і попередню масу, період зміни, ІМТ, фактичне споживання та причину його зниження.',
    metrics: ['ІМТ', 'відсоток ненавмисної втрати маси за 3–6 місяців', 'період мінімального або відсутнього споживання', 'ознаки підвищених втрат чи потреб'],
    limitations: 'Скринінг має виконувати підготовлений медичний працівник; він не замінює дієтологічну оцінку та план нутритивної підтримки.',
    safety: 'Після тривалого майже повного голодування початок нутритивної підтримки потребує оцінки ризику синдрому відновлення харчування та відповідного моніторингу.',
    source: sources.niceNutrition,
  },
  bowelDiary: {
    id: 'digestive-bowel-diary', name: 'Щоденник кишкових функцій', category: 'functional',
    measures: 'Частоту дефекації, епізоди ургентності або нетримання, натужування, допоміжні заходи та зв’язок із харчуванням і ліками.',
    indications: 'Закреп, діарея, нетримання калу, непередбачуване випорожнення або нейрогенна дисфункція кишечника.',
    documents: 'Час, тип випорожнення за прийнятим описом, ургентність, підтікання, біль, ручні прийоми, препарати та доступ до туалету.',
    limitations: 'Щоденник описує патерн, але не встановлює причину; перед функціональним планом потрібно виключити каловий завал і органічні захворювання.',
    source: sources.niceBowel,
  },
  bowelImpact: {
    id: 'digestive-bowel-impact', name: 'Континенція і функціональний вплив', category: 'supportive',
    measures: 'Вплив кишкових симптомів на гігієну, одягання, сон, вихід із дому, роботу та участь.',
    indications: 'Для визначення потрібної допомоги, доступу до туалету й особистих цілей пацієнта.',
    documents: 'Тип і частоту епізодів, потрібну допомогу, засоби догляду, обмежені активності та вплив на гідність і приватність.',
    limitations: 'Не пояснює механізм симптомів і не замінює анамнез, огляд та оцінку потенційно виліковних причин.',
    safety: 'Кровотеча, ознаки непрохідності, гострий сильний біль, токсичне розширення кишки або нове нетримання з ознаками синдрому кінського хвоста потребують термінової оцінки.',
    source: sources.niceBowel,
  },
  whodas: {
    id: 'digestive-whodas', name: 'WHODAS 2.0', questionnaireId: 'whodas-36', actionLabel: 'Провести WHODAS 2.0 →', category: 'functional',
    measures: 'Загальний вплив стану на функціонування у шести доменах за останні 30 днів.',
    indications: 'Комплексні стани, коли ковтання, харчування або кишкові симптоми впливають на ширші сфери життя.',
    documents: 'Профіль шести доменів і загальний результат 0–100.',
    limitations: 'Не оцінює ризик аспірації, нутритивний статус або причину кишкових симптомів.', source: sources.whodas,
  },
};

export const digestiveAssessmentProfiles = [
  { id: 'basic', label: 'Базова оцінка', description: 'Ковтання, харчування, кишковий патерн і загальний функціональний вплив.', tools: [tools.swallowingScreen, tools.nutritionRisk, tools.bowelDiary, tools.whodas] },
  { id: 'dysphagia', label: 'Дисфагія', description: 'Безпечність ковтання, фактичне приймання їжі та стандартизована консистенція.', tools: [tools.swallowingScreen, tools.oralIntake, tools.iddsi, tools.nutritionRisk] },
  { id: 'nutrition', label: 'Ризик недостатнього харчування', description: 'Маса тіла, фактичне споживання, безпечність ковтання та потреба в поглибленій оцінці.', tools: [tools.nutritionRisk, tools.swallowingScreen, tools.oralIntake, tools.whodas] },
  { id: 'bowel', label: 'Кишкові функції', description: 'Закреп, нетримання, щоденний патерн, допомога і вплив на участь.', tools: [tools.bowelDiary, tools.bowelImpact, tools.whodas] },
];

export const digestiveAssessmentSection = {
  id: 'digestive-functions', title: 'Ковтання, харчування та кишкові функції', eyebrow: 'Травна система',
  description: 'Короткі маршрути для документування дисфагії, фактичного приймання їжі, нутритивного ризику, дефекації, континенції та повсякденного впливу.',
  note: 'Не проводьте пробне ковтання без належної підготовки й протоколу. Ознаки аспірації, кишкової непрохідності, значної кровотечі або гострого неврологічного порушення потребують термінового клінічного маршруту.',
};
