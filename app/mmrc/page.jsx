import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import MmrcQuestionnaire from '../../components/questionnaires/MmrcQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('mmrc');

export default function Page() {
  return <PrioritySeoToolPage toolId="mmrc"><MmrcQuestionnaire /></PrioritySeoToolPage>;
}
