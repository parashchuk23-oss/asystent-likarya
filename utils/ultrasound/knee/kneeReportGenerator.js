import { optionLabel } from '../../../data/ultrasound/kneeProtocol';

const sideLabels = { right: 'Правий колінний суглоб', left: 'Лівий колінний суглоб' };
const sideAccusative = { right: 'правого колінного суглоба', left: 'лівого колінного суглоба' };

const tendonNames = {
  quadriceps: 'сухожилок чотириголового м’яза стегна',
  patellarTendon: 'сухожилок надколінка',
  popliteus: 'сухожилок підколінного м’яза',
  bicepsFemoris: 'сухожилок двоголового м’яза стегна',
};

function selectedSides(data) {
  if (data.jointMode === 'bilateral') return ['right', 'left'];
  return [data.jointMode];
}

function withMeasurement(value, unit = 'мм') {
  return value ? ` (${value} ${unit})` : '';
}

function tendonDescription(name, tendon) {
  if (tendon.status === 'normal' && tendon.enthesis === 'normal') {
    return `${name}: цілісність і структура не порушені, зона ентезу без видимих змін.`;
  }
  const parts = [`${name}: ${optionLabel('tendon', tendon.status)}`];
  if (tendon.thickness) parts.push(`товщина ${tendon.thickness} мм`);
  if (tendon.enthesis !== 'normal') parts.push(`зона ентезу — ${optionLabel('enthesis', tendon.enthesis)}`);
  if (tendon.pd !== '0') parts.push(`PD-сигнал ${tendon.pd}`);
  if (tendon.details) parts.push(tendon.details);
  return `${parts.join(', ')}.`;
}

function ligamentDescription(name, item) {
  return item.status === 'normal'
    ? `${name}: цілісність і структура не порушені.`
    : `${name}: ${optionLabel('ligament', item.status)}${item.details ? `, ${item.details}` : ''}.`;
}

function meniscusDescription(name, item) {
  if (item.status === 'normal') return `${name}: у доступних для УЗ-візуалізації периферичних відділах без видимих змін.`;
  const extrusion = item.status === 'extrusion' ? withMeasurement(item.extrusionMm) : '';
  return `${name}: ${optionLabel('meniscus', item.status)}${extrusion}${item.details ? `, ${item.details}` : ''}.`;
}

function bursaDescription(name, item) {
  return item.status === 'normal'
    ? `${name}: не розширена.`
    : `${name}: розширена${withMeasurement(item.depth)}${item.details ? `, ${item.details}` : ''}.`;
}

function cruciateDescription(name, item) {
  if (item.visualization === 'notVisualized') return `${name}: не візуалізується.`;
  return `${name}: ${optionLabel('cruciateVisualization', item.visualization)}, ${optionLabel('cruciateStatus', item.status)}${item.details ? `, ${item.details}` : ''}.`;
}

function jointOverview(side, joint) {
  const lines = [`${sideLabels[side]}.`];
  lines.push(tendonDescription('Сухожилок чотириголового м’яза стегна', joint.quadriceps));
  if (joint.suprapatellar.effusion === 'none') {
    lines.push('Верхній заворот не розширений, випіт не визначається.');
  } else {
    lines.push(`У верхньому завороті визначається випіт${withMeasurement(joint.suprapatellar.depth)}${joint.suprapatellar.details ? `, ${joint.suprapatellar.details}` : ''}.`);
  }
  lines.push(
    joint.suprapatellar.synovium === 'normal'
      ? 'Синовіальна оболонка не потовщена.'
      : `Синовіальна оболонка: ${optionLabel('synovium', joint.suprapatellar.synovium)}${withMeasurement(joint.suprapatellar.synoviumThickness)}; PD-сигнал ${joint.suprapatellar.pd}.`,
  );
  lines.push(
    joint.patellaContour.status === 'normal'
      ? 'Контури надколінка рівні, без видимих змін.'
      : `Контури надколінка змінені${joint.patellaContour.details ? `: ${joint.patellaContour.details}` : ''}.`,
  );
  lines.push(tendonDescription('Сухожилок надколінка', joint.patellarTendon));
  lines.push(bursaDescription('Препателярна бурса', joint.prepatellarBursa));
  lines.push(bursaDescription('Поверхнева інфрапателярна бурса', joint.superficialInfrapatellarBursa));
  lines.push(bursaDescription('Глибока інфрапателярна бурса', joint.deepInfrapatellarBursa));
  lines.push(joint.hoffa.status === 'normal' ? 'Жирове тіло Гоффа без видимих структурних змін.' : `Жирове тіло Гоффа змінене${joint.hoffa.details ? `: ${joint.hoffa.details}` : ''}.`);
  lines.push(
    joint.cartilage.status === 'normal'
      ? 'Гіаліновий хрящ збереженої товщини та однорідної структури.'
      : `Гіаліновий хрящ: ${optionLabel('cartilage', joint.cartilage.status)}${withMeasurement(joint.cartilage.thickness)}${joint.cartilage.location ? `, локалізація: ${joint.cartilage.location}` : ''}${joint.cartilage.details ? `, ${joint.cartilage.details}` : ''}.`,
  );
  lines.push(ligamentDescription('Медіальна пателофеморальна зв’язка', joint.mpfl));
  lines.push(ligamentDescription('Латеральний ретинакулюм', joint.lateralRetinaculum));
  lines.push(`Кісткові контури медіальної поверхні: ${optionLabel('boneContour', joint.medialBoneContour.status)}${joint.medialBoneContour.details ? `, ${joint.medialBoneContour.details}` : ''}.`);
  lines.push(`Кісткові контури латеральної поверхні: ${optionLabel('boneContour', joint.lateralBoneContour.status)}${joint.lateralBoneContour.details ? `, ${joint.lateralBoneContour.details}` : ''}.`);
  lines.push(ligamentDescription('Медіальна колатеральна зв’язка', joint.mcl));
  lines.push(ligamentDescription('Латеральна колатеральна зв’язка', joint.lcl));
  lines.push(meniscusDescription('Медіальний меніск', joint.medialMeniscus));
  lines.push(meniscusDescription('Латеральний меніск', joint.lateralMeniscus));
  lines.push(tendonDescription('Сухожилок підколінного м’яза', joint.popliteus));
  lines.push(tendonDescription('Сухожилок двоголового м’яза стегна', joint.bicepsFemoris));
  lines.push(bursaDescription('Бурса «гусячої лапки»', joint.pesAnserine));
  lines.push(
    joint.baker.status === 'absent'
      ? 'Кіста Бейкера не виявлена.'
      : `Кіста Бейкера: ${optionLabel('baker', joint.baker.status)}, розміри ${[joint.baker.length, joint.baker.width, joint.baker.depth].filter(Boolean).join(' × ') || 'не вказані'} мм${joint.baker.details ? `, ${joint.baker.details}` : ''}.`,
  );
  lines.push(cruciateDescription('Передня хрестоподібна зв’язка', joint.acl));
  lines.push(cruciateDescription('Задня хрестоподібна зв’язка', joint.pcl));
  if (joint.additional) lines.push(`Додатково: ${joint.additional}`);
  return lines.join('\n');
}

export function generateKneeOverview(data) {
  const header = [];
  if (data.apparatus.trim()) header.push(`УЗД проводилося на апараті ${data.apparatus.trim()}.`);
  header.push(
    data.visualization === 'limited'
      ? `Візуалізація погіршена${data.visualizationReason.trim() ? `: ${data.visualizationReason.trim()}` : ''}.`
      : 'Візуалізація задовільна.',
  );
  return [...header, ...selectedSides(data).map((side) => jointOverview(side, data[side]))].join('\n\n');
}

function addTendonFinding(findings, key, item) {
  if (item.status === 'tendinopathy') findings.push(`тендинопатії ${tendonNames[key]}`);
  if (item.status === 'partialTear') findings.push(`ознак, що можуть відповідати частковому пошкодженню ${tendonNames[key]}`);
  if (item.status === 'completeTear') findings.push(`ознак, що можуть відповідати повному пошкодженню ${tendonNames[key]}`);
  if (item.enthesis !== 'normal') findings.push(`ентезопатії ${tendonNames[key]}`);
}

function addLigamentFinding(findings, name, item) {
  if (item.status === 'thickened') findings.push(`структурних змін ${name}`);
  if (item.status === 'partialTear') findings.push(`ознак, що можуть відповідати частковому пошкодженню ${name}`);
  if (item.status === 'completeTear') findings.push(`ознак, що можуть відповідати повному пошкодженню ${name}`);
}

function jointFindings(joint) {
  const findings = [];
  if (joint.suprapatellar.effusion === 'present') findings.push('внутрішньосуглобового випоту');
  if (joint.suprapatellar.synovium !== 'normal') findings.push(`синовіальної гіпертрофії${joint.suprapatellar.pd !== '0' ? ` з PD-активністю ${joint.suprapatellar.pd}` : ''}`);
  ['quadriceps', 'patellarTendon', 'popliteus', 'bicepsFemoris'].forEach((key) => addTendonFinding(findings, key, joint[key]));
  const degenerative = joint.cartilage.status !== 'normal' || joint.medialBoneContour.status === 'osteophytes' || joint.lateralBoneContour.status === 'osteophytes';
  if (degenerative) findings.push('дегенеративних змін суглоба');
  if (joint.medialBoneContour.status === 'erosions' || joint.lateralBoneContour.status === 'erosions') findings.push('ерозивних змін кісткових контурів');
  addLigamentFinding(findings, 'медіальної пателофеморальної зв’язки', joint.mpfl);
  addLigamentFinding(findings, 'латерального ретинакулюма', joint.lateralRetinaculum);
  addLigamentFinding(findings, 'медіальної колатеральної зв’язки', joint.mcl);
  addLigamentFinding(findings, 'латеральної колатеральної зв’язки', joint.lcl);
  [['медіального меніска', joint.medialMeniscus], ['латерального меніска', joint.lateralMeniscus]].forEach(([name, item]) => {
    if (item.status === 'degenerative') findings.push(`дегенеративних змін ${name}`);
    if (item.status === 'suspectedTear') findings.push(`ознак, що можуть відповідати пошкодженню ${name}`);
    if (item.status === 'extrusion') findings.push(`екструзії ${name}`);
    if (item.status === 'parameniscalCyst') findings.push(`параменіскової кісти ${name}`);
  });
  [['препателярного бурситу', joint.prepatellarBursa], ['поверхневого інфрапателярного бурситу', joint.superficialInfrapatellarBursa], ['глибокого інфрапателярного бурситу', joint.deepInfrapatellarBursa], ['бурситу «гусячої лапки»', joint.pesAnserine]].forEach(([name, item]) => {
    if (item.status !== 'normal') findings.push(name);
  });
  if (joint.baker.status !== 'absent') findings.push(joint.baker.status === 'complicated' ? 'ускладненої кісти Бейкера' : 'кісти Бейкера');
  if (joint.hoffa.status !== 'normal') findings.push('структурних змін жирового тіла Гоффа');
  [['передньої хрестоподібної зв’язки', joint.acl], ['задньої хрестоподібної зв’язки', joint.pcl]].forEach(([name, item]) => {
    if (item.status === 'suspectedInjury') findings.push(`ознак, що можуть відповідати пошкодженню ${name}`);
  });
  return [...new Set(findings)];
}

export function generateKneeConclusion(data) {
  return selectedSides(data).map((side) => {
    const findings = jointFindings(data[side]);
    return findings.length
      ? `${sideLabels[side]}: УЗ-ознаки ${findings.join('; ')}.`
      : `${sideLabels[side]}: ехографічних ознак патологічних змін не виявлено.`;
  }).join('\n');
}

export function generateKneeRecommendations(data) {
  const recommendations = new Set();
  selectedSides(data).forEach((side) => {
    const joint = data[side];
    const possibleTear = ['quadriceps', 'patellarTendon', 'popliteus', 'bicepsFemoris'].some((key) => ['partialTear', 'completeTear'].includes(joint[key].status))
      || ['mpfl', 'lateralRetinaculum', 'mcl', 'lcl'].some((key) => ['partialTear', 'completeTear'].includes(joint[key].status))
      || ['medialMeniscus', 'lateralMeniscus'].some((key) => joint[key].status === 'suspectedTear')
      || ['acl', 'pcl'].some((key) => joint[key].status === 'suspectedInjury');
    if (possibleTear) recommendations.add(`Консультація ортопеда-травматолога; за клінічними показаннями розглянути МРТ ${sideAccusative}.`);
    if (joint.suprapatellar.synovium !== 'normal' && joint.suprapatellar.pd !== '0') recommendations.add('Клініко-лабораторна оцінка активності запального процесу; за показаннями консультація ревматолога.');
    if (joint.suprapatellar.effusion === 'present') recommendations.add('Клінічна оцінка причини випоту; питання пункції вирішувати за симптомами, об’ємом випоту та ознаками запалення/інфекції.');
    if (joint.baker.status !== 'absent') recommendations.add('Оцінити можливу внутрішньосуглобову причину формування кісти Бейкера.');
  });
  if (!recommendations.size) recommendations.add('Подальша тактика — з урахуванням скарг, анамнезу та даних клінічного огляду.');
  recommendations.add('УЗ-висновок не є клінічним діагнозом; остаточну інтерпретацію виконує лікар.');
  return [...recommendations].map((item) => `• ${item}`).join('\n');
}
