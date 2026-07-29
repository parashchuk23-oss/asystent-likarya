export const renalSelectOptions = {
  kidneyPosition: [
    { value: 'typical', label: 'розташована типово' },
    { value: 'moderatePtosis', label: 'опущена помірно' },
    { value: 'pelvicDystopia', label: 'тазова дистопія' },
  ],
  contours: [
    { value: 'smooth', label: 'рівні' },
    { value: 'irregular', label: 'нерівні' },
    { value: 'lobulated', label: 'горбкуваті' },
  ],
  contourClarity: [
    { value: 'clear', label: 'чіткі' },
    { value: 'blurred', label: 'розмиті' },
  ],
  corticomedullary: [
    { value: 'preserved', label: 'збережена' },
    { value: 'impaired', label: 'порушена' },
    { value: 'unclear', label: 'нечітка' },
  ],
  sinusEchogenicity: [
    { value: 'normal', label: 'нормальної ехогенності' },
    { value: 'increased', label: 'підвищеної ехогенності' },
    { value: 'decreased', label: 'зниженої ехогенності' },
  ],
  vascularPattern: [
    { value: 'preserved', label: 'збережений' },
    { value: 'changed', label: 'змінений' },
  ],
  collectingSystem: [
    { value: 'notDilated', label: 'не розширені' },
    { value: 'dilated', label: 'розширені' },
  ],
  findingStatus: [
    { value: 'absent', label: 'не виявлені' },
    { value: 'present', label: 'виявлені' },
  ],
  adrenalStatus: [
    { value: 'notVisualized', label: 'не візуалізується' },
    { value: 'visualized', label: 'візуалізується без особливостей' },
    { value: 'changed', label: 'візуалізується зі змінами' },
  ],
  uretersStatus: [
    { value: 'notDilated', label: 'не розширені, просвіти вільні' },
    { value: 'dilated', label: 'розширені' },
  ],
  arteryStenosis: [
    { value: 'no', label: 'даних за стеноз ниркових артерій немає' },
    { value: 'yes', label: 'є дані за стеноз ниркових артерій' },
  ],
  bladderWall: [
    { value: 'notThickened', label: 'не потовщені' },
    { value: 'thickened', label: 'потовщені' },
  ],
  bladderContent: [
    { value: 'anechoic', label: 'однорідний анехогенний' },
    { value: 'heterogeneous', label: 'неоднорідний' },
  ],
  uretericOrifices: [
    { value: 'notDilated', label: 'не розширені' },
    { value: 'dilated', label: 'розширені' },
  ],
  yesNo: [
    { value: 'no', label: 'ні' },
    { value: 'yes', label: 'так' },
  ],
};

export function renalOptionLabel(group, value) {
  return renalSelectOptions[group]?.find((option) => option.value === value)?.label || value;
}
