import AccordionSection from '../AccordionSection';
import { examinationStatusMap } from '../../data/examination/statusRegistry';
import GeneralStatusForm from './statuses/GeneralStatusForm';
import CardiovascularStatusForm from './statuses/CardiovascularStatusForm';
import RespiratoryStatusForm from './statuses/RespiratoryStatusForm';
import NeurologicalStatusForm from './statuses/NeurologicalStatusForm';
import CustomStatusForm from './statuses/CustomStatusForm';

const statusForms = {
  general: GeneralStatusForm,
  cardiovascular: CardiovascularStatusForm,
  respiratory: RespiratoryStatusForm,
  neurological: NeurologicalStatusForm,
  custom: CustomStatusForm,
};

export default function SelectedStatusCard({
  statusId,
  index,
  total,
  isOpen,
  mode,
  formData,
  onToggle,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
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
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => onRemove(statusId)}
          className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
        >
          Видалити
        </button>
      </div>

      <StatusForm formData={formData} onChange={onChange} mode={mode} />
    </AccordionSection>
  );
}
