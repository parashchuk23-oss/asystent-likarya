const sources = {
  nszu: { label: 'Академія НСЗУ — Інструменти оцінювання функціонування', url: 'https://academy.nszu.gov.ua/pluginfile.php/415054/mod_page/content/101/%D0%86%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%20%D0%A4%D0%9E.pdf' },
  icope: { label: 'WHO ICOPE — person-centred assessment and pathways in primary care', url: 'https://www.who.int/publications/i/item/9789240103726' },
  whodas: { label: 'WHO Disability Assessment Schedule 2.0', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule' },
};

const tools = {
  barthel: {
    id: 'daily-barthel', name: 'Індекс Бартел', questionnaireId: 'barthel-index', actionLabel: 'Провести оцінювання →', category: 'functional',
    measures: 'Фактичну незалежність у десяти базових активностях повсякденного життя.',
    indications: 'Після інсульту, травми, операції або при іншому стані, що обмежує самообслуговування та мобільність.',
    documents: 'Харчування, гігієну, одягання, туалет, континенцію, переміщення, ходьбу та сходи.',
    metrics: ['результат кожної активності', 'загальний результат 0–100', 'фізична або вербальна допомога'],
    interpretation: 'Фіксуйте те, що людина фактично робить, а не лише те, що теоретично може виконати.',
    limitations: 'Не охоплює повністю складні побутові завдання, когніцію, домашнє середовище та участь у суспільстві.', source: sources.nszu,
  },
  taskObservation: {
    id: 'daily-task-observation', name: 'Спостереження за виконанням дії', category: 'clinical',
    measures: 'Як людина починає, послідовно виконує та безпечно завершує конкретну повсякденну дію.',
    indications: 'Коли самооцінка не пояснює реальний рівень допомоги або потрібно підібрати адаптацію.',
    documents: 'Обрану дію, час, помилки, фізичні й когнітивні труднощі, підказки, допомогу та використані засоби.',
    metrics: ['самостійно', 'із наглядом або підказкою', 'із частковою допомогою', 'із повною допомогою'],
    limitations: 'Одна дія в кабінеті може не відображати виконання вдома; оцінюйте у звичному контексті, якщо це можливо.', source: sources.icope,
  },
  instrumentalActivities: {
    id: 'daily-instrumental-activities', name: 'Складні побутові дії', category: 'supportive',
    measures: 'Незалежність у діях, потрібних для проживання в громаді.',
    indications: 'Раннє функціональне зниження, когнітивні труднощі, планування виписки або визначення необхідної підтримки.',
    documents: 'Фактичне виконання, звичний попередній рівень, причину допомоги та людину, яка її надає.',
    metrics: ['ліки й медичні призначення', 'покупки та приготування їжі', 'телефон і цифровий зв’язок', 'фінанси й документи', 'транспорт і домашні справи'],
    limitations: 'Це структурований опис, а не відтворення шкали Lawton. Враховуйте звичні ролі, культуру, доступність послуг, зір, слух і рухливість.', source: sources.icope,
  },
  homeSafety: {
    id: 'daily-home-safety', name: 'Безпека домашнього середовища', category: 'supportive',
    measures: 'Перешкоди вдома, які збільшують ризик падіння, опіку, помилки з ліками або неможливості звернутися по допомогу.',
    indications: 'Падіння, когнітивне чи сенсорне порушення, нова залежність, виписка додому або проживання наодинці.',
    documents: 'Доступ до входу, туалету й ліжка, освітлення, сходи, килими, ванну, кухню, зберігання ліків і засіб зв’язку.',
    limitations: 'Оцінка зі слів не замінює огляд середовища ерготерапевтом або іншим підготовленим фахівцем.',
    safety: 'Якщо людина не може забезпечити їжу, ліки, базову гігієну або виклик допомоги, потрібен невідкладний план безпечної підтримки до повернення додому.', source: sources.icope,
  },
  assistancePlan: {
    id: 'daily-assistance-plan', name: 'Потреба в допомозі та нагляді', category: 'supportive',
    measures: 'Для яких дій потрібні фізична допомога, нагляд, словесна підказка або організаційна підтримка.',
    indications: 'Планування виписки, домашнього догляду, реабілітації або повторної оцінки в динаміці.',
    documents: 'Конкретну дію, тип і частоту допомоги, безпечність виконання, доступного помічника та незакриті потреби.',
    limitations: 'Не визначає юридичний статус, групу інвалідності, обсяг соціальної послуги або право на конкретний засіб автоматично.', source: sources.icope,
  },
  whodas: {
    id: 'daily-whodas', name: 'WHODAS 2.0', questionnaireId: 'whodas-36', actionLabel: 'Провести WHODAS 2.0 →', category: 'functional',
    measures: 'Функціонування у шести доменах за останні 30 днів.',
    indications: 'Коли потрібно доповнити базове самообслуговування оцінкою когніції, мобільності, життєвої активності та участі.',
    documents: 'Результати шести доменів і загальний результат 0–100.',
    limitations: 'Не замінює спостереження за конкретними діями та не визначає обсяг сторонньої допомоги автоматично.', source: sources.whodas,
  },
};

export const dailyLivingAssessmentProfiles = [
  { id: 'basic', label: 'Базова оцінка', description: 'Самообслуговування, складні побутові дії та загальне функціонування.', tools: [tools.barthel, tools.instrumentalActivities, tools.whodas] },
  { id: 'basic-adl', label: 'Базове самообслуговування', description: 'Фактичне виконання гігієни, одягання, харчування, туалету й переміщень.', tools: [tools.barthel, tools.taskObservation, tools.assistancePlan] },
  { id: 'community', label: 'Незалежність у побуті', description: 'Ліки, покупки, харчування, фінанси, транспорт і домашні справи.', tools: [tools.instrumentalActivities, tools.taskObservation, tools.homeSafety, tools.assistancePlan] },
  { id: 'discharge', label: 'Безпечна виписка додому', description: 'Домашнє середовище, доступна допомога та незакриті потреби.', tools: [tools.barthel, tools.homeSafety, tools.assistancePlan, tools.whodas] },
];

export const dailyLivingAssessmentSection = {
  id: 'daily-living', title: 'Самообслуговування та побутова незалежність', eyebrow: 'Активність і участь',
  description: 'Оцінка того, що людина фактично виконує самостійно, де потребує нагляду або допомоги та чи є безпечним повернення до звичного середовища.',
  note: 'Оцінюйте реальне виконання, а не лише потенційну здатність. Результати допомагають сформувати план підтримки, але не визначають інвалідність, соціальну послугу або засіб реабілітації автоматично.',
};
