import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import Whodas36Questionnaire from '../../components/questionnaires/Whodas36Questionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('whodas-2');

export default function Page() {
  return <PrioritySeoToolPage toolId="whodas-2"><Whodas36Questionnaire /></PrioritySeoToolPage>;
}
