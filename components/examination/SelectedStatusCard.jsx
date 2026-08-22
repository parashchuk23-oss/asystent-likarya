import AccordionSection from '../AccordionSection';
import { examinationStatusMap } from '../../data/examination/statusRegistry';
import GeneralStatusForm from './statuses/GeneralStatusForm';
import GynecologicalStatusForm from './statuses/GynecologicalStatusForm';
import NeurologicalStatusForm from './statuses/NeurologicalStatusForm';
import PediatricPreventiveStatusForm from './statuses/PediatricPreventiveStatusForm';

const statusForms = {
  general: GeneralStatusForm,
  gynecological: GynecologicalStatusForm,
  neurological: NeurologicalStatusForm,
  'pediatric-preventive': PediatricPreventiveStatusForm,
};

export default function SelectedStatusCard({
  statusId,
  isOpen,
  mode,
  formData,
  onToggle,
  onChange,
}) {
  const status = examinationStatusMap[statusId];
  const StatusForm = statusForms[statusId];

  if (!status || !StatusForm) return null;

  return (
    <AccordionSection
      id={`examination-${statusId}`}
      title={status.title}
      subtitle={status.description}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <StatusForm formData={formData} onChange={onChange} mode={mode} />
    </AccordionSection>
  );
}
