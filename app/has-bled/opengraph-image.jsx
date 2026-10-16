import {
  createPriorityToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createPriorityToolOpenGraphImage';

export const alt = 'has-bled — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createPriorityToolOpenGraphImage('has-bled');
}
