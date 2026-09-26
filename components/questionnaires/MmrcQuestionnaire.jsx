'use client';

import { useState } from 'react';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const mmrcOptions = [
  { value: 0, label: 'Задишка виникає лише при значному фізичному навантаженні.' },
  { value: 1, label: 'Задишка виникає при швидкій ходьбі по рівній місцевості або під час підйому на невеликий схил.' },
  { value: 2, label: 'Через задишку пацієнт ходить повільніше за людей свого віку або зупиняється, коли йде у власному темпі по рівній місцевості.' },
  { value: 3, label: 'Пацієнт зупиняється через задишку приблизно через 100 метрів або через декілька хвилин ходьби по рівній місцевості.' },
  { value: 4, label: 'Задишка не дозволяє виходити з дому або виникає під час одягання чи роздягання.' },
];

const questions = [{
  key: 'grade',
  text: 'Оберіть одне твердження, яке найкраще описує задишку пацієнта.',
  options: mmrcOptions,
}];

function buildResult(grade) {
  const option = mmrcOptions.find((item) => item.value === grade);
  if (!option) return null;

  return {
    score: grade,
    category: `mMRC ${grade}`,
    description: option.label,
  };
}

function formatPoints(value) {
  if (value === 1) return 'бал';
  if (value >= 2 && value <= 4) return 'бали';
  return 'балів';
}

function buildCopyText(result) {
  return `Задишка за модифікованою шкалою Medical Research Council (mMRC) — ${result.score} ${formatPoints(result.score)}. ${result.description}`;
}

export default function MmrcQuestionnaire() {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const result = selectedGrade === '' ? null : buildResult(Number(selectedGrade));

  function selectGrade(value) {
    setSelectedGrade(String(value));
    setCopyStatus('');
  }

  function clearResult() {
    setSelectedGrade('');
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Модифікована шкала задишки Medical Research Council</p>
        <p className="mt-1">mMRC оцінює, наскільки задишка обмежує ходьбу та повсякденну активність. Оберіть лише один варіант.</p>
      </div>

      <details className="group overflow-hidden rounded-lg border border-teal-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-teal-900 marker:content-none">
          <span>Про шкалу mMRC та її застосування</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl text-teal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="space-y-3 border-t border-teal-100 px-4 py-4 text-sm leading-6 text-slate-700">
          <p>Шкала описує вплив задишки на активність за ступенями від 0 до 4. Вона не вимірює інтенсивність задишки в конкретну хвилину — для цього використовується шкала Borg.</p>
          <p>Результат mMRC не встановлює причину задишки, діагноз ХОЗЛ або тяжкість бронхообструкції. Його оцінюють разом з анамнезом, оглядом, спірометрією та іншими клінічними даними.</p>
          <p>У контексті ХОЗЛ GOLD використовує поріг mMRC ≥2 як ознаку більш вираженого симптомного навантаження, але mMRC не замінює комплексного опитувальника стану здоров’я.</p>
          <p className="border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
            Джерело:{' '}
            <a href="https://goldcopd.org/2026-gold-report-and-pocket-guide/" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">GOLD 2026 Report and Pocket Guide</a>.
          </p>
        </div>
      </details>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-bold text-slate-950">Оберіть твердження, яке найкраще описує задишку пацієнта</legend>
        {mmrcOptions.map((option) => {
          const isSelected = selectedGrade === String(option.value);
          return (
            <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${isSelected ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-200'}`}>
              <input type="radio" name="mmrc-grade" value={option.value} checked={isSelected} onChange={() => selectGrade(option.value)} className="mt-1 h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm leading-6 text-slate-700"><strong className="text-slate-950">mMRC {option.value}.</strong> {option.label}</span>
            </label>
          );
        })}
      </fieldset>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        <button type="button" onClick={clearResult} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Очистити</button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">Результат</p>
        <p className="mt-1 text-3xl font-bold text-blue-800">{result ? `mMRC ${result.score}` : '—'}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result?.description || 'Оберіть один варіант відповіді.'}</p>
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

      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">mMRC характеризує пов’язане із задишкою обмеження активності, але не визначає її причину та не замінює клінічне обстеження.</p>

      <PrintableQuestionnaire
        title="Модифікована шкала задишки mMRC"
        instruction="Оберіть одне твердження, яке найкраще описує задишку пацієнта."
        questions={questions}
        answers={{ grade: selectedGrade }}
        result={result}
        scoreLabel="Ступінь mMRC"
      />
    </div>
  );
}
