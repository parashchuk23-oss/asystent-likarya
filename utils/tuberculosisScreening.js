import { tuberculosisScreeningQuestions } from '../data/questionnaires/tuberculosisScreening';

export function evaluateTuberculosisScreening(answers) {
  const unansweredQuestions = tuberculosisScreeningQuestions.filter(
    (question) => answers[question.id] !== 'yes' && answers[question.id] !== 'no',
  );

  if (unansweredQuestions.length) {
    return {
      isComplete: false,
      isPositive: false,
      positiveAnswers: [],
      unansweredCount: unansweredQuestions.length,
    };
  }

  const positiveAnswers = tuberculosisScreeningQuestions.filter(
    (question) => answers[question.id] === 'yes',
  );

  return {
    isComplete: true,
    isPositive: positiveAnswers.length > 0,
    positiveAnswers,
    unansweredCount: 0,
  };
}

export function buildTuberculosisScreeningConclusion(result) {
  if (!result?.isComplete) return '';

  if (!result.isPositive) {
    return [
      'Проведено скринінгове анкетування щодо чинників ризику та симптомів, що можуть свідчити про туберкульоз. Усі відповіді — «Ні».',
      'За результатами скринінгової анкети не виявлено симптомів або чинників ризику, які за цією анкетою є підставою для подальшого обстеження на ТБ.',
    ].join(' ');
  }

  const positiveList = result.positiveAnswers
    .map((question) => `• ${question.positiveLabel};`)
    .join('\n')
    .replace(/;$/, '.');

  return [
    'Проведено скринінгове анкетування щодо чинників ризику та симптомів, що можуть свідчити про туберкульоз.',
    '',
    'Позитивні відповіді:',
    positiveList,
    '',
    'Результат скринінгу позитивний — особа потребує подальшого обстеження з метою виявлення ТБ.',
    '',
    'Рекомендовано: клінічна оцінка; рентгенографія органів грудної клітки; за можливості отримати мокротиння — збір зразка та молекулярно-генетичне дослідження Xpert MTB/RIF®(Ultra); запропонувати тестування на ВІЛ відповідно до чинного порядку та за інформованою згодою.',
  ].join('\n');
}
