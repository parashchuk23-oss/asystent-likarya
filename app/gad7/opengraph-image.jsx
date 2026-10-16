import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Опитувальник GAD-7 українською — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Клінічний опитувальник',
    title: 'GAD-7 українською',
    description: 'Структурована скринінгова оцінка вираженості симптомів тривоги.',
  });
}
