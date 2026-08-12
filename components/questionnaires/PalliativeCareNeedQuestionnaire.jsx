'use client';

import { useMemo, useState } from 'react';
import { palliativeCareAdultCriteria, palliativeCareSource } from '../../data/palliativeCareCriteria';
import { evaluatePalliativeCareNeed } from '../../utils/calculations';
import { PrintQuestionnaireButton } from './PrintableQuestionnaire';

const ecogOptions = [
  { value: '', label: 'не обрано' },
  { value: '0', label: '0 — повністю активний' },
  { value: '1', label: '1 — обмежене лише значне фізичне навантаження' },
  { value: '2', label: '2 — самостійний, активний більше 50% дня' },
  { value: '3', label: '3 — у ліжку або кріслі більше 50% дня' },
  { value: '4', label: '4 — повністю прикутий до ліжка або крісла' },
];

const karnofskyOptions = [
  { value: '', label: 'не обрано' },
  { value: '100', label: '100 — нормальна активність, скарг немає' },
  { value: '90', label: '90 — звичайна активність, мінімальні симптоми' },
  { value: '80', label: '80 — звичайна активність із зусиллям' },
  { value: '70', label: '70 — самообслуговування збережене, працювати не може' },
  { value: '60', label: '60 — потребує періодичної допомоги' },
  { value: '50', label: '50 — потребує значної допомоги та частого догляду' },
  { value: '40', label: '40 — інвалідизований, потребує спеціального догляду' },
  { value: '30', label: '30 — тяжкий стан, потрібен активний догляд' },
  { value: '20', label: '20 — дуже тяжкий стан, підтримувальний догляд' },
  { value: '10', label: '10 — агональний стан' },
  { value: '0', label: '0 — смерть' },
];

const ppsOptions = [
  { value: '', label: 'не обрано' },
  { value: '100', label: '100% — повністю активний' },
  { value: '90', label: '90% — майже повна активність' },
  { value: '80', label: '80% — активність із зусиллям' },
  { value: '70', label: '70% — знижена активність, самообслуговування збережене' },
  { value: '60', label: '60% — часткова допомога' },
  { value: '50', label: '50% — значна допомога' },
  { value: '40', label: '40% — переважно в ліжку' },
  { value: '30', label: '30% — майже повністю в ліжку, значний догляд' },
  { value: '20', label: '20% — повністю в ліжку, мінімальне споживання' },
  { value: '10', label: '10% — повністю в ліжку, сонливість або кома' },
  { value: '0', label: '0% — смерть' },
];

const barthelItems = [
  {
    key: 'feeding',
    label: 'Їжа',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — повністю залежний' },
      { value: '5', label: '5 — потребує допомоги' },
      { value: '10', label: '10 — самостійно' },
    ],
  },
  {
    key: 'transfer',
    label: 'Пересаджування ліжко / крісло',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — неможливо' },
      { value: '5', label: '5 — значна допомога' },
      { value: '10', label: '10 — мінімальна допомога' },
      { value: '15', label: '15 — самостійно' },
    ],
  },
  {
    key: 'grooming',
    label: 'Особиста гігієна',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — потребує допомоги' },
      { value: '5', label: '5 — самостійно' },
    ],
  },
  {
    key: 'toilet',
    label: 'Користування туалетом',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — залежний' },
      { value: '5', label: '5 — потребує допомоги' },
      { value: '10', label: '10 — самостійно' },
    ],
  },
  {
    key: 'bathing',
    label: 'Купання',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — потребує допомоги' },
      { value: '5', label: '5 — самостійно' },
    ],
  },
  {
    key: 'mobility',
    label: 'Пересування',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — не пересувається' },
      { value: '5', label: '5 — візок, самостійно' },
      { value: '10', label: '10 — ходить з допомогою' },
      { value: '15', label: '15 — ходить самостійно' },
    ],
  },
  {
    key: 'stairs',
    label: 'Сходи',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — не може' },
      { value: '5', label: '5 — потребує допомоги' },
      { value: '10', label: '10 — самостійно' },
    ],
  },
  {
    key: 'dressing',
    label: 'Одягання',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — залежний' },
      { value: '5', label: '5 — потребує допомоги' },
      { value: '10', label: '10 — самостійно' },
    ],
  },
  {
    key: 'bowels',
    label: 'Контроль калу',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — нетримання' },
      { value: '5', label: '5 — епізодичні порушення' },
      { value: '10', label: '10 — контроль збережений' },
    ],
  },
  {
    key: 'bladder',
    label: 'Контроль сечі',
    options: [
      { value: '', label: 'не обрано' },
      { value: '0', label: '0 — нетримання або катетер' },
      { value: '5', label: '5 — епізодичні порушення' },
      { value: '10', label: '10 — контроль збережений' },
    ],
  },
];

const initialFunctionalScales = {
  ecog: '',
  karnofsky: '',
  pps: '',
  barthel: barthelItems.reduce((items, item) => ({ ...items, [item.key]: '' }), {}),
};

function toggleItem(items, item) {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

function mergeCriteria(manualCriteria, automaticCriteria) {
  return Array.from(new Set([...automaticCriteria, ...manualCriteria]));
}

function findCriterion(group, pattern) {
  return group?.scaleCriteria.find((criterion) => pattern.test(criterion)) || null;
}

function calculateBarthelScore(barthelAnswers) {
  const values = Object.values(barthelAnswers);
  const isComplete = values.every((value) => value !== '');

  if (!isComplete) return null;

  return values.reduce((total, value) => total + Number(value), 0);
}

function getAutomaticScaleCriteria(group, functionalScales) {
  const automaticCriteria = [];

  const ecogCriterion = findCriterion(group, /ECOG/i);
  if (ecogCriterion && functionalScales.ecog !== '' && Number(functionalScales.ecog) > 2) {
    automaticCriteria.push(ecogCriterion);
  }

  const karnofskyCriterion = findCriterion(group, /Карновського/i);
  if (karnofskyCriterion && functionalScales.karnofsky !== '' && Number(functionalScales.karnofsky) <= 50) {
    automaticCriteria.push(karnofskyCriterion);
  }

  const ppsCriterion = findCriterion(group, /PPS/i);
  if (ppsCriterion && functionalScales.pps !== '' && Number(functionalScales.pps) <= 30) {
    automaticCriteria.push(ppsCriterion);
  }

  const barthelCriterion = findCriterion(group, /Бартел/i);
  const barthelScore = calculateBarthelScore(functionalScales.barthel);
  if (barthelCriterion && barthelScore !== null && barthelScore < 25) {
    automaticCriteria.push(barthelCriterion);
  }

  return Array.from(new Set(automaticCriteria));
}

function buildConclusionText(group, selectedScaleCriteria, selectedClinicalCriteria, result) {
  const scaleText = selectedScaleCriteria.map((item) => `- ${item}`).join('\n');
  const clinicalText = selectedClinicalCriteria.map((item) => `- ${item}`).join('\n');

  if (!group) {
    return 'Оберіть основне захворювання або стан пацієнта для формування висновку.';
  }

  const resultText = result?.isConfirmed
    ? 'За результатами оцінки пацієнт відповідає критеріям визначення пацієнта, який потребує паліативної допомоги.'
    : 'За зазначеними даними критерії визначення пацієнта, який потребує паліативної допомоги, не підтверджені.';

  return [
    `Проведено оцінку потреби в паліативній допомозі відповідно до критеріїв наказу МОЗ України №1308 від 04.06.2020.`,
    '',
    `Основне захворювання/стан: ${group.title}.`,
    `Нормативна умова групи: ${group.condition}`,
    '',
    'Встановлені критерії захворювання / функціональної оцінки:',
    scaleText || '- не зазначено',
    '',
    'Виявлені клінічні ознаки / показники:',
    clinicalText || '- не зазначено',
    '',
    resultText,
  ].join('\n');
}

function CheckItem({ checked, label, onChange }) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm leading-5 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={`${id}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PalliativeCareNeedQuestionnaire() {
  const [groupId, setGroupId] = useState('');
  const [selectedScaleCriteria, setSelectedScaleCriteria] = useState([]);
  const [selectedClinicalCriteria, setSelectedClinicalCriteria] = useState([]);
  const [functionalScales, setFunctionalScales] = useState(initialFunctionalScales);
  const [isBarthelOpen, setIsBarthelOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [copyText, setCopyText] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const selectedGroup = useMemo(
    () => palliativeCareAdultCriteria.find((group) => group.id === groupId) || null,
    [groupId]
  );

  const automaticScaleCriteria = useMemo(
    () => getAutomaticScaleCriteria(selectedGroup, functionalScales),
    [selectedGroup, functionalScales]
  );
  const effectiveScaleCriteria = useMemo(
    () => mergeCriteria(selectedScaleCriteria, automaticScaleCriteria),
    [selectedScaleCriteria, automaticScaleCriteria]
  );
  const barthelScore = useMemo(() => calculateBarthelScore(functionalScales.barthel), [functionalScales.barthel]);

  function resetResult() {
    setResult(null);
    setCopyText('');
    setCopyStatus('');
  }

  function handleGroupChange(event) {
    setGroupId(event.target.value);
    setSelectedScaleCriteria([]);
    setSelectedClinicalCriteria([]);
    setFunctionalScales(initialFunctionalScales);
    setIsBarthelOpen(false);
    resetResult();
  }

  function handleScaleToggle(item) {
    setSelectedScaleCriteria((current) => toggleItem(current, item));
    resetResult();
  }

  function handleClinicalToggle(item) {
    setSelectedClinicalCriteria((current) => toggleItem(current, item));
    resetResult();
  }

  function handleFunctionalScaleChange(key, value) {
    setFunctionalScales((current) => ({
      ...current,
      [key]: value,
    }));
    resetResult();
  }

  function handleBarthelChange(key, value) {
    setFunctionalScales((current) => ({
      ...current,
      barthel: {
        ...current.barthel,
        [key]: value,
      },
    }));
    resetResult();
  }

  function handleCalculate() {
    const evaluation = evaluatePalliativeCareNeed({
      selectedGroup,
      selectedScaleCriteria: effectiveScaleCriteria,
      selectedClinicalCriteria,
    });

    setResult(evaluation);
    setCopyText(buildConclusionText(selectedGroup, effectiveScaleCriteria, selectedClinicalCriteria, evaluation));
    setCopyStatus('');
  }

  function handleClear() {
    setGroupId('');
    setSelectedScaleCriteria([]);
    setSelectedClinicalCriteria([]);
    setFunctionalScales(initialFunctionalScales);
    setIsBarthelOpen(false);
    setResult(null);
    setCopyText('');
    setCopyStatus('');
  }

  async function handleCopy() {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus('Висновок скопійовано.');
    } catch {
      setCopyStatus('Не вдалося скопіювати автоматично. Виділіть текст вручну.');
    }
  }

  const resultClassName =
    result?.status === 'confirmed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : result?.status === 'not-confirmed'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-blue-100 bg-blue-50 text-blue-900';

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-950">Оцінка потреби в паліативній допомозі</p>
        <p className="mt-2">
          Оберіть основне захворювання або стан пацієнта. Програма покаже відповідні
          критерії наказу МОЗ №1308 і перевірить нормативну умову для дорослого пацієнта.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
        <label className="block text-sm font-semibold text-slate-800" htmlFor="palliative-care-group">
          Основне захворювання / група станів
        </label>
        <select
          id="palliative-care-group"
          value={groupId}
          onChange={handleGroupChange}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Оберіть групу</option>
          {palliativeCareAdultCriteria.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>

        {selectedGroup ? (
          <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            {selectedGroup.condition}
          </p>
        ) : null}
      </section>

      {selectedGroup ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  Захворювання / оцінка за шкалою
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                Обрано: {effectiveScaleCriteria.length}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Тут потрібно відмітити хоча б один пункт, який підтверджує важкість
              стану або значне функціональне обмеження пацієнта, наприклад: ECOG &gt; 2,
              індекс Карновського ≤ 50, PPS ≤ 30% або шкала Бартел &lt; 25.
            </p>

            <div className="mt-4 rounded-md border border-blue-100 bg-blue-50/40 p-4">
              <p className="text-sm font-semibold text-slate-950">Швидка функціональна оцінка</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Якщо значення шкали досягає порогу наказу, відповідний критерій нижче
                підтвердиться автоматично. Ручний вибір також залишається доступним.
              </p>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <SelectField
                  id="palliative-ecog"
                  label="ECOG"
                  value={functionalScales.ecog}
                  onChange={(value) => handleFunctionalScaleChange('ecog', value)}
                  options={ecogOptions}
                />
                <SelectField
                  id="palliative-karnofsky"
                  label="Індекс Карновського"
                  value={functionalScales.karnofsky}
                  onChange={(value) => handleFunctionalScaleChange('karnofsky', value)}
                  options={karnofskyOptions}
                />
                <SelectField
                  id="palliative-pps"
                  label="PPS"
                  value={functionalScales.pps}
                  onChange={(value) => handleFunctionalScaleChange('pps', value)}
                  options={ppsOptions}
                />
              </div>

              <div className="mt-4 rounded-md border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setIsBarthelOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">
                      Шкала Бартел
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {barthelScore === null ? 'Заповніть 10 пунктів для автоматичного підрахунку.' : `Сума: ${barthelScore} балів`}
                    </span>
                  </span>
                  <span className="text-xl font-semibold text-blue-700">{isBarthelOpen ? '−' : '+'}</span>
                </button>

                {isBarthelOpen ? (
                  <div className="border-t border-slate-100 p-4">
                    <div className="grid gap-3 lg:grid-cols-2">
                      {barthelItems.map((item) => (
                        <SelectField
                          key={item.key}
                          id={`barthel-${item.key}`}
                          label={item.label}
                          value={functionalScales.barthel[item.key]}
                          onChange={(value) => handleBarthelChange(item.key, value)}
                          options={item.options}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {automaticScaleCriteria.length > 0 ? (
                <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                  <p className="font-semibold">Автоматично підтверджені критерії:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {automaticScaleCriteria.map((criterion) => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {selectedGroup.scaleCriteria.map((criterion) => (
                <CheckItem
                  key={criterion}
                  label={criterion}
                  checked={effectiveScaleCriteria.includes(criterion)}
                  onChange={() => handleScaleToggle(criterion)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="mt-1 text-lg font-semibold text-slate-950">
                  Клінічні ознаки / показники
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  selectedClinicalCriteria.length >= 5
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {selectedClinicalCriteria.length}/5
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              За додатком 2 потрібно обрати не менше 5 клінічних ознак / показників.
            </p>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {selectedGroup.clinicalCriteria.map((criterion) => (
                <CheckItem
                  key={criterion}
                  label={criterion}
                  checked={selectedClinicalCriteria.includes(criterion)}
                  onChange={() => handleClinicalToggle(criterion)}
                />
              ))}
            </div>
          </section>
        </>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
        >
          Оцінити
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto"
        >
          Очистити
        </button>
        <PrintQuestionnaireButton label="Роздрукувати" />
      </div>

      {result ? (
        <section className={`rounded-lg border p-4 ${resultClassName}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] opacity-80">Результат</p>
          <h3 className="mt-1 text-xl font-semibold">{result.title}</h3>
          <p className="mt-2 text-sm leading-6">{result.message}</p>

          {result.missingItems.length > 0 ? (
            <div className="mt-3 rounded-md border border-white/70 bg-white/60 p-3 text-sm leading-6">
              <p className="font-semibold">Що ще потрібно для підтвердження:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {copyText ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
          <p className="font-semibold text-slate-950">Текст для копіювання</p>
          <textarea
            value={copyText}
            onChange={(event) => setCopyText(event.target.value)}
            className="mt-3 min-h-72 w-full rounded-md border border-slate-300 p-4 text-sm leading-6 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 sm:w-auto"
            >
              Скопіювати висновок
            </button>
            {copyStatus ? <span className="text-sm text-slate-600">{copyStatus}</span> : null}
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Нормативна база</p>
        <p className="mt-2">
          {palliativeCareSource.order} “{palliativeCareSource.title}”. Чинна редакція:{' '}
          {palliativeCareSource.revisionDate}. Актуальність перевірено:{' '}
          {palliativeCareSource.checkedAt}.
        </p>
        <a
          href={palliativeCareSource.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          Відкрити офіційний документ
        </a>
      </section>

      <p className="rounded-md border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">
        Модуль є допоміжним інструментом для лікаря. Він не встановлює діагноз і не
        замінює клінічне рішення, оцінку стану пацієнта та чинні нормативні вимоги.
      </p>
    </div>
  );
}
