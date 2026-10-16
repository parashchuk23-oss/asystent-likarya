import SeoToolPage from '../../components/SeoToolPage';
import Gad7Questionnaire from '../../components/questionnaires/Gad7Questionnaire';

export const metadata = {
  title: 'Скринінг тривожності GAD-7 українською | Асистент лікаря',
  description:
    'GAD-7 українською для оцінки вираженості симптомів тривоги протягом останніх двох тижнів.',
  alternates: {
    canonical: 'https://www.asystentlikarya.com.ua/gad7',
  },
  openGraph: {
    title: 'Опитувальник GAD-7 українською',
    description: 'Скринінгова оцінка вираженості симптомів тривоги за останні два тижні.',
    url: 'https://www.asystentlikarya.com.ua/gad7',
    siteName: 'Асистент лікаря',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Опитувальник GAD-7 українською',
    description: 'Структурована скринінгова оцінка вираженості симптомів тривоги.',
  },
};

const faq = [
  {
    question: 'Що таке GAD-7?',
    answer:
      'GAD-7 — короткий опитувальник із семи пунктів для скринінгової оцінки симптомів тривоги та їх вираженості.',
  },
  {
    question: 'За який період оцінюються симптоми?',
    answer: 'Відповіді мають відображати стан людини протягом останніх двох тижнів.',
  },
  {
    question: 'Як формується результат?',
    answer:
      'Кожна відповідь оцінюється від 0 до 3 балів. Сума балів допомагає орієнтовно розподілити симптоми за ступенем вираженості.',
  },
  {
    question: 'Чи встановлює GAD-7 діагноз тривожного розладу?',
    answer:
      'Ні. Опитувальник є скринінговим інструментом, а діагноз потребує клінічної бесіди та оцінки інших можливих причин симптомів.',
  },
  {
    question: 'Коли потрібна додаткова оцінка?',
    answer:
      'Додаткова клінічна оцінка доцільна при стійких симптомах, помітному впливі на повсякденне функціонування або підвищеному результаті.',
  },
];

export default function Gad7Page() {
  return (
    <SeoToolPage
      title="Скринінг тривожності — GAD-7"
      description="Оцінка вираженості симптомів тривоги протягом останніх двох тижнів."
      path="/gad7"
      faq={faq}
      disclaimer="GAD-7 не встановлює діагноз і не замінює консультацію фахівця. Результат потрібно інтерпретувати разом із клінічними симптомами, анамнезом і впливом стану на повсякденне життя."
      relatedTools={[
        { href: '/phq9', label: 'Опитувальник PHQ-9' },
        { href: '/findrisk', label: 'Калькулятор FINDRISC' },
      ]}
    >
      <Gad7Questionnaire showIntro={false} />
    </SeoToolPage>
  );
}
