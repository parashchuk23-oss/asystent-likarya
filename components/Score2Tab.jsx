'use client';

import { useState } from 'react';
import { calculateScore2Risk } from '../utils/score2';
import FormField from './FormField';
import { inputClass } from './formStyles';

const initialRiskData = {
  patientScenario: 'primary',
  diabetes: 'ні',
  establishedASCVD: 'ні',
  chronicKidneyDisease: 'ні',
  egfr: '',
  acr: '',
  diabetesDiagnosisAge: '',
  hba1c: '',
  hba1cUnit: 'percent',
  smartDiabetes: 'ні',
  smartCoronaryDisease: 'так',
  smartCerebrovascularDisease: 'ні',
  smartPeripheralArteryDisease: 'ні',
  smartAbdominalAorticAneurysm: 'ні',
  yearsSinceFirstEvent: '',
  hsCrp: '',
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

function ScenarioCard({ title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-3 text-left transition ${
        active
          ? 'border-blue-300 bg-blue-50 shadow-sm shadow-blue-100'
          : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50'
      }`}
    >
      <span className="block text-sm font-semibold text-slate-950">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span>
    </button>
  );
}

function DiabetesDetailsDropdown({ riskData, onChange }) {
  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/70 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Дані для SCORE2-Diabetes</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Вік встановлення ЦД">
          <input
            type="number"
            value={riskData.diabetesDiagnosisAge}
            onChange={(event) => onChange('diabetesDiagnosisAge', event.target.value)}
            className={inputClass}
            placeholder="50"
            min="1"
          />
        </FormField>

        <FormField label="ШКФ" hint="мл/хв/1,73 м²">
          <input
            type="number"
            value={riskData.egfr}
            onChange={(event) => onChange('egfr', event.target.value)}
            className={inputClass}
            placeholder="75"
            min="1"
          />
        </FormField>

        <FormField label="HbA1c">
          <input
            type="number"
            value={riskData.hba1c}
            onChange={(event) => onChange('hba1c', event.target.value)}
            className={inputClass}
            placeholder="7.0"
            min="1"
            step="0.1"
          />
        </FormField>

        <FormField label="Одиниці HbA1c">
          <select
            value={riskData.hba1cUnit}
            onChange={(event) => onChange('hba1cUnit', event.target.value)}
            className={inputClass}
          >
            <option value="percent">%</option>
            <option value="mmolMol">ммоль/моль</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}

function SecondaryPreventionDropdown({ riskData, onChange }) {
  return (
    <div className="rounded-md border border-blue-100 bg-blue-50/70 p-3 text-sm leading-6 text-slate-700">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
        Вторинна профілактика / SMART
      </p>
      <p className="mt-2">
        При встановленому атеросклеротичному ССЗ SCORE2 не застосовується. Нижче можна розрахувати
        орієнтовний 10-річний залишковий ризик за SMART Risk Score.
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <CheckboxField
          label="Цукровий діабет"
          checked={riskData.smartDiabetes === 'так'}
          onChange={(checked) => onChange('smartDiabetes', checked ? 'так' : 'ні')}
        />

        <FormField label="Років від першої СС-події">
          <input
            type="number"
            value={riskData.yearsSinceFirstEvent}
            onChange={(event) => onChange('yearsSinceFirstEvent', event.target.value)}
            className={inputClass}
            placeholder="5"
            min="0"
            step="0.1"
          />
        </FormField>

        <FormField label="ШКФ" hint="мл/хв/1,73 м²">
          <input
            type="number"
            value={riskData.egfr}
            onChange={(event) => onChange('egfr', event.target.value)}
            className={inputClass}
            placeholder="75"
            min="1"
          />
        </FormField>

        <FormField label="hsCRP" hint="мг/л">
          <input
            type="number"
            value={riskData.hsCrp}
            onChange={(event) => onChange('hsCrp', event.target.value)}
            className={inputClass}
            placeholder="2"
            min="0.1"
            step="0.1"
          />
        </FormField>
      </div>

      <div className="mt-3 rounded-md border border-white bg-white/75 p-3">
        <p className="mb-2 font-semibold text-slate-900">Тип встановленого ССЗ</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <CheckboxField
            label="ІХС / коронарне захворювання"
            checked={riskData.smartCoronaryDisease === 'так'}
            onChange={(checked) => onChange('smartCoronaryDisease', checked ? 'так' : 'ні')}
          />

          <CheckboxField
            label="Інсульт / ТІА"
            checked={riskData.smartCerebrovascularDisease === 'так'}
            onChange={(checked) => onChange('smartCerebrovascularDisease', checked ? 'так' : 'ні')}
          />

          <CheckboxField
            label="Периферичний атеросклероз"
            checked={riskData.smartPeripheralArteryDisease === 'так'}
            onChange={(checked) => onChange('smartPeripheralArteryDisease', checked ? 'так' : 'ні')}
          />

          <CheckboxField
            label="Аневризма черевної аорти"
            checked={riskData.smartAbdominalAorticAneurysm === 'так'}
            onChange={(checked) => onChange('smartAbdominalAorticAneurysm', checked ? 'так' : 'ні')}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href="https://www.escardio.org/Education/ESC-Prevention-of-CVD-Programme/Risk-assessment/SMART-Risk-Score"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
        >
          Відкрити SMART Risk Score
        </a>

        <a
          href="https://u-prevent.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Відкрити U-Prevent
        </a>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        SMART2 поки залишено як зовнішній інструмент через U-Prevent; локально реалізовано оригінальний SMART Risk
        Score.
      </p>
    </div>
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

function hasCkdData(data) {
  return data.chronicKidneyDisease === 'так' && (hasPositiveNumber(data.egfr) || hasPositiveNumber(data.acr));
}

function canCalculateRisk(data) {
  if (data.patientScenario === 'diabetes' || data.patientScenario === 'establishedASCVD') return true;
  if (hasCkdData(data)) return true;

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

  function handleScenarioChange(patientScenario) {
    setRiskData((current) => ({
      ...current,
      patientScenario,
      diabetes: patientScenario === 'diabetes' ? 'так' : 'ні',
      establishedASCVD: patientScenario === 'establishedASCVD' ? 'так' : 'ні',
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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)]">
      <section className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 border-b border-blue-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">SCORE2 / SCORE2-OP</p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950">Кардіоваскулярний ризик</h2>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">Клінічний сценарій</p>
            <div className="grid gap-2">
              <ScenarioCard
                title="Первинна профілактика"
                description="Немає встановленого атеросклеротичного ССЗ або ЦД."
                active={riskData.patientScenario === 'primary'}
                onClick={() => handleScenarioChange('primary')}
              />

              <ScenarioCard
                title="Цукровий діабет 2 типу"
                description="SCORE2-Diabetes для пацієнтів 40-69 років без встановленого ССЗ."
                active={riskData.patientScenario === 'diabetes'}
                onClick={() => handleScenarioChange('diabetes')}
              />

              {riskData.patientScenario === 'diabetes' && (
                <DiabetesDetailsDropdown riskData={riskData} onChange={handleChange} />
              )}

              <ScenarioCard
                title="Встановлене ССЗ"
                description="ІХС, інфаркт, інсульт, ТІА або атеросклероз периферичних артерій."
                active={riskData.patientScenario === 'establishedASCVD'}
                onClick={() => handleScenarioChange('establishedASCVD')}
              />

              {riskData.patientScenario === 'establishedASCVD' && (
                <SecondaryPreventionDropdown riskData={riskData} onChange={handleChange} />
              )}
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <CheckboxField
              label="Є ХХН / відома знижена ШКФ або альбумінурія"
              checked={riskData.chronicKidneyDisease === 'так'}
              onChange={(checked) => handleChange('chronicKidneyDisease', checked ? 'так' : 'ні')}
            />

            {riskData.chronicKidneyDisease === 'так' && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {riskData.patientScenario === 'primary' && (
                  <FormField label="ШКФ" hint="мл/хв/1,73 м²">
                    <input
                      type="number"
                      value={riskData.egfr}
                      onChange={(event) => handleChange('egfr', event.target.value)}
                      className={inputClass}
                      placeholder="75"
                      min="1"
                    />
                  </FormField>
                )}

                <FormField label="ACR" hint="мг/г">
                  <input
                    type="number"
                    value={riskData.acr}
                    onChange={(event) => handleChange('acr', event.target.value)}
                    className={inputClass}
                    placeholder="20"
                    min="0"
                    step="0.1"
                  />
                </FormField>
              </div>
            )}
          </div>
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

            {calculatedResult.missing?.length > 0 && (
              <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-slate-700">
                <span className="font-semibold">Що ще заповнити:</span> {calculatedResult.missing.join(', ')}.
              </p>
            )}

            {calculatedResult.ckdModifier && (
              <div className="rounded-md border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-slate-800">
                <p className="font-semibold text-teal-800">ХХН / ACR як модифікатор ризику</p>
                <p className="mt-1">{calculatedResult.ckdModifier.reason}</p>
                {calculatedResult.ckdModifier.details.length > 0 && (
                  <p className="mt-1 text-slate-600">{calculatedResult.ckdModifier.details.join(', ')}.</p>
                )}
              </div>
            )}

            {calculatedResult.ldlTarget && (
              <p>
                <span className="font-semibold">Ціль ЛПНЩ:</span> {calculatedResult.ldlTarget}
              </p>
            )}

            {calculatedResult.recommendations.length > 0 && (
              <div>
                <p className="font-semibold">Рекомендації:</p>
                {calculatedResult.patientInfo && (
                  <p className="mt-2 rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm leading-6 text-slate-700">
                    {calculatedResult.patientInfo}
                  </p>
                )}

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
