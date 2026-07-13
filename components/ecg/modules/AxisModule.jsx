'use client';

import { useMemo, useState } from 'react';
import { calculateAxisByPolarity, getAxisNextSteps } from '../../../utils/ecg/axisCalculations';
import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';
import EcgResultCard from '../EcgResultCard';

function PolarityControl({ label, value, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-slate-700">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['positive', '+'],
          ['negative', '−'],
        ].map(([option, text]) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md border px-3 py-2 text-lg font-bold transition ${
              value === option
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AxisModule() {
  const [form, setForm] = useState({ leadI: '', leadII: '', leadIII: '', leadAvf: '' });
  const result = useMemo(() => calculateAxisByPolarity(form), [form]);
  const nextSteps = useMemo(() => getAxisNextSteps(result), [result]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <EcgModuleShell
      eyebrow="Електрична вісь"
      title="Орієнтовна оцінка електричної осі"
      description="Швидка оцінка за полярністю QRS у I та aVF. II і III можна заповнювати для самоперевірки, але базова інтерпретація MVP спирається на I та aVF."
    >
      <div className="grid gap-3 md:grid-cols-4">
        <PolarityControl label="QRS у I" value={form.leadI} onChange={(value) => update('leadI', value)} />
        <PolarityControl label="QRS у II" value={form.leadII} onChange={(value) => update('leadII', value)} />
        <PolarityControl label="QRS у III" value={form.leadIII} onChange={(value) => update('leadIII', value)} />
        <PolarityControl label="QRS у aVF" value={form.leadAvf} onChange={(value) => update('leadAvf', value)} />
      </div>

      {result ? (
        <div className="grid gap-3 md:grid-cols-2">
          <EcgResultCard title="Вісь" value={result.label} description={`Орієнтовний кут: ${result.angle}.`} tone="info" />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="font-bold text-slate-950">Типові причини</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {result.causes.map((cause) => (
                <li key={cause}>{cause}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Оберіть полярність QRS у I та aVF, щоб отримати орієнтовну вісь.
        </p>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-bold text-slate-950">Наступний клінічний крок</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
