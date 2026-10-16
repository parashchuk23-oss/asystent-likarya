import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import ChestPainHeartCalculator from '../../components/calculators/ChestPainHeartCalculator';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('heart-score');

export default function Page() {
  return <PrioritySeoToolPage toolId="heart-score"><ChestPainHeartCalculator /></PrioritySeoToolPage>;
}
