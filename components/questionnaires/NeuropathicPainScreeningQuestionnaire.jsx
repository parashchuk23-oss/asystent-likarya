'use client';

import { useState } from 'react';
import { calculateNeuropathicPainScreening } from '../../utils/calculations';
import PrintableQuestionnaire, { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const items = [
  { key: 'burning', text: 'Печіння' },
  { key: 'electric', text: 'Простріли або відчуття електричного струму' },
  { key: 'tingling', text: 'Поколювання або “мурашки”' },
  { key: 'numbness', text: 'Оніміння' },
  { key: 'allodynia', text: 'Біль від звичайного дотику або одягу' },
  { key: 'hyperalgesia', text: 'Надмірна болючість при легкому подразненні' },
  { key: 'dermatomal', text: 'Поширення болю по ходу нерва або дерматому' },
];

const printOptions = [
  { value: 0, label: 'ні' },
  { value: 1, label: 'так' },
];

const printQuestions = items.map((item) => ({
  key: item.key,
  text: item.text,
  options: printOptions,
}));

function buildPrintAnswers(selectedItems) {
  return items.reduce((answers, item) => {
    answers[item.key] = selectedItems.includes(item.key) ? 1 : 0;
    return answers;
  }, {});
}

function buildCopyText(result, selectedLabels) {
  const signsText = selectedLabels.length ? selectedLabels.join(', ') : 'не позначено';

  return (
    `Скринінг нейропатичного компонента болю: ${result.score} озн. (${signsText}). ` +
    `${result.category} ${result.interpretation}`
  );
}

export default function NeuropathicPainScreeningQuestionnaire() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  const selectedLabels = items
    .filter((item) => selectedItems.includes(item.key))
    .map((item) => item.text.toLowerCase());

  function toggleItem(key) {
    setSelectedItems((current) =>
      current.includes(key) ? current.filter((itemKey) => itemKey !== key) : [...current, key]
    );
    setResult(null);
    setCopyStatus('');
  }

  function handleCalculate() {
    setResult(calculateNeuropathicPainScreening(selectedItems));
    setCopyStatus('');
  }

  function handleClear() {
    setSelectedItems([]);
    setResult(null);
    setCopyStatus('');
  }

  async function handleCopyResult() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(buildCopyText(result, selectedLabels));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">Скринінг нейропатичного компонента болю</p>
        <p className="mt-2">
          Короткий чек-лист типових ознак, які можуть підказувати нейропатичний компонент.
        </p>
        <p className="mt-2">
          Це не DN4 і не валідована діагностична шкала, а довідкова підказка для лікаря.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item.key);

          return (
            <label
              key={item.key}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-base font-medium transition ${
                isSelected
                  ? 'border-blue-300 bg-blue-50 text-blue-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItem(item.key)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{item.text}</span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Розрахувати
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton />
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-slate-900">
        <p className="text-slate-600">Результат</p>
        <p className="mt-1 text-3xl font-semibold text-blue-800">
          {result ? `${result.score} озн.` : '—'}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Інтерпретація:</span>{' '}
          {result?.category || 'Позначте ознаки та натисніть “Розрахувати”.'}
        </p>
        {result ? <p className="mt-2 leading-6">{result.interpretation}</p> : null}
      </div>

      {result ? (
        <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">Текст для медичної документації</p>
          <p className="mt-2 leading-6">{buildCopyText(result, selectedLabels)}</p>
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

      <p className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
        Чек-лист не встановлює діагноз нейропатичного болю. Остаточна оцінка проводиться
        лікарем з урахуванням анамнезу, неврологічного статусу, основного захворювання та
        додаткових даних.
      </p>

      <PrintableQuestionnaire
        title="Скринінг нейропатичного компонента болю"
        instruction="Позначте ознаки, які описує пацієнт."
        questions={printQuestions}
        options={printOptions}
        answers={buildPrintAnswers(selectedItems)}
        result={result}
        scoreLabel="Кількість ознак"
      />
    </div>
  );
}
