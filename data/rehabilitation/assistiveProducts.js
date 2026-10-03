import { rehabilitationLegalSources as legal } from './legalSources';

export const verifiedAssistiveProductMappings = [
  {
    id: 'g35-walking-sticks',
    routeId: 'multiple-sclerosis',
    domainIds: ['mobility'],
    icdCodes: ['G35'],
    category: 'Засоби для ходіння, керовані однією рукою',
    productName: 'Палиці та палиці з трьома або більше ніжками',
    classification: 'ОР.1.1 / ОР.1.2; ISO 9999 12 03 03 / 12 03 16',
    normativeCondition: 'У відповідному рядку Переліку G35 поєднано з наслідками ураження нижніх кінцівок, паралітичним ураженням м’язів нижніх кінцівок і тулуба та порушеннями статико-динамічних функцій. Самого коду G35 недостатньо.',
    evidenceNeeded: 'Документувати порушення ходьби, опори, статики або координації та фактичну потребу в засобі.',
    assessedBy: 'Лікар та/або фахівець з реабілітації відповідно до документа, що формує підставу, і процедури підбору засобу.',
    selectedBy: 'Підбір конкретного підвиду виконує лікар та/або фахівець з реабілітації суб’єкта господарювання відповідно до пункту 30 Порядку №321.',
    formedDocument: 'Документ із пункту 5 Порядку №321; під час забезпечення оформлюються попереднє замовлення та анкета.',
    sources: [
      { ...legal.icdAssistiveProducts, section: 'Розділ X, пункт 1, рядки 1 і 3 Переліку, стор. 107–116' },
      { ...legal.stateProvision, section: 'Пункти 5 і 30 Порядку; додаток 1, позиція 10' },
      legal.functionalProductSelection,
    ],
    verificationStatus: 'verified',
  },
  {
    id: 'g35-walking-frames',
    routeId: 'multiple-sclerosis',
    domainIds: ['mobility'],
    icdCodes: ['G35'],
    category: 'Засоби для ходіння, керовані обома руками',
    productName: 'Ходунки-рамки',
    classification: 'ОР.2.1; ISO 9999 12 06 03',
    normativeCondition: 'Перелік пов’язує G35 з ходунками-рамками у разі наслідків ураження нижніх кінцівок або паралітичного ураження м’язів нижніх кінцівок і тулуба; протипоказання та можливість безпечного користування оцінюються індивідуально.',
    evidenceNeeded: 'Підтвердити обмеження пересування та здатність безпечно керувати засобом обома руками.',
    assessedBy: 'Лікар та/або фахівець з реабілітації відповідно до чинного маршруту забезпечення.',
    selectedBy: 'Конкретний підвид підбирає лікар та/або фахівець з реабілітації суб’єкта господарювання.',
    formedDocument: 'Документ із пункту 5 Порядку №321; під час забезпечення — попереднє замовлення та анкета.',
    sources: [
      { ...legal.icdAssistiveProducts, section: 'Розділ XI, пункт 1 Переліку, стор. 145–147' },
      { ...legal.stateProvision, section: 'Пункти 5 і 30 Порядку; додаток 1, позиція 11' },
      legal.functionalProductSelection,
    ],
    verificationStatus: 'verified',
  },
  {
    id: 'i69-wrist-hand-finger-orthosis',
    routeId: 'stroke-sequelae',
    domainIds: ['self-care-upper-limb'],
    icdCodes: ['I69'],
    category: 'Ортези верхніх кінцівок',
    productName: 'Ортез на зап’ясток–кисть–пальці',
    classification: 'ОВ.1.5; ISO 9999 06 06 13',
    normativeCondition: 'I69 прямо міститься у рядку цього виду ортеза. Потреба має підтверджуватися станом кисті та функціональними можливостями, а не лише перенесеним інсультом.',
    evidenceNeeded: 'Оцінити локалізацію ураження, стан шкіри, чутливість, біль, силу м’язів, обсяг рухів, хапання/відпускання, опору на руку і самообслуговування.',
    assessedBy: 'Лікар визначає показники функціональних можливостей і мету ортезування; оцінювання може відбуватися в реабілітаційному маршруті.',
    selectedBy: 'Лікар призначає підвид ортеза певної функціональності; протезист-ортезист визначає комплектувальні та погоджує їх із користувачем.',
    formedDocument: 'Замовлення на ортези на верхні кінцівки.',
    sources: [
      { ...legal.icdAssistiveProducts, section: 'Розділ II, пункт 2 Переліку, стор. 7' },
      legal.upperLimbFunctionalAssessment,
      { ...legal.stateProvision, section: 'Пункти 5 і 30 Порядку' },
    ],
    verificationStatus: 'verified',
  },
];

export function getVerifiedAssistiveProducts(routeId, domainIds) {
  return verifiedAssistiveProductMappings.filter(
    (mapping) => mapping.routeId === routeId && mapping.domainIds.some((domainId) => domainIds.includes(domainId)),
  );
}
