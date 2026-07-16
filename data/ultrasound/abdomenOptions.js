export const abdomenOptions = {
  organMode: [
    { value: 'normal', label: 'Без особливостей' },
    { value: 'changed', label: 'Зміни' },
  ],
  contours: [
    { value: 'smooth', label: 'рівні' },
    { value: 'uneven', label: 'нерівні' },
  ],
  echogenicity: [
    { value: 'medium', label: 'середня' },
    { value: 'increased', label: 'підвищена' },
    { value: 'decreased', label: 'знижена' },
  ],
  structure: [
    { value: 'homogeneous', label: 'однорідна' },
    { value: 'heterogeneous', label: 'неоднорідна' },
  ],
  liverChanges: [
    { value: 'fattyInfiltration', label: 'жирова інфільтрація' },
    { value: 'fibrosis', label: 'фіброз' },
    { value: 'cirrhoticRemodeling', label: 'циротична перебудова' },
    { value: 'heterogeneity', label: 'неоднорідність' },
    { value: 'other', label: 'інше' },
  ],
  gallbladderShape: [
    { value: 'ovoid', label: 'овоїдна' },
    { value: 'sShaped', label: 'S-подібна' },
    { value: 'hooked', label: 'гачкоподібна' },
    { value: 'phrygianCap', label: 'фрігійський ковпак' },
  ],
  gallbladderInflection: [
    { value: 'none', label: 'немає' },
    { value: 'neck', label: 'у ділянці шийки' },
    { value: 'body', label: 'у ділянці тіла' },
    { value: 'fundus', label: 'у ділянці дна' },
  ],
  gallbladderContent: [
    { value: 'anechoic', label: 'анехогенний' },
    { value: 'sludge', label: 'сладж' },
    { value: 'denseSludge', label: 'густий сладж' },
  ],
  commonBileDuctLumen: [
    { value: 'free', label: 'вільний' },
    { value: 'heterogeneous', label: 'неоднорідний' },
    { value: 'stone', label: 'конкремент' },
  ],
  yesNo: [
    { value: 'no', label: 'немає' },
    { value: 'yes', label: 'є' },
  ],
};

export function abdomenOptionLabel(group, value) {
  return abdomenOptions[group]?.find((option) => option.value === value)?.label || '';
}
