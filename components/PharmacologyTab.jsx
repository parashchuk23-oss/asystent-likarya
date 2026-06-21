import { arbs } from '../data/drugs/arbs';
import { aceInhibitors } from '../data/drugs/aceInhibitors';
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

      <DrugClassSection
        classId="arb"
        eyebrow="БРА / сартани"
        title="Блокатори рецепторів ангіотензину II"
        description="Швидке порівняння представників класу для лікування дорослих. Дозування для окремих показань може відрізнятися від режиму при артеріальній гіпертензії."
        drugs={arbs}
      />

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

      <div className="mt-10 border-t border-slate-200 pt-4">
        <DrugClassSection
          classId="ace-inhibitor"
          eyebrow="ІАПФ"
          title="Інгібітори ангіотензинперетворювального ферменту"
          description="Практичне порівняння ІАПФ для лікування дорослих. Дози наведені для артеріальної гіпертензії; при серцевій недостатності, після інфаркту або при ХХН схеми титрації можуть відрізнятися."
          drugs={aceInhibitors}
        />
      </div>

      <section className="mt-8 border-t border-slate-200 pt-5">
        <h3 className="text-base font-semibold text-slate-950">ІАПФ при хронічній хворобі нирок</h3>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
          При ХХН з альбумінурією настанови рекомендують ІАПФ або БРА у найвищій переносимій
          схваленій дозі, але не визначають одну молекулу ІАПФ як найкращу. Раміприл, еналаприл,
          лізиноприл і периндоприл можуть застосовуватися за показаннями; вибір залежить від
          переносимості, кратності прийому, функції нирок, калію та можливості титрації.
        </p>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
          Каптоприл менш зручний для тривалої терапії через коротку дію. Після початку або зміни
          дози контролюють АТ, креатинін / eGFR і калій протягом 2–4 тижнів; зростання креатиніну
          більш ніж на 30% потребує клінічної оцінки причин і перегляду тактики.
        </p>
      </section>

      <section className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-base font-semibold text-slate-950">Спільне для класу ІАПФ</h3>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
          Враховують ризик кашлю, ангіоневротичного набряку, гіперкаліємії, симптомної гіпотензії
          та погіршення функції нирок. ІАПФ не застосовують під час вагітності, не комбінують
          рутинно з БРА або прямим інгібітором реніну та витримують 36-годинний інтервал із
          сакубітрилом/валсартаном.
        </p>
        <p className="mt-2 max-w-5xl text-xs leading-5 text-slate-500">
          Для ІАПФ не доведено клінічно значущої переваги окремої молекули за силою зниження АТ.
          Наведений числовий ефект є середнім плацебо-коригованим орієнтиром для класу, а не
          прогнозом для конкретного пацієнта.
        </p>
      </section>

      <aside className="mt-8 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
        {disclaimer}
      </aside>

      <section className="mt-6 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
        БРА / сартани та ІАПФ використовуються для лікування артеріальної гіпертензії, серцевої
        недостатності, хронічної хвороби нирок з альбумінурією та інших станів за показаннями.
        Вибір класу й конкретного препарату залежить від клінічної ситуації, переносимості,
        функції нирок, рівня калію та супутньої терапії.
      </section>
    </div>
  );
}
