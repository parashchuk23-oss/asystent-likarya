import AccordionSection from '../AccordionSection';
import { examinationStatusMap } from '../../data/examination/statusRegistry';
import GeneralStatusForm from './statuses/GeneralStatusForm';
import CardiovascularStatusForm from './statuses/CardiovascularStatusForm';
import RespiratoryStatusForm from './statuses/RespiratoryStatusForm';
import CustomStatusForm from './statuses/CustomStatusForm';

const statusForms = {
  general: GeneralStatusForm,
  cardiovascular: CardiovascularStatusForm,
  respiratory: RespiratoryStatusForm,
  custom: CustomStatusForm,
};

export default function SelectedStatusCard({
  statusId,
  index,
  total,
  isOpen,
  mode,
  statusText,
  formData,
  onToggle,
  onChange,
  onModeChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onFillNormal,
  onClearStatus,
}) {
  const status = examinationStatusMap[statusId];
  const StatusForm = statusForms[statusId];

  if (!status || !StatusForm) return null;

  async function handleCopyStatus() {
    if (!statusText || typeof navigator === 'undefined' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(statusText);
  }

  return (
    <AccordionSection
      id={`examination-${statusId}`}
      title={status.title}
      subtitle={status.description}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-2 text-xs font-semibold ${
              statusText
                ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-100'
                : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
            }`}
          >
            {statusText ? 'Заповнено' : 'Порожньо'}
          </span>

          {status.modes.length > 1 ? (
            <select
              value={mode}
              onChange={(event) => onModeChange(statusId, event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-100/60 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {status.modes.map((modeOption) => (
                <option key={modeOption} value={modeOption}>
                  {modeOption === 'short' ? 'Коротко' : modeOption === 'expanded' ? 'Розширено' : 'Стандартно'}
                </option>
              ))}
            </select>
          ) : null}

          {statusId !== 'custom' ? (
            <button
              type="button"
              onClick={() => onFillNormal(statusId)}
              className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
            >
              Заповнити норму
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCopyStatus}
            disabled={!statusText}
            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Копіювати статус
          </button>

          <button
            type="button"
            onClick={() => onClearStatus(statusId)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
          >
            Очистити статус
          </button>
        </div>

        <div className="flex gap-2">
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
      </div>

      <StatusForm formData={formData} onChange={onChange} mode={mode} />
    </AccordionSection>
  );
}
