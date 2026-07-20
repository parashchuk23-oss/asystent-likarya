'use client';

import { useMemo, useState } from 'react';
import { buildQtMetricsInput, calculateQtMetrics, getSmallCellDurationMs } from '../../../utils/ecg/qtCalculations';
import { inputClass, textareaClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const rhythmSigns = [
  { id: 'pBeforeEachQrs', label: 'Є зубець P перед кожним QRS' },
  { id: 'pPositiveII', label: 'P позитивний у II відведенні' },
  { id: 'pNegativeAvr', label: 'P негативний в aVR' },
  { id: 'rrRegular', label: 'Інтервали RR регулярні' },
  { id: 'noClearP', label: 'Чіткі P не визначаються' },
  { id: 'irregularRr', label: 'RR нерегулярні' },
  { id: 'flutterWaves', label: 'Є хвилі F / пилкоподібна активність' },
  { id: 'pacerSpikes', label: 'Є стимуляційні спайки ЕКС' },
  { id: 'wideQrs', label: 'QRS широкий' },
];

const polarityOptions = [
  { value: 'positive', label: 'позитивний' },
  { value: 'negative', label: 'негативний' },
  { value: 'isoelectric', label: 'R=S / ізоелектричний' },
];

const freeTextItems = [
  { id: 'blocks', label: 'Блокади', placeholder: 'Наприклад: ознак блокад немає', norm: 'приблизна норма: ознак порушення провідності немає' },
  { id: 'hypertrophy', label: 'Гіпертрофія', placeholder: 'Наприклад: критерії ГЛШ не виконуються', norm: 'приблизна норма: ЕКГ-критерії гіпертрофії не виконуються' },
  { id: 'st', label: 'ST', placeholder: 'Наприклад: без значущих змін', norm: 'приблизна норма: без значущої елевації або депресії' },
  { id: 't', label: 'T', placeholder: 'Наприклад: без гострих ішемічних змін', norm: 'приблизна норма: без гострих ішемічних змін' },
  { id: 'q', label: 'Патологічні Q', placeholder: 'Наприклад: не виявлені', norm: 'приблизна норма: патологічні Q не виявлені' },
];

const normalChecklistValues = {
  rate: '76',
  rrCells: '',
  rhythmSigns: {
    pBeforeEachQrs: true,
    pPositiveII: true,
    pNegativeAvr: true,
    rrRegular: true,
    noClearP: false,
    irregularRr: false,
    flutterWaves: false,
    pacerSpikes: false,
    wideQrs: false,
  },
  rhythmManual: '',
  axisI: 'positive',
  axisII: 'positive',
  axisAvf: 'positive',
  pqCells: '4.5',
  qrsCells: '2.25',
  qt: 'QTc 420 мс',
  blocks: 'ознак порушення провідності не виявлено',
  hypertrophy: 'ЕКГ-критерії гіпертрофії камер серця не виконуються',
  st: 'сегмент ST без значущої елевації або депресії',
  t: 'зубці T без гострих ішемічних змін',
  q: 'патологічні зубці Q не виявлені',
};

function formatNumber(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(number)) return '';
  return String(Math.round(number));
}

function cellsToMs(cells, paperSpeed) {
  const value = Number(String(cells || '').replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * getSmallCellDurationMs(paperSpeed));
}

function calculateRateFromRrCells(rrCells, paperSpeed) {
  const rrMs = cellsToMs(rrCells, paperSpeed);
  if (!rrMs) return null;
  return Math.round(60000 / rrMs);
}

function getRateStatus(rate) {
  if (!rate) return '';
  if (rate < 60) return 'брадикардія';
  if (rate > 100) return 'тахікардія';
  return 'нормальна ЧСС';
}

function buildRateText(values, paperSpeed) {
  const manualRate = formatNumber(values.rate);
  const calculatedRate = calculateRateFromRrCells(values.rrCells, paperSpeed);
  const rate = calculatedRate || Number(manualRate);

  if (!rate) return '';

  return `ЧСС ${rate}/хв, ${getRateStatus(rate)}`;
}

function inferRhythm(values) {
  const signs = values.rhythmSigns || {};

  if (values.rhythmManual?.trim()) {
    return values.rhythmManual.trim();
  }

  if (signs.pacerSpikes) {
    return 'електрокардіостимулятора';
  }

  if (signs.flutterWaves) {
    return 'тріпотіння передсердь';
  }

  if (signs.noClearP && signs.irregularRr) {
    return 'фібриляція передсердь';
  }

  if (signs.pBeforeEachQrs && signs.pPositiveII && signs.pNegativeAvr) {
    return signs.rrRegular ? 'синусовий, регулярний' : 'синусовий, нерегулярний';
  }

  if (signs.wideQrs) {
    return 'потребує уточнення; широкий QRS-комплекс';
  }

  return 'потребує уточнення';
}

function buildAxisText(values) {
  const { axisI, axisII, axisAvf } = values;

  if (axisI === 'positive' && axisAvf === 'positive') {
    if (axisII === 'isoelectric') {
      return 'електрична вісь серця орієнтовно не відхилена; у II відведенні QRS ізоелектричний (R=S), оцінити разом з іншими відведеннями';
    }
    return 'електрична вісь серця орієнтовно не відхилена';
  }

  if (axisI === 'positive' && axisAvf === 'negative') {
    return axisII === 'positive'
      ? 'електрична вісь серця орієнтовно в межах норми або помірно відхилена вліво'
      : 'електрична вісь серця орієнтовно відхилена вліво';
  }

  if (axisI === 'negative' && axisAvf === 'positive') {
    return 'електрична вісь серця орієнтовно відхилена вправо';
  }

  if (axisI === 'negative' && axisAvf === 'negative') {
    return 'електрична вісь серця орієнтовно різко відхилена';
  }

  return 'електрична вісь серця потребує уточнення за відведеннями кінцівок';
}

function buildConclusion(values, paperSpeed) {
  const rateText = buildRateText(values, paperSpeed);
  const rhythm = inferRhythm(values);
  const pqMs = cellsToMs(values.pqCells, paperSpeed);
  const qrsMs = cellsToMs(values.qrsCells, paperSpeed);
  const lines = [
    rateText,
    rhythm ? `ритм ${rhythm}` : '',
    buildAxisText(values),
    pqMs ? `PQ ${pqMs} мс` : '',
    qrsMs ? `QRS ${qrsMs} мс` : '',
    values.qt?.trim(),
    ...freeTextItems
    .map((item) => values[item.id]?.trim())
    .filter(Boolean),
  ].filter(Boolean);

  if (!lines.length) {
    return 'Заповніть пункти чек-листа, щоб сформувати короткий структурований висновок.';
  }

  return `${lines.join('. ')}.`;
}

export default function EcgChecklistModule() {
  const [values, setValues] = useState(normalChecklistValues);
  const [qtForm, setQtForm] = useState({
    inputMode: 'cells',
    paperSpeed: '25',
    qt: '10.5',
    rr: '19.75',
    heartRate: '',
    sex: 'male',
  });
  const conclusion = useMemo(() => buildConclusion(values, qtForm.paperSpeed), [values, qtForm.paperSpeed]);
  const qtMetricsInput = useMemo(() => buildQtMetricsInput(qtForm), [qtForm]);
  const qtMetrics = useMemo(() => calculateQtMetrics(qtMetricsInput), [qtMetricsInput]);
  const pqMs = useMemo(() => cellsToMs(values.pqCells, qtForm.paperSpeed), [values.pqCells, qtForm.paperSpeed]);
  const qrsMs = useMemo(() => cellsToMs(values.qrsCells, qtForm.paperSpeed), [values.qrsCells, qtForm.paperSpeed]);
  const calculatedRate = useMemo(
    () => calculateRateFromRrCells(values.rrCells, qtForm.paperSpeed),
    [values.rrCells, qtForm.paperSpeed],
  );
  const effectiveRate = calculatedRate || Number(formatNumber(values.rate)) || null;
  const rhythmText = useMemo(() => inferRhythm(values), [values]);

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const updateRhythmSign = (id, checked) => {
    setValues((current) => ({
      ...current,
      rhythmSigns: {
        ...current.rhythmSigns,
        [id]: checked,
      },
    }));
  };
  const resetToNormal = () => setValues(normalChecklistValues);
  const updateQtForm = (field, value) => setQtForm((current) => ({ ...current, [field]: value }));
  const applyQtToChecklist = () => {
    if (!qtMetrics) return;
    update('qt', `QT ${qtMetrics.qt} мс, QTc Fridericia ${qtMetrics.qtcFridericia} мс (${qtMetrics.interpretation.label.toLowerCase()})`);
  };

  return (
    <EcgModuleShell
      eyebrow="Чек-лист"
      title="Покроковий аналіз ЕКГ"
      description="Базовий маршрут: ЧСС, ритм, вісь, інтервали, провідність, гіпертрофія, ST-T та патологічні Q."
    >
      <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-emerald-900">
          Чек-лист заповнений приблизною нормою. Змініть лише ті пункти, де на ЕКГ є відхилення.
        </p>
        <button
          type="button"
          onClick={resetToNormal}
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          Повернути норму
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Швидкість плівки</span>
          <select
            value={qtForm.paperSpeed}
            onChange={(event) => updateQtForm('paperSpeed', event.target.value)}
            className={inputClass}
          >
            <option value="25">25 мм/с</option>
            <option value="50">50 мм/с</option>
          </select>
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
            1 маленька клітинка = {getSmallCellDurationMs(qtForm.paperSpeed)} мс
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">ЧСС</span>
          <input
            type="number"
            min="0"
            step="1"
            value={values.rate}
            onChange={(event) => update('rate', event.target.value)}
            placeholder="76"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">приблизна норма: 60–100/хв</span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">RR, маленьких клітинок</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={values.rrCells}
            onChange={(event) => update('rrCells', event.target.value)}
            placeholder="Наприклад: 20"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
            якщо RR заповнено, ЧСС буде розрахована автоматично{calculatedRate ? `: ${calculatedRate}/хв` : ''}
          </span>
        </label>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 lg:col-span-3">
          <p className="text-sm font-bold text-blue-900">
            У висновку: {effectiveRate ? `ЧСС ${effectiveRate}/хв, ${getRateStatus(effectiveRate)}.` : 'введіть ЧСС або RR.'}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:col-span-3">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Ритм: ознаки на ЕКГ</span>
          <div className="grid gap-2 md:grid-cols-2">
            {rhythmSigns.map((sign) => (
              <label key={sign.id} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(values.rhythmSigns?.[sign.id])}
                  onChange={(event) => updateRhythmSign(sign.id, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                />
                <span>{sign.label}</span>
              </label>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Ручне уточнення ритму</span>
            <input
              value={values.rhythmManual}
              onChange={(event) => update('rhythmManual', event.target.value)}
              placeholder="Заповніть, якщо автоматичний висновок треба замінити"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <p className="mt-3 rounded-md border border-blue-100 bg-white p-3 text-sm font-bold text-blue-900">
            У висновку: ритм {rhythmText}.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:col-span-3">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Електрична вісь: полярність QRS</span>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['axisI', 'I'],
              ['axisII', 'II'],
              ['axisAvf', 'aVF'],
            ].map(([id, label]) => (
              <label key={id} className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
                <select value={values[id]} onChange={(event) => update(id, event.target.value)} className={inputClass}>
                  {polarityOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-slate-500">
            Якщо R=S, оберіть “ізоелектричний”; програма сформує обережний орієнтовний висновок.
          </p>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">PQ, маленьких клітинок</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={values.pqCells}
            onChange={(event) => update('pqCells', event.target.value)}
            placeholder="4.5"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
            приблизна норма: 120–200 мс; зараз {pqMs ? `${pqMs} мс` : 'введіть кількість клітинок'}
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">QRS, маленьких клітинок</span>
          <input
            type="number"
            min="0"
            step="0.25"
            value={values.qrsCells}
            onChange={(event) => update('qrsCells', event.target.value)}
            placeholder="2.25"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
            приблизна норма: 60–110 мс; зараз {qrsMs ? `${qrsMs} мс` : 'введіть кількість клітинок'}
          </span>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">QT / QTc</span>
          <input
            value={values.qt || ''}
            onChange={(event) => update('qt', event.target.value)}
            placeholder="Наприклад: QTc 420 мс"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
            приблизна норма QTc: до 450 мс у чоловіків, до 460 мс у жінок
          </span>
        </label>

        {freeTextItems.map((item) => (
          <label key={item.id} className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">{item.label}</span>
            <input
              value={values[item.id] || ''}
              onChange={(event) => update(item.id, event.target.value)}
              placeholder={item.placeholder}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-100/60 transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">{item.norm}</span>
          </label>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="font-bold text-slate-950">QT / QTc: розрахунок із клітинок</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Введіть QT і RR у мілісекундах або в маленьких клітинках. При 25 мм/с одна маленька клітинка = 40 мс, при 50 мм/с = 20 мс.
            </p>
          </div>
          <button
            type="button"
            onClick={applyQtToChecklist}
            disabled={!qtMetrics}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Внести в QT/QTc
          </button>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Спосіб</span>
            <select value={qtForm.inputMode} onChange={(event) => updateQtForm('inputMode', event.target.value)} className={inputClass}>
              <option value="cells">маленькі клітинки</option>
              <option value="ms">мілісекунди</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">QT</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={qtForm.qt}
              onChange={(event) => updateQtForm('qt', event.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">{qtForm.inputMode === 'cells' ? 'маленьких клітинок' : 'мс'}</span>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">RR</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={qtForm.rr}
              onChange={(event) => updateQtForm('rr', event.target.value)}
              className={inputClass}
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">{qtForm.inputMode === 'cells' ? 'маленьких клітинок' : 'мс'}</span>
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Стать</span>
            <select value={qtForm.sex} onChange={(event) => updateQtForm('sex', event.target.value)} className={inputClass}>
              <option value="male">чоловік</option>
              <option value="female">жінка</option>
            </select>
          </label>
          <div className="rounded-md border border-blue-100 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Результат</p>
            {qtMetrics ? (
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
                QT {qtMetrics.qt} мс, RR {Math.round(qtMetrics.rr * 1000)} мс, QTcF {qtMetrics.qtcFridericia} мс
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Введіть QT і RR.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h4 className="text-sm font-bold text-blue-900">Структурований висновок</h4>
        <textarea value={conclusion} readOnly rows={4} className={`${textareaClass} mt-3 bg-white`} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Коли діяти негайно</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li>STEMI або нова значуща елевація ST у відповідному клінічному контексті.</li>
            <li>Ширококомплексна тахікардія з нестабільністю.</li>
            <li>Виражена брадикардія, AV-блокада високого ступеня або синкопе.</li>
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Наступний крок</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Порівняти з попередніми ЕКГ, співставити з симптомами, гемодинамікою, тропонінами,
            електролітами та клінічним контекстом.
          </p>
        </div>
      </div>

      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
