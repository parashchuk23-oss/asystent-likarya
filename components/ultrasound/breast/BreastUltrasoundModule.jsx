'use client';

import { useEffect, useMemo, useState } from 'react';
import AccordionSection from '../../AccordionSection';
import { inputClass, textareaClass } from '../../formStyles';
import { buildBreastReport, getBreastBirads, getBiradsText } from '../../../utils/ultrasound/breast/breastReportGenerator';
import BreastReportPreview from './BreastReportPreview';
import UltrasoundComplaintsField from '../UltrasoundComplaintsField';

const selectOptions = {
  indication: [
    { value: 'screening', label: 'профілактичний огляд' },
    { value: 'pain', label: 'масталгія' },
    { value: 'palpableMass', label: 'пальпаторне ущільнення' },
    { value: 'discharge', label: 'виділення із соска' },
    { value: 'followUp', label: 'контроль у динаміці' },
    { value: 'postoperative', label: 'післяопераційний контроль' },
  ],
  menstrualStatus: [
    { value: 'notSpecified', label: 'не вказано' },
    { value: 'reproductive', label: 'репродуктивний період' },
    { value: 'menopause', label: 'менопауза' },
    { value: 'lactation', label: 'лактація' },
  ],
  tissuePattern: [
    { value: 'fibroglandular', label: 'фіброгландулярна тканина' },
    { value: 'fatty', label: 'переважно жирова інволюція' },
    { value: 'mixed', label: 'змішана фіброзно-жирова структура' },
    { value: 'dense', label: 'виражений фіброгландулярний компонент' },
  ],
  ducts: [
    { value: 'notDilated', label: 'не розширені' },
    { value: 'dilated', label: 'розширені' },
    { value: 'ectasia', label: 'дуктектазія' },
  ],
  cysts: [
    { value: 'absent', label: 'не виявлені' },
    { value: 'simple', label: 'прості кісти' },
    { value: 'complicated', label: 'ускладнені / неоднорідні кісти' },
    { value: 'multiple', label: 'множинні дрібні кісти' },
  ],
  shape: [
    { value: 'oval', label: 'овальна' },
    { value: 'round', label: 'округла' },
    { value: 'irregular', label: 'неправильна' },
  ],
  orientation: [
    { value: 'parallel', label: 'паралельна шкірі' },
    { value: 'notParallel', label: 'непаралельна' },
  ],
  margin: [
    { value: 'circumscribed', label: 'чіткий рівний' },
    { value: 'indistinct', label: 'нечіткий' },
    { value: 'microlobulated', label: 'мікролобульований' },
    { value: 'angular', label: 'кутовий' },
    { value: 'spiculated', label: 'спікульований' },
  ],
  echogenicity: [
    { value: 'hypoechoic', label: 'гіпоехогенне' },
    { value: 'anechoic', label: 'анехогенне' },
    { value: 'isoechoic', label: 'ізоехогенне' },
    { value: 'hyperechoic', label: 'гіперехогенне' },
    { value: 'complex', label: 'змішаної ехоструктури' },
  ],
  posterior: [
    { value: 'none', label: 'немає' },
    { value: 'enhancement', label: 'посилення' },
    { value: 'shadowing', label: 'тінь' },
    { value: 'combined', label: 'комбінований' },
  ],
  vascularity: [
    { value: 'none', label: 'немає патологічного' },
    { value: 'peripheral', label: 'периферичний' },
    { value: 'central', label: 'центральний' },
    { value: 'mixed', label: 'змішаний' },
  ],
  lymphNodes: [
    { value: 'normal', label: 'не збільшені, структура збережена' },
    { value: 'reactive', label: 'реактивні' },
    { value: 'suspicious', label: 'підозрілі' },
  ],
};

function createNormalBreast() {
  return {
    tissuePattern: 'fibroglandular',
    ducts: 'notDilated',
    ductsDetails: '',
    cysts: 'absent',
    cystsDetails: '',
    formations: [],
    additionalText: '',
  };
}

function createInitialData() {
  return {
    complaints: '',
    general: {
      indication: 'screening',
      menstrualStatus: 'notSpecified',
      cycleDay: '',
      previousStudies: '',
    },
    rightBreast: createNormalBreast(),
    leftBreast: createNormalBreast(),
    lymphNodes: {
      axillary: 'normal',
      axillaryDetails: '',
      supraclavicular: 'normal',
      supraclavicularDetails: '',
    },
    birads: {
      manual: '',
    },
  };
}

function emptyFormation() {
  return {
    id: crypto.randomUUID(),
    clock: '',
    distance: '',
    quadrant: '',
    length: '',
    width: '',
    height: '',
    shape: 'oval',
    orientation: 'parallel',
    margin: 'circumscribed',
    echogenicity: 'hypoechoic',
    posterior: 'none',
    calcifications: 'no',
    vascularity: 'none',
  };
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function BreastSection({ title, data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const addFormation = () => update('formations', [...data.formations, emptyFormation()]);
  const updateFormation = (id, field, value) => {
    update('formations', data.formations.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const removeFormation = (id) => update('formations', data.formations.filter((item) => item.id !== id));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <SelectField label="Ехоструктура" value={data.tissuePattern} onChange={(value) => update('tissuePattern', value)} options={selectOptions.tissuePattern} />
        <SelectField label="Протоки" value={data.ducts} onChange={(value) => update('ducts', value)} options={selectOptions.ducts} />
        <SelectField label="Кісти" value={data.cysts} onChange={(value) => update('cysts', value)} options={selectOptions.cysts} />
      </div>

      {(data.ducts !== 'notDilated' || data.cysts !== 'absent') ? (
        <div className="grid gap-3 md:grid-cols-2">
          {data.ducts !== 'notDilated' ? (
            <TextField label="Деталі протоків" value={data.ductsDetails} onChange={(value) => update('ductsDetails', value)} placeholder="Наприклад: до 3 мм, без внутрішнього вмісту" />
          ) : null}
          {data.cysts !== 'absent' ? (
            <TextField label="Деталі кіст" value={data.cystsDetails} onChange={(value) => update('cystsDetails', value)} placeholder="Наприклад: поодинокі до 6 мм" />
          ) : null}
        </div>
      ) : null}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-950">Вогнищеві утворення: {title.toLowerCase()}</h4>
            <p className="text-xs text-slate-500">Додайте тільки якщо є знахідка.</p>
          </div>
          <button type="button" onClick={addFormation} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
            Додати утворення
          </button>
        </div>

        {data.formations.length ? (
          <div className="mt-3 space-y-3">
            {data.formations.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-teal-200 bg-white p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h5 className="text-sm font-bold text-slate-900">Утворення {index + 1}</h5>
                  <button type="button" onClick={() => removeFormation(item.id)} className="text-xs font-semibold text-red-600">
                    Видалити
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <TextField label="Година" value={item.clock} onChange={(value) => updateFormation(item.id, 'clock', value)} placeholder="10" />
                  <TextField label="Відстань від соска, см" value={item.distance} onChange={(value) => updateFormation(item.id, 'distance', value)} placeholder="3" />
                  <TextField label="Квадрант / зона" value={item.quadrant} onChange={(value) => updateFormation(item.id, 'quadrant', value)} placeholder="верхньо-зовнішній квадрант" />
                  <TextField label="Довжина, мм" value={item.length} onChange={(value) => updateFormation(item.id, 'length', value)} placeholder="12" />
                  <TextField label="Товщина, мм" value={item.width} onChange={(value) => updateFormation(item.id, 'width', value)} placeholder="6" />
                  <TextField label="Ширина, мм" value={item.height} onChange={(value) => updateFormation(item.id, 'height', value)} placeholder="10" />
                  <SelectField label="Форма" value={item.shape} onChange={(value) => updateFormation(item.id, 'shape', value)} options={selectOptions.shape} />
                  <SelectField label="Орієнтація" value={item.orientation} onChange={(value) => updateFormation(item.id, 'orientation', value)} options={selectOptions.orientation} />
                  <SelectField label="Контур" value={item.margin} onChange={(value) => updateFormation(item.id, 'margin', value)} options={selectOptions.margin} />
                  <SelectField label="Ехогенність" value={item.echogenicity} onChange={(value) => updateFormation(item.id, 'echogenicity', value)} options={selectOptions.echogenicity} />
                  <SelectField label="Задній ефект" value={item.posterior} onChange={(value) => updateFormation(item.id, 'posterior', value)} options={selectOptions.posterior} />
                  <SelectField label="Кровотік" value={item.vascularity} onChange={(value) => updateFormation(item.id, 'vascularity', value)} options={selectOptions.vascularity} />
                  <SelectField label="Кальцинати" value={item.calcifications} onChange={(value) => updateFormation(item.id, 'calcifications', value)} options={[{ value: 'no', label: 'немає' }, { value: 'yes', label: 'є' }]} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Додатково вручну</span>
        <textarea
          value={data.additionalText}
          onChange={(event) => update('additionalText', event.target.value)}
          rows={3}
          placeholder="Додатковий опис, якщо потрібно"
          className={textareaClass}
        />
      </label>
    </div>
  );
}

export default function BreastUltrasoundModule() {
  const [data, setData] = useState(createInitialData);
  const [openSection, setOpenSection] = useState('general');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildBreastReport(data), [data]);
  const [report, setReport] = useState(generatedReport);
  const autoBirads = getBreastBirads(data);

  useEffect(() => {
    if (autoUpdate) setReport(generatedReport);
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const toggleSection = (sectionId) => setOpenSection((current) => (current === sectionId ? null : sectionId));
  const regenerate = () => setReport(generatedReport);
  const clear = () => {
    const nextData = createInitialData();
    setData(nextData);
    setReport(buildBreastReport(nextData));
    setAutoUpdate(true);
    setOpenSection('general');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <UltrasoundComplaintsField value={data.complaints} onChange={(value) => updateData('complaints', value)} />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД молочних залоз</h3>
              <p className="mt-1 text-sm text-slate-600">
                Конструктор протоколу з описом залоз, утворень, регіонарних лімфовузлів та ACR BI-RADS.
              </p>
            </div>
            <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
              Сформувати протокол
            </button>
          </div>
        </div>

        <AccordionSection id="breast-general" title="1. Загальні дані" subtitle="Скарги, день циклу, попередні дослідження" isOpen={openSection === 'general'} onToggle={() => toggleSection('general')}>
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField label="Показання / причина" value={data.general.indication} onChange={(value) => updateData('general', { ...data.general, indication: value })} options={selectOptions.indication} />
            <SelectField label="Гормональний статус" value={data.general.menstrualStatus} onChange={(value) => updateData('general', { ...data.general, menstrualStatus: value })} options={selectOptions.menstrualStatus} />
            <TextField label="День циклу" value={data.general.cycleDay} onChange={(value) => updateData('general', { ...data.general, cycleDay: value })} placeholder="Наприклад: 7" />
            <TextField label="Попередні дослідження" value={data.general.previousStudies} onChange={(value) => updateData('general', { ...data.general, previousStudies: value })} placeholder="Наприклад: мамографія 2025" />
          </div>
        </AccordionSection>

        <AccordionSection id="breast-right" title="2. Права молочна залоза" subtitle="Ехоструктура, протоки, кісти, утворення" isOpen={openSection === 'right'} onToggle={() => toggleSection('right')}>
          <BreastSection title="Права молочна залоза" data={data.rightBreast} onChange={(value) => updateData('rightBreast', value)} />
        </AccordionSection>

        <AccordionSection id="breast-left" title="3. Ліва молочна залоза" subtitle="Ехоструктура, протоки, кісти, утворення" isOpen={openSection === 'left'} onToggle={() => toggleSection('left')}>
          <BreastSection title="Ліва молочна залоза" data={data.leftBreast} onChange={(value) => updateData('leftBreast', value)} />
        </AccordionSection>

        <AccordionSection id="breast-nodes" title="4. Регіонарні лімфатичні вузли" subtitle="Пахвові, над- та підключичні групи" isOpen={openSection === 'nodes'} onToggle={() => toggleSection('nodes')}>
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField label="Пахвові ЛВ" value={data.lymphNodes.axillary} onChange={(value) => updateData('lymphNodes', { ...data.lymphNodes, axillary: value })} options={selectOptions.lymphNodes} />
            <TextField label="Деталі пахвових ЛВ" value={data.lymphNodes.axillaryDetails} onChange={(value) => updateData('lymphNodes', { ...data.lymphNodes, axillaryDetails: value })} placeholder="Наприклад: кора до 2 мм, ворота збережені" />
            <SelectField label="Над- / підключичні ЛВ" value={data.lymphNodes.supraclavicular} onChange={(value) => updateData('lymphNodes', { ...data.lymphNodes, supraclavicular: value })} options={selectOptions.lymphNodes} />
            <TextField label="Деталі над- / підключичних ЛВ" value={data.lymphNodes.supraclavicularDetails} onChange={(value) => updateData('lymphNodes', { ...data.lymphNodes, supraclavicularDetails: value })} />
          </div>
        </AccordionSection>

        <AccordionSection id="breast-birads" title="5. ACR BI-RADS" subtitle="Автоматична підказка та ручна корекція" isOpen={openSection === 'birads'} onToggle={() => toggleSection('birads')}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Автоматична підказка</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{getBiradsText(autoBirads)}</p>
            </div>
            <SelectField
              label="Ручна корекція ACR BI-RADS"
              value={data.birads.manual}
              onChange={(value) => updateData('birads', { manual: value })}
              options={[
                { value: '', label: 'автоматично' },
                { value: '1', label: 'ACR BI-RADS 1' },
                { value: '2', label: 'ACR BI-RADS 2' },
                { value: '3', label: 'ACR BI-RADS 3' },
                { value: '4', label: 'ACR BI-RADS 4' },
                { value: '5', label: 'ACR BI-RADS 5' },
              ]}
            />
          </div>
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-slate-700">
            BI-RADS є довідковою системою категоризації. Остаточну категорію, потребу в мамографії,
            біопсії або спостереженні визначає лікар з урахуванням клінічної ситуації.
          </p>
        </AccordionSection>
      </div>

      <BreastReportPreview
        overview={report.overview}
        conclusion={report.conclusion}
        recommendations={report.recommendations}
        onOverviewChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, overview: value }));
        }}
        onConclusionChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, conclusion: value }));
        }}
        onRecommendationsChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, recommendations: value }));
        }}
        autoUpdate={autoUpdate}
        onAutoUpdateChange={setAutoUpdate}
        onRegenerate={regenerate}
        onClear={clear}
      />
    </div>
  );
}
