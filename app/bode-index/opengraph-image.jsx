import {
  createPriorityToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createPriorityToolOpenGraphImage';

export const alt = 'bode-index — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createPriorityToolOpenGraphImage('bode-index');
}
