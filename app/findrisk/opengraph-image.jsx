import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Калькулятор FINDRISC українською — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Оцінювання ризику',
    title: 'FINDRISC українською',
    description: 'Орієнтовна оцінка ризику розвитку цукрового діабету 2 типу.',
  });
}
