'use client';

import { useMemo, useState } from 'react';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const responseOptions = [
  { value: 0, label: 'Жодних' },
  { value: 1, label: 'Незначні' },
  { value: 2, label: 'Помірні' },
  { value: 3, label: 'Великі' },
  { value: 4, label: 'Надзвичайно важко або неможливо виконати' },
];

const domains = [
  {
    id: 'd1',
    title: 'Домен 1. Розуміння та спілкування',
    questions: [
      ['D1.1', 'Зосередженням на чомусь протягом десяти хвилин?'],
      ['D1.2', 'Запам’ятовуванням виконати щось важливе?'],
      ['D1.3', 'Аналізом та пошуком розв’язання проблем у повсякденному житті?'],
      ['D1.4', 'Виконанням нового завдання, наприклад з’ясувати, як дістатися до нового місця?'],
      ['D1.5', 'Загальним розумінням того, що говорять люди?'],
      ['D1.6', 'Початком і підтриманням розмови?'],
    ],
  },
  {
    id: 'd2',
    title: 'Домен 2. Мобільність',
    questions: [
      ['D2.1', 'Тривалим стоянням, наприклад упродовж 30 хвилин?'],
      ['D2.2', 'Вставанням із положення сидячи?'],
      ['D2.3', 'Пересуванням удома?'],
      ['D2.4', 'Виходом із дому?'],
      ['D2.5', 'Прогулянками на велику відстань, скажімо на 1 км або еквівалентну відстань?'],
    ],
  },
  {
    id: 'd3',
    title: 'Домен 3. Самообслуговування',
    questions: [
      ['D3.1', 'Миттям усього тіла?'],
      ['D3.2', 'Одяганням?'],
      ['D3.3', 'Споживанням їжі?'],
      ['D3.4', 'Залишатися самому / самій на кілька днів?'],
    ],
  },
  {
    id: 'd4',
    title: 'Домен 4. Взаємодія з людьми',
    questions: [
      ['D4.1', 'Взаємодією з незнайомими людьми?'],
      ['D4.2', 'Підтриманням дружніх відносин?'],
      ['D4.3', 'Взаємодією з близькими людьми?'],
      ['D4.4', 'Пошуком нових друзів?'],
      ['D4.5', 'Сексуальною активністю?'],
    ],
  },
  {
    id: 'd5-household',
    title: 'Домен 5. Повсякденна діяльність — домашні обов’язки',
    questions: [
      ['D5.1', 'Виконанням домашніх обов’язків?'],
      ['D5.2', 'Належним виконанням найважливіших домашніх обов’язків?'],
      ['D5.3', 'Виконанням усієї домашньої роботи, яку потрібно було зробити?'],
      ['D5.4', 'Швидким виконанням домашньої роботи у разі потреби?'],
    ],
  },
  {
    id: 'd5-work',
    title: 'Домен 5. Повсякденна діяльність — робота або навчання',
    conditional: true,
    questions: [
      ['D5.5', 'Щоденною роботою або навчанням?'],
      ['D5.6', 'Належним виконанням найважливіших робочих або навчальних завдань?'],
      ['D5.7', 'Виконанням усієї роботи, яку ви повинні зробити?'],
      ['D5.8', 'Швидким виконанням роботи у міру потреби?'],
    ],
  },
  {
    id: 'd6',
    title: 'Домен 6. Участь у житті суспільства',
    questions: [
      ['D6.1', 'Наскільки великі проблеми у вас виникали з участю у громадській діяльності порівняно з іншими людьми, наприклад у святкових, релігійних або інших заходах?'],
      ['D6.2', 'Наскільки великі проблеми виникали у вас через бар’єри або перешкоди у вашому середовищі?'],
      ['D6.3', 'Наскільки великі проблеми виникали у вас із відчуттям власної гідності через ставлення та дії інших людей?'],
      ['D6.4', 'Скільки часу ви витратили, щоб поліпшити стан свого здоров’я?'],
      ['D6.5', 'Наскільки сильними були ваші емоційні переживання через стан здоров’я?'],
      ['D6.6', 'Наскільки фінансово затратним є стан вашого здоров’я для вас і вашої родини?'],
      ['D6.7', 'Наскільки великі проблеми виникали у вашій сім’ї через проблеми з вашим здоров’ям?'],
      ['D6.8', 'Наскільки великі проблеми виникали у вас у тому, щоб робити щось самостійно для відпочинку або задоволення?'],
    ],
  },
];

const dayQuestions = [
  ['h1', 'Загалом за останні 30 днів упродовж скількох днів були ці труднощі?'],
  ['h2', 'За останні 30 днів упродовж скількох днів ви були повністю не в змозі займатися звичайною діяльністю або працювати через проблеми зі здоров’ям?'],
  ['h3', 'За останні 30 днів на скільки днів ви скоротили або зменшили повсякденну чи робочу активність через погіршення стану здоров’я? Не враховуйте дні, коли ви були повністю не в змозі щось робити.'],
];

const defaultAnswers = Object.fromEntries(
  domains.flatMap((domain) => domain.questions.map(([key]) => [key, 0])),
);

const scoringDomains = [
  { id: 'd1', code: 'D1', title: 'Розуміння та спілкування', sourceIds: ['d1'] },
  { id: 'd2', code: 'D2', title: 'Пересування у просторі', sourceIds: ['d2'] },
  { id: 'd3', code: 'D3', title: 'Догляд за собою', sourceIds: ['d3'] },
  { id: 'd4', code: 'D4', title: 'Взаємодія з людьми', sourceIds: ['d4'] },
  { id: 'd5', code: 'D5', title: 'Життєва активність', sourceIds: ['d5-household', 'd5-work'] },
  { id: 'd6', code: 'D6', title: 'Участь у житті суспільства', sourceIds: ['d6'] },
];

function flattenQuestions(selectedDomains) {
  return selectedDomains.flatMap((domain) => domain.questions.map(([key, text]) => ({
    key,
    text: `${key}. ${text}`,
    options: responseOptions,
    domainId: domain.id,
  })));
}

function buildCopyText(result, days) {
  const domainText = result.domainScores
    .map((domain) => `${domain.code} — ${domain.title}: ${domain.score} зі 100.`)
    .join(' ');
  const dayText = dayQuestions
    .filter(([key]) => days[key] !== '')
    .map(([key, text]) => `${text} ${days[key]} дн.`)
    .join(' ');

  return `WHODAS 2.0, 36-пунктова версія. Результати за доменами: ${domainText} Загальний результат WHODAS 2.0: ${result.score} зі 100.${dayText ? ` ${dayText}` : ''}`;
}

export default function Whodas36Questionnaire() {
  const [answers, setAnswers] = useState(defaultAnswers);
  const [worksOrStudies, setWorksOrStudies] = useState('no');
  const [days, setDays] = useState({ h1: '', h2: '', h3: '' });
  const [copyStatus, setCopyStatus] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  const activeDomains = useMemo(
    () => domains.filter((domain) => !domain.conditional || worksOrStudies === 'yes'),
    [worksOrStudies],
  );
  const activeQuestions = useMemo(() => flattenQuestions(activeDomains), [activeDomains]);
  const answeredCount = activeQuestions.filter((question) => answers[question.key] !== undefined).length;
  const isComplete = answeredCount === activeQuestions.length;

  const result = useMemo(() => {
    if (!isComplete || !hasCalculated) return null;

    const domainScores = scoringDomains.map((scoringDomain) => {
      const applicableDomains = activeDomains.filter((domain) => scoringDomain.sourceIds.includes(domain.id));
      const applicableQuestions = applicableDomains.flatMap((domain) => domain.questions);
      const rawScore = applicableQuestions.reduce((sum, [key]) => sum + Number(answers[key]), 0);
      const rawMaximum = applicableQuestions.length * 4;
      const exactScore = rawMaximum > 0 ? (rawScore / rawMaximum) * 100 : 0;

      return {
        ...scoringDomain,
        rawScore,
        rawMaximum,
        exactScore,
        score: Math.round(exactScore),
      };
    });

    const exactOverallScore = domainScores.reduce((sum, domain) => sum + domain.exactScore, 0) / domainScores.length;

    return {
      score: Math.round(exactOverallScore),
      maximum: 100,
      domainScores,
      category: 'Результат за шістьма доменами',
    };
  }, [activeDomains, answers, hasCalculated, isComplete]);

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: Number(value) }));
    setCopyStatus('');
    setHasCalculated(false);
  }

  function updateWorkStatus(value) {
    setWorksOrStudies(value);
    setCopyStatus('');
    setHasCalculated(false);
  }

  function clearForm() {
    setAnswers(defaultAnswers);
    setWorksOrStudies('no');
    setDays({ h1: '', h2: '', h3: '' });
    setCopyStatus('');
    setHasCalculated(false);
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildCopyText(result, days));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">WHODAS 2.0 — 36-пунктова самозаповнювана версія</p>
        <p className="mt-1">Оцініть труднощі за останні 30 днів з урахуванням того, як людина зазвичай виконує діяльність, використовуючи доступні допоміжні засоби.</p>
      </div>

      <details className="group overflow-hidden rounded-lg border border-teal-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-teal-900 marker:content-none">
          <span>Інструкція, підрахунок і джерела</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl text-teal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="space-y-3 border-t border-teal-100 px-4 py-4 text-sm leading-6 text-slate-700">
          <p>Для кожного пункту оберіть ступінь труднощів: від 0 «Жодних» до 4 «Надзвичайно важко або неможливо виконати». Питання про роботу або навчання застосовуються лише до людини, яка працює чи навчається.</p>
          <p>Результат кожного домену нормалізується до шкали 0–100 відповідно до офіційної таблиці WHO для розрахунку за доменами. Загальний результат — середнє значення шести неокруглених доменних результатів, округлене до цілого числа. Вищий бал означає більші труднощі функціонування.</p>
          <p>Якщо людина не працює і не навчається, D5 розраховується лише за чотирма питаннями про домашні обов’язки. Незастосовні питання D5.5–D5.8 не прирівнюються до відсутності труднощів.</p>
          <p>WHODAS оцінює функціонування, а не встановлює діагноз. Результат інтерпретує лікар разом із клінічними даними.</p>
          <div className="border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
            <p>Український текст: <a href="https://academy.nszu.gov.ua/pluginfile.php/415054/mod_page/content/101/%D0%86%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%20%D0%A4%D0%9E.pdf" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Академія НСЗУ — «Інструменти оцінювання функціонування»</a>.</p>
            <p className="mt-1">Методика: <a href="https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">WHO Disability Assessment Schedule 2.0</a>.</p>
            <p className="mt-1">Розрахунок: <a href="https://cdn.who.int/media/docs/default-source/classification/icf/whodas/36item-scoring-template-complex-scoring.xlsx?sfvrsn=de1228b3_2" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">офіційна таблиця WHO для 36-пунктової версії</a>.</p>
          </div>
        </div>
      </details>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label htmlFor="whodas-work-status" className="block text-sm font-bold text-slate-950">Чи працює або навчається людина?</label>
        <select id="whodas-work-status" value={worksOrStudies} onChange={(event) => updateWorkStatus(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 sm:max-w-md">
          <option value="">Оберіть відповідь</option>
          <option value="yes">Так</option>
          <option value="no">Ні</option>
        </select>
        <p className="mt-2 text-xs leading-5 text-slate-500">Від відповіді залежить, чи враховуються пункти D5.5–D5.8 про роботу або навчання.</p>
      </div>

      {activeDomains.map((domain) => (
        <fieldset key={domain.id} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
          <legend className="px-1 text-sm font-bold text-slate-950">{domain.title}</legend>
          <div className="mt-2 divide-y divide-slate-100">
            {domain.questions.map(([key, text]) => (
              <label key={key} htmlFor={`whodas-${key}`} className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_18rem] sm:items-center sm:gap-4">
                <span className="text-sm leading-6 text-slate-700"><strong className="text-slate-950">{key}.</strong> {text}</span>
                <select id={`whodas-${key}`} value={answers[key] ?? ''} onChange={(event) => updateAnswer(key, event.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800">
                  <option value="">Оберіть оцінку</option>
                  {responseOptions.map((option) => <option key={option.value} value={option.value}>{option.value} — {option.label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        <legend className="px-1 text-sm font-bold text-slate-950">Додаткові показники за останні 30 днів</legend>
        <p className="mt-1 text-xs leading-5 text-slate-500">Ці три показники не входять до простого сумарного бала.</p>
        <div className="mt-2 space-y-3">
          {dayQuestions.map(([key, text]) => (
            <label key={key} htmlFor={`whodas-${key}`} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center sm:gap-4">
              <span className="text-sm leading-6 text-slate-700">{text}</span>
              <span className="flex items-center gap-2"><input id={`whodas-${key}`} type="number" min="0" max="30" inputMode="numeric" value={days[key]} onChange={(event) => setDays((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm" /><span className="text-sm text-slate-500">днів</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        <button type="button" onClick={() => setHasCalculated(true)} disabled={!isComplete} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Розрахувати</button>
        <button type="button" onClick={clearForm} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Очистити</button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">Загальний результат WHODAS 2.0</p>
        <p className="mt-1 text-3xl font-bold text-blue-800">{result ? `${result.score} із ${result.maximum}` : '—'}</p>
        {!result && <p className="mt-2 text-sm leading-6 text-slate-700">Натисніть «Розрахувати», щоб отримати сумарний результат і оцінки за доменами.</p>}
        {result && (
          <>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {result.domainScores.map((domain) => (
                <div key={domain.id} className="rounded-md border border-white/80 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500">{domain.title}</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">{domain.score} / 100</p>
                  <p className="mt-1 text-xs text-slate-500">Сирий бал: {domain.rawScore} / {domain.rawMaximum}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-white/80 bg-white p-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">Текст для медичної документації</p>
              <p className="mt-2 leading-6">{buildCopyText(result, days)}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button type="button" onClick={copyResult} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Скопіювати результат</button>
                {copyStatus && <span className="text-sm text-slate-600">{copyStatus}</span>}
              </div>
            </div>
          </>
        )}
      </section>

      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">Результат 0–100 описує вираженість труднощів функціонування. Він не встановлює діагноз, групу інвалідності чи потребу в конкретному виді допомоги автоматично. Автоматичні категорії тяжкості не застосовуються.</p>

      <PrintableQuestionnaire
        title="WHODAS 2.0 — 36-пунктова версія"
        instruction="Оцініть труднощі за останні 30 днів. Пункти роботи / навчання включаються лише за відповідної відповіді."
        questions={activeQuestions}
        answers={answers}
        result={result}
        scoreLabel="Загальний результат WHODAS 2.0 (0–100)"
        showInterpretation={false}
        resultDetails={result?.domainScores.map((domain) => ({
          label: `${domain.code} — ${domain.title}`,
          value: `${domain.score} зі 100`,
        })) || []}
      />
    </div>
  );
}
