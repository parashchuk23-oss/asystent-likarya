'use client';

import { useState } from 'react';
import { calculatePhq9 } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const questions = [
  'Зниження інтересу або відчуття задоволення від виконання справ',
  'Поганий настрій, відчуття пригнічення або безнадії',
  'Труднощі з засинанням, поверхневий сон або, навпаки, надмірна сонливість',
  'Відчуття втоми або зниження енергії',
  'Поганий апетит або переїдання',
  'Негативне відчуття щодо себе: або Ви почувалися невдахою, або ж розчаровувались у собі, або думали, що підвели родину',
  'Труднощі з концентрацією уваги, наприклад, при читанні або перегляді телепередач',
  'Сповільненість рухів і мовлення, яку помічають оточуючі. Або, навпаки, надмірна і непритаманна Вам метушливість і активність',
  'Думки, що було б краще, якби Ви померли, або думки про те, щоб заподіяти собі шкоду',
];

const options = [
  { value: 0, label: 'ніколи' },
  { value: 1, label: 'декілька днів' },
  { value: 2, label: 'більшу половину часу' },
  { value: 3, label: 'майже щодня' },
];

const initialAnswers = questions.reduce((answers, _question, index) => {
  answers[`q${index}`] = 0;
  return answers;
}, {});

const additionalAssessmentItems = [
  'GAD-7 — супутні симптоми тривоги.',
  'Ризик самоушкодження або суїцидальні думки, особливо при позитивній відповіді на 9-те питання.',
  'Сон, апетит, втома, концентрація та вплив симптомів на повсякденне функціонування.',
  'Вживання алкоголю або психоактивних речовин.',
  'Соматичні причини симптомів: анемія, гіпотиреоз, дефіцит вітаміну B12, хронічний біль, побічні ефекти ліків.',
  'Психосоціальні фактори, стрес, втрати, травматичні події та рівень підтримки.',
];

function buildCopyText(result) {
  return (
    `За шкалою PHQ-9 отримано ${result.score} із 27 балів, що відповідає ${result.categoryForCopy} депресивним симптомам. ` +
    `${result.hasSelfHarmAnswer ? 'На 9-те питання отримано позитивну відповідь, потрібна окрема оцінка безпеки пацієнта. ' : ''}` +
    'Результат має скринінговий характер і потребує інтерпретації з урахуванням клінічної картини.'
  );
}

function VerticalOptionList({ name, selectedValue, onChange }) {
  return (
    <div className="mt-3 space-y-2">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <label
            key={option.value}
            className={`flex w-fit cursor-pointer items-center gap-2 text-base font-medium leading-6 transition ${
              isSelected ? 'text-blue-800' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(event) => onChange(event.target.value)}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function Phq9Questionnaire({ showIntro = true }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  function handleChange(questionKey, value) {
    setAnswers((current) => ({
      ...current,
      [questionKey]: Number(value),
    }));
    setResult(null);
    setCopyStatus('');
  }

  function handleCalculate() {
    setResult(calculatePhq9(answers));
    setCopyStatus('');
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
    setCopyStatus('');
  }

  async function handleCopyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(buildCopyText(result));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-4">
      {showIntro ? (
        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Про PHQ-9</p>
          <p className="mt-2">
            PHQ-9 використовується для скринінгової оцінки депресивних симптомів за останні 2
            тижні.
          </p>
          <p className="mt-2">
            Результат є допоміжним інструментом і не замінює клінічне рішення лікаря.
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question} className="rounded-md border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-100/60">
            <p className="text-base font-semibold leading-6 text-slate-900">
              {index + 1}. {question}
            </p>
            <VerticalOptionList
              name={`phq9-q${index}`}
              selectedValue={answers[`q${index}`]}
              onChange={(value) => handleChange(`q${index}`, value)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
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
          {result ? `PHQ-9: ${result.score} із 27 балів` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Категорія:</span>{' '}
          {result?.category || 'Натисніть “Розрахувати” після заповнення опитувальника.'}
        </p>
        {result ? (
          <>
            <p className="mt-2 leading-6">{result.interpretation}</p>
            {result.hasSelfHarmAnswer ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-900">
                <p className="font-semibold">Окрема увага до 9-го питання</p>
                <p className="mt-1 leading-6">
                  Позитивна відповідь на питання про смерть або самоушкодження потребує окремої
                  своєчасної оцінки безпеки пацієнта та клінічного контексту.
                </p>
              </div>
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
          <p className="mt-2 leading-6">{buildCopyText(result)}</p>
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
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        <p className="font-semibold text-slate-800">Джерело</p>
        <p className="mt-2">
          PHQ-9 є частиною Patient Health Questionnaire і використовується як скринінговий
          інструмент для оцінки вираженості депресивних симптомів.
        </p>
        <p className="mt-2">
          Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: Validity of a Brief Depression Severity
          Measure. Journal of General Internal Medicine. 2001;16(9):606-613.
        </p>
      </div>

      <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        PHQ-9 є скринінговим інструментом для оцінки вираженості депресивних симптомів.
        Результат не є самостійною підставою для встановлення діагнозу або призначення лікування.
        Остаточна оцінка здійснюється лікарем з урахуванням анамнезу, клінічного стану,
        функціонування пацієнта та оцінки безпеки.
      </p>

      <PrintableQuestionnaire
        title="PHQ-9"
        instruction="За останні 2 тижні як часто вас турбували такі проблеми?"
        questions={questions}
        options={options}
      />
    </div>
  );
}
