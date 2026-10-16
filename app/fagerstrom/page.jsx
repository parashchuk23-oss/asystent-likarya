import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import FagerstromQuestionnaire from '../../components/questionnaires/FagerstromQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('fagerstrom');

export default function Page() {
  return <PrioritySeoToolPage toolId="fagerstrom"><FagerstromQuestionnaire /></PrioritySeoToolPage>;
}
