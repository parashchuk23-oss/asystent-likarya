'use client';

import { useMemo, useState } from 'react';

const benefitLabels = {
  free: 'безоплатно',
  discount50: '50% вартості',
};

const filterOptions = [
  { id: 'all', label: 'Усе' },
  { id: 'population', label: 'Групи населення' },
  { id: 'disease', label: 'Категорії захворювань' },
];

const normalize = (value) => value.toLowerCase().trim();

const copyToClipboard = async (text) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(text);
  return true;
};

function buildResultText(regulation, selectedItems) {
  if (!selectedItems.length) {
    return [
      `Перевірка за постановою КМУ №${regulation.number}`,
      '',
      'Підстава не обрана.',
    ].join('\n');
  }

  const selectedLines = selectedItems.map((item) => {
    const benefit = item.type === 'disease' ? 'безоплатно' : benefitLabels[item.benefitType];
    const source = item.type === 'disease' ? 'категорія захворювання' : 'група населення';
    const condition = item.note || item.condition;
    return `- ${item.title} (${source}; ${benefit}${condition ? `; ${condition}` : ''})`;
  });

  return [
    `Перевірка за постановою КМУ №${regulation.number}`,
    'Підстава: безоплатний або пільговий відпуск лікарських засобів за рецептом лікаря при амбулаторному лікуванні.',
    '',
    'Позначені підстави:',
    ...selectedLines,
    '',
    'Звірити з чинною редакцією постанови, документами пацієнта, основним захворюванням та переліком лікарських засобів, на які поширюється відповідна програма.',
  ].join('\n');
}

function MedicineBenefitItem({ item, isSelected, onToggle }) {
  const benefit = item.type === 'disease' ? 'безоплатно' : benefitLabels[item.benefitType];
  const typeLabel = item.type === 'disease' ? 'Категорія захворювання' : 'Група населення';

  return (
    <label className="flex gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0"
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-6 text-slate-900">{item.title}</span>
        <span className="mt-1 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-700 ring-1 ring-teal-100">{typeLabel}</span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">{benefit}</span>
        </span>
        {(item.condition || item.note) && (
          <span className="mt-2 block text-sm leading-6 text-slate-600">{item.note || item.condition}</span>
        )}
      </span>
    </label>
  );
}

export default function MedicineBenefitRegulationViewer({ regulation }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [copied, setCopied] = useState(false);

  const allItems = useMemo(
    () => [
      ...regulation.populationGroups.map((item) => ({ ...item, type: 'population' })),
      ...regulation.diseaseCategories.map((item) => ({ ...item, type: 'disease', benefitType: 'free' })),
    ],
    [regulation.diseaseCategories, regulation.populationGroups],
  );

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.includes(`${item.type}:${item.id}`)),
    [allItems, selectedIds],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalize(query);

    return allItems.filter((item) => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const haystack = normalize([item.title, item.condition, item.note, benefitLabels[item.benefitType]].filter(Boolean).join(' '));
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [allItems, filter, query]);

  const resultText = useMemo(() => buildResultText(regulation, selectedItems), [regulation, selectedItems]);

  const toggleItem = (item) => {
    const itemId = `${item.type}:${item.id}`;
    setSelectedIds((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]));
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setCopied(false);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(resultText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
      <aside className="xl:sticky xl:top-4 xl:self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Зміст</p>
          <nav className="mt-3 space-y-1">
            <a href="#kmu-1303-check" className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Перевірка підстав
            </a>
            <a href="#kmu-1303-result" className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Текст для копіювання
            </a>
            <a href="#kmu-1303-source" className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Джерело
            </a>
          </nav>
        </div>
      </aside>

      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
            {regulation.documentType} {regulation.authorityShort} №{regulation.number}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{regulation.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{regulation.status}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <p>
              <span className="font-bold text-slate-800">Перевірено:</span> {regulation.lastChecked}
            </p>
            <p>
              <span className="font-bold text-slate-800">Версія структури:</span> {regulation.dataStructureVersion}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            Це довідкова перевірка підстав. Остаточне рішення щодо пільги залежить від чинної редакції постанови,
            документів пацієнта, амбулаторного лікування, рецепта лікаря та правил відпуску конкретного препарату.
          </p>
        </section>

        <section id="kmu-1303-check" className="scroll-mt-24 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Пошук</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Наприклад: діабет, дитина, інвалідність, інфаркт"
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Що перевіряємо</span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {filterOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-3">
            {filteredItems.map((item) => {
              const itemId = `${item.type}:${item.id}`;
              return (
                <MedicineBenefitItem
                  key={itemId}
                  item={item}
                  isSelected={selectedIds.includes(itemId)}
                  onToggle={() => toggleItem(item)}
                />
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5 text-center text-sm font-semibold text-slate-500">
              За цим пошуком підстав не знайдено.
            </div>
          )}
        </section>

        <section id="kmu-1303-result" className="scroll-mt-24 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Текст для копіювання</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">Довідкова перевірка підстав</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Очистити
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {copied ? 'Скопійовано' : 'Копіювати'}
              </button>
            </div>
          </div>
          <textarea
            value={resultText}
            readOnly
            rows={selectedItems.length ? Math.min(14, selectedItems.length + 7) : 5}
            className="mt-3 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm leading-6 text-slate-800"
          />
        </section>

        <section id="kmu-1303-source" className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-bold text-slate-950">Джерело</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Дані структуровано з офіційної сторінки постанови Кабінету Міністрів України №{regulation.number} на
            zakon.rada.gov.ua. Текст у модулі скорочено для швидкої роботи лікаря; у сумнівних випадках потрібно
            звіряти формулювання з чинною редакцією документа.
          </p>
          <a
            href={regulation.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
          >
            Відкрити офіційне джерело
          </a>
        </section>
      </div>
    </div>
  );
}
