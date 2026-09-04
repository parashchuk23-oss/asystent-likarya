'use client';

import { useMemo, useState } from 'react';
import { nationalSchedule } from '../../data/vaccination/ukraine/nationalSchedule';
import { vaccinationMetadata } from '../../data/vaccination/ukraine/metadata';
import { getVaccineTitle } from '../../utils/vaccination/vaccinationAssessment';

const ageColumns = [
  { key: 'birth', label: '3–5 доба', shortLabel: '3–5 діб', group: 'infancy', matches: (dose) => dose.id === 'bcg-birth' },
  { key: '2m', label: '2 місяці', shortLabel: '2 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 2 },
  { key: '4m', label: '4 місяці', shortLabel: '4 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 4 },
  { key: '6m', label: '6 місяців', shortLabel: '6 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 6 },
  { key: '12m', label: '12 місяців', shortLabel: '12 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 12 },
  { key: '18m', label: '18 місяців', shortLabel: '18 міс.', group: 'infancy', matches: (dose) => dose.minAgeMonths === 18 },
  { key: '4y', label: '4 роки', shortLabel: '4 роки', group: 'childhood', matches: (dose) => dose.minAgeMonths === 48 },
  { key: '6y', label: '6 років', shortLabel: '6 років', group: 'childhood', matches: (dose) => dose.minAgeMonths === 72 },
  { key: '12y', label: '12–13 років', shortLabel: '12–13 р.', group: 'childhood', matches: (dose) => dose.minAgeMonths === 144 },
  { key: '16y', label: '16 років', shortLabel: '16 років', group: 'childhood', matches: (dose) => dose.minAgeMonths === 192 },
  { key: 'adult', label: 'Дорослі', shortLabel: 'Дорослі', group: 'adult', matches: (dose) => dose.id === 'dt-adult' },
];

const vaccineRowDefinitions = [
  { id: 'bcg', title: 'БЦЖ', vaccineIds: ['bcg'] },
  { id: 'hepb', title: 'Гепатит B', vaccineIds: ['hepb'] },
  { id: 'dtap-dt', title: 'Кашлюк, дифтерія, правець', vaccineIds: ['dtap', 'dt'] },
  { id: 'polio', title: 'Поліомієліт', vaccineIds: ['polio'] },
  { id: 'hib', title: 'Hib', vaccineIds: ['hib'] },
  { id: 'mmr', title: 'КПК', vaccineIds: ['mmr'] },
  { id: 'hpv', title: 'ВПЛ', vaccineIds: ['hpv'] },
];

function getDoseLabel(dose) {
  if (dose.vaccineId === 'dt') return { main: 'ДП', sub: null };
  if (dose.doseNumber) return { main: String(dose.doseNumber), sub: 'доза' };
  return { main: '•', sub: null };
}

function getCalendarVaccineTitle(vaccineId) {
  return vaccineId === 'dtap' ? 'Кашлюк, дифтерія, правець' : getVaccineTitle(vaccineId);
}

function getDoseAccessibleLabel(dose) {
  const dosePart = dose.doseNumber ? `, доза ${dose.doseNumber}` : '';
  const sexPart = dose.sex === 'female' ? ', дівчата' : '';
  return `${getCalendarVaccineTitle(dose.vaccineId)}, ${dose.ageLabel}${dosePart}${sexPart}`;
}

function isDoseRelevantForAge(dose, ageMonths) {
  return dose.minAgeMonths <= ageMonths
    && (dose.maxAgeMonths == null || ageMonths <= dose.maxAgeMonths);
}

function getBcgCatchUpRecommendation(ageMonths) {
  if (ageMonths < 7) {
    return {
      ageGroup: 'Дитина молодше 7 місяців',
      paragraphs: [
        'БЦЖ у пологовому стаціонарі не проведена. Рекомендована вакцинація БЦЖ найближчим часом без попередньої діагностики туберкульозної інфекції після огляду дитини та виключення протипоказань.',
        'Якщо був відомий контакт із хворим на туберкульоз: у зв’язку з відомим контактом вакцинацію БЦЖ не проводити до обстеження дитини, виключення активного туберкульозу та визначення подальшої тактики. Рекомендована консультація фтизіопедіатра/фтизіатра та обстеження відповідно до чинних стандартів ведення контактних осіб.',
      ],
    };
  }

  if (ageMonths < 216) {
    return {
      ageGroup: 'Дитина від 7 місяців до 17 років 11 місяців 29 днів',
      paragraphs: [
        'Перед вакцинацією БЦЖ рекомендовано провести діагностику туберкульозної інфекції: пробу Манту, шкірний тест на основі антигенів туберкульозу або IGRA. За негативного результату, відсутності симптомів активного туберкульозу та протипоказань — провести вакцинацію БЦЖ.',
        'При позитивному або сумнівному результаті БЦЖ не проводити. Позитивний або сумнівний результат тесту не підтверджує активний туберкульоз, але потребує оцінки на туберкульозну інфекцію та виключення активного захворювання. Рекомендована консультація фтизіатра/фтизіопедіатра.',
      ],
    };
  }

  return {
    ageGroup: 'Особа віком 18 років і старше',
    paragraphs: [
      'Планове надолуження БЦЖ після досягнення 18 років Календарем профілактичних щеплень України не передбачене. За наявності контакту, симптомів або факторів ризику провести обстеження на туберкульозну інфекцію та активний туберкульоз відповідно до чинних стандартів.',
    ],
  };
}

function getHepBCatchUpRecommendation(dose, ageMonths) {
  if (ageMonths >= 216) {
    return {
      ageGroup: 'Особа віком 18 років і старше',
      title: `Не отримана доза ${dose.doseNumber}`,
      paragraphs: [
        'Планове надолуження дитячої схеми вакцинації проти вірусного гепатиту B після досягнення 18 років не визначається лише за віком. Необхідно перевірити документовані дози та оцінити показання до вакцинації дорослого відповідно до факторів ризику, стану здоров’я, чинних рекомендацій та інструкції до вакцини.',
      ],
    };
  }

  const recommendationsByDose = {
    1: [
      'Вакцинація проти вірусного гепатиту B не розпочата або документально підтверджена перша доза відсутня. Рекомендовано розпочати вакцинацію найближчим часом після огляду дитини та виключення протипоказань.',
      'Подальші дози вводити з дотриманням мінімальних інтервалів. У разі порушення графіка розпочинати серію спочатку не потрібно.',
    ],
    2: [
      'Другу дозу вакцини проти вірусного гепатиту B пропущено. Розпочинати серію вакцинації спочатку не потрібно.',
      'Рекомендовано ввести пропущену дозу найближчим часом, якщо після першої дози минув мінімально допустимий інтервал — 4 тижні. Наступну дозу планувати з урахуванням дати фактично проведеного щеплення.',
    ],
    3: [
      'Третю дозу вакцини проти вірусного гепатиту B пропущено. Розпочинати серію вакцинації спочатку не потрібно.',
      'Рекомендовано ввести пропущену дозу найближчим часом, якщо після другої дози минув мінімально допустимий інтервал — 4 тижні. Подальшу схему визначати за кількістю, датами та складом фактично введених вакцин.',
    ],
    4: [
      'Необхідно перевірити кількість, дати та склад раніше введених вакцин. Якщо дитина вже отримала щонайменше три зараховані дози вакцини проти вірусного гепатиту B із дотриманням мінімальних інтервалів, курс вакцинації проти гепатиту B може вважатися завершеним.',
      'Четверта доза передбачена схемою комбінованої вакцинації у 18 місяців і проводиться відповідно до Календаря профілактичних щеплень та інструкції до використаної вакцини. Раніше отримані валідні дози не анулюються, а серію спочатку не розпочинають.',
    ],
  };

  return {
    ageGroup: 'Дитина віком до 18 років',
    title: `Не отримана доза ${dose.doseNumber}`,
    paragraphs: recommendationsByDose[dose.doseNumber] || [],
  };
}

function getDtpDoseName(dose) {
  if (dose.id === 'dt-72') return 'ДП у 6 років';
  if (dose.id === 'dt-192') return 'ДП у 16 років';
  return `доза ${dose.doseNumber}`;
}

function getDtpCatchUpRecommendation(ageMonths, missingDoses) {
  const markedDoses = missingDoses.map(getDtpDoseName).join(', ');

  if (ageMonths < 12) {
    return {
      ageGroup: 'Дитина молодше 1 року',
      markedDoses,
      paragraphs: [
        'Позначені дози вакцини проти кашлюку, дифтерії та правця не проведені. Рекомендовано продовжити вакцинацію найближчим часом після огляду дитини та виключення протипоказань. Розпочинати серію спочатку не потрібно.',
        'Мінімальний інтервал між першою та другою дозами — 4 тижні, між другою та третьою — 4 тижні, між третьою та четвертою — 6 місяців. Подальші щеплення проводити з урахуванням віку дитини, кількості та дат зарахованих доз.',
      ],
    };
  }

  if (ageMonths < 84) {
    return {
      ageGroup: 'Дитина від 1 року до 6 років 11 місяців',
      markedDoses,
      paragraphs: [
        'Якщо дитина не отримала жодної дози, рекомендовано провести серію з трьох доз вакцини, що містить кашлюковий компонент, дифтерійний і правцевий анатоксини: мінімальний інтервал між першою та другою дозами — 4 тижні, між другою та третьою — 6 місяців.',
        'Якщо окремі дози вже отримані, серію спочатку не розпочинати — необхідно ввести лише дози, яких не вистачає, з дотриманням мінімальних інтервалів.',
        'Якщо третю дозу введено після досягнення 5 років, вона зараховується як ревакцинація у 6 років. Якщо третю дозу введено раніше 5 років, ревакцинація у 6 років залишається необхідною.',
      ],
    };
  }

  if (ageMonths < 216) {
    return {
      ageGroup: 'Дитина від 7 до 17 років 11 місяців',
      markedDoses,
      paragraphs: [
        'Для надолуження вакцинації проти дифтерії та правця рекомендовано ввести дози, яких не вистачає. Якщо попередні щеплення відсутні, проводять серію з трьох доз: мінімальний інтервал між першою та другою — 4 тижні, між другою та третьою — 6 місяців. Розпочинати раніше проведену серію спочатку не потрібно.',
        'Вакцина з ацелюлярним кашлюковим компонентом може застосовуватися після 7 років, якщо це дозволено інструкцією до конкретної вакцини. Вакцину з цільноклітинним кашлюковим компонентом після досягнення 7 років не застосовують.',
      ],
    };
  }

  return {
    ageGroup: 'Особа віком 18 років і старше',
    markedDoses,
    paragraphs: [
      'Якщо первинна вакцинація проти дифтерії та правця відсутня або документально не підтверджена, рекомендована серія з трьох доз: друга доза — не раніше ніж через 4 тижні після першої, третя — не раніше ніж через 6 місяців після другої. Розпочинати раніше проведену серію спочатку не потрібно.',
      'Після завершення первинної серії проводити ревакцинацію проти дифтерії та правця кожні 10 років. Застосування вакцини з ацелюлярним кашлюковим компонентом можливе відповідно до віку та інструкції конкретної вакцини.',
    ],
  };
}

function getPolioDoseName(dose) {
  return `доза ${dose.doseNumber} (${dose.ageLabel})`;
}

function getPolioCatchUpRecommendation(ageMonths, missingDoses) {
  const markedDoses = missingDoses.map(getPolioDoseName).join(', ');

  if (ageMonths >= 216) {
    return {
      ageGroup: 'Особа віком 18 років і старше',
      markedDoses,
      paragraphs: [
        'Планове надолуження дитячої вакцинації проти поліомієліту після досягнення 18 років Календарем профілактичних щеплень України не передбачене. Особам віком від 18 років вакцинацію проводять за епідемічними показаннями.',
        'Необхідно перевірити документовані дози та визначити подальшу тактику з урахуванням епідемічних показань, чинних нормативних документів та інструкції до інактивованої поліомієлітної вакцини.',
      ],
    };
  }

  const ageGroup = ageMonths < 12
    ? 'Дитина молодше 1 року'
    : ageMonths < 72
      ? 'Дитина від 1 року до 5 років 11 місяців'
      : 'Дитина від 6 до 17 років 11 місяців';

  return {
    ageGroup,
    markedDoses,
    paragraphs: [
      'Позначені дози вакцини проти поліомієліту не проведені. Для надолуження незалежно від віку застосовується інактивована поліомієлітна вакцина (ІПВ). Розпочинати серію спочатку не потрібно — необхідно ввести дози, яких не вистачає.',
      'Мінімальний інтервал між першою та другою дозами — 4 тижні, між другою та третьою — 4 тижні, між третьою та четвертою — 6 місяців. Схему визначають за кількістю і датами документованих валідних доз та інструкцією до використаної вакцини.',
      'Дитина з порушенням Календаря має отримати чотири дози проти поліомієліту до віку 17 років 11 місяців 29 днів. Якщо остання доза вакцинального комплексу — перша ревакцинація — проводиться у віці планової ревакцинації в 6 років, її зараховують як ревакцинацію у 6 років.',
    ],
  };
}

function getHibDoseName(dose) {
  return `доза ${dose.doseNumber} (${dose.ageLabel})`;
}

function getHibCatchUpRecommendation(ageMonths, missingDoses) {
  const markedDoses = missingDoses.map(getHibDoseName).join(', ');

  if (ageMonths < 12) {
    return {
      ageGroup: 'Дитина молодше 12 місяців',
      markedDoses,
      paragraphs: [
        'Позначені дози вакцини проти Hib-інфекції не проведені. Розпочинати серію спочатку не потрібно — необхідно продовжити вакцинацію з урахуванням кількості та дат документованих валідних доз.',
        'Мінімальний інтервал між першою та другою дозами — 4 тижні, між другою та третьою — 4 тижні, між третьою та четвертою — 6 місяців. Остаточну схему визначають за віком на момент введення кожної дози та інструкцією до використаної вакцини.',
      ],
    };
  }

  if (ageMonths < 60) {
    return {
      ageGroup: 'Дитина від 12 місяців до 4 років 11 місяців',
      markedDoses,
      paragraphs: [
        'Якщо вакцинація проти Hib-інфекції не розпочата або курс не завершений, рекомендовано ввести одну дозу вакцини найближчим часом після огляду дитини та виключення протипоказань. Розпочинати серію спочатку не потрібно.',
        'Якщо чергову дозу Hib-вакцини введено у віці від 12 місяців до 4 років 11 місяців 29 днів, наступні дози для планового надолуження не вводять. Необхідно врахувати документовані попередні дози та інструкцію до конкретної вакцини.',
      ],
    };
  }

  return {
    ageGroup: ageMonths < 216
      ? 'Дитина від 5 до 17 років 11 місяців'
      : 'Особа віком 18 років і старше',
    markedDoses,
    paragraphs: [
      'Планове надолуження вакцинації проти Hib-інфекції після досягнення 5 років Календарем профілактичних щеплень України не передбачене.',
      'Вакцинацію в цьому віці проводять лише особам із визначених груп ризику за окремими показаннями. Необхідно оцінити стан здоров’я, документовану історію щеплень і застосувати схему відповідно до чинного Календаря та інструкції до конкретної вакцини.',
    ],
  };
}

function getMmrDoseName(dose) {
  return `доза ${dose.doseNumber} (${dose.ageLabel})`;
}

function getMmrCatchUpRecommendation(ageMonths, missingDoses) {
  const markedDoses = missingDoses.map(getMmrDoseName).join(', ');

  if (ageMonths >= 216) {
    return {
      ageGroup: 'Особа віком 18 років і старше',
      markedDoses,
      paragraphs: [
        'Планове надолуження дитячої схеми вакцинації проти кору, епідемічного паротиту та краснухи після досягнення 18 років не визначається лише за введеним віком.',
        'Необхідно перевірити документовані дози та оцінити показання до вакцинації відповідно до епідемічної ситуації, професійного ризику, стану здоров’я, чинних нормативних документів та інструкції до вакцини КПК.',
      ],
    };
  }

  const firstDoseMissing = missingDoses.some((dose) => dose.doseNumber === 1);
  const ageGroup = ageMonths < 48
    ? 'Дитина від 12 місяців до 3 років 11 місяців'
    : 'Дитина від 4 до 17 років 11 місяців';

  const scheduleParagraph = firstDoseMissing
    ? 'Якщо немає двох документованих валідних доз, вакцинацію потрібно розпочати або продовжити так, щоб дитина отримала дві дози КПК. Мінімальний інтервал між першою та другою дозами — 28 днів. Розпочинати серію спочатку після тривалої перерви не потрібно.'
    : 'Якщо документована лише одна валідна доза КПК, рекомендовано ввести другу дозу з мінімальним інтервалом 28 днів після першої. Розпочинати серію спочатку після тривалої перерви не потрібно.';

  return {
    ageGroup,
    markedDoses,
    paragraphs: [
      scheduleParagraph,
      'Курс вважається завершеним після двох валідних доз: першу введено у віці 12 місяців або пізніше, а інтервал між дозами становить щонайменше 28 днів. Другу дозу, введену не раніше 24-го дня після першої, допускається зарахувати.',
      'Якщо першу дозу введено до 12 місяців, її зазвичай не зараховують. Як виняток, дозу, введену після досягнення 11 місяців, можна зарахувати, якщо другу дозу введено після 12 місяців і не раніше ніж через 3 місяці після першої.',
      'Якщо дві валідні дози вже введено до досягнення 4 років із дотриманням мінімального інтервалу, додаткова планова доза у 4 роки не потрібна.',
    ],
  };
}

function getHpvCatchUpRecommendation() {
  return {
    ageGroup: 'Дівчата віком 12–13 років',
    paragraphs: [
      'Якщо планове щеплення проти ВПЛ не проведене, рекомендовано ввести одну дозу 9-валентної вакцини після огляду та виключення протипоказань. У 2026 році безоплатна вакцинація за Національним календарем передбачена для дівчат віком 12–13 років включно.',
      'Імунокомпетентній дитині після однієї календарної дози друга доза не потрібна. Окремі схеми застосовують для спеціальних груп: дівчатам, які живуть із ВІЛ або мають первинний імунодефіцит, вакцинацію проводять за тридозною схемою; дітям з історією сексуального насильства вакцинацію починають якомога раніше з 9 років, а для імунокомпетентних дітей цієї групи застосовують однодозову схему.',
      'Заплановане з 2027 року надолуження для дівчат до 15 років не застосовується як чинне правило календаря 2026 року. Схему для спеціальної групи визначають відповідно до чинних нормативних документів та інструкції до конкретної вакцини.',
    ],
  };
}

export default function NationalScheduleView() {
  const [selectedDose, setSelectedDose] = useState(nationalSchedule[0]);
  const [ageValue, setAgeValue] = useState('');
  const [ageUnit, setAgeUnit] = useState('years');
  const [missingDoseIds, setMissingDoseIds] = useState([]);

  const visibleColumns = ageColumns.filter((column) => column.group !== 'adult');
  const visibleDoses = nationalSchedule.filter((dose) => visibleColumns.some((column) => column.matches(dose)));

  const numericAge = ageValue === '' ? null : Number(ageValue);
  const maximumAge = ageUnit === 'years' ? 120 : 216;
  const ageMonths = numericAge === null ? null : numericAge * (ageUnit === 'years' ? 12 : 1);
  const ageIsValid = numericAge !== null
    && Number.isInteger(numericAge)
    && numericAge >= 0
    && numericAge <= maximumAge;

  const vaccineRows = useMemo(
    () => vaccineRowDefinitions
      .map((row) => ({
        ...row,
        doses: nationalSchedule.filter((dose) => row.vaccineIds.includes(dose.vaccineId)),
      }))
      .filter((row) => row.doses.length > 0),
    [],
  );

  const bcgCatchUpRecommendation = ageIsValid && missingDoseIds.includes('bcg-birth')
    ? getBcgCatchUpRecommendation(ageMonths)
    : null;

  const hepBCatchUpRecommendations = ageIsValid
    ? nationalSchedule
      .filter((dose) => dose.vaccineId === 'hepb' && missingDoseIds.includes(dose.id))
      .map((dose) => ({ dose, recommendation: getHepBCatchUpRecommendation(dose, ageMonths) }))
    : [];
  const hepBCatchUpSummary = hepBCatchUpRecommendations.length > 0
    ? {
      ageGroup: hepBCatchUpRecommendations[0].recommendation.ageGroup,
      markedDoses: hepBCatchUpRecommendations
        .map(({ dose }) => `доза ${dose.doseNumber} (${dose.ageLabel})`)
        .join(', '),
      paragraphs: [...new Set(
        hepBCatchUpRecommendations.flatMap(({ recommendation }) => recommendation.paragraphs),
      )],
    }
    : null;

  const dtpMissingDoses = ageIsValid
    ? nationalSchedule.filter(
      (dose) => ['dtap', 'dt'].includes(dose.vaccineId) && missingDoseIds.includes(dose.id),
    )
    : [];
  const dtpCatchUpRecommendation = dtpMissingDoses.length > 0
    ? getDtpCatchUpRecommendation(ageMonths, dtpMissingDoses)
    : null;

  const polioMissingDoses = ageIsValid
    ? nationalSchedule.filter(
      (dose) => dose.vaccineId === 'polio' && missingDoseIds.includes(dose.id),
    )
    : [];
  const polioCatchUpRecommendation = polioMissingDoses.length > 0
    ? getPolioCatchUpRecommendation(ageMonths, polioMissingDoses)
    : null;

  const hibMissingDoses = ageIsValid
    ? nationalSchedule.filter(
      (dose) => dose.vaccineId === 'hib' && missingDoseIds.includes(dose.id),
    )
    : [];
  const hibCatchUpRecommendation = hibMissingDoses.length > 0
    ? getHibCatchUpRecommendation(ageMonths, hibMissingDoses)
    : null;

  const mmrMissingDoses = ageIsValid
    ? nationalSchedule.filter(
      (dose) => dose.vaccineId === 'mmr' && missingDoseIds.includes(dose.id),
    )
    : [];
  const mmrCatchUpRecommendation = mmrMissingDoses.length > 0
    ? getMmrCatchUpRecommendation(ageMonths, mmrMissingDoses)
    : null;

  const hpvDoseIsMissing = ageIsValid && nationalSchedule.some(
    (dose) => dose.vaccineId === 'hpv'
      && missingDoseIds.includes(dose.id)
      && isDoseRelevantForAge(dose, ageMonths),
  );
  const hpvCatchUpRecommendation = hpvDoseIsMissing
    ? getHpvCatchUpRecommendation()
    : null;

  const handleDoseClick = (dose) => {
    setSelectedDose(dose);
    if (
      !ageIsValid
      || !isDoseRelevantForAge(dose, ageMonths)
      || !['bcg', 'hepb', 'dtap', 'dt', 'polio', 'hib', 'mmr', 'hpv'].includes(dose.vaccineId)
    ) return;

    setMissingDoseIds((current) => (
      current.includes(dose.id)
        ? current.filter((id) => id !== dose.id)
        : [...current, dose.id]
    ));
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-300">Національний календар України</p>
          <div className="mt-2">
            <h3 className="text-xl font-bold">Календар профілактичних щеплень</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
              Введіть вік і натисніть на відсутню дозу, щоб отримати рекомендації з надолуження.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <section className="mb-5 rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <div className="max-w-xl">
              <div>
                <h4 className="text-base font-bold text-slate-950">Рекомендації за віком</h4>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Введіть вік, щоб виділити актуальні дози в календарі та позначити пропущені щеплення.
                </p>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_120px] gap-2">
                  <label>
                    <span className="sr-only">Вік</span>
                    <input
                      type="number"
                      min="0"
                      max={ageUnit === 'years' ? '120' : '216'}
                      step="1"
                      inputMode="numeric"
                      value={ageValue}
                      onChange={(event) => setAgeValue(event.target.value)}
                      placeholder="Введіть вік"
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </label>
                  <label>
                    <span className="sr-only">Одиниця віку</span>
                    <select
                      value={ageUnit}
                      onChange={(event) => setAgeUnit(event.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    >
                      <option value="years">років</option>
                      <option value="months">місяців</option>
                    </select>
                  </label>
                </div>
                {ageValue !== '' && !ageIsValid && (
                  <p className="mt-2 text-sm font-semibold leading-6 text-rose-700">
                    Вкажіть цілий вік від 0 до {maximumAge} {ageUnit === 'years' ? 'років' : 'місяців'}.
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div
                  className="min-w-0 bg-white"
                  style={{ display: 'grid', gridTemplateColumns: `minmax(140px, 1.45fr) repeat(${visibleColumns.length}, minmax(0, 1fr))` }}
                >
                  <div className="flex min-w-0 items-end border-b border-r border-slate-200 bg-slate-50 p-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 lg:p-3 lg:text-xs">
                    Інфекція / вакцина
                  </div>
                  {visibleColumns.map((column) => (
                    <div key={column.key} className="flex min-h-14 min-w-0 items-end justify-center border-b border-slate-200 bg-slate-50 px-0.5 py-2 text-center text-[10px] font-bold leading-4 text-slate-700 lg:min-h-16 lg:px-1 lg:py-3 lg:text-xs">
                      {column.shortLabel}
                    </div>
                  ))}

                  {vaccineRows.map((row, rowIndex) => (
                    <div key={row.id} className="contents">
                      <div className={`flex min-w-0 items-center border-r border-slate-200 px-2 py-2 lg:px-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}>
                        <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-teal-500 lg:mr-3 lg:h-2.5 lg:w-2.5" aria-hidden="true" />
                        <span className="min-w-0 text-xs font-bold leading-4 text-slate-900 lg:text-sm lg:leading-5">{row.title}</span>
                      </div>
                      {visibleColumns.map((column) => {
                        const dose = row.doses.find((item) => column.matches(item));
                        const isSelected = dose?.id === selectedDose?.id;
                        const isAgeRelevant = Boolean(dose && ageIsValid && isDoseRelevantForAge(dose, ageMonths));
                        const isMissing = Boolean(dose && missingDoseIds.includes(dose.id));

                        return (
                          <div
                            key={`${row.id}-${column.key}`}
                            className={`relative flex min-h-16 min-w-0 items-center justify-center px-0.5 py-2 lg:min-h-20 lg:px-1 lg:py-3 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}`}
                          >
                            <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" aria-hidden="true" />
                            {dose && (
                              <button
                                type="button"
                                onClick={() => handleDoseClick(dose)}
                                className={`relative z-10 flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-1 text-xs font-extrabold transition focus:outline-none focus:ring-4 focus:ring-teal-200 lg:h-11 lg:min-w-11 lg:text-sm ${
                                  isMissing
                                    ? 'scale-110 border-amber-700 bg-amber-500 text-slate-950 shadow-md shadow-amber-200'
                                    : isAgeRelevant
                                      ? 'border-teal-700 bg-teal-600 text-white shadow-sm shadow-teal-200'
                                      : isSelected
                                        ? 'scale-105 border-sky-600 bg-sky-50 text-sky-800 shadow-sm'
                                    : 'border-teal-200 bg-teal-50 text-teal-800 hover:scale-105 hover:border-teal-500 hover:bg-teal-100'
                                }`}
                                aria-label={`${getDoseAccessibleLabel(dose)}${isMissing ? ', позначено як не отримано' : ''}`}
                                aria-pressed={isMissing}
                              >
                                <span className="flex flex-col items-center leading-none">
                                  <span>{getDoseLabel(dose).main}</span>
                                  {getDoseLabel(dose).sub && (
                                    <span className="mt-0.5 text-[8px] font-bold leading-none lg:text-[9px]">
                                      {getDoseLabel(dose).sub}
                                    </span>
                                  )}
                                </span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
          </div>

          <div className="space-y-5 md:hidden">
                {visibleColumns.map((column) => {
                  const doses = visibleDoses.filter((dose) => column.matches(dose));
                  if (doses.length === 0) return null;

                  return (
                    <section key={column.key} className="relative pl-8">
                      <span className="absolute bottom-0 left-3 top-3 w-px bg-teal-200" aria-hidden="true" />
                      <span className="absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal-500 ring-2 ring-teal-100" aria-hidden="true" />
                      <h4 className="text-sm font-extrabold text-slate-950">{column.label}</h4>
                      <div className="mt-2 grid gap-2">
                        {doses.map((dose) => {
                          const isSelected = dose.id === selectedDose?.id;
                          const isAgeRelevant = ageIsValid && isDoseRelevantForAge(dose, ageMonths);
                          const isMissing = missingDoseIds.includes(dose.id);
                          return (
                            <button
                              key={dose.id}
                              type="button"
                              onClick={() => handleDoseClick(dose)}
                              className={`rounded-lg border p-3 text-left transition ${
                                isMissing
                                  ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100'
                                  : isAgeRelevant
                                    ? 'border-teal-500 bg-teal-50'
                                    : isSelected
                                      ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-100'
                                  : 'border-slate-200 bg-white hover:border-teal-300'
                              }`}
                              aria-pressed={isMissing}
                            >
                              <span className="block text-sm font-bold text-slate-950">{getCalendarVaccineTitle(dose.vaccineId)}</span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">
                                {dose.type}{dose.doseNumber ? ` · доза ${dose.doseNumber}` : ''}{dose.sex === 'female' ? ' · дівчата' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
          </div>

          {selectedDose && (
            <aside className="mt-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4" aria-live="polite">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Вибране щеплення</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-950">{getCalendarVaccineTitle(selectedDose.vaccineId)}</h4>
                </div>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-bold text-sky-800 ring-1 ring-sky-200">
                  {selectedDose.ageLabel}
                </span>
              </div>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Етап</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {selectedDose.type}{selectedDose.doseNumber ? `, доза ${selectedDose.doseNumber}` : ''}{selectedDose.sex === 'female' ? ', дівчата' : ''}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Примітка</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{selectedDose.note}</dd>
                </div>
              </dl>
            </aside>
          )}

          {bcgCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-slate-950">БЦЖ не проведена</h4>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {bcgCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {bcgCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції.
              </p>
            </section>
          )}

          {hepBCatchUpSummary && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-950">Гепатит B</h4>
                  <p className="mt-1 text-xs font-semibold text-amber-900">
                    Позначено як неотримані: {hepBCatchUpSummary.markedDoses}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {hepBCatchUpSummary.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {hepBCatchUpSummary.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Конкретна календарна дата не розраховується без документованих дат попередніх щеплень. Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції.
              </p>
            </section>
          )}

          {dtpCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-950">Кашлюк, дифтерія, правець</h4>
                  <p className="mt-1 text-xs font-semibold text-amber-900">
                    Позначено як неотримані: {dtpCatchUpRecommendation.markedDoses}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {dtpCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {dtpCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Конкретна календарна дата не розраховується без документованих дат попередніх щеплень. Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції.
              </p>
            </section>
          )}

          {polioCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-950">Поліомієліт</h4>
                  <p className="mt-1 text-xs font-semibold text-amber-900">
                    Позначено як неотримані: {polioCatchUpRecommendation.markedDoses}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {polioCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {polioCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Конкретна календарна дата не розраховується без документованих дат попередніх щеплень. Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції від 01.01.2026.
              </p>
            </section>
          )}

          {hibCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-950">Hib-інфекція</h4>
                  <p className="mt-1 text-xs font-semibold text-amber-900">
                    Позначено як неотримані: {hibCatchUpRecommendation.markedDoses}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {hibCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {hibCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Конкретна календарна дата не розраховується без документованих дат попередніх щеплень. Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції від 01.01.2026.
              </p>
            </section>
          )}

          {mmrCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-950">КПК — кір, епідемічний паротит, краснуха</h4>
                  <p className="mt-1 text-xs font-semibold text-amber-900">
                    Позначено як неотримані: {mmrCatchUpRecommendation.markedDoses}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {mmrCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {mmrCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Конкретна календарна дата не розраховується без документованих дат попередніх щеплень. Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції від 01.01.2026.
              </p>
            </section>
          )}

          {hpvCatchUpRecommendation && (
            <section className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Рекомендації з надолуження</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-slate-950">ВПЛ-інфекція: щеплення не проведене</h4>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200">
                  {hpvCatchUpRecommendation.ageGroup}
                </span>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                {hpvCatchUpRecommendation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-3 border-t border-amber-200 pt-3 text-xs font-semibold leading-5 text-amber-900">
                Джерело: Календар профілактичних щеплень України, наказ МОЗ України №595 у чинній редакції від 01.01.2026, роз’яснення МОЗ і ЦГЗ щодо календаря 2026 року.
              </p>
            </section>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-600" />Активна за введеним віком</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Позначена як не отримана</span>
            <span>ДП — дифтерія, правець</span>
            <span>Дорослим — повторювати кожні 10 років</span>
          </div>
        </div>
      </section>

      <p className="px-1 text-xs font-semibold leading-5 text-slate-500">
        Перевірено: {vaccinationMetadata.checkedAt}. Версія: {vaccinationMetadata.version}. Дані не зберігаються і не передаються на сервер.
      </p>
    </div>
  );
}
