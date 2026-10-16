import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import BarthelIndexQuestionnaire from '../../components/questionnaires/BarthelIndexQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('barthel-index');

export default function Page() {
  return <PrioritySeoToolPage toolId="barthel-index"><BarthelIndexQuestionnaire /></PrioritySeoToolPage>;
}
