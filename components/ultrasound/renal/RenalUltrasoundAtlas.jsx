'use client';

const atlasItems = [
  {
    title: 'Нормальна нирка',
    image: '/images/renal-atlas/normal-kidney.jpg',
    alt: 'Поздовжній ультразвуковий зріз нормальної лівої нирки',
    findings: 'Поздовжній зріз із диференціацією паренхіми та ехогенного ниркового синуса.',
    caution: 'Оцінюйте нирку щонайменше у двох площинах; окремий кадр не підтверджує відсутність патології.',
    source: 'https://commons.wikimedia.org/wiki/File:Kidney_ultrasound_110315132820_1329070.jpg',
    author: 'Nevit Dilmen',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    title: 'Гідронефроз',
    image: '/images/renal-atlas/hydronephrosis.jpg',
    alt: 'Ультразвукове зображення помірного гідронефрозу правої нирки',
    findings: 'Анехогенне розширення ниркової миски та кількох чашечок.',
    caution: 'Розширення ЧМС не визначає причину обструкції; враховуйте наповнення міхура, клініку та динаміку.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasound_of_right_kidney_moderate_hydronephrosis.jpg',
    author: 'Cerevisae',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'Конкремент нирки',
    image: '/images/renal-atlas/renal-stone.jpg',
    alt: 'Ультразвукове зображення конкременту нирки із задньою акустичною тінню',
    findings: 'Гіперехогенний фокус у центральній частині нирки формує задню акустичну тінь.',
    caution: 'Описуйте локалізацію, максимальний розмір, акустичну тінь і супутнє розширення ЧМС.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasonography_of_centrally-located_stone_with_posterior_shadowing.jpg',
    author: 'Kristoffer Lindskov Hansen, Michael Bachmann Nielsen, Caroline Ewertsen',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    title: 'Проста кіста',
    image: '/images/renal-atlas/simple-cyst.jpg',
    alt: 'Ультразвукове зображення простої кісти нирки',
    findings: 'Анехогенне утворення з тонкою гладкою стінкою та заднім акустичним посиленням.',
    caution: 'Якщо є перегородки, кальцифікати, солідний компонент або кровотік, знахідку не слід називати простою кістою.',
    source: 'https://commons.wikimedia.org/wiki/File:Renal_cyst_ultrasound.jpg',
    author: 'Ptrump16',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'Складне кістозне утворення',
    image: '/images/renal-atlas/complex-cyst.jpg',
    alt: 'Складні кісти нижнього полюса правої нирки з перегородками та внутрішнім вмістом',
    findings: 'У кістозних утвореннях видно перегородки та внутрішній ехогенний вміст.',
    caution: 'УЗД-опис має перелічувати морфологічні ознаки; категорію Bosniak визначають за відповідним контрастним дослідженням, а не за цим кадром.',
    source: 'https://commons.wikimedia.org/wiki/File:Complex_cysts_at_the_lower_pole_of_right_kidney_showing_septations_and_sediment_within.jpg',
    author: 'Cerevisae',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'Солідне утворення',
    image: '/images/renal-atlas/solid-mass.jpg',
    alt: 'Ультразвукове зображення кортикального солідного утворення нирки',
    findings: 'Кортикальне солідне утворення відмежовується від навколишньої паренхіми та виміряне на зображенні.',
    caution: 'За самим сірошкальним зображенням не встановлюйте гістологічний діагноз; подальша тактика залежить від повної характеристики й клінічного контексту.',
    source: 'https://commons.wikimedia.org/wiki/File:Cortical_solid_mass_of_renal_cell_carcinoma.jpg',
    author: 'Kristoffer Lindskov Hansen, Michael Bachmann Nielsen, Caroline Ewertsen',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    title: 'Паренхіматозні зміни',
    image: '/images/renal-atlas/parenchymal-disease.jpg',
    alt: 'Ультразвукове зображення нирки з підвищеною ехогенністю паренхіми',
    findings: 'Підвищена ехогенність кіркового шару та менш виразна корково-мозкова диференціація.',
    caution: 'Ехогенність оцінюють у порівнянні з сусідніми органами та разом із розмірами й товщиною паренхіми; УЗД не визначає функцію нирок.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasound_of_left_kidney_renal_parenchymal_disease.jpg',
    author: 'Cerevisae',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    title: 'Сечовідний викид',
    image: '/images/renal-atlas/ureteric-jet.jpg',
    alt: 'Кольорове доплерівське зображення сечовідного викиду в сечовому міхурі',
    findings: 'Кольоровий сигнал демонструє надходження сечі із сечоводу до сечового міхура.',
    caution: 'Відсутність викиду під час короткого спостереження не доводить обструкцію; результат залежить від гідратації, наповнення міхура й тривалості оцінювання.',
    source: 'https://commons.wikimedia.org/wiki/File:Ultrasonography_of_left_hydroureter_with_ureteric_jet.jpg',
    author: 'Kristoffer Lindskov Hansen, Michael Bachmann Nielsen, Caroline Ewertsen',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
];

export default function RenalUltrasoundAtlas() {
  return (
    <details className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Навчальний УЗ-атлас</span>
          <span className="mt-1 block text-lg font-bold text-slate-950">Поширені знахідки при УЗД нирок</span>
          <span className="mt-1 block text-sm text-slate-500">8 реальних клінічних прикладів із джерелами та обмеженнями інтерпретації</span>
        </span>
        <span className="text-xl font-semibold text-teal-700 transition group-open:rotate-45">+</span>
      </summary>

      <div className="border-t border-slate-200 p-4 sm:p-5">
        <p className="max-w-4xl text-sm leading-relaxed text-slate-600">
          Зображення призначені для навчального зіставлення ознак і не замінюють повного дослідження в кількох площинах, клінічної оцінки та остаточного висновку лікаря УЗД.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {atlasItems.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <a href={item.image} target="_blank" rel="noreferrer" className="block bg-black">
                <img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-contain" />
              </a>
              <div className="p-4">
                <h4 className="font-bold text-slate-950">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700"><span className="font-semibold">Що видно:</span> {item.findings}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600"><span className="font-semibold">Важливо:</span> {item.caution}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Джерело: <a href={item.source} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">Wikimedia Commons, {item.author}</a> ·{' '}
                  <a href={item.licenseUrl} target="_blank" rel="noreferrer" className="underline">{item.license}</a> · зображення не змінено, зменшено лише роздільну здатність.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </details>
  );
}
