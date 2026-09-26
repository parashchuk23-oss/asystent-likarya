'use client';

import { useState } from 'react';

const initialValues = {
  bmi: '',
  fev1: '',
  mmrc: '',
  walkDistance: '',
};

function scoreBmi(value) {
  return value <= 21 ? 1 : 0;
}

function scoreFev1(value) {
  if (value >= 65) return 0;
  if (value >= 50) return 1;
  if (value >= 36) return 2;
  return 3;
}

function scoreMmrc(value) {
  if (value <= 1) return 0;
  return value - 1;
}

function scoreWalkDistance(value) {
  if (value >= 350) return 0;
  if (value >= 250) return 1;
  if (value >= 150) return 2;
  return 3;
}

function getQuartile(score) {
  if (score <= 2) return 'I квартиль (0–2 бали)';
  if (score <= 4) return 'II квартиль (3–4 бали)';
  if (score <= 6) return 'III квартиль (5–6 балів)';
  return 'IV квартиль (7–10 балів)';
}

function calculateBode(values) {
  const bmi = Number(values.bmi);
  const fev1 = Number(values.fev1);
  const mmrc = Number(values.mmrc);
  const walkDistance = Number(values.walkDistance);
  const components = {
    bmi: scoreBmi(bmi),
    fev1: scoreFev1(fev1),
    mmrc: scoreMmrc(mmrc),
    walkDistance: scoreWalkDistance(walkDistance),
  };
  const score = Object.values(components).reduce((sum, value) => sum + value, 0);

  return { score, quartile: getQuartile(score), components };
}

function validate(values) {
  const bmi = Number(values.bmi);
  const fev1 = Number(values.fev1);
  const walkDistance = Number(values.walkDistance);

  if (!values.bmi || bmi < 10 || bmi > 80) return 'Введіть ІМТ у межах 10–80 кг/м².';
  if (!values.fev1 || fev1 <= 0 || fev1 > 200) return 'Введіть постбронходилатаційний ОФВ₁ у межах >0–200% від належного.';
  if (values.mmrc === '') return 'Оберіть ступінь задишки mMRC.';
  if (values.walkDistance === '' || walkDistance < 0 || walkDistance > 1500) return 'Введіть дистанцію 6MWT у межах 0–1500 м.';
  return '';
}

function buildCopyText(values, result) {
  return `BODE-індекс при ХОЗЛ: ${result.score} із 10 балів, ${result.quartile}. ІМТ ${values.bmi} кг/м² — ${result.components.bmi} бал(и); постбронходилатаційний ОФВ₁ ${values.fev1}% від належного — ${result.components.fev1} бал(и); mMRC ${values.mmrc} — ${result.components.mmrc} бал(и); дистанція 6MWT ${values.walkDistance} м — ${result.components.walkDistance} бал(и).`;
}

const componentLabels = {
  bmi: 'ІМТ',
  fev1: 'ОФВ₁',
  mmrc: 'mMRC',
  walkDistance: '6MWT',
};

export default function BodeIndexQuestionnaire() {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  function updateValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError('');
    setCopyStatus('');
  }

  function handleCalculate() {
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }
    setResult(calculateBode(values));
  }

  function handleClear() {
    setValues(initialValues);
    setResult(null);
    setError('');
    setCopyStatus('');
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildCopyText(values, result));
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">BODE — прогностичний індекс для пацієнтів із ХОЗЛ</p>
        <p className="mt-1">Використовує ІМТ, постбронходилатаційний ОФВ₁, задишку за mMRC і дистанцію 6MWT. Діапазон результату: 0–10 балів.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">
          ІМТ (кг/м²)
          <input type="number" min="10" max="80" step="0.1" value={values.bmi} onChange={(event) => updateValue('bmi', event.target.value)} placeholder="Наприклад, 23.5" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950" />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Постбронходилатаційний ОФВ₁ (% від належного)
          <input type="number" min="0.1" max="200" step="0.1" value={values.fev1} onChange={(event) => updateValue('fev1', event.target.value)} placeholder="Наприклад, 48" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950" />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Задишка за mMRC
          <select value={values.mmrc} onChange={(event) => updateValue('mmrc', event.target.value)} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950">
            <option value="">Оберіть 0–4</option>
            {[0, 1, 2, 3, 4].map((value) => <option key={value} value={value}>mMRC {value}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Дистанція 6MWT (м)
          <input type="number" min="0" max="1500" step="1" value={values.walkDistance} onChange={(event) => updateValue('walkDistance', event.target.value)} placeholder="Наприклад, 320" className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950" />
        </label>
      </div>

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        <button type="button" onClick={handleCalculate} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Розрахувати</button>
        <button type="button" onClick={handleClear} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Очистити</button>
      </div>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">Результат BODE</p>
        <p className="mt-1 text-3xl font-bold text-blue-800">{result ? `${result.score} / 10` : '—'}</p>
        <p className="mt-2 text-sm font-semibold text-slate-800">{result?.quartile || 'Заповніть усі чотири показники та натисніть «Розрахувати».'}</p>
        {result && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(result.components).map(([key, points]) => (
                <div key={key} className="rounded-md border border-white bg-white p-3 text-center">
                  <p className="text-xs font-semibold text-slate-500">{componentLabels[key]}</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">{points} бал.</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-white/80 bg-white p-3 text-sm leading-6 text-slate-700">
              <p className="font-semibold text-slate-950">Текст для медичної документації</p>
              <p className="mt-2">{buildCopyText(values, result)}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button type="button" onClick={handleCopy} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Скопіювати результат</button>
                {copyStatus && <span className="text-sm text-slate-600">{copyStatus}</span>}
              </div>
            </div>
          </>
        )}
      </section>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
        Вищий бал BODE відповідає гіршому прогнозу в популяції пацієнтів із ХОЗЛ. Індекс не встановлює діагноз, не визначає групу інвалідності та не замінює клінічну оцінку.
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Джерело:{' '}
        <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa021322" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Celli et al., New England Journal of Medicine, 2004</a>.
      </p>
    </div>
  );
}
