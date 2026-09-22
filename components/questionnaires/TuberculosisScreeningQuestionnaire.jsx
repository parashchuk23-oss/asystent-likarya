'use client';

import { useMemo, useState } from 'react';
import {
  tuberculosisScreeningQuestions,
  tuberculosisScreeningSections,
  tuberculosisScreeningSource,
} from '../../data/questionnaires/tuberculosisScreening';
import {
  buildTuberculosisScreeningConclusion,
  evaluateTuberculosisScreening,
} from '../../utils/tuberculosisScreening';
import PrintArea from '../PrintArea';
import { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const initialAnswers = tuberculosisScreeningQuestions.reduce((answers, question) => {
  answers[question.id] = '';
  return answers;
}, {});

function AnswerOption({ questionId, value, label, selectedValue, onChange }) {
  const isSelected = selectedValue === value;

  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition ${
        isSelected
          ? value === 'yes'
            ? 'border-amber-400 bg-amber-50 text-amber-900'
            : 'border-teal-400 bg-teal-50 text-teal-900'
          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/40'
      }`}
    >
      <input
        type="radio"
        name={`tb-${questionId}`}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
        className="h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-500"
      />
      {label}
    </label>
  );
}

export default function TuberculosisScreeningQuestionnaire() {
  const [answers, setAnswers] = useState(initialAnswers);
  const [result, setResult] = useState(null);
  const [conclusion, setConclusion] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [showSputumInstructions, setShowSputumInstructions] = useState(false);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((answer) => answer === 'yes' || answer === 'no').length,
    [answers],
  );

  function handleAnswer(questionId, value) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setResult(null);
    setConclusion('');
    setValidationMessage('');
    setCopyStatus('');
  }

  function handleEvaluate() {
    const nextResult = evaluateTuberculosisScreening(answers);

    if (!nextResult.isComplete) {
      setResult(null);
      setConclusion('');
      setValidationMessage(`Дайте відповідь на всі 14 запитань. Не заповнено: ${nextResult.unansweredCount}.`);
      return;
    }

    setResult(nextResult);
    setConclusion(buildTuberculosisScreeningConclusion(nextResult));
    setValidationMessage('');
    setCopyStatus('');
  }

  function handleClear() {
    setAnswers(initialAnswers);
    setResult(null);
    setConclusion('');
    setValidationMessage('');
    setCopyStatus('');
    setShowSputumInstructions(false);
  }

  async function handleCopy() {
    if (!conclusion) return;

    try {
      await navigator.clipboard.writeText(conclusion);
      setCopyStatus('Заключення скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-6 text-slate-700">
        <h3 className="font-semibold text-slate-950">Скринінг на туберкульоз</h3>
        <p className="mt-2">
          Офіційна скринінгова анкета для дорослої особи щодо чинників ризику та
          симптомів, що можуть свідчити про ТБ. Відповідь «Так» хоча б на одне питання є
          підставою для подальшого обстеження з метою виявлення ТБ.
        </p>
        <p className="mt-2 font-medium text-slate-800">
          Заповнено: {answeredCount} із {tuberculosisScreeningQuestions.length}
        </p>
      </section>

      {tuberculosisScreeningSections.map((section, sectionIndex) => (
        <section key={section.id} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-800">
            {section.title}
          </h3>
          {section.questions.map((question, questionIndex) => {
            const number = sectionIndex === 0 ? questionIndex + 1 : 8 + questionIndex;

            return (
              <fieldset
                key={question.id}
                className="rounded-md border border-slate-200 bg-white p-3 shadow-sm shadow-slate-100/60"
              >
                <legend className="sr-only">Питання {number}</legend>
                <p className="text-sm font-semibold leading-6 text-slate-900">
                  {number}. {question.text}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AnswerOption
                    questionId={question.id}
                    value="yes"
                    label="Так"
                    selectedValue={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                  />
                  <AnswerOption
                    questionId={question.id}
                    value="no"
                    label="Ні"
                    selectedValue={answers[question.id]}
                    onChange={(value) => handleAnswer(question.id, value)}
                  />
                </div>
              </fieldset>
            );
          })}
        </section>
      ))}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleEvaluate}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Оцінити
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      {validationMessage ? (
        <p role="alert" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">
          {validationMessage}
        </p>
      ) : null}

      {result?.isComplete ? (
        <>
          <section
            className={`rounded-md border p-4 text-sm leading-6 ${
              result.isPositive
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : 'border-teal-300 bg-teal-50 text-teal-950'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em]">Результат</p>
            <h3 className="mt-1 text-lg font-semibold">
              {result.isPositive
                ? 'Потребує подальшого обстеження на туберкульоз'
                : 'За анкетою підстав для подальшого обстеження не виявлено'}
            </h3>
            {result.isPositive ? (
              <div className="mt-3">
                <p className="font-semibold">Позитивні відповіді:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {result.positiveAnswers.map((question) => (
                    <li key={question.id}>{question.positiveLabel}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <p className="mt-2">
                  За результатами скринінгової анкети не виявлено симптомів або чинників
                  ризику, які за цією анкетою є підставою для подальшого обстеження на ТБ.
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  Негативний результат анкети не виключає туберкульоз за наявності інших
                  клінічних або радіологічних ознак. Для окремих груп підвищеного ризику
                  подальший скринінг визначається чинним стандартом.
                </p>
              </>
            )}
          </section>

          {result.isPositive ? (
            <section className="rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
              <h3 className="text-base font-semibold text-slate-950">Подальше обстеження</h3>
              <ol className="mt-3 space-y-3">
                <li>
                  <span className="font-semibold text-slate-900">1. Клінічна оцінка.</span>{' '}
                  Уточнити скарги, анамнез, попередній ТБ і контакти, провести фізикальне
                  обстеження та диференційну діагностику.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">2. Рентгенографія органів грудної клітки.</span>{' '}
                  КТ ОГК — за клінічною необхідністю.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">3. Молекулярно-генетичне дослідження.</span>{' '}
                  За можливості отримати мокротиння — зібрати зразок і направити на Xpert
                  MTB/RIF®(Ultra) для виявлення комплексу M. tuberculosis та стійкості до
                  рифампіцину.
                  <button
                    type="button"
                    aria-expanded={showSputumInstructions}
                    onClick={() => setShowSputumInstructions((current) => !current)}
                    className="mt-2 block rounded-md border border-teal-300 bg-teal-50 px-3 py-2 text-left text-sm font-semibold text-teal-800 transition hover:border-teal-500"
                  >
                    Як правильно зібрати мокротиння? {showSputumInstructions ? '−' : '+'}
                  </button>
                  {showSputumInstructions ? (
                    <div className="mt-2 rounded-md border border-teal-200 bg-teal-50/60 p-3">
                      <p className="font-semibold text-teal-950">Мокротиння з нижніх дихальних шляхів, а не слина.</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>Збирати на відкритому повітрі або у спеціально обладнаному приміщенні.</li>
                        <li>Використати стерильний одноразовий контейнер із широкою горловиною та кришкою, що закручується.</li>
                        <li>Прополоскати рот водою; чистити зуби безпосередньо перед процедурою не рекомендується.</li>
                        <li>Зробити два глибокі вдихи, після кожного затримати дихання на кілька секунд і повільно видихнути.</li>
                        <li>Вдихнути втретє, із силою видихнути повітря з легень і глибоко відкашлятися.</li>
                        <li>Відкрити контейнер безпосередньо перед відкашлюванням, сплюнути мокротиння та щільно закрити контейнер.</li>
                        <li>Вимити руки з милом.</li>
                      </ul>
                    </div>
                  ) : null}
                </li>
                <li>
                  <span className="font-semibold text-slate-900">4. ВІЛ.</span>{' '}
                  Запропонувати тестування на ВІЛ відповідно до чинного порядку та за
                  інформованою згодою.
                </li>
              </ol>
            </section>
          ) : null}

          <section className="rounded-md border border-slate-200 bg-white p-4">
            <label htmlFor="tb-screening-conclusion" className="text-sm font-semibold text-slate-950">
              Текст для медичного запису
            </label>
            <textarea
              id="tb-screening-conclusion"
              value={conclusion}
              onChange={(event) => setConclusion(event.target.value)}
              rows={result.isPositive ? 12 : 5}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Копіювати заключення
              </button>
              {copyStatus ? <span className="text-sm text-slate-600">{copyStatus}</span> : null}
            </div>
          </section>
        </>
      ) : null}

      <footer className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <p className="font-semibold text-slate-900">Джерело</p>
        <p className="mt-1">
          {tuberculosisScreeningSource.title}. {tuberculosisScreeningSource.order}.{' '}
          {tuberculosisScreeningSource.registry}. {tuberculosisScreeningSource.appendix}.
        </p>
        <p>Перевірено: {tuberculosisScreeningSource.checkedAt}.</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <a className="font-semibold text-blue-700 underline" href={tuberculosisScreeningSource.registryUrl} target="_blank" rel="noreferrer">Реєстр ДЕЦ</a>
          <a className="font-semibold text-blue-700 underline" href={tuberculosisScreeningSource.appendixUrl} target="_blank" rel="noreferrer">Офіційні додатки</a>
          <a className="font-semibold text-blue-700 underline" href={tuberculosisScreeningSource.detectionOrderUrl} target="_blank" rel="noreferrer">Наказ МОЗ №302</a>
        </div>
      </footer>

      <PrintArea>
        <div className="print-header">
          <p className="print-brand">Асистент лікаря</p>
          <h1>Скринінг на туберкульоз</h1>
          <p className="print-instruction">Скринінгова анкета для дорослої особи за Додатком 8 до Стандартів медичної допомоги «Туберкульоз».</p>
        </div>
        <div className="print-patient-grid">
          <div>ПІБ: ________________________________________________</div>
          <div>Дата: ____ / ____ / ______</div>
          <div>Вік: ____________________</div>
          <div>Лікар: ______________________________________________</div>
        </div>
        <ol className="print-question-list">
          {tuberculosisScreeningQuestions.map((question, index) => (
            <li key={question.id} className="print-question">
              <p><span className="print-question-number">{index + 1}. </span>{question.text}</p>
              <div className="print-options">
                {[
                  { value: 'yes', label: 'Так' },
                  { value: 'no', label: 'Ні' },
                ].map((option) => {
                  const selected = answers[question.id] === option.value;
                  return (
                    <span key={option.value} className="print-option">
                      <span className={`print-checkbox ${selected ? 'print-checkbox-selected' : ''}`}>{selected ? '✓' : ''}</span>
                      <span className={selected ? 'print-selected-option' : ''}>{option.label}</span>
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        <div className="print-report-section">
          <h2>Результат і текст для медичного запису</h2>
          <div className="print-preserve-lines">{conclusion || 'Заповніть усі питання та натисніть «Оцінити».'}</div>
        </div>
        <p className="print-disclaimer">
          {tuberculosisScreeningSource.order}, {tuberculosisScreeningSource.appendix}. Негативний результат анкети не виключає ТБ за наявності інших клінічних або радіологічних ознак.
        </p>
      </PrintArea>
    </div>
  );
}
