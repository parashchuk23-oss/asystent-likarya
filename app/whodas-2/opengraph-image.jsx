import {
  createPriorityToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createPriorityToolOpenGraphImage';

export const alt = 'whodas-2 — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createPriorityToolOpenGraphImage('whodas-2');
}
