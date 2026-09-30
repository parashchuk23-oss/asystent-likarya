export const kneeSelectOptions = {
  jointMode: [
    { value: 'right', label: 'правий' },
    { value: 'left', label: 'лівий' },
    { value: 'bilateral', label: 'обидва' },
  ],
  visualization: [
    { value: 'satisfactory', label: 'задовільна' },
    { value: 'limited', label: 'погіршена' },
  ],
  tendon: [
    { value: 'normal', label: 'без змін' },
    { value: 'tendinopathy', label: 'тендинопатія' },
    { value: 'partialTear', label: 'ознаки часткового пошкодження' },
    { value: 'completeTear', label: 'ознаки повного пошкодження' },
    { value: 'limited', label: 'оцінка обмежена' },
  ],
  enthesis: [
    { value: 'normal', label: 'без змін' },
    { value: 'enthesophyte', label: 'ентезофіт' },
    { value: 'erosion', label: 'ерозія' },
    { value: 'calcification', label: 'кальцифікат' },
    { value: 'thickened', label: 'потовщення / гіпоехогенність' },
  ],
  nonePresent: [
    { value: 'none', label: 'немає' },
    { value: 'present', label: 'є' },
  ],
  synovium: [
    { value: 'normal', label: 'не потовщена' },
    { value: 'hypertrophy', label: 'потовщена / гіпертрофована' },
    { value: 'proliferation', label: 'проліферативні зміни' },
  ],
  pd: [
    { value: '0', label: '0 — сигнал відсутній' },
    { value: '1', label: '1 — поодинокі сигнали' },
    { value: '2', label: '2 — помірний сигнал' },
    { value: '3', label: '3 — виражений сигнал' },
  ],
  simpleStatus: [
    { value: 'normal', label: 'без змін' },
    { value: 'abnormal', label: 'змінено' },
  ],
  cartilage: [
    { value: 'normal', label: 'не змінений' },
    { value: 'thinned', label: 'стоншений' },
    { value: 'heterogeneous', label: 'неоднорідний / підвищеної ехогенності' },
    { value: 'focalDefect', label: 'локальний дефект' },
  ],
  boneContour: [
    { value: 'normal', label: 'рівний, без змін' },
    { value: 'osteophytes', label: 'крайові остеофіти' },
    { value: 'erosions', label: 'ерозивні зміни' },
    { value: 'irregular', label: 'нерівність контуру' },
  ],
  ligament: [
    { value: 'normal', label: 'без змін' },
    { value: 'thickened', label: 'потовщена / неоднорідна' },
    { value: 'partialTear', label: 'ознаки часткового пошкодження' },
    { value: 'completeTear', label: 'ознаки повного пошкодження' },
    { value: 'limited', label: 'оцінка обмежена' },
  ],
  meniscus: [
    { value: 'normal', label: 'без видимих змін у доступних відділах' },
    { value: 'degenerative', label: 'дегенеративні зміни' },
    { value: 'suspectedTear', label: 'ознаки, що можуть відповідати пошкодженню' },
    { value: 'extrusion', label: 'екструзія' },
    { value: 'parameniscalCyst', label: 'параменіскова кіста' },
    { value: 'limited', label: 'оцінка обмежена' },
  ],
  cruciateVisualization: [
    { value: 'partial', label: 'частково доступна' },
    { value: 'notVisualized', label: 'не візуалізується' },
    { value: 'adequate', label: 'доступна для оцінки' },
  ],
  cruciateStatus: [
    { value: 'noVisibleChanges', label: 'без видимих змін у доступних відділах' },
    { value: 'thickened', label: 'потовщена / неоднорідна' },
    { value: 'suspectedInjury', label: 'ознаки, що можуть відповідати пошкодженню' },
  ],
  baker: [
    { value: 'absent', label: 'не виявлена' },
    { value: 'present', label: 'виявлена' },
    { value: 'complicated', label: 'ускладнена / з ознаками розриву' },
  ],
};

export function createNormalKneeJoint() {
  return {
    quadriceps: { status: 'normal', enthesis: 'normal', pd: '0', thickness: '', details: '' },
    suprapatellar: { effusion: 'none', depth: '', synovium: 'normal', synoviumThickness: '', pd: '0', details: '' },
    patellaContour: { status: 'normal', details: '' },
    patellarTendon: { status: 'normal', enthesis: 'normal', pd: '0', thickness: '', details: '' },
    prepatellarBursa: { status: 'normal', depth: '', details: '' },
    superficialInfrapatellarBursa: { status: 'normal', depth: '', details: '' },
    deepInfrapatellarBursa: { status: 'normal', depth: '', details: '' },
    hoffa: { status: 'normal', details: '' },
    cartilage: { status: 'normal', thickness: '', location: '', details: '' },
    mpfl: { status: 'normal', details: '' },
    lateralRetinaculum: { status: 'normal', details: '' },
    medialBoneContour: { status: 'normal', details: '' },
    lateralBoneContour: { status: 'normal', details: '' },
    mcl: { status: 'normal', details: '' },
    lcl: { status: 'normal', details: '' },
    medialMeniscus: { status: 'normal', extrusionMm: '', details: '' },
    lateralMeniscus: { status: 'normal', extrusionMm: '', details: '' },
    popliteus: { status: 'normal', enthesis: 'normal', pd: '0', thickness: '', details: '' },
    bicepsFemoris: { status: 'normal', enthesis: 'normal', pd: '0', thickness: '', details: '' },
    pesAnserine: { status: 'normal', depth: '', details: '' },
    baker: { status: 'absent', length: '', width: '', depth: '', details: '' },
    acl: { visualization: 'partial', status: 'noVisibleChanges', details: '' },
    pcl: { visualization: 'partial', status: 'noVisibleChanges', details: '' },
    additional: '',
  };
}

export function createInitialKneeData() {
  return {
    complaints: '',
    apparatus: '',
    visualization: 'satisfactory',
    visualizationReason: '',
    jointMode: 'right',
    right: createNormalKneeJoint(),
    left: createNormalKneeJoint(),
  };
}

export function optionLabel(group, value) {
  return kneeSelectOptions[group]?.find((item) => item.value === value)?.label || value;
}
