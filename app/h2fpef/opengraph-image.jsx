import {
  createPriorityToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createPriorityToolOpenGraphImage';

export const alt = 'h2fpef — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createPriorityToolOpenGraphImage('h2fpef');
}
