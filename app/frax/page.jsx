import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import FraxCalculator from '../../components/calculators/FraxCalculator';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('frax');

export default function Page() {
  return <PrioritySeoToolPage toolId="frax"><FraxCalculator /></PrioritySeoToolPage>;
}
