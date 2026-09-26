'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const TEST_DURATION_SECONDS = 6 * 60;

const borgOptions = [
  { value: '', label: 'Оберіть оцінку' },
  { value: '0', label: '0 — немає' },
  { value: '0.5', label: '0,5 — дуже-дуже слабка' },
  { value: '1', label: '1 — дуже слабка' },
  { value: '2', label: '2 — слабка' },
  { value: '3', label: '3 — помірна' },
  { value: '4', label: '4 — дещо сильна' },
  { value: '5', label: '5 — сильна' },
  { value: '6', label: '6 — між сильною і дуже сильною' },
  { value: '7', label: '7 — дуже сильна' },
  { value: '8', label: '8 — дуже-дуже сильна' },
  { value: '9', label: '9 — майже максимальна' },
  { value: '10', label: '10 — максимальна' },
];

const initialValues = {
  indication: '',
  courseLength: '30',
  oxygenSupport: 'ні',
  oxygenFlow: '',
  walkingAid: 'немає',
  medicationNote: '',
  preHeartRate: '',
  preBloodPressure: '',
  preSpo2: '',
  preDyspnea: '',
  preFatigue: '',
  fullLaps: '',
  additionalDistance: '',
  minimumSpo2: '',
  stopsCount: '',
  stopsDuration: '',
  symptoms: '',
  stopReason: '',
  postHeartRate: '',
  postBloodPressure: '',
  postSpo2: '',
  postDyspnea: '',
  postFatigue: '',
  recoveryTime: '',
};

function NumberField({ id, label, value, onChange, min = 0, max, step = 1, placeholder = '' }) {
  return (
    <label className="text-sm font-semibold text-slate-800" htmlFor={id}>
      {label}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TextField({ id, label, value, onChange, placeholder = '' }) {
  return (
    <label className="text-sm font-semibold text-slate-800" htmlFor={id}>
      {label}
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function BorgSelect({ id, label, value, onChange }) {
  return (
    <label className="text-sm font-semibold text-slate-800" htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {borgOptions.map((option) => (
          <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatBorgValue(value) {
  return String(value || 'не вказано').replace('.', ',');
}

function formatPrintValue(value, suffix = '') {
  return value ? `${String(value).replace('.', ',')}${suffix}` : '—';
}

function buildResultText(values, distance) {
  const parts = [`Проведено 6-хвилинний тест ходьби. Пройдена дистанція — ${distance} м.`];

  if (values.preSpo2 || values.minimumSpo2 || values.postSpo2) {
    const spo2Parts = [];
    if (values.preSpo2) spo2Parts.push(`вихідна — ${values.preSpo2}%`);
    if (values.minimumSpo2) spo2Parts.push(`мінімальна під час навантаження — ${values.minimumSpo2}%`);
    if (values.postSpo2) spo2Parts.push(`після тесту — ${values.postSpo2}%`);
    parts.push(`SpO₂: ${spo2Parts.join(', ')}.`);
  }

  if (values.preHeartRate || values.postHeartRate) {
    const heartRateParts = [];
    if (values.preHeartRate) heartRateParts.push(`${values.preHeartRate}/хв до тесту`);
    if (values.postHeartRate) heartRateParts.push(`${values.postHeartRate}/хв після тесту`);
    parts.push(`ЧСС: ${heartRateParts.join(', ')}.`);
  }

  if (values.preBloodPressure || values.postBloodPressure) {
    const bloodPressureParts = [];
    if (values.preBloodPressure) bloodPressureParts.push(`${values.preBloodPressure} мм рт. ст. до тесту`);
    if (values.postBloodPressure) bloodPressureParts.push(`${values.postBloodPressure} мм рт. ст. після тесту`);
    parts.push(`АТ: ${bloodPressureParts.join(', ')}.`);
  }

  if (values.preDyspnea || values.postDyspnea) {
    parts.push(`Задишка за Borg: ${formatBorgValue(values.preDyspnea)} → ${formatBorgValue(values.postDyspnea)} балів.`);
  }

  if (values.preFatigue || values.postFatigue) {
    parts.push(`Втома за Borg: ${formatBorgValue(values.preFatigue)} → ${formatBorgValue(values.postFatigue)} балів.`);
  }

  if (values.oxygenSupport === 'так') {
    parts.push(`Тест виконано з кисневою підтримкою${values.oxygenFlow ? ` ${values.oxygenFlow} л/хв` : ''}.`);
  } else {
    parts.push('Тест виконано без кисневої підтримки.');
  }

  if (values.walkingAid !== 'немає') parts.push(`Допоміжний засіб: ${values.walkingAid}.`);
  if (values.medicationNote) parts.push(`Препарати перед тестом: ${values.medicationNote}.`);
  if (values.stopsCount) parts.push(`Зупинки: ${values.stopsCount}${values.stopsDuration ? `, загальна тривалість ${values.stopsDuration} с` : ''}.`);
  else parts.push('Тест виконано без зафіксованих зупинок.');
  if (values.stopReason) parts.push(`Причина дострокового припинення: ${values.stopReason}.`);
  if (values.symptoms) parts.push(`Симптоми під час тесту: ${values.symptoms}.`);
  if (values.recoveryTime) parts.push(`Час відновлення — ${values.recoveryTime} хв.`);
  if (values.indication) parts.push(`Показання: ${values.indication}.`);

  return parts.join(' ');
}

export default function SixMinuteWalkTest() {
  const [values, setValues] = useState(initialValues);
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const distance = useMemo(() => {
    const courseLength = Number(values.courseLength || 0);
    const fullLaps = Number(values.fullLaps || 0);
    const additionalDistance = Number(values.additionalDistance || 0);
    return Math.max(0, Math.round((courseLength * fullLaps + additionalDistance) * 10) / 10);
  }, [values.courseLength, values.fullLaps, values.additionalDistance]);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timerId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [timerRunning]);

  function updateValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setResultText('');
    setCopyStatus('');
  }

  function resetTimer() {
    setTimerRunning(false);
    setSecondsLeft(TEST_DURATION_SECONDS);
  }

  function finishTimerEarly() {
    setTimerRunning(false);
    setSecondsLeft(0);
  }

  function clearAll() {
    setValues(initialValues);
    setSafetyConfirmed(false);
    setResultText('');
    setCopyStatus('');
    resetTimer();
  }

  function printProtocol() {
    const previousTitle = document.title;
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    document.title = '';
    window.addEventListener('afterprint', restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 1000);
  }

  function createResult() {
    if (distance <= 0) return;
    setResultText(buildResultText(values, distance));
    setCopyStatus('');
  }

  async function copyResult() {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopyStatus('Результат скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const printMarkup = (
    <section className="print-area questionnaire-print-area hidden">
      <div className="print-header">
        <h1>Протокол проведення 6-хвилинного тесту ходьби (6MWT)</h1>
      </div>
      <div className="print-patient-grid">
        <div>ПІБ: ________________________________________________</div>
        <div>Дата і час: __________________________________________</div>
        <div>Лікар: ______________________________________________</div>
        <div>Відділення: _________________________________________</div>
      </div>

      <section className="sixmwt-print-section">
        <h2>Умови проведення</h2>
        <div className="sixmwt-print-grid">
          <div><strong>Показання:</strong> {formatPrintValue(values.indication)}</div>
          <div><strong>Довжина доріжки:</strong> {formatPrintValue(values.courseLength, ' м')}</div>
          <div><strong>Киснева підтримка:</strong> {values.oxygenSupport}{values.oxygenSupport === 'так' && values.oxygenFlow ? `, ${values.oxygenFlow} л/хв` : ''}</div>
          <div><strong>Допоміжний засіб:</strong> {formatPrintValue(values.walkingAid)}</div>
          <div className="sixmwt-print-wide"><strong>Препарати перед тестом:</strong> {formatPrintValue(values.medicationNote)}</div>
        </div>
      </section>

      <section className="sixmwt-print-section">
        <h2>Показники</h2>
        <table className="sixmwt-print-table">
          <thead>
            <tr><th>Показник</th><th>До тесту</th><th>Після тесту</th></tr>
          </thead>
          <tbody>
            <tr><td>ЧСС</td><td>{formatPrintValue(values.preHeartRate, '/хв')}</td><td>{formatPrintValue(values.postHeartRate, '/хв')}</td></tr>
            <tr><td>АТ</td><td>{formatPrintValue(values.preBloodPressure, ' мм рт. ст.')}</td><td>{formatPrintValue(values.postBloodPressure, ' мм рт. ст.')}</td></tr>
            <tr><td>SpO₂</td><td>{formatPrintValue(values.preSpo2, '%')}</td><td>{formatPrintValue(values.postSpo2, '%')}</td></tr>
            <tr><td>Задишка за Borg, бали</td><td>{formatPrintValue(values.preDyspnea)}</td><td>{formatPrintValue(values.postDyspnea)}</td></tr>
            <tr><td>Втома за Borg, бали</td><td>{formatPrintValue(values.preFatigue)}</td><td>{formatPrintValue(values.postFatigue)}</td></tr>
          </tbody>
        </table>
      </section>

      <section className="sixmwt-print-section">
        <h2>Результат тесту</h2>
        <div className="sixmwt-print-grid">
          <div><strong>Загальна дистанція:</strong> {distance} м</div>
          <div><strong>Повні відрізки:</strong> {formatPrintValue(values.fullLaps)}</div>
          <div><strong>Залишкова відстань:</strong> {formatPrintValue(values.additionalDistance, ' м')}</div>
          <div><strong>Мінімальна SpO₂ під час тесту:</strong> {formatPrintValue(values.minimumSpo2, '%')}</div>
          <div><strong>Кількість зупинок:</strong> {formatPrintValue(values.stopsCount)}</div>
          <div><strong>Тривалість зупинок:</strong> {formatPrintValue(values.stopsDuration, ' с')}</div>
          <div><strong>Час відновлення:</strong> {formatPrintValue(values.recoveryTime, ' хв')}</div>
          <div className="sixmwt-print-wide"><strong>Симптоми:</strong> {formatPrintValue(values.symptoms)}</div>
          <div className="sixmwt-print-wide"><strong>Причина дострокового припинення:</strong> {formatPrintValue(values.stopReason)}</div>
        </div>
      </section>

      <div className="sixmwt-print-signature">Підпис лікаря: __________________________________</div>
      <a className="sixmwt-print-site" href="https://www.asystentlikarya.com.ua">www.asystentlikarya.com.ua</a>
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-blue-100 bg-blue-50/60 p-3 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Стандартизоване документування 6MWT</p>
        <p className="mt-1">Тест оцінює субмаксимальну функціональну спроможність. Модуль не визначає «норму», діагноз або групу інвалідності.</p>
      </div>

      <details className="group overflow-hidden rounded-lg border border-teal-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-teal-900 marker:content-none">
          <span>Техніка, протипоказання та припинення тесту</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xl text-teal-700 transition group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="space-y-5 border-t border-teal-100 px-4 py-4 text-sm leading-6 text-slate-700">
          <section>
            <h3 className="font-bold text-slate-950">Техніка проведення</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Рівна пряма доріжка рекомендованою довжиною 30 м із чітко позначеними точками розвороту.</li>
              <li>Зручний одяг і взуття; звичний допоміжний засіб та призначена киснева підтримка використовуються без змін і документуються.</li>
              <li>Без інтенсивного навантаження протягом 2 годин; перед тестом — щонайменше 15 хвилин спокою сидячи та звичайні призначені препарати.</li>
              <li>До тесту визначають ЧСС, SpO₂, АТ, задишку та втому за Borg.</li>
              <li>Пацієнт іде якомога далі за 6 хвилин без бігу. Можна сповільнюватися, зупинятися й відпочивати, але таймер не зупиняють.</li>
              <li>Не задавайте темп ходьби. Використовуйте однакові стандартні фрази підтримки через кожну хвилину.</li>
              <li>ЧСС і SpO₂ контролюють безперервно; фіксують найнижчу SpO₂, зупинки, симптоми та причину припинення.</li>
              <li>Після тесту записують дистанцію, ЧСС, SpO₂, задишку й втому за Borg, за потреби — АТ.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-slate-950">Абсолютні протипоказання</h3>
            <p className="mt-2">
              Гострий інфаркт міокарда (3–5 діб), нестабільна стенокардія, симптомна або гемодинамічно значуща неконтрольована аритмія, синкопе, активний ендокардит, гострий міокардит/перикардит, симптомний тяжкий аортальний стеноз, неконтрольована серцева недостатність, гостра ТЕЛА/інфаркт легені, тромбоз вен нижніх кінцівок, підозра на розшарування аорти, неконтрольована астма, набряк легень, гостра дихальна недостатність, гострий стан, який може погіршитися через навантаження, або неможливість виконувати інструкції.
            </p>
            <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950">
              SpO₂ у спокої на кімнатному повітрі ≤85% є протипоказанням, якщо тест не проводять на призначеній кисневій підтримці.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-950">Відносні протипоказання</h3>
            <p className="mt-2">
              Стеноз стовбура лівої коронарної артерії або еквівалент, помірний стенотичний клапанний порок, нелікований АТ у спокої ≥200/120 мм рт. ст., тахі-/брадіаритмія, AV-блокада високого ступеня, гіпертрофічна кардіоміопатія, значна легенева гіпертензія, ускладнена вагітність, електролітні порушення або ортопедичне обмеження ходьби. Рішення приймає лікар індивідуально.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-950">Критерії дострокового припинення</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>SpO₂ &lt;80%.</li>
              <li>Біль або дискомфорт у грудній клітці.</li>
              <li>Нестерпна задишка або виражена слабкість.</li>
              <li>Судоми чи сильний біль у ногах, хиткість ходи.</li>
              <li>Запаморочення, передсинкопе або синкопе.</li>
              <li>Холодний піт, різка блідість або попелястий колір шкіри.</li>
              <li>Інша клінічна нестабільність або прохання пацієнта припинити тест.</li>
            </ul>
            <p className="mt-2">
              Після припинення посадіть або покладіть пацієнта, оцініть ЧСС, АТ і SpO₂, зафіксуйте причину та надайте необхідну допомогу. Відновлення ходьби після десатурації можливе лише за локальним протоколом і після клінічної оцінки безпеки.
            </p>
          </section>

          <p className="border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
            Джерело:{' '}
            <a href="https://www.thoracic.org/statements/document-development/resources/tech_stds_ex.pdf" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">
              ERS/ATS Technical Standard: Field Walking Tests in Chronic Respiratory Disease
            </a>.
          </p>
        </div>
      </details>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-bold text-slate-950">1. Підготовка та умови тесту</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TextField id="sixmwt-indication" label="Показання" value={values.indication} onChange={(value) => updateValue('indication', value)} />
          <NumberField id="sixmwt-course" label="Довжина доріжки (м)" value={values.courseLength} onChange={(value) => updateValue('courseLength', value)} min={1} />
          <label className="text-sm font-semibold text-slate-800" htmlFor="sixmwt-oxygen">
            Киснева підтримка
            <select id="sixmwt-oxygen" value={values.oxygenSupport} onChange={(event) => updateValue('oxygenSupport', event.target.value)} className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base font-normal text-slate-950">
              <option value="ні">ні</option>
              <option value="так">так</option>
            </select>
          </label>
          <NumberField id="sixmwt-oxygen-flow" label="Потік кисню (л/хв)" value={values.oxygenFlow} onChange={(value) => updateValue('oxygenFlow', value)} min={0} step={0.5} />
          <TextField id="sixmwt-aid" label="Допоміжний засіб" value={values.walkingAid} onChange={(value) => updateValue('walkingAid', value)} />
          <TextField id="sixmwt-medication" label="Препарати перед тестом" value={values.medicationNote} onChange={(value) => updateValue('medicationNote', value)} />
        </div>
        <label className="mt-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <input type="checkbox" checked={safetyConfirmed} onChange={(event) => setSafetyConfirmed(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300" />
          <span><strong>Лікар перевірив можливість безпечного проведення тесту.</strong> Ця позначка документує клінічне рішення, а не замінює його.</span>
        </label>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-bold text-slate-950">2. Вихідні показники</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <NumberField id="sixmwt-pre-hr" label="ЧСС (/хв)" value={values.preHeartRate} onChange={(value) => updateValue('preHeartRate', value)} />
          <TextField id="sixmwt-pre-bp" label="АТ (мм рт. ст.)" value={values.preBloodPressure} onChange={(value) => updateValue('preBloodPressure', value)} placeholder="120/80" />
          <NumberField id="sixmwt-pre-spo2" label="SpO₂ (%)" value={values.preSpo2} onChange={(value) => updateValue('preSpo2', value)} max={100} />
          <BorgSelect id="sixmwt-pre-dyspnea" label="Задишка за Borg" value={values.preDyspnea} onChange={(value) => updateValue('preDyspnea', value)} />
          <BorgSelect id="sixmwt-pre-fatigue" label="Втома за Borg" value={values.preFatigue} onChange={(value) => updateValue('preFatigue', value)} />
        </div>
      </section>

      <section className="rounded-lg border border-teal-200 bg-teal-50/40 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-950">3. Проведення тесту</h3>
            <p className="mt-1 text-sm text-slate-600">Під час зупинки пацієнта таймер не призупиняють.</p>
          </div>
          <div className="text-5xl font-bold tabular-nums text-teal-800" aria-live="polite">{formatTimer(secondsLeft)}</div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" disabled={!safetyConfirmed || timerRunning || secondsLeft === 0} onClick={() => setTimerRunning(true)} className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300">Почати тест</button>
          <button type="button" disabled={!timerRunning} onClick={finishTimerEarly} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400">Завершити достроково</button>
          <button type="button" onClick={resetTimer} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Скинути таймер</button>
        </div>
        <div className="mt-4 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="sixmwt-laps" label="Кількість повністю пройдених відрізків" value={values.fullLaps} onChange={(value) => updateValue('fullLaps', value)} />
          <NumberField id="sixmwt-extra" label="Відстань після останнього повного відрізка (м)" value={values.additionalDistance} onChange={(value) => updateValue('additionalDistance', value)} step={0.1} />
          <NumberField id="sixmwt-min-spo2" label="Мінімальна SpO₂ (%)" value={values.minimumSpo2} onChange={(value) => updateValue('minimumSpo2', value)} max={100} />
          <div className="rounded-md border border-teal-200 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-slate-600">Загальна дистанція</p>
            <p className="mt-1 text-3xl font-bold text-teal-800">{distance} м</p>
          </div>
          <NumberField id="sixmwt-stops" label="Кількість зупинок" value={values.stopsCount} onChange={(value) => updateValue('stopsCount', value)} />
          <NumberField id="sixmwt-stops-duration" label="Тривалість зупинок (с)" value={values.stopsDuration} onChange={(value) => updateValue('stopsDuration', value)} />
          <TextField id="sixmwt-symptoms" label="Симптоми під час тесту" value={values.symptoms} onChange={(value) => updateValue('symptoms', value)} />
          <TextField id="sixmwt-stop-reason" label="Причина дострокового припинення" value={values.stopReason} onChange={(value) => updateValue('stopReason', value)} />
        </div>
        <p className="mt-3 rounded-md border border-teal-200 bg-white px-3 py-2 text-sm leading-6 text-slate-600">
          Один відрізок — шлях між двома позначками в одному напрямку. Загальна дистанція розраховується автоматично: довжина доріжки × кількість повних відрізків + залишкова відстань.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-bold text-slate-950">4. Показники після тесту</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <NumberField id="sixmwt-post-hr" label="ЧСС (/хв)" value={values.postHeartRate} onChange={(value) => updateValue('postHeartRate', value)} />
          <TextField id="sixmwt-post-bp" label="АТ (мм рт. ст.)" value={values.postBloodPressure} onChange={(value) => updateValue('postBloodPressure', value)} placeholder="130/80" />
          <NumberField id="sixmwt-post-spo2" label="SpO₂ (%)" value={values.postSpo2} onChange={(value) => updateValue('postSpo2', value)} max={100} />
          <BorgSelect id="sixmwt-post-dyspnea" label="Задишка за Borg" value={values.postDyspnea} onChange={(value) => updateValue('postDyspnea', value)} />
          <BorgSelect id="sixmwt-post-fatigue" label="Втома за Borg" value={values.postFatigue} onChange={(value) => updateValue('postFatigue', value)} />
          <NumberField id="sixmwt-recovery" label="Відновлення (хв)" value={values.recoveryTime} onChange={(value) => updateValue('recoveryTime', value)} step={0.5} />
        </div>
      </section>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
        <button type="button" disabled={distance <= 0} onClick={createResult} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Сформувати результат</button>
        <button type="button" onClick={clearAll} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Очистити</button>
        <button type="button" onClick={printProtocol} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Роздрукувати</button>
      </div>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h3 className="font-bold text-slate-950">Текст для медичної документації</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{resultText || 'Вкажіть пройдену дистанцію та натисніть «Сформувати результат».'}</p>
        {resultText && (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button type="button" onClick={copyResult} className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Скопіювати результат</button>
            {copyStatus && <span className="text-sm text-slate-600">{copyStatus}</span>}
          </div>
        )}
      </section>

      <div className="rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
        Джерела:{' '}
        <a href="https://www.thoracic.org/statements/resources/pfet/sixminute.pdf" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">ATS Statement: Guidelines for the Six-Minute Walk Test (2002)</a>
        {' '}та{' '}
        <a href="https://www.thoracic.org/statements/document-development/resources/tech_stds_ex.pdf" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">ERS/ATS Technical Standard: Field Walking Tests in Chronic Respiratory Disease (2014)</a>.
        {' '}Порівнюйте повторні результати лише за співставних умов проведення.
      </div>

      {isMounted ? createPortal(printMarkup, document.body) : null}
    </div>
  );
}
