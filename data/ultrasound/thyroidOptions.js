export const thyroidOptions = {
  surgeryStatus: [
    { value: 'notOperated', label: 'не оперована' },
    { value: 'operated', label: 'оперована' },
  ],
  location: [
    { value: 'typical', label: 'розташована типово' },
    { value: 'low', label: 'розташована низько' },
    { value: 'partlyRetrosternal', label: 'частково загрудинне розташування' },
  ],
  shape: [
    { value: 'usual', label: 'звичайна, представлена двома частками та перешийком' },
    { value: 'rightSmaller', label: 'права частка менша' },
    { value: 'leftSmaller', label: 'ліва частка менша' },
    { value: 'rightAbsent', label: 'права частка не візуалізується' },
    { value: 'leftAbsent', label: 'ліва частка не візуалізується' },
    { value: 'other', label: 'інше' },
  ],
  isthmusStatus: [
    { value: 'notThickened', label: 'не потовщений' },
    { value: 'thickened', label: 'потовщений' },
  ],
  volumeStatus: [
    { value: 'notAssessed', label: 'не оцінено' },
    { value: 'notEnlarged', label: 'не збільшена' },
    { value: 'enlarged', label: 'збільшена' },
    { value: 'decreased', label: 'зменшена' },
  ],
  contour: [
    { value: 'smooth', label: 'рівні' },
    { value: 'uneven', label: 'нерівні' },
  ],
  clarity: [
    { value: 'clear', label: 'чіткі' },
    { value: 'unclear', label: 'нечіткі' },
  ],
  capsule: [
    { value: 'notThickened', label: 'не потовщена' },
    { value: 'thickened', label: 'потовщена' },
    { value: 'poorlyDifferentiated', label: 'диференціюється нечітко' },
  ],
  echogenicity: [
    { value: 'medium', label: 'середня' },
    { value: 'mildlyDecreased', label: 'помірно знижена' },
    { value: 'moderatelyDecreased', label: 'виражено знижена' },
    { value: 'markedlyDecreased', label: 'різко знижена' },
    { value: 'increased', label: 'підвищена' },
  ],
  parenchymaStructure: [
    { value: 'homogeneous', label: 'однорідна' },
    { value: 'diffuselyHeterogeneous', label: 'дифузно неоднорідна' },
  ],
  parenchymaFeatures: [
    { value: 'hypoechoicAreas', label: 'гіпоехогенні ділянки' },
    { value: 'hyperechoicFibroticAreas', label: 'гіперехогенні фіброзні ділянки' },
    { value: 'alternatingEchogenicity', label: 'чергування ділянок різної ехогенності' },
    { value: 'illDefinedHypoechoicZones', label: 'гіпоехогенні зони без чітких контурів' },
    { value: 'connectiveTissueStrands', label: 'сполучнотканинні тяжі' },
    { value: 'other', label: 'інше' },
  ],
  vascularization: [
    { value: 'normal', label: 'у нормі' },
    { value: 'moderatelyIncreased', label: 'помірно посилена' },
    { value: 'significantlyIncreased', label: 'значно посилена' },
    { value: 'reduced', label: 'знижена' },
  ],
  noduleLobe: [
    { value: 'right', label: 'права частка' },
    { value: 'left', label: 'ліва частка' },
    { value: 'isthmus', label: 'перешийок' },
  ],
  noduleLocation: [
    { value: 'upperThird', label: 'верхня третина' },
    { value: 'middleThird', label: 'середня третина' },
    { value: 'lowerThird', label: 'нижня третина' },
    { value: 'border', label: 'на межі частки та перешийка' },
    { value: 'other', label: 'інше' },
  ],
  noduleType: [
    { value: 'solid', label: 'солідне' },
    { value: 'predominantlySolid', label: 'переважно солідне' },
    { value: 'mixed', label: 'змішане' },
    { value: 'predominantlyCystic', label: 'переважно кістозне' },
    { value: 'cystic', label: 'кістозне' },
    { value: 'spongiform', label: 'губчасте' },
  ],
  noduleEchogenicity: [
    { value: 'anechoic', label: 'анехогенне' },
    { value: 'hyperechoic', label: 'гіперехогенне' },
    { value: 'isoechoic', label: 'ізоехогенне' },
    { value: 'hypoechoic', label: 'гіпоехогенне' },
    { value: 'veryHypoechoic', label: 'виражено гіпоехогенне' },
    { value: 'ambiguous', label: 'ехогенність неоднозначна' },
  ],
  noduleShape: [
    { value: 'oval', label: 'овальної форми' },
    { value: 'round', label: 'округлої форми' },
    { value: 'irregular', label: 'неправильної форми' },
  ],
  noduleOrientation: [
    { value: 'horizontal', label: 'горизонтальної орієнтації' },
    { value: 'vertical', label: 'вертикальної орієнтації' },
  ],
  noduleContour: [
    { value: 'smooth', label: 'з рівним контуром' },
    { value: 'uneven', label: 'з нерівним контуром' },
    { value: 'lobulated', label: 'з лобульованим контуром' },
    { value: 'noExtension', label: 'без ознак екстратиреоїдного поширення' },
    { value: 'suspectedExtension', label: 'з підозрою на екстратиреоїдне поширення' },
  ],
  noduleStructure: [
    { value: 'homogeneous', label: 'однорідної структури' },
    { value: 'heterogeneous', label: 'неоднорідної структури' },
  ],
  noduleInclusions: [
    { value: 'absent', label: 'без додаткових ехогенних включень' },
    { value: 'cysticInclusions', label: 'кістозні включення' },
    { value: 'macrocalcifications', label: 'макрокальцинати' },
    { value: 'peripheralCalcifications', label: 'периферичні кальцинати' },
    { value: 'punctateEchogenicFoci', label: 'пунктатні ехогенні фокуси' },
    { value: 'cometTail', label: 'артефакти типу «хвіст комети»' },
    { value: 'other', label: 'інше' },
  ],
  bloodFlow: [
    { value: 'avascular', label: 'аваскулярне' },
    { value: 'perinodular', label: 'перинодулярний кровотік' },
    { value: 'intranodular', label: 'інтранодулярний кровотік' },
    { value: 'mixed', label: 'змішаний кровотік' },
    { value: 'notAssessed', label: 'кровотік не оцінювався' },
  ],
  tirads: [
    { value: '', label: 'не обрано' },
    { value: 'TR1', label: 'ACR TI-RADS 1' },
    { value: 'TR2', label: 'ACR TI-RADS 2' },
    { value: 'TR3', label: 'ACR TI-RADS 3' },
    { value: 'TR4', label: 'ACR TI-RADS 4' },
    { value: 'TR5', label: 'ACR TI-RADS 5' },
  ],
  differential: [
    { value: 'lymphNode', label: 'перитиреоїдний лімфатичний вузол' },
    { value: 'parathyroidCyst', label: 'кіста прищитоподібної залози' },
    { value: 'parathyroidAdenoma', label: 'аденома прищитоподібної залози' },
    { value: 'other', label: 'інше' },
  ],
  lymphZones: [
    { value: 'anteriorCervical', label: 'передньошийні' },
    { value: 'posteriorCervical', label: 'задньошийні' },
    { value: 'submandibular', label: 'підщелепні' },
    { value: 'right', label: 'праворуч' },
    { value: 'left', label: 'ліворуч' },
  ],
};

export function optionLabel(group, value) {
  return thyroidOptions[group]?.find((option) => option.value === value)?.label || '';
}
