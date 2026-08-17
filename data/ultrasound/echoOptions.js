export const echoOptions = {
  mode: [
    { value: 'standard', label: 'Стандартне ЕхоКГ' },
    { value: 'focused', label: 'Швидке Ехо / POCUS' },
  ],
  transducer: [
    { value: 'p21x', label: 'P21x phased-array' },
    { value: 'other-phased-array', label: 'Інший phased-array cardiac transducer' },
    { value: 'other', label: 'Інший датчик' },
  ],
  availability: [
    { value: 'available', label: 'є на апараті' },
    { value: 'optional', label: 'за наявності опції на апараті' },
    { value: 'notAvailable', label: 'немає / не використовується' },
  ],
  visualFunction: [
    { value: '', label: 'не оцінено' },
    { value: 'preserved', label: 'збережена' },
    { value: 'mildlyReduced', label: 'помірно знижена' },
    { value: 'moderatelyReduced', label: 'знижена' },
    { value: 'severelyReduced', label: 'значно знижена' },
  ],
  chamberSize: [
    { value: '', label: 'не оцінено' },
    { value: 'notDilated', label: 'не дилатована' },
    { value: 'mildlyDilated', label: 'незначно дилатована' },
    { value: 'dilated', label: 'дилатована' },
    { value: 'severelyDilated', label: 'значно дилатована' },
  ],
  wallMotion: [
    { value: '', label: 'не оцінено' },
    { value: 'normal', label: 'локальних порушень не виявлено' },
    { value: 'hypokinesis', label: 'гіпокінез' },
    { value: 'akinesis', label: 'акінез' },
    { value: 'dyskinesis', label: 'дискінез' },
  ],
  valveMorphology: [
    { value: '', label: 'не описано' },
    { value: 'normal', label: 'без грубих структурних змін' },
    { value: 'thickened', label: 'стулки потовщені' },
    { value: 'calcified', label: 'кальциноз стулок' },
    { value: 'restricted', label: 'обмежена рухливість' },
  ],
  aorticValveType: [
    { value: '', label: 'не визначено' },
    { value: 'tricuspid', label: 'тристулковий' },
    { value: 'bicuspid', label: 'двостулковий' },
    { value: 'notClear', label: 'чітко не визначено' },
  ],
  regurgitation: [
    { value: '', label: 'не оцінено' },
    { value: 'none', label: 'не виявлена' },
    { value: 'trivial', label: 'мінімальна' },
    { value: 'mild', label: 'легка' },
    { value: 'moderate', label: 'помірна' },
    { value: 'severe', label: 'тяжка' },
  ],
  pericardialFluid: [
    { value: '', label: 'не оцінено' },
    { value: 'none', label: 'рідина не виявлена' },
    { value: 'minimal', label: 'мінімальна' },
    { value: 'small', label: 'мала' },
    { value: 'moderate', label: 'помірна' },
    { value: 'large', label: 'значна' },
  ],
  yesNo: [
    { value: '', label: 'не оцінено' },
    { value: 'yes', label: 'так' },
    { value: 'no', label: 'ні' },
  ],
};

export function echoOptionLabel(group, value) {
  return echoOptions[group]?.find((option) => option.value === value)?.label || '';
}
