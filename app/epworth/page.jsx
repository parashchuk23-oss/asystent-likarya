import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import EpworthQuestionnaire from '../../components/questionnaires/EpworthQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('epworth');

export default function Page() {
  return <PrioritySeoToolPage toolId="epworth"><EpworthQuestionnaire /></PrioritySeoToolPage>;
}
