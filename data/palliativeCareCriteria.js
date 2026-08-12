export const palliativeCareSource = {
  order: 'Наказ МОЗ України №1308 від 04.06.2020',
  title: 'Про удосконалення організації надання паліативної допомоги в Україні',
  revisionDate: '20.03.2025',
  checkedAt: '12.08.2026',
  url: 'https://zakon.rada.gov.ua/laws/show/z0609-20',
};

const coreFunctionalCriteria = [
  'Індекс Карновського ≤ 50.',
  'Шкала PPS ≤ 30 %.',
  'Шкала Бартел < 25.',
];

const respiratorySupportCriteria = [
  'Сатурація менше 85 %.',
  'Необхідність застосування кисневої терапії або ШВЛ.',
  'Залежність від аспіратора.',
  'Аспіраційна пневмонія.',
  'Гіпостатична пневмонія.',
  'Дихання через трахеостому.',
];

const nutritionCriteria = [
  'Втрата ваги >10 % за 3 місяці.',
  'Кахексія.',
  'Довготривала, стійка до лікування анорексія.',
  'Порушення ковтання.',
  'Потреба в ентеральному харчуванні через зонд або гастростому.',
  'Потреба у парентеральному харчуванні.',
];

const careDependenceCriteria = [
  'Наявність постійного сечового катетера або перемінна катетеризація.',
  'Наявність нефростоми / цистостоми / уростоми.',
  'Наявність колостоми.',
  'Належневі рани III-IV ступеня.',
  'Об’ємні трофічні виразки.',
  'Гангрена.',
  'Тетраплегія, параплегія, геміплегія.',
  'Наявність м’язової атрофії.',
  'Наявність контрактур великих суглобів.',
  'Іммобільність.',
  'Нетримання сечі та калу.',
  'Стан свідомості - сопор або кома.',
  'Стійкий вегетативний (апалічний) стан.',
  'Прогресуюче порушення когнітивних функцій за шкалою MMSE.',
];

const commonSystemicCriteria = [
  'Хронічний больовий синдром.',
  'Потреба у використанні опіоїдів.',
  'Задишка.',
  'Прогресуючий плевральний / перитонеальний / перикардіальний випіт.',
  'Набряки.',
  'Лімфостаз.',
  'Анасарка.',
  'Анемія.',
  'Гепаторенальний синдром з олігурією < 400 мл/добу.',
];

function criteria(...items) {
  return Array.from(new Set(items.flat().filter(Boolean)));
}

export const palliativeCareAdultCriteria = [
  {
    id: 'neoplasms',
    title: 'Новоутворення',
    condition:
      'Підтверджений діагноз новоутворення (C00-D48): метастатичне або місцево поширене новоутворення, що прогресує, незважаючи на лікування.',
    scaleCriteria: ['ECOG > 2.', ...coreFunctionalCriteria],
    clinicalCriteria: criteria(
      commonSystemicCriteria,
      respiratorySupportCriteria,
      nutritionCriteria,
      careDependenceCriteria,
      ['Кровохаркання.', 'Міастенія.']
    ),
  },
  {
    id: 'respiratory',
    title: 'Хронічні захворювання дихальної системи',
    condition:
      'J40-J47 та інші визначені наказом стани з підтвердженою дихальною недостатністю (J96).',
    scaleCriteria: ['mMRC рівень 3 або 4.', ...coreFunctionalCriteria],
    clinicalCriteria: criteria(
      [
        'Задишка, що не зменшується при використанні бронходилататорів.',
        'FEV1 (ОФВ1) < 30 %.',
        'CVF (ФЖЄЛ) < 40 %.',
        'DLCO (ДЗЛ) < 40 %.',
      ],
      respiratorySupportCriteria,
      commonSystemicCriteria.filter((item) => item !== 'Гепаторенальний синдром з олігурією < 400 мл/добу.'),
      nutritionCriteria.filter((item) => !item.startsWith('Втрата ваги') && !item.startsWith('Кахексія')),
      careDependenceCriteria.filter((item) => !item.includes('нефростоми') && !item.includes('колостоми') && !item.includes('Гангрена'))
    ),
  },
  {
    id: 'cardiovascular',
    title: 'Хронічні серцево-судинні захворювання',
    condition:
      'Підтверджена серцева недостатність (I50) та/або кардіоміопатія (I42-I43) та легенева артеріальна гіпертензія (I27).',
    scaleCriteria: ['NYHA клас 3 або 4.', ...coreFunctionalCriteria],
    clinicalCriteria: criteria(
      [
        'Відчуття задухи у стані спокою або при мінімальних фізичних навантаженнях.',
        'Фракція викиду лівого шлуночка < 40 %.',
        'Підвищена потреба в діуретиках і рефрактерність до діуретиків, пов’язана з погіршенням функції нирок.',
        'Прогресуюче зниження рівня натрію в сироватці (<133 ммоль/л).',
      ],
      respiratorySupportCriteria.filter((item) => !item.includes('пневмонія')),
      commonSystemicCriteria.filter((item) => item !== 'Задишка.'),
      nutritionCriteria.filter((item) => !item.startsWith('Втрата ваги') && !item.startsWith('Кахексія') && !item.startsWith('Довготривала')),
      careDependenceCriteria
    ),
  },
  {
    id: 'liver',
    title: 'Хронічні захворювання печінки',
    condition: 'K70-K77 із підтвердженою термінальною стадією.',
    scaleCriteria: [
      'Child-Pugh клас B або C за критеріями наказу.',
      'BCLC стадія C або D.',
      'MELD > 30.',
      ...coreFunctionalCriteria,
    ],
    clinicalCriteria: criteria(
      [
        'Пацієнт не знаходиться в листі очікування на трансплантацію, оскільки є протипоказання.',
        'Асцит.',
        'Печінкова енцефалопатія, рефрактерна до лікування.',
        'Рецидивуюча варикозна кровотеча.',
        'Триваючий активний алкоголізм (> 80 г етанолу на день).',
        'Протромбіновий час подовжений більше ніж на 5 секунд або МНВ > 1,5; сироватковий альбумін < 2,5 г/дл.',
      ],
      commonSystemicCriteria,
      respiratorySupportCriteria.filter((item) => !item.includes('Аспіраційна') && !item.includes('Кровохаркання') && !item.includes('трахеостому')),
      nutritionCriteria,
      careDependenceCriteria.filter((item) => !item.includes('нефростоми') && !item.includes('колостоми') && !item.includes('Гангрена') && !item.includes('Міастенія'))
    ),
  },
  {
    id: 'kidney',
    title: 'Хронічні захворювання нирок',
    condition: 'N18 із підтвердженою нирковою недостатністю.',
    scaleCriteria: ['Стадія хронічної хвороби нирок ≥ 4.', ...coreFunctionalCriteria],
    clinicalCriteria: criteria(
      [
        'Пацієнт отримує лікування методом гемодіалізу / перитонеального діалізу.',
        'Пацієнт не знаходиться в листі очікування на трансплантацію, оскільки є протипоказання.',
      ],
      commonSystemicCriteria,
      respiratorySupportCriteria.filter((item) => !item.includes('Аспіраційна') && !item.includes('Кровохаркання') && !item.includes('трахеостому')),
      nutritionCriteria.filter((item) => !item.startsWith('Довготривала') && !item.startsWith('Порушення ковтання')),
      careDependenceCriteria.filter((item) => !item.includes('колостоми') && !item.includes('Гангрена') && !item.includes('Міастенія'))
    ),
  },
  {
    id: 'neurologic',
    title: 'Неврологічні ураження',
    condition:
      'Підтверджені наслідки цереброваскулярних хвороб, уражень ЦНС, розсіяного склерозу, хвороби Паркінсона, Альцгеймера, церебрального паралічу, епілепсії, захворювань рухових нейронів.',
    scaleCriteria: [
      'При наслідках інсульту: сумарний індекс Бартел < 25.',
      'При розсіяному склерозі: EDSS ≥ 8.',
      'При хворобі Паркінсона: шкала Хена та Яра ≥ III.',
      'При церебральному паралічі: GMFCS рівень 3-5.',
      'При хворобі Альцгеймера: FAST 7a-7f або GDS 6-7.',
      ...coreFunctionalCriteria,
    ],
    clinicalCriteria: criteria(
      commonSystemicCriteria,
      respiratorySupportCriteria,
      nutritionCriteria.filter((item) => !item.startsWith('Втрата ваги') && !item.startsWith('Довготривала')),
      careDependenceCriteria,
      ['Рівень альбумінів у сироватці < 25 г/л.', 'Хронічний больовий синдром, у тому числі нейропатичний біль.']
    ),
  },
  {
    id: 'diabetes',
    title: 'Цукровий діабет',
    condition: 'Цукровий діабет (E10-E14).',
    scaleCriteria: coreFunctionalCriteria,
    clinicalCriteria: criteria(
      [
        'Декомпенсований діабет: високий HbA1c, глюкоза крові > 15 ммоль/л, що не піддається корекції.',
        'Хронічний больовий синдром, у тому числі фантомний біль.',
      ],
      respiratorySupportCriteria.filter((item) => !item.includes('Кровохаркання') && !item.includes('трахеостому')),
      commonSystemicCriteria.filter((item) => item !== 'Задишка.'),
      nutritionCriteria,
      careDependenceCriteria
    ),
  },
  {
    id: 'trauma',
    title: 'Тяжкі післятравматичні стани',
    condition:
      'T90.5, T91.3, T91.4, T91.5, R40.3, R26.3: наслідки внутрішньочерепної травми, травми спинного мозку, внутрішньогрудних, черевних або тазових органів.',
    scaleCriteria: coreFunctionalCriteria,
    clinicalCriteria: criteria(
      [
        'Хронічний больовий синдром.',
        'Потреба у використанні опіоїдів.',
        'Гідроцефалія.',
        'Рівень альбумінів у сироватці < 25 г/л.',
      ],
      respiratorySupportCriteria,
      nutritionCriteria.filter((item) => !item.startsWith('Втрата ваги') && !item.startsWith('Довготривала')),
      careDependenceCriteria,
      ['Набряки.', 'Лімфостаз.', 'Прогресуючий плевральний / перитонеальний / перикардіальний випіт.', 'Анасарка.']
    ),
  },
  {
    id: 'mental-dementia',
    title: 'Хронічні психічні захворювання, деменція',
    condition: 'F00-F04, G30.',
    scaleCriteria: ['FAST 6C-7F.', 'Clinical Dementia Rating (CDR) ≥ 3.', 'GDS 6-7.', ...coreFunctionalCriteria],
    clinicalCriteria: criteria(
      commonSystemicCriteria,
      respiratorySupportCriteria,
      nutritionCriteria,
      careDependenceCriteria
    ),
  },
  {
    id: 'tuberculosis',
    title: 'Туберкульоз',
    condition:
      'A15-A19: мультирезистентна форма, широка лікарська стійкість, ускладнені форми, коінфекція, тяжкі розлади життєдіяльності або термінальна стадія.',
    scaleCriteria: coreFunctionalCriteria,
    clinicalCriteria: criteria(
      [
        'Задишка, що не зменшується при використанні бронходилататорів.',
        'FEV1 (ОФВ1) < 30 %.',
        'CVF (ФЖЄЛ) < 40 %.',
        'DLCO < 40 %.',
        'Зменшення FEV1 на 40 мл/рік протягом щонайменше 3 років.',
      ],
      respiratorySupportCriteria,
      commonSystemicCriteria.filter((item) => item !== 'Гепаторенальний синдром з олігурією < 400 мл/добу.'),
      nutritionCriteria.filter((item) => !item.startsWith('Втрата ваги') && !item.startsWith('Кахексія') && !item.startsWith('Довготривала') && !item.startsWith('Порушення ковтання')),
      careDependenceCriteria.filter((item) => !item.includes('нефростоми') && !item.includes('колостоми') && !item.includes('Гангрена') && !item.includes('Міастенія'))
    ),
  },
  {
    id: 'hiv-aids',
    title: 'ВІЛ/СНІД',
    condition:
      'B20-B23: тяжкі опортуністичні мультирезистентні СНІД-інфекції, супутні злоякісні новоутворення, термінальна деменція, тяжкі серцеві / легеневі / ниркові захворювання або резистентність до АРТ.',
    scaleCriteria: coreFunctionalCriteria,
    clinicalCriteria: criteria(
      commonSystemicCriteria,
      respiratorySupportCriteria,
      nutritionCriteria,
      careDependenceCriteria,
      ['Когнітивні порушення / постінсультна деменція.']
    ),
  },
  {
    id: 'congenital-genetic-metabolic',
    title: 'Вроджені вади розвитку, генетичні та метаболічні порушення',
    condition:
      'Розділи E, Q, M за МКХ-10: вроджені вади розвитку, ендокринні та метаболічні порушення, орфанні захворювання.',
    scaleCriteria: coreFunctionalCriteria,
    clinicalCriteria: criteria(
      commonSystemicCriteria,
      respiratorySupportCriteria,
      nutritionCriteria,
      careDependenceCriteria,
      ['Хронічний больовий синдром, у тому числі фантомний біль.']
    ),
  },
];
