import { rehabilitationLegalSources as legal } from './legalSources';

export const rehabilitationEvidenceCategories = {
  normative: {
    label: 'Нормативний критерій',
    icon: '🔵',
    classes: 'border-blue-200 bg-blue-50 text-blue-900',
  },
  functional: {
    label: 'Валідований функціональний інструмент',
    icon: '🟢',
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  clinical: {
    label: 'Клінічний об’єктивний доказ',
    icon: '🟡',
    classes: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  product: {
    label: 'Продуктова підказка',
    icon: '⚪',
    classes: 'border-slate-200 bg-slate-50 text-slate-800',
  },
};

const commonAssessments = {
  tug: {
    id: 'tug',
    name: 'Timed Up and Go (TUG)',
    category: 'functional',
    measures: 'Функціональну мобільність: вставання, коротку ходьбу, розворот і сідання.',
    implementation: 'protocol',
    protocolType: 'single-time',
    resultLabel: 'Час виконання TUG',
    resultUnit: 'с',
    source: { label: 'Podsiadlo & Richardson, 1991 — оригінальна публікація TUG', url: 'https://pubmed.ncbi.nlm.nih.gov/1991946/' },
    licenseNotice: 'Для MVP використовується власна форма документування часу без копіювання захищеної форми.',
  },
  tenMeterWalk: {
    id: '10mwt',
    name: '10-метровий тест ходьби (10MWT)',
    category: 'functional',
    measures: 'Швидкість ходьби у стандартизованих умовах.',
    implementation: 'protocol',
    protocolType: 'walk-speed',
    resultLabel: '10MWT',
    source: { label: 'Academy of Neurologic Physical Therapy — 10MWT pocket guide', url: 'https://www.neuropt.org/docs/default-source/cpgs/core-outcome-measures/10mwt-pocket-guide-rev-0520.pdf' },
  },
  timed25FootWalk: {
    id: 't25fw',
    name: 'Timed 25-Foot Walk (T25FW)',
    category: 'functional',
    measures: 'Швидкість короткої ходьби як компонент функціонального оцінювання при розсіяному склерозі.',
    implementation: 'protocol',
    protocolType: 'two-trial-time',
    resultLabel: 'T25FW',
    resultUnit: 'с',
    source: { label: 'MSFC Administration and Scoring Manual', url: 'https://mstrust.org.uk/sites/default/files/MSFC.pdf' },
  },
  sixMinuteWalk: {
    id: 'six-minute-walk-test',
    name: '6-хвилинний тест ходьби (6MWT)',
    category: 'functional',
    measures: 'Субмаксимальну спроможність ходьби та переносимість навантаження.',
    questionnaireId: 'six-minute-walk-test',
  },
  barthel: {
    id: 'barthel-index',
    name: 'Індекс Бартел',
    category: 'functional',
    measures: 'Незалежність у базових активностях повсякденного життя.',
    questionnaireId: 'barthel-index',
    licenseNotice: 'До публічного розширення електронної форми потрібна окрема перевірка прав на відтворення.',
  },
  whodas: {
    id: 'whodas-36',
    name: 'WHODAS 2.0',
    category: 'functional',
    measures: 'Функціонування у шести доменах незалежно від діагнозу.',
    questionnaireId: 'whodas-36',
    licenseNotice: 'Електронне відтворення потребує окремого врегулювання ліцензії WHO.',
  },
};

export const rehabilitationPilotRoutes = [
  {
    id: 'multiple-sclerosis',
    code: 'G35',
    title: 'Розсіяний склероз',
    description: 'Пілотний маршрут оцінювання функціональних наслідків розсіяного склерозу.',
    codeNotice: 'Код МКХ є стартовою точкою і не визначає потребу в реабілітації або ДЗР автоматично.',
    domains: [
      {
        id: 'mobility',
        title: 'Мобільність і ходьба',
        prompt: 'Чи є порушення ходьби, вставання, розворотів, рівноваги або падіння?',
        assessor: 'Фізичний терапевт; лікар фізичної та реабілітаційної медицини у складі МДРК.',
        rehabilitationNeed: 'При підтвердженому обмеженні може потребувати оцінювання фізичним терапевтом.',
        assessments: [commonAssessments.timed25FootWalk, commonAssessments.tug, commonAssessments.tenMeterWalk, commonAssessments.sixMinuteWalk],
      },
      {
        id: 'upper-limb',
        title: 'Функція верхніх кінцівок',
        prompt: 'Чи є порушення хапання, відпускання, точності рухів або використання руки в побуті?',
        assessor: 'Ерготерапевт; за потреби ортезування — лікар і протезист-ортезист.',
        rehabilitationNeed: 'При підтвердженому порушенні руки може потребувати оцінювання ерготерапевтом.',
        assessments: [
          {
            id: 'nine-hole-peg-test',
            name: '9-Hole Peg Test',
            category: 'functional',
            measures: 'Швидкість і спритність дрібних рухів кисті.',
            implementation: 'protocol',
            protocolType: 'bilateral-time',
            resultLabel: '9-Hole Peg Test',
            source: { label: 'Rehabilitation Measures Database — 9HPT instructions', url: 'https://www.sralab.org/sites/default/files/2017-07/Nine%20Hole%20Peg%20Test%20Instructions.pdf' },
          },
        ],
      },
      {
        id: 'self-care',
        title: 'Самообслуговування',
        prompt: 'Чи є труднощі з одяганням, гігієною, харчуванням, туалетом або переміщенням?',
        assessor: 'Ерготерапевт та інші члени МДРК відповідно до виявленої потреби.',
        rehabilitationNeed: 'При підтвердженому обмеженні може потребувати оцінювання ерготерапевтом.',
        assessments: [commonAssessments.barthel, commonAssessments.whodas],
      },
      {
        id: 'cognition-communication',
        title: 'Когнітивні функції та комунікація',
        prompt: 'Чи є сповільнення обробки інформації, порушення уваги, пам’яті, мовлення або комунікації?',
        assessor: 'Відповідний лікар, психолог та/або терапевт мови і мовлення у складі команди.',
        rehabilitationNeed: 'При підтвердженому порушенні може потребувати профільного оцінювання членом МДРК.',
        assessments: [
          {
            id: 'sdmt',
            name: 'Symbol Digit Modalities Test (SDMT)',
            category: 'functional',
            measures: 'Швидкість обробки інформації та увагу.',
            implementation: 'reference-only',
            licenseNotice: 'Захищений інструмент: повні стимули та ключі на сайті не відтворюються.',
          },
          commonAssessments.whodas,
        ],
      },
    ],
  },
  {
    id: 'stroke-sequelae',
    code: 'I69',
    title: 'Наслідки цереброваскулярної хвороби',
    description: 'Пілотний маршрут для стійких наслідків інсульту після уточнення типу перенесеної події.',
    codeNotice: 'Потрібно обрати конкретний підкод I69 відповідно до підтвердженого типу попередньої цереброваскулярної події. Підкод не описує тяжкість функціонального обмеження.',
    classificationSource: {
      label: 'WHO ICD-10 Browser, версія 2019',
      url: 'https://icd.who.int/browse10/2019/en#/I69',
    },
    icdOptions: [
      { code: 'I69.0', title: 'Наслідки субарахноїдального крововиливу' },
      { code: 'I69.1', title: 'Наслідки внутрішньомозкового крововиливу' },
      { code: 'I69.2', title: 'Наслідки іншого нетравматичного внутрішньочерепного крововиливу' },
      { code: 'I69.3', title: 'Наслідки інфаркту мозку' },
      { code: 'I69.4', title: 'Наслідки інсульту, не уточненого як крововилив або інфаркт' },
      { code: 'I69.8', title: 'Наслідки інших та неуточнених цереброваскулярних хвороб' },
    ],
    domains: [
      {
        id: 'mobility',
        title: 'Мобільність, ходьба і рівновага',
        prompt: 'Чи є геміпарез, порушення ходьби, перенесення ваги, розворотів або рівноваги?',
        assessor: 'Фізичний терапевт; лікар фізичної та реабілітаційної медицини у складі МДРК.',
        rehabilitationNeed: 'При підтвердженому порушенні може потребувати оцінювання фізичним терапевтом.',
        assessments: [commonAssessments.tug, commonAssessments.tenMeterWalk, commonAssessments.sixMinuteWalk],
      },
      {
        id: 'self-care-upper-limb',
        title: 'Рука і самообслуговування',
        prompt: 'Чи обмежують парез, спастичність або порушення координації використання руки та базові ADL?',
        assessor: 'Ерготерапевт; за потреби ортезування — лікар і протезист-ортезист.',
        rehabilitationNeed: 'При підтвердженому обмеженні може потребувати оцінювання ерготерапевтом.',
        assessments: [commonAssessments.barthel],
      },
      {
        id: 'swallowing-communication',
        title: 'Ковтання та комунікація',
        prompt: 'Чи є дисфагія, дизартрія, афазія або інші труднощі комунікації?',
        assessor: 'Терапевт мови і мовлення та відповідний лікар у складі МДРК.',
        rehabilitationNeed: 'При підтвердженому порушенні може потребувати оцінювання терапевтом мови і мовлення.',
        assessments: [
          {
            id: 'swallowing-clinical-screen',
            name: 'Клінічний скринінг ковтання',
            category: 'clinical',
            measures: 'Ознаки ризику дисфагії та потребу в повній профільній оцінці.',
            implementation: 'reference-only',
            licenseNotice: 'Конкретний валідований інструмент буде обрано після перевірки української версії та ліцензії.',
          },
        ],
      },
      {
        id: 'cognition-participation',
        title: 'Когніція та участь',
        prompt: 'Чи є порушення уваги, пам’яті, виконавчих функцій, побутової діяльності або участі?',
        assessor: 'Відповідний лікар, психолог та ерготерапевт у складі МДРК.',
        rehabilitationNeed: 'При підтвердженому порушенні може потребувати профільного оцінювання членами МДРК.',
        assessments: [
          {
            id: 'moca',
            name: 'Montreal Cognitive Assessment (MoCA)',
            category: 'functional',
            measures: 'Когнітивний скринінг.',
            implementation: 'reference-only',
            licenseNotice: 'MoCA не відтворюється на сайті; використання і навчання регулює правовласник.',
          },
          commonAssessments.whodas,
        ],
      },
    ],
  },
];

export const assistiveProductVerificationNotice = {
  title: 'Можливі допоміжні засоби реабілітації',
  text: 'Показано лише позиції, для яких вручну перевірено рядок наказу №774/2691. Це нормативна відповідність для розгляду, а не автоматичне призначення чи гарантія державного забезпечення.',
  sources: [legal.icdAssistiveProducts, legal.functionalProductSelection, legal.stateProvision, legal.upperLimbFunctionalAssessment],
};
