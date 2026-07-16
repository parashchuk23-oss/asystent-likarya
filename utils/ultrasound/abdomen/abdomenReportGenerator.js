import { abdomenOptionLabel } from '../../../data/ultrasound/abdomenOptions';
import {
  formatDimensions,
  formatMm,
  isCommonBileDuctDilated,
  isGallbladderWallThickened,
  isLiverEnlarged,
  isPancreaticDuctDilated,
  isPortalVeinDilated,
  isSpleenEnlarged,
} from './abdomenCalculations';

function compact(items) {
  return items.filter(Boolean);
}

function sentence(parts) {
  const text = compact(parts).join(' ');
  return text ? `${text}.` : '';
}

function list(items) {
  return compact(items).join(', ');
}

function generateLiver(data) {
  const liver = data.liver;
  const dimensions = list([
    liver.rightLobeLength ? `права частка ${formatMm(liver.rightLobeLength)}` : '',
    liver.leftLobeLength ? `ліва частка ${formatMm(liver.leftLobeLength)}` : '',
    liver.caudateLobe ? `хвостата частка ${formatMm(liver.caudateLobe)}` : '',
  ]);
  const changes = liver.structure === 'heterogeneous'
    ? list([
        liver.changes.includes('fattyInfiltration') ? 'ознаки жирової інфільтрації' : '',
        liver.changes.includes('fibrosis') ? 'фіброзні зміни' : '',
        liver.changes.includes('cirrhoticRemodeling') ? 'ознаки циротичної перебудови' : '',
        liver.changes.includes('heterogeneity') ? 'неоднорідність паренхіми' : '',
        liver.changes.includes('other') ? liver.otherChange : '',
      ])
    : '';

  return [
    sentence([
      'Печінка:',
      dimensions || 'розміри без явного збільшення',
      isLiverEnlarged(liver) ? 'збільшена' : 'розміри не збільшені',
    ]),
    sentence([
      `Контури ${abdomenOptionLabel('contours', liver.contours)}`,
      `ехогенність ${abdomenOptionLabel('echogenicity', liver.echogenicity)}`,
      `структура ${abdomenOptionLabel('structure', liver.structure)}`,
      changes ? `(${changes})` : '',
    ]),
    sentence([
      liver.portalVein ? `Портальна вена ${formatMm(liver.portalVein)}` : '',
      liver.portalVein ? (isPortalVeinDilated(liver.portalVein) ? 'розширена' : 'не розширена') : '',
      `Печінкові вени ${liver.hepaticVeins === 'dilated' ? 'розширені' : 'не розширені'}`,
      `внутрішньопечінкові жовчні протоки ${liver.bileDucts === 'dilated' ? 'розширені' : 'не розширені'}`,
    ]),
  ].filter(Boolean).join('\n');
}

function generateStoneText(stone, index) {
  return sentence([
    `${index + 1}. Конкремент`,
    stone.size ? `розміром ${formatMm(stone.size)}` : '',
    stone.shadow === 'yes' ? 'з акустичною тінню' : 'без чіткої акустичної тіні',
    stone.mobile === 'yes' ? 'рухомий' : 'нерухомий',
  ]);
}

function generatePolypText(polyp, index) {
  return sentence([
    `${index + 1}. Пристінкове утворення / поліп`,
    polyp.size ? `розміром ${formatMm(polyp.size)}` : '',
    polyp.localization ? `локалізація: ${polyp.localization}` : '',
  ]);
}

function generateGallbladder(data) {
  const gb = data.gallbladder;
  const stoneText = gb.stones.map(generateStoneText).join('\n');
  const polypText = gb.polyps.map(generatePolypText).join('\n');

  return [
    sentence([
      'Жовчний міхур:',
      `форма ${abdomenOptionLabel('gallbladderShape', gb.shape)}`,
      `перегин: ${abdomenOptionLabel('gallbladderInflection', gb.inflection)}`,
      formatDimensions(gb.length, gb.width) ? `розміри ${formatDimensions(gb.length, gb.width)}` : '',
    ]),
    sentence([
      gb.wall ? `Стінка ${formatMm(gb.wall)}` : '',
      gb.wall ? (isGallbladderWallThickened(gb.wall) ? 'потовщена' : 'не потовщена') : '',
      `вміст ${abdomenOptionLabel('gallbladderContent', gb.content)}`,
    ]),
    stoneText,
    polypText,
  ].filter(Boolean).join('\n');
}

function generateCommonBileDuct(data) {
  const cbd = data.commonBileDuct;
  return sentence([
    'Холедох:',
    cbd.diameter ? `діаметр ${formatMm(cbd.diameter)}` : '',
    cbd.diameter ? (isCommonBileDuctDilated(cbd.diameter) ? 'розширений' : 'не розширений') : '',
    `просвіт ${abdomenOptionLabel('commonBileDuctLumen', cbd.lumen)}`,
  ]);
}

function generateLesionText(item, index) {
  return sentence([
    `${index + 1}. Утворення`,
    item.localization ? `локалізація: ${item.localization}` : '',
    formatDimensions(item.length, item.width) ? `розміром ${formatDimensions(item.length, item.width)}` : '',
    item.description,
  ]);
}

function generatePancreas(data) {
  const pancreas = data.pancreas;
  const dimensions = list([
    pancreas.head ? `головка ${formatMm(pancreas.head)}` : '',
    pancreas.body ? `тіло ${formatMm(pancreas.body)}` : '',
    pancreas.tail ? `хвіст ${formatMm(pancreas.tail)}` : '',
  ]);
  const lesions = pancreas.lesions.map(generateLesionText).join('\n');

  return [
    sentence([
      'Підшлункова залоза:',
      dimensions,
      `контури ${abdomenOptionLabel('contours', pancreas.contours)}`,
      `ехогенність ${abdomenOptionLabel('echogenicity', pancreas.echogenicity)}`,
      `структура ${abdomenOptionLabel('structure', pancreas.structure)}`,
    ]),
    sentence([
      pancreas.wirsung ? `Вірсунгова протока ${formatMm(pancreas.wirsung)}` : '',
      pancreas.wirsung ? (isPancreaticDuctDilated(pancreas.wirsung) ? 'розширена' : 'не розширена') : '',
      `парапанкреатична клітковина ${pancreas.peripancreaticTissue}`,
    ]),
    lesions,
  ].filter(Boolean).join('\n');
}

function generateSpleen(data) {
  const spleen = data.spleen;
  const lesions = spleen.lesions.map(generateLesionText).join('\n');
  return [
    sentence([
      'Селезінка:',
      formatDimensions(spleen.length, spleen.width) ? `розміри ${formatDimensions(spleen.length, spleen.width)}` : 'розміри без явного збільшення',
      isSpleenEnlarged(spleen) ? 'збільшена' : 'не збільшена',
      `ехогенність ${abdomenOptionLabel('echogenicity', spleen.echogenicity)}`,
      `структура ${abdomenOptionLabel('structure', spleen.structure)}`,
    ]),
    sentence([spleen.splenicVein ? `Селезінкова вена ${formatMm(spleen.splenicVein)}` : '']),
    lesions,
  ].filter(Boolean).join('\n');
}

function generateOther(data) {
  return [
    sentence([
      'Вільна рідина:',
      data.freeFluid.status === 'yes'
        ? `наявна${data.freeFluid.localization ? `, локалізація: ${data.freeFluid.localization}` : ''}`
        : 'не візуалізується',
    ]),
    sentence([
      'Лімфатичні вузли:',
      data.lymphNodes.status === 'yes'
        ? `збільшені${data.lymphNodes.size ? `, розміри ${data.lymphNodes.size}` : ''}${data.lymphNodes.localization ? `, локалізація: ${data.lymphNodes.localization}` : ''}`
        : 'не збільшені',
    ]),
    data.hollowOrgans.text ? sentence(['Порожнисті органи:', data.hollowOrgans.text]) : '',
  ].filter(Boolean).join('\n');
}

export function generateAbdomenOverview(data) {
  return [
    generateLiver(data),
    generateGallbladder(data),
    generateCommonBileDuct(data),
    generatePancreas(data),
    generateSpleen(data),
    generateOther(data),
  ].filter(Boolean).join('\n\n');
}
