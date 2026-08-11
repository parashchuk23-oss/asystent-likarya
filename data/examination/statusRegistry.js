export const implementedExaminationStatuses = [
  {
    id: 'general',
    title: 'Загальний соматичний статус',
    description: 'Загальний стан, шкіра, антропометрія, серцево-судинна і респіраторна системи, живіт.',
    defaultMode: 'expanded',
    modes: ['short', 'standard', 'expanded'],
  },
  {
    id: 'neurological',
    title: 'Неврологічний статус',
    description: 'Свідомість, орієнтація, мова, черепні нерви, сила, чутливість, координація.',
    defaultMode: 'expanded',
    modes: ['short', 'standard', 'expanded'],
  },
];

export const plannedExaminationStatuses = [
  {
    id: 'orthopedic',
    title: 'Ортопедичний статус',
    description: 'Буде додано окремим клінічним шаблоном.',
  },
  {
    id: 'pediatric-preventive',
    title: 'Профілактичний огляд дитини',
    description: 'Буде додано окремим клінічним шаблоном.',
  },
  {
    id: 'ent',
    title: 'ЛОР-статус',
    description: 'Буде додано окремим клінічним шаблоном.',
  },
  {
    id: 'dermatology',
    title: 'Дерматологічний статус',
    description: 'Буде додано окремим клінічним шаблоном.',
  },
  {
    id: 'endocrinology',
    title: 'Ендокринологічний статус',
    description: 'Буде додано окремим клінічним шаблоном.',
  },
];

export const examinationStatusMap = Object.fromEntries(
  implementedExaminationStatuses.map((status) => [status.id, status]),
);
