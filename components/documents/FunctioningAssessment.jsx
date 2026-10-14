'use client';

import { useMemo, useRef, useState } from 'react';
import { functioningCategories, respiratoryAssessmentSections } from '../../data/functioning/respiratoryAssessment';
import { neurologicalAssessmentProfiles, neurologicalAssessmentSection } from '../../data/functioning/neurologicalAssessment';
import { musculoskeletalAssessmentProfiles, musculoskeletalAssessmentSection } from '../../data/functioning/musculoskeletalAssessment';
import { cardiovascularAssessmentProfiles, cardiovascularAssessmentSection } from '../../data/functioning/cardiovascularAssessment';
import { sensoryAssessmentProfiles, sensoryAssessmentSection } from '../../data/functioning/sensoryAssessment';
import { cognitiveMentalAssessmentProfiles, cognitiveMentalAssessmentSection } from '../../data/functioning/cognitiveMentalAssessment';
import { urinaryAssessmentProfiles, urinaryAssessmentSection } from '../../data/functioning/urinaryAssessment';
import { digestiveAssessmentProfiles, digestiveAssessmentSection } from '../../data/functioning/digestiveAssessment';
import { dailyLivingAssessmentProfiles, dailyLivingAssessmentSection } from '../../data/functioning/dailyLivingAssessment';
import { order774EntryCount, order774Source, searchOrder774, searchOrder774Diagnoses } from '../../data/rehabilitation/order774Search';

const assessmentSystems = [
  { id: 'respiratory', label: 'Дихальна система' },
  { id: 'neurological', label: 'Неврологічна система' },
  { id: 'musculoskeletal', label: 'Опорно-рухова система' },
  { id: 'cardiovascular', label: 'Серцево-судинна система' },
  { id: 'sensory', label: 'Сенсорні функції' },
  { id: 'cognitive-mental', label: 'Когніція і психоемоційний стан' },
  { id: 'urinary', label: 'Сечовидільні функції' },
  { id: 'digestive', label: 'Травна система' },
  { id: 'daily-living', label: 'Самообслуговування' },
];

const respiratoryGroups = [
  {
    id: 'core',
    title: 'Основна респіраторна оцінка',
    label: 'Основне',
    summary: 'Спірометрія · SpO₂ · оцінка задишки',
    toolIds: ['spirometry', 'pulse-oximetry', 'mmrc'],
    defaultOpen: true,
  },
  {
    id: 'capacity',
    title: 'Функціональна спроможність',
    label: 'Основне',
    summary: '6MWT · переносимість навантаження · повсякденне функціонування',
    toolIds: ['six-minute-walk-test', 'whodas'],
  },
  {
    id: 'copd',
    title: 'Оцінювання при ХОЗЛ',
    label: 'За діагнозом',
    summary: 'CAT · BODE · результати постбронходилатаційної спірометрії',
    note: 'Постбронходилатаційну спірометрію проводять у межах основної респіраторної оцінки; тут її результат використовують разом із CAT або складовими BODE.',
    toolIds: ['cat', 'bode'],
  },
  {
    id: 'asthma',
    title: 'Оцінювання при бронхіальній астмі',
    label: 'За діагнозом',
    summary: 'ACT або ACQ · серійний PEF · FeNO',
    note: 'Спірометрію з бронходилатаційною пробою проводять у межах основної оцінки. Для контролю астми обирають ACT або ACQ, а не трактують їх як два незалежні докази.',
    toolIds: ['act', 'acq', 'pef-variability', 'feno'],
  },
  {
    id: 'advanced',
    title: 'Розширені дослідження',
    label: 'За окремими показаннями',
    summary: 'Гази крові · DLCO · візуалізація · CPET',
    toolIds: ['arterial-blood-gases', 'dlco', 'thoracic-imaging', 'cpet'],
  },
];

const neurologicalGroups = [
  {
    id: 'neuro-independence',
    title: 'Незалежність і повсякденне функціонування',
    label: 'Основне',
    summary: 'Індекс Бартел · WHODAS 2.0',
    note: 'Індекс Бартел описує базове самообслуговування та необхідну допомогу, а WHODAS 2.0 — ширший вплив стану на активність і участь. Інструменти доповнюють, а не замінюють один одного.',
    toolIds: ['neuro-barthel', 'neuro-whodas'],
    defaultOpen: true,
  },
  {
    id: 'neuro-mobility',
    title: 'Мобільність і швидкість ходьби',
    label: 'Основне',
    summary: 'TUG · 10-метровий тест ходьби (10MWT)',
    note: 'TUG оцінює вставання, коротке переміщення, розворот і сідання; 10MWT — швидкість ходьби. Обирайте інструмент відповідно до клінічного питання або використовуйте обидва для різних компонентів мобільності.',
    toolIds: ['neuro-tug', 'neuro-10mwt'],
  },
  {
    id: 'neuro-endurance',
    title: 'Витривалість ходьби',
    label: 'За окремими показаннями',
    summary: '6-хвилинний тест ходьби (6MWT)',
    note: '6MWT потрібний, коли важливо оцінити дистанцію та переносимість тривалішої ходьби. Він не замінює 10MWT, який вимірює швидкість.',
    toolIds: ['neuro-6mwt'],
  },
  {
    id: 'neuro-specific',
    title: 'Специфічні рухові функції',
    label: 'За діагнозом',
    summary: '9-Hole Peg Test · Timed 25-Foot Walk (T25FW)',
    note: '9-Hole Peg Test застосовують при клінічно значущому порушенні дрібної моторики кисті, а T25FW — переважно для стандартизованого спостереження ходьби при розсіяному склерозі. Вони не є рутинними для кожного пацієнта.',
    toolIds: ['neuro-9hpt', 'neuro-t25fw'],
  },
];

const musculoskeletalGroups = [
  {
    id: 'msk-pain-function',
    title: 'Біль і повсякденне функціонування',
    label: 'Основне',
    summary: 'Інтенсивність болю · функціональний вплив · WHODAS 2.0',
    note: 'Інтенсивність болю показує вираженість симптому, а функціональний вплив і WHODAS 2.0 — обмеження активності та участі. Ці оцінки доповнюють, а не замінюють одна одну.',
    toolIds: ['msk-pain-intensity', 'msk-pain-impact', 'msk-whodas'],
    defaultOpen: true,
  },
  {
    id: 'msk-mobility',
    title: 'Рухливість, сила і базова мобільність',
    label: 'Основне',
    summary: 'Обсяг рухів і сила · 30-секундний тест вставання · TUG',
    note: 'Обирайте тест за клінічним завданням: обсяг рухів і сила — для локального порушення, тест вставання — для функції нижніх кінцівок, TUG — для базової мобільності.',
    toolIds: ['msk-range-strength', 'msk-chair-stand', 'msk-tug'],
  },
  {
    id: 'msk-endurance',
    title: 'Витривалість ходьби',
    label: 'За окремими показаннями',
    summary: '6-хвилинний тест ходьби (6MWT)',
    note: '6MWT застосовуйте, коли клінічно важливі дистанція та переносимість тривалої ходьби і пацієнт може безпечно виконати тест. Він не потрібний рутинно кожному пацієнту.',
    toolIds: ['msk-6mwt'],
  },
];

const cardiovascularGroups = [
  {
    id: 'cardio-exercise-response',
    title: 'Реакція на навантаження',
    label: 'Основне',
    summary: 'ЧСС · АТ · SpO₂ · задишка і втома',
    note: 'Життєві показники та симптоми оцінюють разом до, під час і після однакового навантаження. Суб’єктивна шкала симптомів не замінює об’єктивні вимірювання.',
    toolIds: ['cardio-vital-response', 'cardio-exertional-symptoms'],
    defaultOpen: true,
  },
  {
    id: 'cardio-functional-capacity',
    title: 'Функціональна спроможність',
    label: 'Основне',
    summary: '6MWT · повсякденне функціонування',
    note: '6MWT показує переносимість стандартизованої ходьби, а WHODAS 2.0 — ширший вплив стану на повсякденну активність та участь.',
    toolIds: ['cardio-6mwt', 'cardio-whodas'],
  },
  {
    id: 'cardio-heart-failure',
    title: 'Оцінювання при серцевій недостатності',
    label: 'За діагнозом',
    summary: 'Функціональний клас NYHA',
    note: 'NYHA застосовують для опису симптомного обмеження при серцевій недостатності; клас доповнює, але не замінює об’єктивні дослідження.',
    toolIds: ['cardio-nyha'],
  },
  {
    id: 'cardio-peripheral-arteries',
    title: 'Оцінювання периферичних артерій',
    label: 'За діагнозом',
    summary: 'Кісточково-плечовий індекс · ходьба з фіксацією кульгавості',
    note: 'КПІ характеризує артеріальний кровоплин, а стандартизована ходьба — фактичне симптомне обмеження. Ці оцінки відповідають на різні клінічні питання.',
    toolIds: ['cardio-abi', 'cardio-claudication-walk'],
  },
  {
    id: 'cardio-orthostatic',
    title: 'Оцінювання ортостатичних симптомів',
    label: 'За симптомами',
    summary: 'Ортостатична проба з АТ і ЧСС',
    toolIds: ['cardio-orthostatic-bp'],
  },
];

const sensoryGroups = [
  {
    id: 'sensory-functional-impact',
    title: 'Вплив на повсякденне функціонування',
    label: 'Основне',
    summary: 'Зір · слух · спілкування · орієнтування · WHODAS 2.0',
    note: 'Спочатку зафіксуйте конкретні труднощі у звичних ситуаціях. WHODAS 2.0 додавайте, коли потрібна ширша оцінка активності та участі, а не лише опис сенсорної функції.',
    toolIds: ['sensory-functional-vision', 'sensory-functional-communication', 'sensory-whodas'],
    defaultOpen: true,
  },
  {
    id: 'sensory-vision',
    title: 'Об’єктивна оцінка зору',
    label: 'За скаргою',
    summary: 'Гострота зору · поля зору',
    note: 'Гострота зору оцінює розрізнення деталей, а дослідження полів — периферичні дефекти. Один тест не замінює інший.',
    toolIds: ['sensory-visual-acuity', 'sensory-visual-fields'],
  },
  {
    id: 'sensory-hearing',
    title: 'Об’єктивна оцінка слуху',
    label: 'За скаргою',
    summary: 'Тональна аудіометрія · сприйняття мовлення',
    note: 'Аудіометрія визначає пороги слуху, а оцінка мовлення — здатність його розуміти. Розбіжність між результатами потребує клінічної інтерпретації.',
    toolIds: ['sensory-pure-tone-audiometry', 'sensory-speech-hearing'],
  },
];

const cognitiveMentalGroups = [
  {
    id: 'cognitive-function',
    title: 'Когнітивне функціонування',
    label: 'Основне',
    summary: 'Когнітивні труднощі · самостійність і безпека · MoCA за потреби',
    note: 'Почніть із змін порівняно зі звичним рівнем і конкретних помилок у побуті. MoCA додавайте як поглиблений скринінг, якщо результат може змінити подальший маршрут.',
    toolIds: ['cognitive-history', 'cognitive-daily-safety', 'cognitive-moca'],
    defaultOpen: true,
  },
  {
    id: 'mental-symptoms',
    title: 'Тривога і депресивні симптоми',
    label: 'За симптомами',
    summary: 'PHQ-9 · GAD-7 · психосоціальне функціонування',
    note: 'PHQ-9 і GAD-7 оцінюють різні групи симптомів. Їхні результати потрібно доповнювати описом реального впливу на сон, побут, роботу, стосунки та участь.',
    toolIds: ['mental-phq9', 'mental-gad7', 'mental-psychosocial-function'],
  },
  {
    id: 'cognitive-mental-functioning',
    title: 'Загальне повсякденне функціонування',
    label: 'За потреби',
    summary: 'WHODAS 2.0',
    note: 'WHODAS 2.0 застосовуйте, коли потрібна ширша оцінка активності та участі, а не лише когнітивних або емоційних симптомів.',
    toolIds: ['cognitive-mental-whodas'],
  },
];

const urinaryGroups = [
  {
    id: 'urinary-basic',
    title: 'Симптоми і повсякденний патерн',
    label: 'Основне',
    summary: 'Структурована оцінка · щоденник сечовипускань · функціональний вплив',
    note: 'Почніть із типу симптомів, звичних обставин і реального впливу на сон, пересування та активність. Щоденник допомагає об’єктивізувати цей патерн у звичних умовах.',
    toolIds: ['urinary-history', 'urinary-bladder-diary', 'urinary-functional-impact'],
    defaultOpen: true,
  },
  {
    id: 'urinary-emptying',
    title: 'Оцінювання випорожнення сечового міхура',
    label: 'За симптомами',
    summary: 'Залишковий об’єм сечі · урофлоуметрія',
    note: 'Залишковий об’єм і урофлоуметрія доповнюють один одного, але жодне окреме значення не визначає механізм порушення без клінічного контексту.',
    toolIds: ['urinary-pvr', 'urinary-uroflowmetry'],
  },
  {
    id: 'urinary-incontinence',
    title: 'Нетримання і функція тазового дна',
    label: 'За показаннями',
    summary: 'Функція тазового дна · стандартизований pad-тест',
    note: 'Функцію тазового дна оцінює підготовлений фахівець за згодою пацієнта. Pad-тест використовуйте вибірково, лише якщо кількісний результат вплине на рішення.',
    toolIds: ['urinary-pelvic-floor', 'urinary-pad-test'],
  },
  {
    id: 'urinary-complex-functioning',
    title: 'Ширше функціонування при комплексному стані',
    label: 'За потреби',
    summary: 'WHODAS 2.0',
    note: 'WHODAS 2.0 додавайте, коли сечовидільні симптоми є частиною ширшого неврологічного, рухового або комплексного функціонального обмеження.',
    toolIds: ['urinary-whodas'],
  },
];

const digestiveGroups = [
  {
    id: 'digestive-swallowing',
    title: 'Оцінювання при підозрі на дисфагію',
    label: 'За симптомами',
    summary: 'Скринінг ковтання · фактичне приймання їжі · консистенції IDDSI',
    note: 'Спочатку оцініть безпечність ковтання і фактичний спосіб харчування. IDDSI використовуйте лише для документування вже визначеної фахівцем консистенції, а не для її автоматичного вибору.',
    toolIds: ['digestive-swallowing-screen', 'digestive-oral-intake', 'digestive-iddsi'],
  },
  {
    id: 'digestive-nutrition',
    title: 'Ризик недостатнього харчування',
    label: 'За показаннями',
    summary: 'ІМТ · ненавмисна втрата маси · фактичне споживання',
    note: 'Скринінг визначає потребу в поглибленій нутритивній оцінці, але не формує план харчової підтримки автоматично.',
    toolIds: ['digestive-nutrition-risk'],
  },
  {
    id: 'digestive-bowel',
    title: 'Кишкові функції і континенція',
    label: 'За симптомами',
    summary: 'Щоденник кишкових функцій · повсякденний вплив',
    note: 'Щоденник показує звичний патерн, а функціональна оцінка — потребу в допомозі та вплив на участь. Вони не встановлюють причину симптомів.',
    toolIds: ['digestive-bowel-diary', 'digestive-bowel-impact'],
  },
  {
    id: 'digestive-complex-functioning',
    title: 'Ширше функціонування при комплексному стані',
    label: 'За потреби',
    summary: 'WHODAS 2.0',
    note: 'WHODAS 2.0 додавайте, коли ковтання, харчування або кишкові симптоми впливають на ширші сфери активності та участі.',
    toolIds: ['digestive-whodas'],
  },
];

const dailyLivingGroups = [
  {
    id: 'daily-basic-activities',
    title: 'Базове самообслуговування',
    label: 'Основне',
    summary: 'Індекс Бартел · спостереження за виконанням дії',
    note: 'Фіксуйте те, що людина фактично виконує, а не лише її потенційну здатність. Спостереження за конкретною дією допомагає уточнити тип потрібної допомоги.',
    toolIds: ['daily-barthel', 'daily-task-observation'],
    defaultOpen: true,
  },
  {
    id: 'daily-instrumental',
    title: 'Складні побутові дії',
    label: 'За потреби',
    summary: 'Ліки · покупки · харчування · фінанси · транспорт · домашні справи',
    note: 'Оцінюйте фактичне виконання з урахуванням звичного попереднього рівня, ролей, середовища та доступної підтримки.',
    toolIds: ['daily-instrumental-activities'],
  },
  {
    id: 'daily-discharge-support',
    title: 'Безпечна виписка і необхідна підтримка',
    label: 'Перед випискою',
    summary: 'Домашнє середовище · допомога · нагляд · незакриті потреби',
    note: 'До повернення додому визначте конкретні небезпеки, дії, для яких потрібна допомога, її частоту та доступного помічника.',
    toolIds: ['daily-home-safety', 'daily-assistance-plan'],
  },
  {
    id: 'daily-broader-functioning',
    title: 'Ширше повсякденне функціонування',
    label: 'За потреби',
    summary: 'WHODAS 2.0',
    note: 'WHODAS 2.0 додавайте, коли потрібно оцінити когніцію, мобільність, життєву активність та участь поза межами базового самообслуговування.',
    toolIds: ['daily-whodas'],
  },
];

function Detail({ title, children }) {
  return <div><p className="font-bold text-slate-900">{title}</p><div className="mt-1">{children}</div></div>;
}

function AssessmentToolDetails({ tool, onOpenQuestionnaire }) {
  return (
    <div className="space-y-4 text-sm leading-6 text-slate-600">
      <Detail title="Що вимірює">{tool.measures}</Detail>
      {tool.indications && <Detail title="Основні показання">{tool.indications}</Detail>}
      <Detail title="Що документує для функціональної оцінки">{tool.documents}</Detail>
      {tool.metrics && <Detail title="Основні показники"><ul className="list-disc space-y-1 pl-5">{tool.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul></Detail>}
      {tool.protocol && <Detail title="Як виконати">{tool.protocol}</Detail>}
      {tool.interpretation && <Detail title="Інтерпретація">{tool.interpretation}</Detail>}
      <Detail title="Обмеження">{tool.limitations}</Detail>
      {tool.safety && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-950"><p className="font-bold">Безпека</p><p className="mt-1">{tool.safety}</p></div>}
      {tool.licenseNotice && <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-semibold text-amber-900">{tool.licenseNotice}</div>}
      <div><p className="font-bold text-slate-900">Джерело</p><a href={tool.source.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">{tool.source.label}</a></div>
      {tool.questionnaireId && onOpenQuestionnaire && <button type="button" onClick={() => onOpenQuestionnaire(tool.questionnaireId)} className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 sm:w-auto">{tool.actionLabel || 'Провести тест →'}</button>}
    </div>
  );
}

function AssessmentToolCard({ tool, onOpenQuestionnaire }) {
  const [isOpen, setIsOpen] = useState(false);
  const category = functioningCategories[tool.category];

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls={`respiratory-tool-${tool.id}`} className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-slate-50">
        <div>
          <h4 className="text-base font-bold text-slate-950">{tool.name}</h4>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>{category.icon} {category.label}</span>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div id={`respiratory-tool-${tool.id}`} className="space-y-4 border-t border-slate-200 p-4 text-sm leading-6 text-slate-600">
          <AssessmentToolDetails tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />
        </div>
      )}
    </article>
  );
}

function AssessmentGroupCard({ group, tools, onOpenQuestionnaire }) {
  const [isOpen, setIsOpen] = useState(Boolean(group.defaultOpen));
  const isPrimary = group.label === 'Основне';

  return (
    <article className={`overflow-hidden rounded-lg border bg-white ${isPrimary ? 'border-teal-300' : 'border-slate-200'}`}>
      <button type="button" onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls={`assessment-group-${group.id}`} className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-slate-50 sm:p-5">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wide ${isPrimary ? 'text-teal-700' : 'text-slate-500'}`}>{group.label}</span>
          <h3 className="mt-1 text-lg font-bold text-slate-950">{group.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{group.summary}</p>
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-bold ${isPrimary ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'}`} aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div id={`assessment-group-${group.id}`} className="border-t border-slate-200 px-4 sm:px-5">
          {group.note && <p className="border-b border-slate-200 py-4 text-sm font-semibold leading-6 text-slate-700">{group.note}</p>}
          {tools.map((tool) => {
            const category = functioningCategories[tool.category];
            return (
              <section key={tool.id} className="border-b border-slate-200 py-5 last:border-b-0">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-950">{tool.name}</h4>
                  <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${category.classes}`}>{category.icon} {category.label}</span>
                </div>
                <AssessmentToolDetails tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />
              </section>
            );
          })}
        </div>
      )}
    </article>
  );
}

function RespiratoryAssessment({ onOpenQuestionnaire, onCollapse }) {
  const section = respiratoryAssessmentSections[0];
  const toolsById = new Map(section.tools.map((tool) => [tool.id, tool]));
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{section.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{section.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{section.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {respiratoryGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{section.note}</p>
    </section>
  );
}

function NeurologicalAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(neurologicalAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{neurologicalAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{neurologicalAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{neurologicalAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {neurologicalGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{neurologicalAssessmentSection.note}</p>
    </section>
  );
}

function MusculoskeletalAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(musculoskeletalAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{musculoskeletalAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{musculoskeletalAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{musculoskeletalAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {musculoskeletalGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{musculoskeletalAssessmentSection.note}</p>
    </section>
  );
}

function CardiovascularAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(cardiovascularAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{cardiovascularAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{cardiovascularAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{cardiovascularAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {cardiovascularGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{cardiovascularAssessmentSection.note}</p>
    </section>
  );
}

function SensoryAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(sensoryAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{sensoryAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{sensoryAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{sensoryAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {sensoryGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{sensoryAssessmentSection.note}</p>
    </section>
  );
}

function CognitiveMentalAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(cognitiveMentalAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{cognitiveMentalAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{cognitiveMentalAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{cognitiveMentalAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>

      <div className="mb-3 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
        <p className="font-bold text-red-800">Перед плановим оцінюванням</p>
        <p>Гостра або мінлива сплутаність, порушення свідомості, новий неврологічний дефіцит, суїцидальні наміри чи психотичні симптоми потребують невідкладної оцінки.</p>
      </div>

      <div className="grid gap-3">
        {cognitiveMentalGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{cognitiveMentalAssessmentSection.note}</p>
    </section>
  );
}

function UrinaryAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(urinaryAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{urinaryAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{urinaryAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{urinaryAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {urinaryGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{urinaryAssessmentSection.note}</p>
    </section>
  );
}

function DigestiveAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(digestiveAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{digestiveAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{digestiveAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{digestiveAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {digestiveGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{digestiveAssessmentSection.note}</p>
    </section>
  );
}

function DailyLivingAssessment({ onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(dailyLivingAssessmentProfiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );
  const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{dailyLivingAssessmentSection.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{dailyLivingAssessmentSection.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{dailyLivingAssessmentSection.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>
      <div className="grid gap-3">
        {dailyLivingGroups.map((group) => (
          <AssessmentGroupCard key={group.id} group={group} tools={group.toolIds.map((id) => toolsById.get(id)).filter(Boolean)} onOpenQuestionnaire={onOpenQuestionnaire} />
        ))}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{dailyLivingAssessmentSection.note}</p>
    </section>
  );
}

function ProfiledAssessment({ section, profiles, onOpenQuestionnaire, onCollapse }) {
  const tools = Array.from(
    new Map(profiles.flatMap((profile) => profile.tools).map((tool) => [tool.id, tool])).values(),
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">{section.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{section.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{section.description}</p>
        </div>
        <button type="button" onClick={onCollapse} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50">Згорнути систему ↑</button>
      </div>

      <div className="grid gap-3">
        {tools.map((tool) => <AssessmentToolCard key={tool.id} tool={tool} onOpenQuestionnaire={onOpenQuestionnaire} />)}
      </div>
      <p className="mt-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">{section.note}</p>
    </section>
  );
}

function AssistiveProductCard({ product }) {
  const pages = product.pageStart === product.pageEnd ? `стор. ${product.pageStart}` : `стор. ${product.pageStart}–${product.pageEnd}`;
  return (
    <article className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="text-base font-bold leading-6 text-slate-950">{product.productName}</h3>
      <p className="mt-0.5 text-xs leading-5 text-slate-500">{product.classification}</p>
      <div className="mt-3 grid gap-x-6 gap-y-3 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Показання</h4>
          <p className="mt-1 text-sm leading-5 text-slate-700">{product.indications}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Протипоказання</h4>
          <p className="mt-1 text-sm leading-5 text-slate-700">{product.contraindications}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-700"><span className="font-bold text-slate-900">Перевірити:</span> функціональну потребу в засобі та відсутність наведених протипоказань.</p>
      <a href={order774Source.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-blue-700 underline underline-offset-2">Наказ №774/2691, {pages}</a>
    </article>
  );
}

export default function FunctioningAssessment({ initialSearchOpen = false, onOpenQuestionnaire }) {
  const [activeSystem, setActiveSystem] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(initialSearchOpen);
  const [isSystemsOpen, setIsSystemsOpen] = useState(false);
  const systemsRef = useRef(null);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const products = useMemo(() => searchOrder774(submittedQuery), [submittedQuery]);
  const diagnosisSuggestions = useMemo(() => searchOrder774Diagnoses(query), [query]);
  const searched = Boolean(submittedQuery);

  function submit(event) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setVisibleCount(12);
    setIsSuggestionsOpen(false);
  }

  function selectDiagnosis(diagnosis) {
    setQuery(`${diagnosis.code} — ${diagnosis.title}`);
    setSubmittedQuery(diagnosis.code);
    setVisibleCount(12);
    setIsSuggestionsOpen(false);
  }

  function handleDiagnosisKeyDown(event) {
    if (!isSuggestionsOpen || diagnosisSuggestions.length === 0) {
      if (event.key === 'ArrowDown' && diagnosisSuggestions.length > 0) {
        event.preventDefault();
        setIsSuggestionsOpen(true);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestionIndex((index) => (index + 1) % diagnosisSuggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestionIndex((index) => (index - 1 + diagnosisSuggestions.length) % diagnosisSuggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectDiagnosis(diagnosisSuggestions[activeSuggestionIndex] || diagnosisSuggestions[0]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsSuggestionsOpen(false);
    }
  }

  function collapseSystem() {
    setActiveSystem('');
    requestAnimationFrame(() => systemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function selectSystem(systemId) {
    if (!systemId || systemId === activeSystem) {
      collapseSystem();
      return;
    }
    setActiveSystem(systemId);
  }

  return (
    <div className="space-y-5">
      {isSearchOpen ? (
        <section className="rounded-xl border border-teal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Реабілітаційні засоби</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Пошук засобів за діагнозом або кодом МКХ-10</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Введіть код МКХ-10 або назву діагнозу, щоб переглянути показання, протипоказання та нормативні джерела. Пошук працює локально по {order774EntryCount} позиціях наказу №774/2691.</p>
            </div>
            <button type="button" onClick={() => setIsSearchOpen(false)} aria-expanded="true" aria-controls="rehabilitation-search-content" className="shrink-0 rounded-lg border border-teal-300 bg-white px-3 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50">Згорнути пошук ↑</button>
          </div>
          <div id="rehabilitation-search-content">
            <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1" onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsSuggestionsOpen(false);
              }}>
                <label htmlFor="rehabilitation-diagnosis" className="sr-only">Діагноз або код МКХ-10</label>
                <input
                  id="rehabilitation-diagnosis"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveSuggestionIndex(0);
                    setIsSuggestionsOpen(Boolean(event.target.value.trim()));
                  }}
                  onFocus={() => setIsSuggestionsOpen(Boolean(query.trim()))}
                  onKeyDown={handleDiagnosisKeyDown}
                  placeholder="Введіть код МКХ-10 або назву діагнозу"
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={isSuggestionsOpen && diagnosisSuggestions.length > 0}
                  aria-controls="rehabilitation-diagnosis-suggestions"
                  aria-activedescendant={isSuggestionsOpen && diagnosisSuggestions.length > 0 ? `rehabilitation-diagnosis-option-${activeSuggestionIndex}` : undefined}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
                {isSuggestionsOpen && diagnosisSuggestions.length > 0 && (
                  <ul id="rehabilitation-diagnosis-suggestions" role="listbox" className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    {diagnosisSuggestions.map((diagnosis, index) => (
                      <li key={diagnosis.code} role="none">
                        <button
                          id={`rehabilitation-diagnosis-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={index === activeSuggestionIndex}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                          onClick={() => selectDiagnosis(diagnosis)}
                          className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm ${index === activeSuggestionIndex ? 'bg-teal-50 text-teal-950' : 'text-slate-800 hover:bg-slate-50'}`}
                        >
                          <span className="shrink-0 font-bold text-teal-800">{diagnosis.code}</span>
                          <span>{diagnosis.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white transition hover:bg-teal-800">Знайти засоби</button>
            </form>
          </div>
        </section>
      ) : (
        <button type="button" onClick={() => setIsSearchOpen(true)} aria-expanded="false" aria-controls="rehabilitation-search-content" className="flex w-full items-center justify-between gap-4 rounded-xl border border-teal-200 bg-white p-4 text-left transition hover:bg-teal-50/50">
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Реабілітаційні засоби</span>
            <span className="mt-1 block font-bold text-slate-950">Пошук засобів за діагнозом або кодом МКХ-10</span>
            {searched && <span className="mt-1 block text-xs text-slate-500">Запит і результати збережено</span>}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">+</span>
        </button>
      )}

      {isSearchOpen && searched && products.length === 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
          <h3 className="font-bold text-slate-950">Збігів у наказі не знайдено</h3>
          <p className="mt-1">Перевірте код МКХ-10 або введіть коротшу офіційну назву діагнозу.</p>
        </section>
      )}

      {isSearchOpen && searched && products.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-950">Знайдено: {products.length}</h3>
            <p className="text-xs text-slate-500">Нормативна відповідність за наказом №774/2691</p>
          </div>
          {products.slice(0, visibleCount).map((product) => <AssistiveProductCard key={product.id} product={product} />)}
          {visibleCount < products.length && <button type="button" onClick={() => setVisibleCount((count) => count + 12)} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50">Показати ще {Math.min(12, products.length - visibleCount)}</button>}
        </section>
      )}

      {isSearchOpen && searched && <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Важливо</p>
          <p className="mt-1">Діагноз лише звужує нормативний перелік і не є автоматичним призначенням. Конкретний засіб визначають після індивідуального функціонального оцінювання та перевірки чинної редакції документа.</p>
      </section>}

      {isSystemsOpen ? (
        <section ref={systemsRef} className="scroll-mt-4 rounded-xl border border-teal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Функціональні інструменти</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Оцінювання за системами</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Оберіть систему, щоб переглянути доступні дослідження та тести.</p>
            </div>
            <button type="button" onClick={() => setIsSystemsOpen(false)} aria-expanded="true" aria-controls="functioning-systems-content" className="shrink-0 rounded-lg border border-teal-300 bg-white px-3 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50">Згорнути оцінювання ↑</button>
          </div>

          <div id="functioning-systems-content">
            <label htmlFor="assessment-system" className="mt-4 block text-sm font-bold text-slate-800 sm:hidden">Система оцінювання</label>
            <select id="assessment-system" value={activeSystem} onChange={(event) => selectSystem(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:hidden">
              <option value="">Оберіть систему</option>
              {assessmentSystems.map((system) => <option key={system.id} value={system.id}>{system.label}</option>)}
            </select>

            <div className="mt-4 hidden flex-wrap gap-2 sm:flex" aria-label="Системи функціонального оцінювання">
              {assessmentSystems.map((system) => (
                <button key={system.id} type="button" onClick={() => selectSystem(system.id)} aria-pressed={activeSystem === system.id} className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${activeSystem === system.id ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'}`}>
                  {system.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <button ref={systemsRef} type="button" onClick={() => setIsSystemsOpen(true)} aria-expanded="false" aria-controls="functioning-systems-content" className="flex w-full scroll-mt-4 items-center justify-between gap-4 rounded-xl border border-teal-200 bg-white p-4 text-left transition hover:bg-teal-50/50">
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Функціональні інструменти</span>
            <span className="mt-1 block font-bold text-slate-950">Оцінювання за системами</span>
            {activeSystem && <span className="mt-1 block text-xs text-slate-500">Вибір системи збережено</span>}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-700" aria-hidden="true">+</span>
        </button>
      )}

      {isSystemsOpen && activeSystem === 'respiratory' ? (
        <RespiratoryAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'neurological' ? (
        <NeurologicalAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'musculoskeletal' ? (
        <MusculoskeletalAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'cardiovascular' ? (
        <CardiovascularAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'sensory' ? (
        <SensoryAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'cognitive-mental' ? (
        <CognitiveMentalAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'urinary' ? (
        <UrinaryAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'digestive' ? (
        <DigestiveAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : isSystemsOpen && activeSystem === 'daily-living' ? (
        <DailyLivingAssessment onOpenQuestionnaire={onOpenQuestionnaire} onCollapse={collapseSystem} />
      ) : null}
    </div>
  );
}
