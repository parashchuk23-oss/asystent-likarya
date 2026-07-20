'use client';

import { useState } from 'react';
import { calculateGad7 } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const questions = [
  'Ви нервували, відчували тривогу або були дуже напружені',
  'Ви не могли зупинити або контролювати своє хвилювання',
  'Ви занадто хвилювались через різні речі',
  'Вам було важко розслабитись',
  'Ви були настільки неспокійні, що Вам було важко всидіти на одному місці',
  'Вам було легко дошкулити або роздратувати',
  'Ви відчували страх, неначе щось жахливе може статися',
];

const options = [
  { value: 0, label: 'ніколи' },
  { value: 1, label: 'декілька днів' },
  { value: 2, label: 'більшу половину часу' },
  { value: 3, label: 'майже щодня' },
];

const functioningOptions = [
  'Зовсім не ускладнювали',
  'Дещо ускладнювали',
  'Дуже ускладнювали',
  'Надзвичайно ускладнювали',
];

const additionalAssessmentItems = [
  'PHQ-9 — симптоми депресії.',
  'AUDIT-C — вживання алкоголю.',
  'Якість і тривалість сну.',
  'Панічні напади.',
  'Ознаки посттравматичного стресу.',
  'Соматичні причини симптомів за клінічними показами.',
  'Лікарські засоби та стимулятори, які можуть посилювати тривогу.',
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = null;
  return answers;
}, {});

function isAnswered(value) {
  return value !== null && value !== undefined;
}

function buildCopyText(result, functioningImpact) {
  const impactText = functioningImpact || 'не вказано';

  return (
    `За шкалою GAD-7 отримано ${result.score} із 21 бала, що відповідає ${result.categoryForCopy} проявам тривоги. ` +
    `Вплив симптомів на роботу, побут або спілкування: ${impactText}. ` +
    'Результат має скринінговий характер і потребує інтерпретації з урахуванням клінічної картини.'
  );
}

export default function Gad7Questionnaire({ showIntro = true }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [functioningImpact, setFunctioningImpact] = useState('');
  const [result, setResult] = useState(null);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const allMainQuestionsAnswered = questions.every((_question, index) => isAnswered(answers[`q${index}`]));
  const hasAnyMainAnswer = questions.some((_question, index) => isAnswered(answers[`q${index}`]));

  function handleChange(questionKey, value) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: Number(value),
    }));
    setResult(null);
    setCopyStatus('');
  }

  function handleFunctioningChange(value) {
    setFunctioningImpact(value);
    setCopyStatus('');
  }

  function handleCalculate() {
    setHasTriedSubmit(true);

    if (!allMainQuestionsAnswered) return;

    setResult(calculateGad7(answers));
    setCopyStatus('');
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setFunctioningImpact('');
    setResult(null);
    setHasTriedSubmit(false);
    setCopyStatus('');
  }

  async function handleCopyResult() {
    if (!result) return;

    const text = buildCopyText(result, functioningImpact);

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const showValidationMessage = (hasTriedSubmit || hasAnyMainAnswer) && !allMainQuestionsAnswered;

  return (
    <div className="space-y-4">
      {showIntro ? (
        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Скринінг тривожності — GAD-7</p>
          <p className="mt-2">
            Оцінка вираженості симптомів тривоги протягом останніх двох тижнів.
          </p>
          <p className="mt-2">
            GAD-7 є скринінговим інструментом і не встановлює діагноз самостійно.
          </p>
        </div>
      ) : null}

      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-950">
          За останні 2 тижні, як часто вас турбували такі проблеми?
        </p>
      </div>

      {showValidationMessage ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">
          Будь ласка, дайте відповідь на всі 7 запитань.
        </p>
      ) : null}

      <div className="space-y-4">
        {questions.map((question, index) => {
          const questionKey = `q${index}`;
          const isMissing = hasTriedSubmit && !isAnswered(answers[questionKey]);

          return (
            <div
              key={question}
              className={`rounded-md border bg-white p-4 shadow-sm shadow-slate-100/60 ${
                isMissing ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200/80'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{question}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {options.map((option) => {
                  const isSelected = answers[questionKey] === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`gad7-q${index}`}
                        value={option.value}
                        checked={isSelected}
                        onChange={(event) => handleChange(questionKey, event.target.value)}
                        className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
        <p className="text-sm font-semibold text-slate-900">
          Якщо ви позначили будь-які з цих проблем, наскільки сильно вони ускладнювали Вам роботу, побут або спілкування з іншими людьми?
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {functioningOptions.map((option) => {
            const isSelected = functioningImpact === option;

            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  name="gad7-functioning"
                  value={option}
                  checked={isSelected}
                  onChange={(event) => handleFunctioningChange(event.target.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!allMainQuestionsAnswered}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto"
        >
          Розрахувати
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>

        <PrintQuestionnaireButton />
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-slate-900">
        <p className="text-slate-600">Результат</p>
        <p className="mt-1 text-3xl font-semibold text-blue-800">
          {result ? `GAD-7: ${result.score} із 21 бала` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Категорія:</span>{' '}
          {result?.category || 'Натисніть “Розрахувати” після заповнення опитувальника.'}
        </p>
        {result ? (
          <>
            <p className="mt-2 leading-6">{result.interpretation}</p>
            {functioningImpact ? (
              <p className="mt-2">
                <span className="font-semibold">Вплив на повсякденне функціонування:</span>{' '}
                «{functioningImpact}».
              </p>
            ) : null}
            <div className="mt-4 rounded-md border border-blue-200 bg-white/70 p-3">
              <p className="font-semibold">Наступний клінічний крок</p>
              <p className="mt-1 leading-6">{result.nextStep}</p>
            </div>
          </>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Текст для медичної документації</p>
          <p className="mt-2 leading-6">{buildCopyText(result, functioningImpact)}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopyResult}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
            >
              Скопіювати результат
            </button>
            {copyStatus ? <span className="text-sm text-slate-600">{copyStatus}</span> : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-950">Що варто оцінити додатково</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-6">
          {additionalAssessmentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 rounded-md border border-amber-100 bg-amber-50 p-3 text-amber-900">
          В умовах тривалого стресу або воєнної небезпеки підвищений результат може відображати як тривожний розлад, так і ситуативну реакцію на об’єктивну загрозу. Потрібна клінічна диференціація.
        </p>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        <p className="font-semibold text-slate-800">Джерело</p>
        <p className="mt-2">
          Шкала GAD-7 розроблена R. L. Spitzer, K. Kroenke, J. B. W. Williams та B. Löwe.
        </p>
        <p className="mt-2">
          Україномовна адаптація: Алексіна Н., Герасименко О., Лавриненко Д., Савченко О.
          Українська адаптація шкали для оцінки генералізованого тривожного розладу GAD-7.
          Інсайт: психологічні виміри суспільства. 2024;11:77–103.
          DOI: 10.32999/2663-970X/2024-11-5.
        </p>
      </div>

      <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        GAD-7 є скринінговим інструментом для оцінки вираженості симптомів тривоги.
        Результат не є самостійною підставою для встановлення діагнозу або призначення
        лікування. Остаточна оцінка здійснюється лікарем з урахуванням анамнезу,
        клінічного стану та впливу симптомів на повсякденне функціонування.
      </p>

      <PrintableQuestionnaire
        title="GAD-7"
        instruction="За останні 2 тижні, як часто вас турбували такі проблеми?"
        questions={questions}
        options={options}
      />
    </div>
  );
}
