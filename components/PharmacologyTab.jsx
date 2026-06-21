import { arbs } from '../data/drugs/arbs';
import DrugClassSection from './pharmacology/DrugClassSection';

const disclaimer =
  'Цей розділ є короткою практичною довідкою для лікаря і не замінює офіційну інструкцію до препарату, клінічні настанови або індивідуальне клінічне рішення. Перед призначенням враховуйте показання, протипоказання, ШКФ, калій, супутні захворювання, взаємодії та офіційну інструкцію конкретного препарату.';

export default function PharmacologyTab() {
  return (
    <div>
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Практичний довідник
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Препарати</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Практичний фармакологічний довідник для лікаря. Інформація подана у форматі швидкої
          клінічної шпаргалки, а не повної інструкції до препарату.
        </p>
      </header>

      <section className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Категорія</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-950">Антигіпертензивні препарати</h3>
      </section>

      <DrugClassSection drugs={arbs} />

      <section className="mt-8 border-t border-slate-200 pt-5">
        <h3 className="text-base font-semibold text-slate-950">Спільне для класу БРА</h3>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
          Перед початком і після зміни дози контролюють АТ, калій та креатинін / eGFR. БРА не
          застосовують під час вагітності; подвійна блокада РААС зазвичай не рекомендована, а
          при дефіциті об’єму, гіперкаліємії або реноваскулярній патології потрібна окрема оцінка.
        </p>
        <p className="mt-2 max-w-5xl text-xs leading-5 text-slate-500">
          Наведене зниження САТ — середній орієнтир із клінічних досліджень, а не прогноз для
          конкретного пацієнта. Результат залежить від вихідного АТ, дози, методу вимірювання,
          комбінацій, прихильності та споживання солі.
        </p>
      </section>

      <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        {disclaimer}
      </aside>

      <section className="mt-6 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
        БРА / сартани використовуються для лікування артеріальної гіпертензії, серцевої
        недостатності, хронічної хвороби нирок з альбумінурією та інших станів за показаннями.
        Вибір конкретного препарату залежить від клінічної ситуації, тривалості дії,
        переносимості, функції нирок і рівня калію.
      </section>
    </div>
  );
}
