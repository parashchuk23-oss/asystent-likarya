'use client';

import { useMemo, useState } from 'react';
import { arbs } from '../data/drugs/arbs';
import { aceInhibitors } from '../data/drugs/aceInhibitors';
import DrugClassSection from './pharmacology/DrugClassSection';

const disclaimer =
  'Цей розділ є короткою практичною довідкою для лікаря і не замінює офіційну інструкцію до препарату, клінічні настанови або індивідуальне клінічне рішення. Перед призначенням враховуйте показання, протипоказання, ШКФ, калій, супутні захворювання, взаємодії та офіційну інструкцію конкретного препарату.';

const drugClasses = [
  {
    id: 'arb',
    eyebrow: 'БРА / сартани',
    title: 'Блокатори рецепторів ангіотензину II',
    description:
      'Швидке порівняння представників класу для лікування дорослих. Дозування для окремих показань може відрізнятися від режиму при артеріальній гіпертензії.',
    drugs: arbs,
  },
  {
    id: 'ace-inhibitor',
    eyebrow: 'ІАПФ',
    title: 'Інгібітори ангіотензинперетворювального ферменту',
    description:
      'Практичне порівняння ІАПФ для лікування дорослих. Дози наведені для артеріальної гіпертензії; при серцевій недостатності, після інфаркту або при ХХН схеми титрації можуть відрізнятися.',
    drugs: aceInhibitors,
  },
];

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase('uk-UA');
}

function drugMatchesQuery(drug, query) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;

  return [drug.internationalName, drug.ukrainianName, ...drug.tradeNames].some((name) =>
    normalizeSearchValue(name).includes(normalizedQuery),
  );
}

export default function PharmacologyTab() {
  const [query, setQuery] = useState('');
  const [openClass, setOpenClass] = useState('arb');

  const resultCount = useMemo(
    () =>
      drugClasses.reduce(
        (total, drugClass) =>
          total + drugClass.drugs.filter((drug) => drugMatchesQuery(drug, query)).length,
        0,
      ),
    [query],
  );

  function handleQueryChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (!nextQuery.trim()) return;

    const firstMatchingClass = drugClasses.find((drugClass) =>
      drugClass.drugs.some((drug) => drugMatchesQuery(drug, nextQuery)),
    );
    setOpenClass(firstMatchingClass?.id ?? null);
  }

  return (
    <div>
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Практичний довідник
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Препарати</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Швидке порівняння клінічно важливих відмінностей препаратів без дублювання повної
          інструкції.
        </p>
      </header>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Категорія</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950">Антигіпертензивні препарати</h3>

        <label className="mt-5 block max-w-2xl">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            Пошук серед усіх препаратів
          </span>
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="МНН, українська або торгова назва"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        {query.trim() ? (
          <p className="mt-3 text-sm text-slate-500">
            {resultCount
              ? `Знайдено препаратів: ${resultCount}`
              : 'За цим запитом препаратів не знайдено.'}
          </p>
        ) : null}
      </section>

      <div className="mt-6 space-y-3">
        {drugClasses.map((drugClass) => (
          <DrugClassSection
            key={drugClass.id}
            classId={drugClass.id}
            eyebrow={drugClass.eyebrow}
            title={drugClass.title}
            description={drugClass.description}
            drugs={drugClass.drugs}
            query={query}
            isOpen={openClass === drugClass.id}
            onToggle={() =>
              setOpenClass((current) => (current === drugClass.id ? null : drugClass.id))
            }
          >
            {drugClass.id === 'arb' ? (
              <>
                <p>
                  Перед початком і після зміни дози контролюють АТ, калій та креатинін / eGFR.
                  БРА не застосовують під час вагітності; подвійна блокада РААС зазвичай не
                  рекомендована, а при дефіциті об’єму, гіперкаліємії або реноваскулярній
                  патології потрібна окрема оцінка.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Наведене зниження САТ — середній орієнтир із клінічних досліджень, а не прогноз
                  для конкретного пацієнта. Результат залежить від вихідного АТ, дози, методу
                  вимірювання, комбінацій, прихильності та споживання солі.
                </p>
              </>
            ) : (
              <>
                <p>
                  При ХХН з альбумінурією настанови рекомендують ІАПФ або БРА у найвищій
                  переносимій схваленій дозі, але не визначають одну молекулу ІАПФ як найкращу.
                  Вибір залежить від переносимості, кратності прийому, функції нирок, калію та
                  можливості титрації. Каптоприл менш зручний для тривалої терапії через коротку
                  дію.
                </p>
                <p className="mt-2">
                  Після початку або зміни дози контролюють АТ, креатинін / eGFR і калій протягом
                  2–4 тижнів. Враховують ризик кашлю, ангіоневротичного набряку, гіперкаліємії,
                  симптомної гіпотензії та погіршення функції нирок. ІАПФ не застосовують під час
                  вагітності, не комбінують рутинно з БРА або прямим інгібітором реніну та
                  витримують 36-годинний інтервал із сакубітрилом/валсартаном.
                </p>
                <p className="mt-3 border-l-4 border-sky-400 bg-sky-50 px-4 py-3 text-sm text-slate-700">
                  У середньому ІАПФ у дозах, що забезпечують майже максимальний ефект, знижують
                  АТ наприкінці інтервалу дозування приблизно на 7,7/4,6 мм рт. ст. порівняно з
                  плацебо. Для окремих представників класу ефект був приблизно однаковим;
                  клінічно значущої переваги певної молекули за силою зниження АТ не доведено.
                  Індивідуальний результат залежить від вихідного АТ, дози, кратності прийому,
                  прихильності та інших клінічних факторів.{' '}
                  <a
                    href="https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003823.pub2/full"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
                  >
                    Cochrane: огляд ефективності ІАПФ при первинній гіпертензії
                  </a>
                  .
                </p>
              </>
            )}
          </DrugClassSection>
        ))}
      </div>

      <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        {disclaimer}
      </aside>

      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        БРА / сартани та ІАПФ застосовуються за відповідними показаннями. Вибір класу й препарату
        залежить від клінічної ситуації, переносимості, функції нирок, калію та супутньої терапії.
      </p>
    </div>
  );
}
