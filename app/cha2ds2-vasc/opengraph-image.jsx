import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Калькулятор CHA₂DS₂-VASc — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Клінічний калькулятор',
    title: 'CHA₂DS₂-VASc',
    description: 'Оцінка ризику інсульту при фібриляції передсердь.',
  });
}
