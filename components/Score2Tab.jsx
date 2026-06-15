'use client';

import { useState } from 'react';
import { calculateScore2Risk } from '../utils/score2';
import FormField from './FormField';
import { inputClass } from './formStyles';

const initialRiskData = {
  diabetes: 'ні',
  establishedASCVD: 'ні',
  chronicKidneyDisease: 'ні',
  egfr: '',
  age: '',
  sex: '',
  smoking: 'ні',
  systolicBP: '',
  totalCholesterol: '',
  hdl: '',
  lipidsUnit: 'mmolL',
};

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-200 hover:bg-blue-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function SexCheckboxes({ value, onChange }) {
  return (
    <FormField label="Стать">
      <div className="grid gap-2 sm:grid-cols-2">
        <CheckboxField
          label="Чоловіча"
          checked={value === 'чоловік'}
          onChange={(checked) => onChange(checked ? 'чоловік' : '')}
        />

        <CheckboxField
          label="Жіноча"
          checked={value === 'жінка'}
          onChange={(checked) => onChange(checked ? 'жінка' : '')}
        />
      </div>
    </FormField>
  );
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function hasPositiveNumber(value) {
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
}

function hasRequiredStopFactors(data) {
  return hasValue(data.diabetes) && hasValue(data.establishedASCVD) && hasValue(data.chronicKidneyDisease);
}

function hasStopFactorResult(data) {
  const egfr = Number(String(data.egfr).replace(',', '.'));

  return (
    data.diabetes === 'так' ||
    data.establishedASCVD === 'так' ||
    data.chronicKidneyDisease === 'так' ||
    (Number.isFinite(egfr) && egfr > 0 && egfr < 60)
  );
}

function canCalculateRisk(data) {
  if (!hasRequiredStopFactors(data)) return false;
  if (hasStopFactorResult(data)) return true;

  return (
    hasPositiveNumber(data.age) &&
    hasValue(data.sex) &&
    hasValue(data.smoking) &&
    hasPositiveNumber(data.systolicBP) &&
    hasPositiveNumber(data.totalCholesterol) &&
    hasPositiveNumber(data.hdl)
  );
}

export default function Score2Tab() {
  const [riskData, setRiskData] = useState(initialRiskData);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const isCalculateEnabled = canCalculateRisk(riskData);
  const primaryButtonClass =
    'w-full rounded-md bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto';
  const secondaryButtonClass =
    'w-full rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:w-auto';

  function handleChange(field, value) {
    setRiskData((current) => ({
      ...current,
      [field]: value,
    }));
    setCalculatedResult(null);
  }

  function handleCalculate() {
    if (!isCalculateEnabled) return;
    setCalculatedResult(calculateScore2Risk(riskData));
  }

  function handleClear() {
    setRiskData(initialRiskData);
    setCalculatedResult(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,28rem)_minmax(0,28rem)]">
      <section className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 border-b border-blue-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">SCORE2 / SCORE2-OP</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950">Кардіоваскулярний ризик</h2>
        </div>

        <div className="space-y-3">
          <CheckboxField
            label="Цукровий діабет"
            checked={riskData.diabetes === 'так'}
            onChange={(checked) => handleChange('diabetes', checked ? 'так' : 'ні')}
          />

          <CheckboxField
            label="Встановлене атеросклеротичне захворювання"
            checked={riskData.establishedASCVD === 'так'}
            onChange={(checked) => handleChange('establishedASCVD', checked ? 'так' : 'ні')}
          />

          <CheckboxField
            label="Хронічна хвороба нирок"
            checked={riskData.chronicKidneyDisease === 'так'}
            onChange={(checked) => handleChange('chronicKidneyDisease', checked ? 'так' : 'ні')}
          />

          <FormField label="ШКФ" hint="якщо відома">
            <input
              type="number"
              value={riskData.egfr}
              onChange={(event) => handleChange('egfr', event.target.value)}
              className={inputClass}
              placeholder="75"
              min="1"
            />
          </FormField>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="space-y-4">
            <FormField label="Вік">
              <input
                type="number"
                value={riskData.age}
                onChange={(event) => handleChange('age', event.target.value)}
                className={inputClass}
                placeholder="55"
                min="1"
              />
            </FormField>

            <SexCheckboxes
              value={riskData.sex}
              onChange={(value) => handleChange('sex', value)}
            />

            <CheckboxField
              label="Куріння"
              checked={riskData.smoking === 'так'}
              onChange={(checked) => handleChange('smoking', checked ? 'так' : 'ні')}
            />

            <FormField label="Систолічний АТ" hint="мм рт.ст.">
              <input
                type="number"
                value={riskData.systolicBP}
                onChange={(event) => handleChange('systolicBP', event.target.value)}
                className={inputClass}
                placeholder="140"
                min="50"
              />
            </FormField>

            <FormField label="Загальний холестерин">
              <input
                type="number"
                value={riskData.totalCholesterol}
                onChange={(event) => handleChange('totalCholesterol', event.target.value)}
                className={inputClass}
                placeholder="5.2"
                min="0"
                step="0.1"
              />
            </FormField>

            <FormField label="ЛПВЩ">
              <input
                type="number"
                value={riskData.hdl}
                onChange={(event) => handleChange('hdl', event.target.value)}
                className={inputClass}
                placeholder="1.2"
                min="0"
                step="0.1"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!isCalculateEnabled}
            className={primaryButtonClass}
          >
            Розрахувати
          </button>

          <button type="button" onClick={handleClear} className={secondaryButtonClass}>
            Очистити
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 border-b border-blue-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Результат</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950">Заключення</h2>
        </div>

        {calculatedResult ? (
          <div className="space-y-3 text-sm leading-relaxed text-slate-900">
            {calculatedResult.riskPercent !== null && (
              <p>
                <span className="font-semibold">{calculatedResult.modelName || 'SCORE2'}:</span>{' '}
                {calculatedResult.riskPercent} %
              </p>
            )}

            <p>
              <span className="font-semibold">Кардіоваскулярний ризик:</span>{' '}
              {calculatedResult.interpretation}
            </p>

            <p>
              <span className="font-semibold">Причина:</span> {calculatedResult.reason}
            </p>

            {calculatedResult.ldlTarget && (
              <p>
                <span className="font-semibold">Ціль ЛПНЩ:</span> {calculatedResult.ldlTarget}
              </p>
            )}

            {calculatedResult.recommendations.length > 0 && (
              <div>
                <p className="font-semibold">Рекомендації:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  {calculatedResult.recommendations.map((recommendation) => (
                    <li key={recommendation}>{recommendation}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Заповніть дані та натисніть “Розрахувати”.</p>
        )}
      </section>
    </div>
  );
}
