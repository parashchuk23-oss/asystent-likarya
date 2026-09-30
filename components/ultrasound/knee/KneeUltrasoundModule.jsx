'use client';

import { useEffect, useMemo, useState } from 'react';
import UltrasoundComplaintsField from '../UltrasoundComplaintsField';
import { SelectField, TextField } from '../abdomen/AbdomenFormControls';
import KneeJointForm from './KneeJointForm';
import KneeReportPreview from './KneeReportPreview';
import { createInitialKneeData, kneeSelectOptions } from '../../../data/ultrasound/kneeProtocol';
import { addComplaintsToOverview } from '../../../utils/ultrasound/reportComplaints';
import { generateKneeConclusion, generateKneeOverview, generateKneeRecommendations } from '../../../utils/ultrasound/knee/kneeReportGenerator';

function buildReport(data) {
  return {
    overview: addComplaintsToOverview(generateKneeOverview(data), data.complaints),
    conclusion: generateKneeConclusion(data),
    recommendations: generateKneeRecommendations(data),
  };
}

export default function KneeUltrasoundModule() {
  const [data, setData] = useState(createInitialKneeData);
  const [activeSide, setActiveSide] = useState('right');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildReport(data), [data]);
  const [report, setReport] = useState(generatedReport);

  useEffect(() => {
    if (autoUpdate) setReport(generatedReport);
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const updateJointMode = (jointMode) => {
    updateData('jointMode', jointMode);
    if (jointMode !== 'bilateral') setActiveSide(jointMode);
  };
  const regenerate = () => setReport(generatedReport);
  const reset = () => {
    const normal = createInitialKneeData();
    setData(normal);
    setActiveSide('right');
    setReport(buildReport(normal));
    setAutoUpdate(true);
  };

  const visibleSides = data.jointMode === 'bilateral' ? ['right', 'left'] : [data.jointMode];
  const currentSide = visibleSides.includes(activeSide) ? activeSide : visibleSides[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <UltrasoundComplaintsField value={data.complaints} onChange={(value) => updateData('complaints', value)} />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД колінного суглоба</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">Структурований огляд переднього, медіального, латерального, заднього та центрального доступів.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={reset} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Заповнити як норму</button>
              <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">Сформувати протокол</button>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <TextField label="Апарат" value={data.apparatus} onChange={(value) => updateData('apparatus', value)} placeholder="Введіть модель апарата" />
            <SelectField label="Дослідження" value={data.jointMode} onChange={updateJointMode} options={kneeSelectOptions.jointMode} />
            <SelectField label="Якість візуалізації" value={data.visualization} onChange={(value) => updateData('visualization', value)} options={kneeSelectOptions.visualization} />
            {data.visualization === 'limited' ? <TextField label="Причина погіршення візуалізації" value={data.visualizationReason} onChange={(value) => updateData('visualizationReason', value)} placeholder="Наприклад: виражена підшкірна жирова клітковина" /> : null}
          </div>
        </div>

        {data.jointMode === 'bilateral' ? (
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2" role="tablist" aria-label="Сторона дослідження">
                {[['right', 'Правий суглоб'], ['left', 'Лівий суглоб']].map(([side, label]) => (
                  <button key={side} type="button" role="tab" aria-selected={currentSide === side} onClick={() => setActiveSide(side)} className={`rounded-md border px-4 py-2 text-sm font-semibold ${currentSide === side ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>{label}</button>
                ))}
              </div>
              <button type="button" onClick={() => setData((current) => ({ ...current, left: structuredClone(current.right) }))} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">Копіювати правий у лівий</button>
            </div>
          </div>
        ) : null}

        <KneeJointForm sideLabel={currentSide === 'right' ? 'Правий колінний суглоб' : 'Лівий колінний суглоб'} value={data[currentSide]} onChange={(value) => updateData(currentSide, value)} />

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
          УЗД має обмеження для оцінки внутрішніх відділів менісків і хрестоподібних зв’язок. Модуль формує чернетку; остаточний опис і висновок перевіряє лікар УЗД.
        </div>
      </div>

      <KneeReportPreview
        overview={report.overview}
        conclusion={report.conclusion}
        recommendations={report.recommendations}
        onOverviewChange={(value) => { setAutoUpdate(false); setReport((current) => ({ ...current, overview: value })); }}
        onConclusionChange={(value) => { setAutoUpdate(false); setReport((current) => ({ ...current, conclusion: value })); }}
        onRecommendationsChange={(value) => { setAutoUpdate(false); setReport((current) => ({ ...current, recommendations: value })); }}
        autoUpdate={autoUpdate}
        onAutoUpdateChange={setAutoUpdate}
        onRegenerate={regenerate}
        onClear={reset}
      />
    </div>
  );
}
