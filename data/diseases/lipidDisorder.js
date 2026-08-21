export const lipidDisorderDisease = {
  id: 'lipidDisorder',
  title: 'Порушення ліпідного обміну',
  shortTitle: 'Ліпіди',
  category: 'Кардіологія',
  summary:
    'Практичний шаблон для формулювання гіперхолестеринемії, гіпертригліцеридемії або змішаної гіперліпідемії з МКХ-10 і короткими рекомендаціями.',
  diagnosticCriteria: [
    'Основні сценарії: гіперхолестеринемія, гіпертригліцеридемія або змішана гіперліпідемія.',
    'ЛПНЩ допомагає визначити ціль і потребу в інтенсифікації ліпідознижувальної терапії відповідно до серцево-судинного ризику.',
    'ТГ важливі не лише для кардіометаболічного ризику: при ТГ понад 10 ммоль/л ризик гострого панкреатиту є клінічно значущим; панкреатит можливий і при 5-10 ммоль/л за наявності додаткових факторів.',
    'При гіпертригліцеридемії варто шукати вторинні причини: декомпенсований ЦД, алкоголь, ожиріння, гіпотиреоз, ХХН, ліки та сімейні форми.',
  ],
  diagnosisConstructor: {
    textPrefix: '',
    icd10Options: [
      {
        field: 'lipidType',
        value: 'Гіперхолестеринемія',
        items: [
          {
            code: 'E78.0',
            label: 'Чиста гіперхолестеринемія',
          },
        ],
      },
      {
        field: 'lipidType',
        value: 'Гіпертригліцеридемія',
        items: [
          {
            code: 'E78.1',
            label: 'Чиста гіпергліцеридемія',
          },
        ],
      },
      {
        field: 'lipidType',
        value: 'Змішана гіперліпідемія',
        items: [
          {
            code: 'E78.2',
            label: 'Змішана гіперліпідемія',
          },
        ],
      },
    ],
    selectFields: [
      {
        id: 'lipidType',
        label: 'Клінічний сценарій',
        defaultValue: 'Гіперхолестеринемія',
        options: [
          { value: 'Гіперхолестеринемія', label: 'Гіперхолестеринемія' },
          { value: 'Гіпертригліцеридемія', label: 'Гіпертригліцеридемія' },
          { value: 'Змішана гіперліпідемія', label: 'Змішана гіперліпідемія' },
        ],
      },
    ],
    checkboxGroups: [],
    freeTextFields: [
      {
        id: 'ldl',
        label: 'ЛПНЩ',
        placeholder: 'Наприклад: 3.4',
        suffix: ' ммоль/л',
      },
      {
        id: 'triglycerides',
        label: 'ТГ',
        placeholder: 'Наприклад: 2.1',
        suffix: ' ммоль/л',
      },
      {
        id: 'cvRisk',
        label: 'Серцево-судинний ризик',
        placeholder: '1, 2, 3 або 4',
      },
      {
        id: 'score',
        label: 'SCORE',
        placeholder: 'Наприклад: 6%',
      },
    ],
  },
  recommendationGroups: {
    labs: [
      { id: 'lipid-panel', text: 'ліпідограма' },
      { id: 'alt-ast', text: 'АЛТ / АСТ' },
      { id: 'bilirubin', text: 'білірубін' },
      { id: 'ggt', text: 'ГГТ' },
      { id: 'alkaline-phosphatase', text: 'лужна фосфатаза' },
      { id: 'glucose', text: 'глюкоза крові' },
      { id: 'hba1c', text: 'HbA1c' },
      { id: 'creatinine', text: 'креатинін' },
      { id: 'tsh', text: 'ТТГ' },
    ],
    instrumental: [
      { id: 'carotid-ultrasound', text: 'УЗД судин шиї' },
      { id: 'abdominal-ultrasound', text: 'УЗД ОЧП' },
    ],
    consultations: [
      { id: 'cardiologist', text: 'кардіолог' },
      { id: 'endocrinologist', text: 'ендокринолог' },
    ],
    lifestyle: [
      { id: 'mediterranean-diet', text: 'середземноморська дієта' },
      { id: 'weight-control', text: 'контроль маси тіла' },
      { id: 'smoking-cessation', text: 'відмова від куріння' },
      { id: 'alcohol-limit', text: 'обмеження алкоголю, особливо при підвищених ТГ' },
      { id: 'simple-carbs-limit', text: 'обмеження простих вуглеводів при підвищених ТГ' },
      {
        id: 'lipid-control',
        text: 'контроль ліпідограми через 6-12 тижнів після старту або зміни терапії',
      },
      {
        id: 'pancreatitis-risk',
        text: 'при ТГ >10 ммоль/л оцінити ризик гострого панкреатиту та потребу в невідкладній корекції ТГ',
      },
    ],
    medications: [
      { id: 'lipid-lowering-therapy', text: 'ліпідознижувальна терапія' },
    ],
  },
  sourceNote:
    'Орієнтир: ESC/EAS підхід до дисліпідемій і гіпертригліцеридемії. Формулювання є шаблоном для редагування лікарем.',
  disclaimer:
    'Цей блок є практичним шаблоном для лікаря і не замінює клінічне рішення, чинні локальні протоколи або індивідуальну оцінку пацієнта.',
};
