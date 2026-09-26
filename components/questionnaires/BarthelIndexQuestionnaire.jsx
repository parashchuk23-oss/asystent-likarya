'use client';

import { useMemo, useState } from 'react';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const sourceUrl = 'https://academy.nszu.gov.ua/pluginfile.php/415054/mod_page/content/101/%D0%86%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B8%20%D0%A4%D0%9E.pdf';

const items = [
  {
    key: 'feeding', code: 'Barthel_eat', title: 'Прийом їжі',
    options: [
      { value: 0, label: 'Не в змозі виконати або не застосовується' },
      { value: 5, label: 'Потребує допомоги, зокрема з нарізанням їжі' },
      { value: 10, label: 'Самостійно приймає їжу' },
    ],
  },
  {
    key: 'transfer', code: 'Barthel_move', title: 'Переміщення з крісла колісного на ліжко і назад',
    options: [
      { value: 0, label: 'Не в змозі виконати або не застосовується' },
      { value: 5, label: 'Може сидіти самостійно, але потребує значної допомоги для переміщення' },
      { value: 10, label: 'Потребує мінімальної допомоги або нагляду' },
      { value: 15, label: 'Повністю самостійне і безпечне переміщення' },
    ],
  },
  {
    key: 'grooming', code: 'Barthel_wash', title: 'Особиста гігієна',
    options: [
      { value: 0, label: 'Потребує допомоги або не застосовується' },
      { value: 5, label: 'Самостійно вмивається, розчісується, чистить зуби та голиться' },
    ],
  },
  {
    key: 'toilet', code: 'Barthel_toilet', title: 'Користування туалетом',
    options: [
      { value: 0, label: 'Залежний або не застосовується' },
      { value: 5, label: 'Потребує допомоги' },
      { value: 10, label: 'Самостійно користується туалетом і справляється з одягом та гігієною' },
    ],
  },
  {
    key: 'bathing', code: 'Barthel_bath', title: 'Самостійне миття',
    options: [
      { value: 0, label: 'Потребує допомоги або не застосовується' },
      { value: 5, label: 'Самостійно миється у ванні, душі або обтирається' },
    ],
  },
  {
    key: 'mobility', code: 'Barthel_walk', title: 'Ходьба по рівній поверхні або пересування у кріслі колісному',
    options: [
      { value: 0, label: 'Не пересувається або не застосовується' },
      { value: 5, label: 'Не ходить, але самостійно пересувається у кріслі колісному щонайменше 45 м' },
      { value: 10, label: 'Проходить щонайменше 45 м з невеликою допомогою або наглядом' },
      { value: 15, label: 'Самостійно проходить щонайменше 45 м, допоміжні засоби дозволені' },
    ],
  },
  {
    key: 'stairs', code: 'Barthel_stair', title: 'Піднімання та спускання сходами',
    options: [
      { value: 0, label: 'Не в змозі виконувати або не застосовується' },
      { value: 5, label: 'Потребує допомоги або нагляду' },
      { value: 10, label: 'Самостійно і безпечно користується сходами' },
    ],
  },
  {
    key: 'dressing', code: 'Barthel_dress', title: 'Одягання',
    options: [
      { value: 0, label: 'Залежний або не застосовується' },
      { value: 5, label: 'Потребує допомоги, але виконує щонайменше половину дій' },
      { value: 10, label: 'Самостійно одягається, роздягається та застібає одяг' },
    ],
  },
  {
    key: 'bowels', code: 'Barthel_bowel', title: 'Контроль дефекації',
    options: [
      { value: 0, label: 'Нетримання або не застосовується' },
      { value: 5, label: 'Епізоди нетримання або потреба в допомозі із супозиторієм чи клізмою' },
      { value: 10, label: 'Контроль збережений, самостійно використовує супозиторій або клізму за потреби' },
    ],
  },
  {
    key: 'bladder', code: 'Barthel_bladder', title: 'Контроль сечового міхура',
    options: [
      { value: 0, label: 'Нетримання, залежність у догляді або не застосовується' },
      { value: 5, label: 'Епізоди нетримання або потреба в допомозі із зовнішнім пристроєм' },
      { value: 10, label: 'Контроль збережений удень і вночі; пристроєм користується самостійно' },
    ],
  },
];

const initialAnswers = Object.fromEntries(items.map((item) => [item.key, '']));

function selectedLabel(item, value) {
  return item.options.find((option) => Number(option.value) === Number(value))?.label || '';
}

function buildCopyText(result) {
  const components = result.components
    .map((component) => `${component.title}: ${component.score} балів — ${component.label}.`)
    .join(' ');
  return `Індекс Бартел (Barthel_Extended). ${components} Загальний результат: ${result.score} зі 100 балів.`;
}

export default function BarthelIndexQuestionnaire() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const isComplete = items.every((item) => answers[item.key] !== '');
  const result = useMemo(() => {
    if (!hasCalculated || !isComplete) return null;
    const components = items.map((item) => ({
      ...item,
      score: Number(answers[item.key]),
      label: selectedLabel(item, answers[item.key]),
    }));
    return {
      score: components.reduce((sum, component) => sum + component.score, 0),
      category: 'Підсумкова оцінка Індекс Бартел (розширений)',
      components,
    };
  }, [answers, hasCalculated, isComplete]);

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setHasCalculated(false);
    setCopyStatus('');
  }

  function clearForm() {
    setAnswers(initialAnswers);
    setHasCalculated(false);
    setCopyStatus('');
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildCopyText(result));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const printableQuestions = items.map((item) => ({
    key: item.key,
    text: `${item.title} (${item.code})`,
    options: item.options,
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Індекс Бартел для активностей повсякденного життя</p>
        <p className="mt-1">Оцінюйте те, що людина фактично виконує. Мета — визначити ступінь незалежності від фізичної або вербальної допомоги. Допоміжні засоби допускаються.</p>
      </div>

      <details className="group overflow-hidden rounded-lg border border-teal-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-teal-900 marker:content-none">
          <span>Інструкція та внесення в ЕСОЗ</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl text-teal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="space-y-3 border-t border-teal-100 px-4 py-4 text-sm leading-6 text-slate-700">
          <p>Враховуйте фактичне виконання активностей за найбільш достовірними даними: зі слів людини, близьких, медичних працівників або за прямим спостереженням.</p>
          <p>В ЕСОЗ результат реєструється як спостереження «Підсумкова оцінка Індекс Бартел (розширений)» з кодом <code>Barthel_Extended</code>. Потрібно внести кожен із десяти обов’язкових компонентів і його результат.</p>
          <p className="border-t border-slate-200 pt-3 text-xs text-slate-500">Джерело: <a href={sourceUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Академія НСЗУ — «Інструменти функціонального оцінювання», сторінки 5–13</a>.</p>
        </div>
      </details>

      <div className="space-y-3">
        {items.map((item, index) => (
          <label key={item.key} htmlFor={`barthel-${item.key}`} className="block rounded-lg border border-slate-200 bg-white p-3 sm:grid sm:grid-cols-[minmax(0,1fr)_24rem] sm:items-center sm:gap-4">
            <span className="text-sm font-semibold leading-6 text-slate-900">{index + 1}. {item.title}<span className="ml-2 text-xs font-normal text-slate-400">{item.code}</span></span>
            <select id={`barthel-${item.key}`} value={answers[item.key]} onChange={(event) => updateAnswer(item.key, event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 sm:mt-0">
              <option value="">Оберіть оцінку</option>
              {item.options.map((option) => <option key={option.value} value={option.value}>{option.value} — {option.label}</option>)}
            </select>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        <button type="button" onClick={() => setHasCalculated(true)} disabled={!isComplete} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Розрахувати</button>
        <button type="button" onClick={clearForm} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Очистити</button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">Загальний результат</p>
        <p className="mt-1 text-3xl font-bold text-blue-800">{result ? `${result.score} зі 100` : '—'}</p>
        {!result && <p className="mt-2 text-sm leading-6 text-slate-700">Заповніть усі 10 компонентів і натисніть «Розрахувати».</p>}
        {result && (
          <div className="mt-3 rounded-md border border-white/80 bg-white p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Текст для медичної документації</p>
            <p className="mt-2 leading-6">{buildCopyText(result)}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button type="button" onClick={copyResult} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Скопіювати результат</button>
              {copyStatus && <span className="text-sm text-slate-600">{copyStatus}</span>}
            </div>
          </div>
        )}
      </section>

      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">Індекс Бартел описує незалежність у базових активностях повсякденного життя. Загальний бал не встановлює діагноз, групу інвалідності або потребу в конкретному виді допомоги автоматично.</p>

      <PrintableQuestionnaire
        title="Індекс Бартел для активностей повсякденного життя"
        instruction="Оцініть фактичне виконання кожної активності."
        questions={printableQuestions}
        answers={answers}
        result={result}
        scoreLabel="Загальний результат (0–100)"
        showInterpretation={false}
        resultDetails={result?.components.map((component) => ({ label: component.title, value: `${component.score} балів` })) || []}
      />
    </div>
  );
}
