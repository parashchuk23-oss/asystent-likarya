export const examinationPresets = [
  {
    id: 'general-visit',
    title: 'Загальний прийом',
    description: 'Загальний соматичний і респіраторний статус.',
    statusIds: ['general', 'respiratory'],
  },
  {
    id: 'neurological-complaint',
    title: 'Неврологічна скарга',
    description: 'Загальний і неврологічний статус.',
    statusIds: ['general', 'neurological'],
  },
  {
    id: 'joint-or-back-pain',
    title: 'Біль у суглобі або спині',
    description: 'Поки додає загальний статус; ортопедичний шаблон буде окремим етапом.',
    statusIds: ['general'],
  },
  {
    id: 'child-preventive',
    title: 'Профілактичний огляд дитини',
    description: 'Поки додає загальний статус; дитячий шаблон буде окремим етапом.',
    statusIds: ['general', 'respiratory', 'neurological'],
  },
];
