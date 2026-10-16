import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from '../../utils/createToolOpenGraphImage';

export const alt = 'Калькулятор ШКФ за CKD-EPI 2021 — Асистент лікаря';
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function Image() {
  return createToolOpenGraphImage({
    eyebrow: 'Клінічний калькулятор',
    title: 'Калькулятор ШКФ',
    description: 'CKD-EPI 2021, Cockcroft–Gault, ACR і оцінка ризику за KDIGO.',
  });
}
