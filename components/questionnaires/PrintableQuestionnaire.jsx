'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function normalizeQuestions(questions, sharedOptions) {
  return questions.map((question, index) => {
    if (typeof question === 'string') {
      return {
        key: `q${index}`,
        text: question,
        options: sharedOptions,
      };
    }

    return {
      key: question.key || `q${index}`,
      text: question.text,
      options: question.options || sharedOptions,
    };
  });
}

export function PrintQuestionnaireButton({ label = 'Роздрукувати опитувальник' }) {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
    >
      {label}
    </button>
  );
}

export default function PrintableQuestionnaire({
  title,
  instruction,
  questions,
  options,
  answers,
  result,
  scoreLabel = 'Сума балів',
  interpretationLabel = 'Інтерпретація',
}) {
  const normalizedQuestions = normalizeQuestions(questions, options);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function isOptionSelected(question, option) {
    if (!answers) return false;
    return Number(answers[question.key]) === Number(option.value);
  }

  const hasPrintedScore = result?.score !== undefined && result?.score !== null;
  const printedInterpretation = result?.category || result?.interpretation || '';

  const printMarkup = (
    <section className="questionnaire-print-area hidden">
      <div className="print-header">
        <p className="print-brand">Асистент лікаря</p>
        <h1>{title}</h1>
        {instruction ? <p className="print-instruction">{instruction}</p> : null}
      </div>

      <div className="print-patient-grid">
        <div>ПІБ: ________________________________________________</div>
        <div>Дата: ____ / ____ / ______</div>
        <div>Вік: ____________________</div>
        <div>Лікар: ______________________________________________</div>
      </div>

      <ol className="print-question-list">
        {normalizedQuestions.map((question) => (
          <li key={question.key} className="print-question">
            <p>{question.text}</p>
            <div className="print-options">
              {question.options.map((option) => {
                const isSelected = isOptionSelected(question, option);

                return (
                  <span key={`${question.key}-${option.label}`} className="print-option">
                    <span className={`print-checkbox ${isSelected ? 'print-checkbox-selected' : ''}`} aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className={isSelected ? 'print-selected-option' : ''}>{option.label}</span>
                    <span className="print-points">({option.value})</span>
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="print-result-grid">
        <div>{scoreLabel}: {hasPrintedScore ? result.score : '____________________'}</div>
        <div>
          {interpretationLabel}: {printedInterpretation || '________________________________________________'}
        </div>
      </div>

      <p className="print-disclaimer">
        Результат є допоміжним інструментом і оцінюється лікарем разом із клінічною
        картиною, анамнезом та іншими даними.
      </p>
    </section>
  );

  if (!isMounted) return null;

  return createPortal(printMarkup, document.body);
}
