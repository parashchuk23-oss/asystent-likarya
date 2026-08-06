'use client';

import { useState } from 'react';
import { defaultExaminationData } from '../../data/examination/defaultExaminationData';
import { examinationStatusMap } from '../../data/examination/statusRegistry';
import { buildExaminationText, calculateBmi } from '../../utils/examination/buildExaminationText';
import PresetBar from './PresetBar';
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

export default function ExaminationBuilder() {
  const [selectedStatuses, setSelectedStatuses] = useState(defaultSelectedStatuses);
  const [statusModes, setStatusModes] = useState(getInitialModes(defaultSelectedStatuses));
  const [openStatus, setOpenStatus] = useState('general');
  const [formData, setFormData] = useState(defaultExaminationData);

  function handleChange(field, value) {
    setFormData((current) => {
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

  function handleAddStatus(statusId) {
    if (!examinationStatusMap[statusId]) return;

    setSelectedStatuses((current) => {
      if (current.includes(statusId)) return current;
      return [...current, statusId];
    });

    setStatusModes((current) => ({
      ...current,
      [statusId]: examinationStatusMap[statusId]?.defaultMode || 'standard',
    }));

    setOpenStatus(statusId);
  }

  function handleApplyPreset(preset) {
    setSelectedStatuses(preset.statusIds);
    setStatusModes(getInitialModes(preset.statusIds));
    setOpenStatus(preset.statusIds[0] || null);
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

    setFormData((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field] = defaultExaminationData[field] ?? '';
      });
      return next;
    });
  }

  function handleClearStatus(statusId) {
    const fields = statusFieldMap[statusId] || [];

    setFormData((current) => {
      const next = { ...current };
      fields.forEach((field) => {
        next[field] = field === 'customTitle' ? 'Додатковий статус' : '';
      });
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Конструктор огляду</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Огляд пацієнта</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Оберіть потрібні клінічні статуси та сформуйте структурований опис огляду.
        </p>
      </section>

      <PresetBar onApplyPreset={handleApplyPreset} />
      <StatusPicker selectedStatuses={selectedStatuses} onAddStatus={handleAddStatus} />

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
    </div>
  );
}
