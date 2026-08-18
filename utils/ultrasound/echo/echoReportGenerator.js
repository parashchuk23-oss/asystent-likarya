import { echoOptionLabel } from '../../../data/ultrasound/echoOptions';
import { calculateEchoDerived } from './echoCalculations';

function compact(items) {
  return items.filter(Boolean);
}

function line(label, value, unit = '') {
  if (value === '' || value === null || value === undefined) return '';
  return `${label}: ${value}${unit}.`;
}

function qualitative(group, value) {
  const label = echoOptionLabel(group, value);
  if (!label || label === 'не оцінено' || label === 'не описано') return '';
  return label;
}

function formatOptionalFeature(name, value) {
  if (value === 'optional') return `${name}: за наявності відповідної опції на апараті.`;
  if (value === 'available') return `${name}: доступно / використовується.`;
  if (value === 'notAvailable') return `${name}: не використовується.`;
  return '';
}

export function generateEchoOverview(data) {
  const derived = calculateEchoDerived(data);
  const lines = [];

  lines.push('Ехокардіографія виконана трансторакально.');
  lines.push(`Режим: ${echoOptionLabel('mode', data.basic.mode)}.`);
  lines.push(formatOptionalFeature('CW Doppler', data.basic.cwDoppler));
  lines.push(formatOptionalFeature('TDI', data.basic.tdi));
  lines.push(formatOptionalFeature('ECG', data.basic.ecg));
  if (derived.bsa) lines.push(`BSA ${derived.bsa} м².`);

  if (data.basic.mode === 'focused') {
    lines.push(
      compact([
        qualitative('visualFunction', data.focused.lvFunction) && `Глобальна функція ЛШ: ${qualitative('visualFunction', data.focused.lvFunction)}.`,
        qualitative('chamberSize', data.focused.rvDilation) && `ПШ: ${qualitative('chamberSize', data.focused.rvDilation)}.`,
        qualitative('pericardialFluid', data.focused.pericardialFluid) && `Перикард: ${qualitative('pericardialFluid', data.focused.pericardialFluid)}.`,
        data.focused.ivcComment && `НПВ: ${data.focused.ivcComment}.`,
        data.focused.valveComment && `Клапани: ${data.focused.valveComment}.`,
      ]).join(' '),
    );
    return lines.filter(Boolean).join('\n');
  }

  lines.push(
    compact([
      'Лівий шлуночок.',
      line('КДР', data.leftVentricle.lvidd, ' мм'),
      line('КСР', data.leftVentricle.lvids, ' мм'),
      line('МШП', data.leftVentricle.ivsd, ' мм'),
      line('Задня стінка ЛШ', data.leftVentricle.lvpwd, ' мм'),
      qualitative('visualFunction', data.leftVentricle.visualEf) && `Візуально глобальна систолічна функція ЛШ: ${qualitative('visualFunction', data.leftVentricle.visualEf)}.`,
      derived.simpsonEf !== null && `ФВ ЛШ за Simpson ${derived.simpsonEf}%.`,
      derived.teichholzEf !== null && `ФВ ЛШ за Teichholz ${derived.teichholzEf}% (метод доречний лише при придатній геометрії ЛШ).`,
      derived.fs !== null && `FS ${derived.fs}%.`,
      derived.lvMass !== null && `Маса ЛШ ${derived.lvMass} г.`,
      derived.lvMassIndex !== null && `Індекс маси ЛШ ${derived.lvMassIndex} г/м².`,
      derived.rwt !== null && `Відносна товщина стінки ${derived.rwt}.`,
      derived.lvGeometry && `Геометрія ЛШ: ${derived.lvGeometry}.`,
      qualitative('wallMotion', data.leftVentricle.regionalMotion) && `Регіональна скоротливість: ${qualitative('wallMotion', data.leftVentricle.regionalMotion)}.`,
      data.leftVentricle.regionalDetails && `Деталі регіональної скоротливості: ${data.leftVentricle.regionalDetails}.`,
    ]).join(' '),
  );

  lines.push(
    compact([
      'Діастолічна функція.',
      line('E', data.diastolic.e, ' см/с'),
      line('A', data.diastolic.a, ' см/с'),
      derived.eA !== null && `E/A ${derived.eA}.`,
      line('DT', data.diastolic.dt, ' мс'),
      line("eʼ septal", data.diastolic.ePrimeSeptal, ' см/с'),
      line("eʼ lateral", data.diastolic.ePrimeLateral, ' см/с'),
      derived.avgEPrime !== null && `Середнє eʼ ${derived.avgEPrime} см/с.`,
      derived.eOverEPrime !== null && `E/eʼ ${derived.eOverEPrime}.`,
      line('TR Vmax', data.diastolic.trVmax, ' м/с'),
      data.diastolic.comment || 'Класифікація діастолічної функції потребує повного набору параметрів ASE/EACVI.',
    ]).join(' '),
  );

  lines.push(
    compact([
      'Правий шлуночок.',
      line('Базальний діаметр ПШ', data.rightVentricle.basalDiameter, ' мм'),
      line('TAPSE', data.rightVentricle.tapse, ' мм'),
      line("TDI Sʼ", data.rightVentricle.sPrime, ' см/с'),
      qualitative('visualFunction', data.rightVentricle.visualFunction) && `Візуальна функція ПШ: ${qualitative('visualFunction', data.rightVentricle.visualFunction)}.`,
      data.rightVentricle.comment,
    ]).join(' '),
  );

  lines.push(
    compact([
      'Передсердя.',
      line('ЛП передньо-задній розмір', data.leftAtrium.apSize, ' мм'),
      line('ЛП обʼєм', data.leftAtrium.volume, ' мл'),
      derived.lavi !== null && `LAVI ${derived.lavi} мл/м².`,
      line('ПП площа', data.rightAtrium.area, ' см²'),
      qualitative('chamberSize', data.rightAtrium.visualDilation) && `ПП: ${qualitative('chamberSize', data.rightAtrium.visualDilation)}.`,
    ]).join(' '),
  );

  lines.push(
    compact([
      'Аорта.',
      line('Кільце АК', data.aorta.annulus, ' мм'),
      line('Синуси Вальсальви', data.aorta.sinuses, ' мм'),
      line('Синотубулярне зʼєднання', data.aorta.stj, ' мм'),
      line('Висхідна аорта', data.aorta.ascending, ' мм'),
    ]).join(' '),
  );

  lines.push(
    compact([
      'Клапани.',
      qualitative('aorticValveType', data.aorticValve.type) && `Аортальний клапан: ${qualitative('aorticValveType', data.aorticValve.type)}.`,
      qualitative('valveMorphology', data.aorticValve.morphology) && `АК: ${qualitative('valveMorphology', data.aorticValve.morphology)}.`,
      qualitative('regurgitation', data.aorticValve.regurgitation) && `Аортальна регургітація: ${qualitative('regurgitation', data.aorticValve.regurgitation)}.`,
      line('AV Vmax', data.aorticValve.vmax, ' м/с'),
      derived.avPeakGradient !== null && `Піковий градієнт на АК ${derived.avPeakGradient} мм рт. ст.`,
      derived.ava !== null && `AVA за continuity equation ${derived.ava} см².`,
      qualitative('valveMorphology', data.mitralValve.morphology) && `МК: ${qualitative('valveMorphology', data.mitralValve.morphology)}.`,
      qualitative('regurgitation', data.mitralValve.regurgitation) && `Мітральна регургітація: ${qualitative('regurgitation', data.mitralValve.regurgitation)}.`,
      qualitative('regurgitation', data.tricuspidValve.regurgitation) && `Трикуспідальна регургітація: ${qualitative('regurgitation', data.tricuspidValve.regurgitation)}.`,
      line('TR Vmax', data.tricuspidValve.trVmax, ' м/с'),
      derived.rvsp !== null && `Орієнтовний RVSP/PASP ${derived.rvsp} мм рт. ст. за TR Vmax та RAP.`,
      qualitative('regurgitation', data.pulmonaryValve.regurgitation) && `Регургітація на клапані легеневої артерії: ${qualitative('regurgitation', data.pulmonaryValve.regurgitation)}.`,
    ]).join(' '),
  );

  lines.push(
    compact([
      'Перикард і НПВ.',
      qualitative('pericardialFluid', data.pericardium.fluid) && `Перикард: ${qualitative('pericardialFluid', data.pericardium.fluid)}.`,
      line('Максимальна сепарація листків перикарда', data.pericardium.separation, ' мм'),
      data.pericardium.tamponadeSigns && `Ознаки для оцінки гемодинамічної значущості: ${data.pericardium.tamponadeSigns}.`,
      line('НПВ на видиху', data.ivc.maxDiameter, ' мм'),
      line('НПВ на вдиху', data.ivc.minDiameter, ' мм'),
      derived.ivcCollapse !== null && `Колапс НПВ ${derived.ivcCollapse}%.`,
      line('RAP, підтверджений лікарем', data.ivc.rap, ' мм рт. ст'),
    ]).join(' '),
  );

  return lines.filter(Boolean).join('\n');
}

export function generateEchoConclusion(data) {
  const derived = calculateEchoDerived(data);
  const items = [];

  if (data.basic.mode === 'focused') {
    if (qualitative('visualFunction', data.focused.lvFunction)) items.push(`Глобальна функція ЛШ: ${qualitative('visualFunction', data.focused.lvFunction)}.`);
    if (qualitative('chamberSize', data.focused.rvDilation)) items.push(`ПШ: ${qualitative('chamberSize', data.focused.rvDilation)}.`);
    if (qualitative('pericardialFluid', data.focused.pericardialFluid)) items.push(`Перикард: ${qualitative('pericardialFluid', data.focused.pericardialFluid)}.`);
    return items.length ? items.join('\n') : 'Швидке Ехо / POCUS: висновок формується після введення даних.';
  }

  if (derived.simpsonEf !== null) items.push(`ФВ ЛШ за Simpson ${derived.simpsonEf}%.`);
  else if (data.leftVentricle.manualEf) items.push(`ФВ ЛШ ${data.leftVentricle.manualEf}%.`);
  else if (qualitative('visualFunction', data.leftVentricle.visualEf)) items.push(`Глобальна систолічна функція ЛШ: ${qualitative('visualFunction', data.leftVentricle.visualEf)}.`);

  if (derived.lvGeometry) items.push(`Геометрія ЛШ: ${derived.lvGeometry}.`);
  if (derived.lavi !== null) items.push(`LAVI ${derived.lavi} мл/м².`);
  if (qualitative('visualFunction', data.rightVentricle.visualFunction)) items.push(`Функція ПШ: ${qualitative('visualFunction', data.rightVentricle.visualFunction)}.`);
  if (derived.eOverEPrime !== null) items.push(`E/eʼ ${derived.eOverEPrime}; інтерпретувати разом з іншими показниками діастолічної функції.`);
  if (derived.rvsp !== null) items.push(`Орієнтовний RVSP/PASP ${derived.rvsp} мм рт. ст. за наявним TR-сигналом і підтвердженим RAP.`);
  if (qualitative('pericardialFluid', data.pericardium.fluid)) items.push(`Перикард: ${qualitative('pericardialFluid', data.pericardium.fluid)}.`);
  if (data.conclusionManual) items.push(data.conclusionManual);

  return items.length ? items.join('\n') : 'Висновок формується після введення ключових даних.';
}

export function generateEchoRecommendations(data) {
  const recommendations = ['Оцінити результати ЕхоКГ у клінічному контексті.'];
  if (data.leftVentricle.regionalMotion && data.leftVentricle.regionalMotion !== 'normal') {
    recommendations.push('Розглянути зіставлення з ЕКГ, тропоніном та клінікою ішемії за показами.');
  }
  if (data.pericardium.fluid && data.pericardium.fluid !== 'none') {
    recommendations.push('Оцінити клінічні ознаки гемодинамічної значущості перикардіальної рідини.');
  }
  if (data.basic.mode === 'focused') {
    recommendations.push('За потреби виконати стандартне ЕхоКГ або направити на експертне дослідження.');
  }
  recommendations.push('Повторне ЕхоКГ, ЕКГ, Холтер, ДМАТ або консультація кардіолога — за клінічними показами.');
  return recommendations.join('\n');
}

export function buildEchoReport(data) {
  return {
    overview: generateEchoOverview(data),
    conclusion: generateEchoConclusion(data),
    recommendations: generateEchoRecommendations(data),
  };
}
