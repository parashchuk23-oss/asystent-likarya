import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import H2fpefCalculator from '../../components/calculators/H2fpefCalculator';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('h2fpef');

export default function Page() {
  return <PrioritySeoToolPage toolId="h2fpef"><H2fpefCalculator /></PrioritySeoToolPage>;
}
