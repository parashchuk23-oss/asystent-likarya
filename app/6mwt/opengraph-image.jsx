import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = '6-хвилинний тест ходьби — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Функціональне оцінювання',
    title: '6-хвилинний тест ходьби',
    description: 'Таймер, розрахунок дистанції та структурований протокол 6MWT для друку.',
  });
}
