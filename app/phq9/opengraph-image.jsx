import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Опитувальник PHQ-9 українською — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Клінічний опитувальник',
    title: 'PHQ-9 українською',
    description: 'Структурована скринінгова оцінка вираженості депресивних симптомів.',
  });
}
