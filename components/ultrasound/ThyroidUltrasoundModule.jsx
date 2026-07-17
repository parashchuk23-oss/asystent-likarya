'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateThyroidConclusion, generateThyroidRecommendations } from '../../utils/ultrasound/thyroidConclusionGenerator';
import { generateThyroidOverview } from '../../utils/ultrasound/thyroidReportGenerator';
import AccordionSection from '../AccordionSection';
import FormField from '../FormField';
import { inputClass } from '../formStyles';
import ThyroidGeneralForm from './ThyroidGeneralForm';
import ThyroidLymphNodesForm from './ThyroidLymphNodesForm';
import ThyroidMeasurementsForm from './ThyroidMeasurementsForm';
import ThyroidNoduleForm from './ThyroidNoduleForm';
import ThyroidOptionalVascularForm from './ThyroidOptionalVascularForm';
import ThyroidParenchymaForm from './ThyroidParenchymaForm';
import ThyroidPerithyroidForm from './ThyroidPerithyroidForm';
import UltrasoundReportPreview from './UltrasoundReportPreview';

const createNodule = (lobe = 'right') => ({
  id: `nodule-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  lobe,
  location: 'lowerThird',
  locationOther: '',
  type: 'solid',
  echogenicity: 'isoechoic',
  shape: 'oval',
  orientation: 'horizontal',
  contour: 'smooth',
  clarity: 'clear',
  structure: 'homogeneous',
  inclusions: ['absent'],
  inclusionOther: '',
  dimensions: { length: '', thickness: '', width: '' },
  bloodFlow: 'perinodular',
  tirads: '',
});

const createPerithyroidFormation = () => ({
  id: `perithyroid-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  localization: 'по нижньому полюсу щитоподібної залози',
  dimensions: { length: '', thickness: '', width: '' },
  shape: 'овальна',
  echogenicity: 'гіпоехогенна',
  contours: 'чіткі',
  bloodFlow: 'не оцінено',
  compression: 'не оцінено',
  differential: [],
  differentialOther: '',
});

const initialData = {
  general: {
    surgeryStatus: 'notOperated',
    location: 'typical',
    shape: 'usual',
    shapeOther: '',
  },
  measurements: {
    right: { length: '', thickness: '', width: '' },
    left: { length: '', thickness: '', width: '' },
    isthmus: { thickness: '', status: 'notThickened' },
    totalVolumeStatus: 'notEnlarged',
    enlargementPercent: '',
  },
  appearance: {
    contour: 'smooth',
    clarity: 'clear',
    capsule: 'notThickened',
    echogenicity: 'medium',
  },
  parenchyma: {
    structure: 'homogeneous',
    features: [],
    hypoechoicSize: '',
    fibroticSize: '',
    other: '',
  },
  diffuseInterpretation: 'diffuseChanges',
  vascularization: 'normal',
  nodules: [],
  perithyroidFormations: [],
  lymphNodes: {
    status: 'notEnlarged',
    zones: [],
    structure: 'без особливостей',
    bloodFlow: 'центральний',
    shortAxisMax: '',
  },
  optionalVascular: {
    jugularEnabled: false,
    jugular: {
      rightDiameter: '',
      leftDiameter: '',
      dilation: 'не розширені',
      patency: 'прохідні',
      compression: 'стискаються повністю',
    },
    carotidEnabled: false,
    carotid: {
      course: 'прямолінійний',
      intima: 'чітко диференціюється',
      cimtRight: '',
      cimtLeft: '',
      bifurcation: 'без локального потовщення',
      plaques: 'notDetected',
      plaqueDescription: '',
    },
  },
};

function buildReport(data) {
  return {
    overview: generateThyroidOverview(data),
    conclusion: generateThyroidConclusion(data),
    recommendations: generateThyroidRecommendations(data),
  };
}

export default function ThyroidUltrasoundModule() {
  const [data, setData] = useState(initialData);
  const [openSection, setOpenSection] = useState('general');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildReport(data), [data]);
  const [report, setReport] = useState(generatedReport);

  useEffect(() => {
    if (autoUpdate) {
      setReport(generatedReport);
    }
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const regenerateReport = () => setReport(generatedReport);

  const clearAll = () => {
    setData(initialData);
    const nextReport = buildReport(initialData);
    setReport(nextReport);
    setAutoUpdate(true);
    setOpenSection('general');
  };

  const addNodule = (lobe) => updateData('nodules', [...data.nodules, createNodule(lobe)]);
  const updateNodule = (id, nextNodule) => updateData('nodules', data.nodules.map((nodule) => (nodule.id === id ? nextNodule : nodule)));
  const removeNodule = (id) => updateData('nodules', data.nodules.filter((nodule) => nodule.id !== id));

  const addPerithyroid = () => updateData('perithyroidFormations', [...data.perithyroidFormations, createPerithyroidFormation()]);
  const updatePerithyroid = (id, nextItem) =>
    updateData(
      'perithyroidFormations',
      data.perithyroidFormations.map((item) => (item.id === id ? nextItem : item)),
    );
  const removePerithyroid = (id) => updateData('perithyroidFormations', data.perithyroidFormations.filter((item) => item.id !== id));

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД щитоподібної залози</h3>
              <p className="mt-1 text-sm text-slate-600">Заповніть форму, перевірте чернетку справа та відредагуйте текст перед копіюванням.</p>
            </div>
            <button
              type="button"
              onClick={regenerateReport}
              className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Сформувати протокол
            </button>
          </div>
        </div>

        <AccordionSection
          id="thyroid-general"
          title="1. Загальні дані"
          subtitle="Операції, розташування, форма"
          isOpen={openSection === 'general'}
          onToggle={() => setOpenSection(openSection === 'general' ? null : 'general')}
        >
          <ThyroidGeneralForm data={data.general} onChange={(value) => updateData('general', value)} />
        </AccordionSection>

        <AccordionSection
          id="thyroid-measurements"
          title="2. Розміри та об’єм"
          subtitle="Частки, перешийок, сумарний об’єм"
          isOpen={openSection === 'measurements'}
          onToggle={() => setOpenSection(openSection === 'measurements' ? null : 'measurements')}
        >
          <ThyroidMeasurementsForm data={data.measurements} onChange={(value) => updateData('measurements', value)} />
        </AccordionSection>

        <AccordionSection
          id="thyroid-parenchyma"
          title="3. Контури, ехогенність, паренхіма"
          subtitle="Капсула, неоднорідність, васкуляризація"
          isOpen={openSection === 'parenchyma'}
          onToggle={() => setOpenSection(openSection === 'parenchyma' ? null : 'parenchyma')}
        >
          <ThyroidParenchymaForm
            appearance={data.appearance}
            parenchyma={data.parenchyma}
            vascularization={data.vascularization}
            onAppearanceChange={(value) => updateData('appearance', value)}
            onParenchymaChange={(value) => updateData('parenchyma', value)}
            onVascularizationChange={(value) => updateData('vascularization', value)}
          />
          <div className="mt-4">
            <FormField className="mb-2" label="Як формувати дифузні зміни у висновку">
              <select value={data.diffuseInterpretation} onChange={(event) => updateData('diffuseInterpretation', event.target.value)} className={inputClass}>
                <option value="diffuseChanges">УЗ-ознаки дифузних змін</option>
                <option value="thyroiditis">УЗ-ознаки, які можуть відповідати тиреоїдиту</option>
              </select>
            </FormField>
          </div>
        </AccordionSection>

        <AccordionSection
          id="thyroid-nodules"
          title="4. Вузлові утворення"
          subtitle="Окремі картки для кожного вузла, автоматичний ACR TI-RADS"
          isOpen={openSection === 'nodules'}
          onToggle={() => setOpenSection(openSection === 'nodules' ? null : 'nodules')}
        >
          <ThyroidNoduleForm nodules={data.nodules} onAdd={addNodule} onUpdate={updateNodule} onRemove={removeNodule} />
        </AccordionSection>

        <AccordionSection
          id="thyroid-perithyroid"
          title="5. Перитиреоїдні утворення"
          subtitle="Опис і диференційний ряд без автоматичного діагнозу"
          isOpen={openSection === 'perithyroid'}
          onToggle={() => setOpenSection(openSection === 'perithyroid' ? null : 'perithyroid')}
        >
          <ThyroidPerithyroidForm items={data.perithyroidFormations} onAdd={addPerithyroid} onUpdate={updatePerithyroid} onRemove={removePerithyroid} />
        </AccordionSection>

        <AccordionSection
          id="thyroid-lymph"
          title="6. Регіонарні лімфатичні вузли"
          subtitle="Зони, структура, кровотік, коротка вісь"
          isOpen={openSection === 'lymph'}
          onToggle={() => setOpenSection(openSection === 'lymph' ? null : 'lymph')}
        >
          <ThyroidLymphNodesForm data={data.lymphNodes} onChange={(value) => updateData('lymphNodes', value)} />
        </AccordionSection>

        <AccordionSection
          id="thyroid-vessels"
          title="7. Додатково: судини"
          subtitle="Опційний блок, не додається в протокол, якщо вимкнений"
          isOpen={openSection === 'vessels'}
          onToggle={() => setOpenSection(openSection === 'vessels' ? null : 'vessels')}
        >
          <ThyroidOptionalVascularForm data={data.optionalVascular} onChange={(value) => updateData('optionalVascular', value)} />
        </AccordionSection>
      </div>

      <UltrasoundReportPreview
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
        onRegenerate={regenerateReport}
        onClear={clearAll}
      />
    </div>
  );
}
