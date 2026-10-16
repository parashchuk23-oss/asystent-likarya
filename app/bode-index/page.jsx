import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import BodeIndexQuestionnaire from '../../components/questionnaires/BodeIndexQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('bode-index');

export default function Page() {
  return <PrioritySeoToolPage toolId="bode-index"><BodeIndexQuestionnaire /></PrioritySeoToolPage>;
}
