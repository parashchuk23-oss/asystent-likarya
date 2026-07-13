'use client';

import { useMemo, useState } from 'react';
import { calculateQtMetrics, getQtClinicalNextSteps } from '../../../utils/ecg/qtCalculations';
import { inputClass } from '../../formStyles';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';
import EcgResultCard from '../EcgResultCard';

const qtRiskFactors = [
  'препарати, що подовжують QT',
  'гіпокаліємія / гіпомагніємія / гіпокальціємія',
  'брадикардія',
  'вроджені синдроми подовженого QT',
  'гостра ішемія або структурне захворювання серця',
  'ниркова або печінкова дисфункція з накопиченням препаратів',
];

export default function QtQtcModule() {
  const [form, setForm] = useState({ qt: '', rr: '', heartRate: '', sex: 'male' });
  const metrics = useMemo(() => calculateQtMetrics(form), [form]);
  const nextSteps = useMemo(() => getQtClinicalNextSteps(metrics), [metrics]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <EcgModuleShell
      eyebrow="Інтервали"
      title="QT / QTc"
      description="Введіть QT та RR або ЧСС. Формули показуються поруч, щоб лікар міг обрати доречну для клінічної ситуації."
    >
      <div className="grid gap-3 md:grid-cols-4">
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">QT, мс</span>
          <input type="number" value={form.qt} onChange={(event) => update('qt', event.target.value)} className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">RR</span>
          <input value={form.rr} onChange={(event) => update('rr', event.target.value)} placeholder="с або мс" className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">ЧСС</span>
          <input type="number" value={form.heartRate} onChange={(event) => update('heartRate', event.target.value)} className={inputClass} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Стать</span>
          <select value={form.sex} onChange={(event) => update('sex', event.target.value)} className={inputClass}>
            <option value="male">чоловік</option>
            <option value="female">жінка</option>
          </select>
        </label>
      </div>

      {metrics ? (
        <>
          <div className="grid gap-3 md:grid-cols-5">
            <EcgResultCard title="QT" value={`${metrics.qt} мс`} />
            <EcgResultCard title="Bazett" value={`${metrics.qtcBazett} мс`} />
            <EcgResultCard title="Fridericia" value={`${metrics.qtcFridericia} мс`} tone="info" />
            <EcgResultCard title="Framingham" value={`${metrics.qtcFramingham} мс`} />
            <EcgResultCard title="Hodges" value={`${metrics.qtcHodges} мс`} />
          </div>

          <EcgResultCard
            title="Інтерпретація"
            value={metrics.interpretation.label}
            description={metrics.interpretation.text}
            tone={metrics.interpretation.tone}
          />
        </>
      ) : (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Введіть QT і RR або QT і ЧСС, щоб отримати QTc.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Фактори, що можуть подовжувати QT</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {qtRiskFactors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-bold text-slate-950">Наступний клінічний крок</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </div>

      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
