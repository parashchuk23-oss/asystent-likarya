import {
  createToolOpenGraphImage,
  openGraphImageContentType,
  openGraphImageSize,
} from './createToolOpenGraphImage';
import { prioritySeoTools } from './prioritySeoTools';

export { openGraphImageContentType, openGraphImageSize };

export function createPriorityToolOpenGraphImage(toolId) {
  const tool = prioritySeoTools[toolId];
  return createToolOpenGraphImage({
    eyebrow: 'Клінічний інструмент',
    title: tool.shortTitle,
    description: tool.description,
  });
}
