import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import HasBledCalculator from '../../components/calculators/HasBledCalculator';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('has-bled');

export default function Page() {
  return <PrioritySeoToolPage toolId="has-bled"><HasBledCalculator /></PrioritySeoToolPage>;
}
