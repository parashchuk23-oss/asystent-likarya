import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import StopBangQuestionnaire from '../../components/questionnaires/StopBangQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('stop-bang');

export default function Page() {
  return <PrioritySeoToolPage toolId="stop-bang"><StopBangQuestionnaire /></PrioritySeoToolPage>;
}
