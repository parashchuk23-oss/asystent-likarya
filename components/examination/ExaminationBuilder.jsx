'use client';

import { useEffect, useMemo, useState } from 'react';
import { defaultExaminationData } from '../../data/examination/defaultExaminationData';
import { examinationStatusMap } from '../../data/examination/statusRegistry';
import { buildExaminationText, calculateBmi } from '../../utils/examination/buildExaminationText';
import FormField from '../FormField';
import { textareaClass } from '../formStyles';
import SelectedStatusCard from './SelectedStatusCard';
import StatusPicker from './StatusPicker';

const defaultSelectedStatuses = ['general', 'cardiovascular', 'respiratory'];

const statusFieldMap = {
  general: [
    'generalCondition',
    'generalConditionNote',
    'skinCondition',
    'bodyType',
    'lymphNodes',
    'thyroid',
    'oralCavity',
    'height',
    'weight',
    'bmi',
    'abdomen',
    'defecation',
    'urination',
    'cvsSymptom',
  ],
  cardiovascular: ['bloodPressure', 'heartRate', 'heartAuscultation', 'edema'],
  respiratory: ['lungAuscultation'],
  neurological: [
    'neuroConsciousness',
    'neuroOrientation',
    'neuroSpeech',
    'neuroPupils',
    'neuroCranialNerves',
    'neuroMotorStrength',
    'neuroSensory',
    'neuroCoordination',
    'neuroMeningealSigns',
    'neuroPathologicalReflexes',
    'neuroGait',
  ],
  custom: ['customTitle', 'customText'],
};

function getInitialModes(statusIds) {
  return Object.fromEntries(
    statusIds.map((statusId) => [
      statusId,
      examinationStatusMap[statusId]?.defaultMode || 'standard',
    ]),
  );
}

function reorderItems(items, fromIndex, toIndex) {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export default function ExaminationBuilder({
  formData: controlledFormData,
  onChange: controlledOnChange,
  onObjectiveTextChange,
  showIntro = true,
}) {
  const [selectedStatuses, setSelectedStatuses] = useState(defaultSelectedStatuses);
  const [statusModes, setStatusModes] = useState(getInitialModes(defaultSelectedStatuses));
  const [openStatus, setOpenStatus] = useState('general');
  const [internalFormData, setInternalFormData] = useState(defaultExaminationData);
  const [finalStatusText, setFinalStatusText] = useState('');
  const formData = controlledFormData || internalFormData;

  const objectiveText = useMemo(
    () => buildExaminationText(selectedStatuses, formData, statusModes),
    [selectedStatuses, formData, statusModes],
  );

  useEffect(() => {
    setFinalStatusText(objectiveText);
    onObjectiveTextChange?.(objectiveText);
  }, [objectiveText, onObjectiveTextChange]);

  function handleFinalStatusTextChange(value) {
    setFinalStatusText(value);
    onObjectiveTextChange?.(value);
  }

  function handleChange(field, value) {
    if (controlledOnChange) {
      controlledOnChange(field, value);

      if (field === 'height' || field === 'weight') {
        const next = {
          ...formData,
          [field]: value,
        };
        controlledOnChange('bmi', calculateBmi(next.height, next.weight));
      }

      return;
    }

    setInternalFormData((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === 'height' || field === 'weight') {
        next.bmi = calculateBmi(next.height, next.weight);
      }

      return next;
    });
  }

  function handleToggleStatus(statusId) {
    if (!examinationStatusMap[statusId]) return;

    setSelectedStatuses((current) => {
      if (current.includes(statusId)) {
        return current.filter((item) => item !== statusId);
      }
      return [...current, statusId];
    });

    setStatusModes((current) => ({
      ...current,
      [statusId]: examinationStatusMap[statusId]?.defaultMode || 'standard',
    }));

    setOpenStatus((current) => (current === statusId ? null : statusId));
  }

  function handleRemoveStatus(statusId) {
    setSelectedStatuses((current) => current.filter((item) => item !== statusId));
    setOpenStatus((current) => (current === statusId ? null : current));
  }

  function handleMoveStatus(fromIndex, direction) {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= selectedStatuses.length) return;

    setSelectedStatuses((current) => reorderItems(current, fromIndex, toIndex));
  }

  function handleModeChange(statusId, mode) {
    setStatusModes((current) => ({
      ...current,
      [statusId]: mode,
    }));
  }

  function handleFillNormal(statusId) {
    const fields = statusFieldMap[statusId] || [];

    if (controlledOnChange) {
      fields.forEach((field) => {
        controlledOnChange(field, defaultExaminationData[field] ?? '');
      });
      return;
    }

    setInternalFormData((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field] = defaultExaminationData[field] ?? '';
      });
      return next;
    });
  }

  function handleClearStatus(statusId) {
    const fields = statusFieldMap[statusId] || [];

    if (controlledOnChange) {
      fields.forEach((field) => {
        controlledOnChange(field, field === 'customTitle' ? 'Додатковий статус' : '');
      });
      return;
    }

    setInternalFormData((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field] = field === 'customTitle' ? 'Додатковий статус' : '';
      });
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {showIntro ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Конструктор огляду</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Огляд пацієнта</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Оберіть потрібні клінічні статуси та сформуйте структурований опис огляду.
          </p>
        </section>
      ) : null}

      <StatusPicker selectedStatuses={selectedStatuses} onToggleStatus={handleToggleStatus} />

      <div className="space-y-3">
        {selectedStatuses.length ? (
          selectedStatuses.map((statusId, index) => (
            <SelectedStatusCard
              key={statusId}
              statusId={statusId}
              index={index}
              total={selectedStatuses.length}
              isOpen={openStatus === statusId}
              mode={statusModes[statusId] || 'standard'}
              statusText={buildExaminationText([statusId], formData, {
                [statusId]: statusModes[statusId] || 'standard',
              })}
              formData={formData}
              onToggle={() => setOpenStatus(openStatus === statusId ? null : statusId)}
              onChange={handleChange}
              onModeChange={handleModeChange}
              onRemove={handleRemoveStatus}
              onMoveUp={(currentIndex) => handleMoveStatus(currentIndex, 'up')}
              onMoveDown={(currentIndex) => handleMoveStatus(currentIndex, 'down')}
              onFillNormal={handleFillNormal}
              onClearStatus={handleClearStatus}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">Статуси ще не обрані.</p>
            <p className="mt-1 text-sm text-slate-500">Оберіть статус вище або використайте швидкий набір.</p>
          </div>
        )}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
        <FormField label="Текст статусу">
          <textarea
            value={finalStatusText}
            onChange={(event) => handleFinalStatusTextChange(event.target.value)}
            placeholder="Поле автоматично заповнюється після вибору статусів. За потреби лікар може відредагувати текст вручну."
            rows={7}
            className={textareaClass}
          />
        </FormField>
      </section>
    </div>
  );
}
