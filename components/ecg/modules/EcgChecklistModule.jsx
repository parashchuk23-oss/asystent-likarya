'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  buildQtMetricsInput,
  calculateQtMetrics,
  getQtClinicalNextSteps,
  getSmallCellDurationMs,
} from '../../../utils/ecg/qtCalculations';
import { inputClass, textareaClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

const rhythmOptions = [
  { value: 'sinus', label: 'синусовий' },
  { value: 'af', label: 'фібриляція передсердь' },
  { value: 'flutter', label: 'тріпотіння передсердь' },
  { value: 'atrial', label: 'передсердний' },
  { value: 'junctional', label: 'вузловий' },
  { value: 'ventricular', label: 'шлуночковий' },
  { value: 'paced', label: 'ритм ЕКС' },
  { value: 'other', label: 'інший / потребує уточнення' },
];

const regularityOptions = [
  { value: 'regular', label: 'регулярний' },
  { value: 'irregular', label: 'нерегулярний' },
];

const polarityOptions = [
  { value: 'positive', label: 'позитивний' },
  { value: 'negative', label: 'негативний' },
  { value: 'isoelectric', label: 'R=S / ізоелектричний' },
];

const pqClarificationOptions = {
  short: [
    { value: 'wpw', label: 'WPW' },
    { value: 'lowAtrial', label: 'нижньопередсердний ритм' },
    { value: 'junctional', label: 'AV-вузловий ритм' },
    { value: 'fastAvConduction', label: 'варіант швидкого AV-проведення' },
  ],
  long: [
    { value: 'avBlockI', label: 'AV-блокада I ступеня' },
    { value: 'mobitzI', label: 'AV-блокада II ступеня, Mobitz I' },
    { value: 'mobitzII', label: 'AV-блокада II ступеня, Mobitz II' },
    { value: 'twoToOne', label: 'AV-блокада 2:1' },
    { value: 'threeToOne', label: 'AV-блокада високого ступеня 3:1' },
    { value: 'fourToOne', label: 'AV-блокада високого ступеня 4:1' },
    { value: 'avBlockIII', label: 'AV-блокада III ступеня' },
    { value: 'other', label: 'інше / потребує уточнення' },
  ],
};

const pqClarificationDescriptions = {
  wpw: 'Короткий PQ у поєднанні з delta-хвилею та розширенням QRS може відповідати передчасному збудженню шлуночків. Оцінюйте форму початку QRS, ширину комплексу та клінічний контекст.',
  lowAtrial: 'Імпульс може виходити з нижніх відділів передсердь, тому шлях до AV-вузла коротший. Часто варто подивитися полярність P у II, III та aVF.',
  junctional: 'Імпульс формується в ділянці AV-вузла. P може бути відсутній, зливатися з QRS або розташовуватися після QRS; якщо P перед QRS, PQ часто короткий.',
  fastAvConduction: 'Короткий PQ без delta-хвилі та без розширення QRS може бути варіантом швидкого AV-проведення. Це краще трактувати обережно, не як самостійний діагноз.',
  avBlockI: 'PQ понад 200 мс, але кожен зубець P проводиться до QRS. Проведення сповільнене, випадіння комплексів немає; можливий вплив ваготонії або препаратів, що сповільнюють AV-провідність.',
  mobitzI: 'PQ поступово подовжується, після чого один QRS випадає. Часто це рівень AV-вузла; може бути при ваготонії, у спортсменів, під час сну або на фоні бета-блокаторів, верапамілу, дилтіазему чи дигоксину.',
  mobitzII: 'PQ залишається стабільним, але QRS раптово випадає. Частіше це порушення нижче AV-вузла, на рівні пучка Гіса або ніжок; клінічно важливіше через ризик прогресування.',
  twoToOne: 'Кожен другий зубець P не проводиться до шлуночків. Часто неможливо точно відрізнити Mobitz I від Mobitz II, бо немає послідовності PQ для оцінки динаміки.',
  threeToOne: 'До шлуночків проводиться кожен третій передсердний імпульс. Це AV-блокада високого ступеня; важливо оцінити ЧСС, симптоми, ширину QRS і клінічний контекст.',
  fourToOne: 'До шлуночків проводиться кожен четвертий передсердний імпульс. Це виражена AV-блокада високого ступеня; особливо важливі брадикардія, синкопе та ширина QRS.',
  avBlockIII: 'Передсердя і шлуночки працюють незалежно: P не має стабільного зв’язку з QRS. Це повна AV-блокада з AV-дисоціацією.',
  other: 'Використовуйте, якщо картина не вкладається в типові варіанти або потребує ручного уточнення у висновку.',
};

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
  rhythmType: 'sinus',
  rhythmRegularity: 'regular',
  rhythmText: '',
  rhythmTextEdited: false,
  axisI: 'positive',
  axisII: 'positive',
  axisAvf: 'positive',
  pqMs: '180',
  pqClarification: '',
  qrsMs: '90',
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
  return '';
}

function getPqStatus(pqMs) {
  const value = Number(formatNumber(pqMs));
  if (!value) return { type: '', label: 'введіть PQ для інтерпретації' };
  if (value < 120) return { type: 'short', label: 'Інтерпретація: вкорочений PQ' };
  if (value > 200) return { type: 'long', label: 'Інтерпретація: подовжений PQ' };
  return { type: 'normal', label: 'Інтерпретація: PQ у межах норми' };
}

function getPqClarificationLabel(type, value) {
  if (!type || !value) return '';
  return pqClarificationOptions[type]?.find((option) => option.value === value)?.label || '';
}

function getEffectiveRate(values, paperSpeed) {
  const manualRate = formatNumber(values.rate);
  const calculatedRate = calculateRateFromRrCells(values.rrCells, paperSpeed);
  return calculatedRate || Number(manualRate) || null;
}

function buildRhythmText(values, rate) {
  if (values.rhythmType === 'sinus') {
    if (rate && rate < 60) {
      return `Синусова брадикардія, ЧСС ${rate}/хв`;
    }
    if (rate && rate > 100) {
      return `Синусова тахікардія, ЧСС ${rate}/хв`;
    }

    const regularity = values.rhythmRegularity === 'irregular' ? 'нерегулярний' : 'регулярний';
    return `Синусовий ритм, ${regularity}, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'af') {
    return `Фібриляція передсердь, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'flutter') {
    return `Тріпотіння передсердь, ЧСС ${rate || '__'}/хв`;
  }

  if (values.rhythmType === 'paced') {
    return `Ритм електрокардіостимулятора, ЧСС ${rate || '__'}/хв`;
  }

  const rhythmLabel = rhythmOptions.find((option) => option.value === values.rhythmType)?.label || 'ритм потребує уточнення';
  if (values.rhythmType === 'other') {
    return `Ритм потребує уточнення, ЧСС ${rate || '__'}/хв`;
  }

  return `${rhythmLabel.charAt(0).toUpperCase()}${rhythmLabel.slice(1)} ритм, ЧСС ${rate || '__'}/хв`;
}

function buildAxisText(values) {
  const { axisI, axisII, axisAvf } = values;

  if (axisI === 'positive' && axisAvf === 'positive') {
    if (axisII === 'isoelectric') {
      return 'електрична вісь серця не відхилена; у II відведенні QRS ізоелектричний (R=S), оцінити разом з іншими відведеннями';
    }
    return 'електрична вісь серця не відхилена';
  }

  if (axisI === 'positive' && axisAvf === 'negative') {
    return axisII === 'positive'
      ? 'електрична вісь серця в межах норми або помірно відхилена вліво'
      : 'електрична вісь серця відхилена вліво';
  }

  if (axisI === 'negative' && axisAvf === 'positive') {
    return 'електрична вісь серця відхилена вправо';
  }

  if (axisI === 'negative' && axisAvf === 'negative') {
    return 'електрична вісь серця різко відхилена';
  }

  return 'електрична вісь серця потребує уточнення за відведеннями кінцівок';
}

function buildQtConclusionText(qtMetrics) {
  if (!qtMetrics) return '';
  return `QT ${qtMetrics.qt} мс, QTc Fridericia ${qtMetrics.qtcFridericia} мс`;
}

function buildConclusion(values, paperSpeed, qtMetrics) {
  const rate = getEffectiveRate(values, paperSpeed);
  const rhythm = values.rhythmText?.trim() || buildRhythmText(values, rate);
  const pqMs = formatNumber(values.pqMs);
  const pqStatus = getPqStatus(values.pqMs);
  const pqClarification = getPqClarificationLabel(pqStatus.type, values.pqClarification);
  const pqText = pqMs
    ? [`PQ ${pqMs} мс`, pqStatus.type === 'short' ? 'вкорочений' : '', pqStatus.type === 'long' ? 'подовжений' : '', pqClarification]
      .filter(Boolean)
      .join(', ')
    : '';
  const qrsMs = formatNumber(values.qrsMs);
  const qtText = buildQtConclusionText(qtMetrics);
  const lines = [
    rhythm,
    buildAxisText(values),
    pqText,
    qrsMs ? `QRS ${qrsMs} мс` : '',
    qtText,
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
    inputMode: 'ms',
    paperSpeed: '25',
    qt: '420',
    rr: '790',
    heartRate: '',
    sex: 'male',
  });
  const qtMetricsInput = useMemo(() => buildQtMetricsInput(qtForm), [qtForm]);
  const qtMetrics = useMemo(() => calculateQtMetrics(qtMetricsInput), [qtMetricsInput]);
  const conclusion = useMemo(() => buildConclusion(values, qtForm.paperSpeed, qtMetrics), [values, qtForm.paperSpeed, qtMetrics]);
  const qtNextSteps = useMemo(() => getQtClinicalNextSteps(qtMetrics), [qtMetrics]);
  const calculatedRate = useMemo(
    () => calculateRateFromRrCells(values.rrCells, qtForm.paperSpeed),
    [values.rrCells, qtForm.paperSpeed],
  );
  const effectiveRate = calculatedRate || Number(formatNumber(values.rate)) || null;
  const rhythmText = useMemo(() => buildRhythmText(values, effectiveRate), [values, effectiveRate]);
  const pqStatus = useMemo(() => getPqStatus(values.pqMs), [values.pqMs]);
  const visiblePqClarificationOptions = pqClarificationOptions[pqStatus.type] || [];
  const pqClarificationDescription = pqClarificationDescriptions[values.pqClarification] || '';

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  const updateRhythmOutput = (value) => {
    setValues((current) => ({ ...current, rhythmText: value, rhythmTextEdited: true }));
  };
  const resetToNormal = () => setValues(normalChecklistValues);
  const updateQtForm = (field, value) => setQtForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (values.rhythmTextEdited && values.rhythmText.trim()) return;
    setValues((current) => {
      const nextText = buildRhythmText(current, effectiveRate);
      if (current.rhythmText === nextText) return current;
      return { ...current, rhythmText: nextText };
    });
  }, [effectiveRate, values.rhythmText, values.rhythmTextEdited, values.rhythmType, values.rhythmRegularity]);

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

      <div className="space-y-3">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">1. Швидкість плівки та ЧСС</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Швидкість</span>
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
                className={inputClass}
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
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                якщо RR заповнено, ЧСС буде розрахована автоматично{calculatedRate ? `: ${calculatedRate}/хв` : ''}
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">2. Ритм</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Основний ритм</span>
              <select value={values.rhythmType} onChange={(event) => update('rhythmType', event.target.value)} className={inputClass}>
                {rhythmOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Регулярність</span>
              <select value={values.rhythmRegularity} onChange={(event) => update('rhythmRegularity', event.target.value)} className={inputClass}>
                {regularityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-slate-500">
            Для синусового ритму програма сама формує синусову брадикардію або тахікардію за ЧСС.
          </p>
          <label className="mt-3 block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Текст у висновку</span>
            <textarea
              value={values.rhythmText || rhythmText}
              onChange={(event) => updateRhythmOutput(event.target.value)}
              rows={2}
              className={`${textareaClass} bg-white`}
            />
          </label>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">3. Електрична вісь</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[
              ['axisI', 'I'],
              ['axisII', 'II'],
              ['axisAvf', 'aVF'],
            ].map(([id, label]) => (
              <label key={id} className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">QRS у {label}</span>
                <select value={values[id]} onChange={(event) => update(id, event.target.value)} className={inputClass}>
                  {polarityOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium leading-snug text-slate-500">
            Якщо R=S, оберіть “ізоелектричний”; програма сформує обережний висновок.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">4. Інтервал PQ</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">PQ, мс</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.pqMs}
                onChange={(event) => update('pqMs', event.target.value)}
                placeholder="180"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                {pqStatus.label}; приблизна норма: 120–200 мс
              </span>
            </label>
            {visiblePqClarificationOptions.length > 0 ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Уточнення PQ</span>
                <select
                  value={values.pqClarification}
                  onChange={(event) => update('pqClarification', event.target.value)}
                  className={inputClass}
                >
                  <option value="">оберіть, якщо потрібно</option>
                  {visiblePqClarificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            ) : null}
            {pqClarificationDescription ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-relaxed text-blue-900 lg:col-span-2">
                {pqClarificationDescription}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">5. Комплекс QRS</h4>
          <div className="mt-3 max-w-md">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">QRS, мс</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values.qrsMs}
                onChange={(event) => update('qrsMs', event.target.value)}
                placeholder="90"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">
                приблизна норма: 60–110 мс
              </span>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-950">6. QT / QTc</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              QTc Fridericia використовується як основний результат для висновку. Bazett, Framingham і Hodges показуються довідково.
            </p>
          </div>
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
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold leading-relaxed text-slate-900">
                  QTc Fridericia {qtMetrics.qtcFridericia} мс
                </p>
                <p className="text-xs leading-relaxed text-slate-500">
                  QT {qtMetrics.qt} мс, RR {Math.round(qtMetrics.rr * 1000)} мс
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Введіть QT і RR.</p>
            )}
          </div>
        </div>

        {qtMetrics ? (
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Інші формули</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Bazett {qtMetrics.qtcBazett} мс</p>
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Framingham {qtMetrics.qtcFramingham} мс</p>
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Hodges {qtMetrics.qtcHodges} мс</p>
              </div>
            </div>
            <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
              <p className="text-sm font-bold text-blue-950">{qtMetrics.interpretation.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-blue-900">{qtMetrics.interpretation.text}</p>
              <ul className="mt-2 space-y-1 text-sm text-blue-900">
                {qtNextSteps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-950">7. Морфологія, ST-T та патологічні Q</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {freeTextItems.map((item) => (
              <label key={item.id} className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">{item.label}</span>
                <input
                  value={values[item.id] || ''}
                  onChange={(event) => update(item.id, event.target.value)}
                  placeholder={item.placeholder}
                  className={inputClass}
                />
                <span className="mt-1 block text-xs font-medium leading-snug text-slate-500">{item.norm}</span>
              </label>
            ))}
          </div>
        </section>
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
