export const ecgModules = [
  {
    id: 'checklist',
    title: 'Чек-лист аналізу ЕКГ',
    description: 'Покроковий структурований аналіз і короткий висновок.',
    status: 'ready',
  },
  {
    id: 'qt',
    title: 'Інтервали: QT / QTc',
    description: 'QTc Bazett, Fridericia, Framingham і Hodges.',
    status: 'ready',
  },
  {
    id: 'axis',
    title: 'Електрична вісь',
    description: 'Орієнтовна оцінка осі за полярністю QRS.',
    status: 'ready',
  },
  {
    id: 'hypertrophy',
    title: 'Гіпертрофія',
    description: 'Sokolow-Lyon, Cornell, Cornell Product.',
    status: 'soon',
  },
  {
    id: 'conduction',
    title: 'Провідність',
    description: 'RBBB, LBBB, фасцикулярні блокади та AV-блокади.',
    status: 'soon',
  },
  {
    id: 'stemi',
    title: 'STEMI',
    description: 'Локалізація, ймовірна артерія, додаткові відведення.',
    status: 'soon',
  },
  {
    id: 'tachycardia',
    title: 'VT / SVT',
    description: 'Brugada, Vereckei та aVR алгоритми.',
    status: 'soon',
  },
  {
    id: 'syndromes',
    title: 'ЕКГ синдроми',
    description: 'WPW, Brugada, Wellens, de Winter та інші чек-листи.',
    status: 'soon',
  },
];
