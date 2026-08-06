export const implementedExaminationStatuses = [
  {
    id: 'general',
    title: 'Загальний соматичний статус',
    description: 'Загальний стан, шкіра, антропометрія, живіт, сечовидільна система.',
    defaultMode: 'standard',
    modes: ['short', 'standard', 'expanded'],
  },
  {
    id: 'cardiovascular',
    title: 'Серцево-судинний статус',
    description: 'АТ, ЧСС, аускультація серця, набряки.',
    defaultMode: 'standard',
    modes: ['short', 'standard'],
  },
  {
    id: 'respiratory',
    title: 'Респіраторний статус',
    description: 'Аускультація легень та короткий опис дихання.',
    defaultMode: 'standard',
    modes: ['short', 'standard'],
  },
  {
    id: 'neurological',
    title: 'Неврологічний статус',
    description: 'Свідомість, орієнтація, мова, черепні нерви, сила, чутливість, координація.',
    defaultMode: 'standard',
    modes: ['short', 'standard', 'expanded'],
  },
  {
    id: 'custom',
    title: 'Інший / довільний статус',
    description: 'Вільний текст без автоматичної інтерпретації.',
    defaultMode: 'standard',
    modes: ['standard'],
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
