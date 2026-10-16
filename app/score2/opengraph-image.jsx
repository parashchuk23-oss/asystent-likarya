import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Калькулятор SCORE2 та SCORE2-OP — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Оцінювання ризику',
    title: 'SCORE2 та SCORE2-OP',
    description: 'Оцінка 10-річного ризику серцево-судинних подій для первинної профілактики.',
  });
}
