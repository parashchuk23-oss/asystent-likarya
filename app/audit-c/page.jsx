import PrioritySeoToolPage from '../../components/PrioritySeoToolPage';
import AuditCQuestionnaire from '../../components/questionnaires/AuditCQuestionnaire';
import { createPriorityToolMetadata } from '../../utils/prioritySeoTools';

export const metadata = createPriorityToolMetadata('audit-c');

export default function Page() {
  return <PrioritySeoToolPage toolId="audit-c"><AuditCQuestionnaire /></PrioritySeoToolPage>;
}
