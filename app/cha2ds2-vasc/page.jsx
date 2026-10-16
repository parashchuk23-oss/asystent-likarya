import Cha2ds2VascCalculator from '../../components/calculators/Cha2ds2VascCalculator';
import SeoToolPage from '../../components/SeoToolPage';

export const metadata = {
  title: 'Калькулятор CHA₂DS₂-VASc при фібриляції передсердь | Асистент лікаря',
  description:
    'Розрахунок CHA₂DS₂-VASc для оцінки ризику інсульту й системної емболії у пацієнтів із фібриляцією передсердь.',
  alternates: {
    canonical: 'https://www.asystentlikarya.com.ua/cha2ds2-vasc',
  },
  openGraph: {
    title: 'Калькулятор CHA₂DS₂-VASc',
    description:
      'Оцінка ризику інсульту й системної емболії у пацієнтів із фібриляцією передсердь.',
    url: 'https://www.asystentlikarya.com.ua/cha2ds2-vasc',
    siteName: 'Асистент лікаря',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Калькулятор CHA₂DS₂-VASc',
    description: 'Оцінка тромбоемболічного ризику при фібриляції передсердь.',
  },
};

const faq = [
  {
    question: 'Що оцінює шкала CHA₂DS₂-VASc?',
    answer:
      'Шкала допомагає оцінити ризик інсульту та системної емболії у пацієнтів із фібриляцією передсердь за клінічними факторами ризику.',
  },
  {
    question: 'Які фактори входять до CHA₂DS₂-VASc?',
    answer:
      'Враховуються серцева недостатність, артеріальна гіпертензія, вік, цукровий діабет, перенесений інсульт, ТІА або системна емболія, судинне захворювання та жіноча стать.',
  },
  {
    question: 'Чи можна застосовувати шкалу без підтвердженої фібриляції передсердь?',
    answer:
      'Цей калькулятор призначений для оцінки тромбоемболічного ризику в клінічному контексті фібриляції передсердь, а не для скринінгу загального серцево-судинного ризику.',
  },
  {
    question: 'Чи означає високий бал автоматичне призначення антикоагулянта?',
    answer:
      'Ні. Бал є частиною клінічної оцінки. Рішення потребує перевірки показань і протипоказань, ризику кровотечі, супутніх станів та актуальних рекомендацій.',
  },
  {
    question: 'Чому сучасні рекомендації можуть згадувати CHA₂DS₂-VA?',
    answer:
      'У настанові ESC 2024 для рішення щодо пероральної антикоагуляції запропоновано CHA₂DS₂-VA без бала за стать. Тому результат CHA₂DS₂-VASc потрібно трактувати в межах тієї настанови, якою користується лікар.',
  },
];

export default function Cha2ds2VascPage() {
  return (
    <SeoToolPage
      title="Калькулятор CHA₂DS₂-VASc"
      description="Розрахуйте бал тромбоемболічного ризику в пацієнта з фібриляцією передсердь за віком, статтю та клінічними факторами."
      path="/cha2ds2-vasc"
      faq={faq}
      disclaimer="CHA₂DS₂-VASc є допоміжним інструментом для пацієнтів із фібриляцією передсердь. Результат не підтверджує діагноз, не враховує всі клінічні обставини й не означає автоматичного призначення або відмови від антикоагулянтної терапії."
      relatedTools={[
        { href: '/egfr', label: 'Калькулятор ШКФ' },
        { href: '/score2', label: 'Калькулятор SCORE2' },
        { href: '/calculators/venous-thromboembolism', label: 'Венозна тромбоемболія' },
      ]}
    >
      <div className="mx-auto max-w-4xl">
        <Cha2ds2VascCalculator />

        <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby="cha2ds2-sources">
          <h2 id="cha2ds2-sources" className="text-lg font-semibold text-slate-950">
            Методика та джерела
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Калькулятор підсумовує стандартні компоненти CHA₂DS₂-VASc. Орієнтовний бал
            слід поєднувати з клінічною оцінкою та чинною локальною настановою.
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            <li>
              <a
                href="https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Atrial-Fibrillation"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
              >
                ESC Clinical Practice Guidelines: Atrial Fibrillation
              </a>
            </li>
            <li>
              <a
                href="https://www.nice.org.uk/guidance/ng196"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
              >
                NICE NG196: Atrial fibrillation — diagnosis and management
              </a>
            </li>
            <li>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/21282258/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
              >
                Валідаційне дослідження CHA₂DS₂-VASc (BMJ, 2011)
              </a>
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">Клінічний перегляд: 16 жовтня 2026 року.</p>
        </section>
      </div>
    </SeoToolPage>
  );
}
