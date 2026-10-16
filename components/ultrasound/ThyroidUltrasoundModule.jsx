'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateThyroidConclusion, generateThyroidRecommendations } from '../../utils/ultrasound/thyroidConclusionGenerator';
import { generateThyroidOverview } from '../../utils/ultrasound/thyroidReportGenerator';
import AccordionSection from '../AccordionSection';
import ThyroidGeneralForm from './ThyroidGeneralForm';
import ThyroidLymphNodesForm from './ThyroidLymphNodesForm';
import ThyroidMeasurementsForm from './ThyroidMeasurementsForm';
import ThyroidNoduleForm from './ThyroidNoduleForm';
import ThyroidOptionalVascularForm from './ThyroidOptionalVascularForm';
import ThyroidParenchymaForm from './ThyroidParenchymaForm';
import ThyroidTiradsCalculator, { initialTiradsData } from './ThyroidTiradsCalculator';
import ThyroidPerithyroidForm from './ThyroidPerithyroidForm';
import ThyroidVolumeCalculator from './ThyroidVolumeCalculator';
import UltrasoundReportPreview from './UltrasoundReportPreview';
import UltrasoundComplaintsField from './UltrasoundComplaintsField';
import { addComplaintsToOverview } from '../../utils/ultrasound/reportComplaints';

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
  localization: 'біля нижнього полюса щитоподібної залози',
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
  complaints: '',
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
    overview: addComplaintsToOverview(generateThyroidOverview(data), data.complaints),
    conclusion: generateThyroidConclusion(data),
    recommendations: generateThyroidRecommendations(data),
  };
}

const thyroidTools = [
  {
    id: 'protocol',
    eyebrow: 'Основний інструмент',
    title: 'Повний протокол УЗД',
    description:
      'Структурована форма з розмірами, паренхімою, вузлами, лімфатичними вузлами, висновком і рекомендаціями.',
    action: 'Відкрити протокол',
    available: true,
  },
  {
    id: 'volume',
    eyebrow: 'Швидкий розрахунок',
    title: 'Об’єм щитоподібної залози',
    description:
      'Окремий калькулятор для правої та лівої часток, сумарного об’єму й автоматичної оцінки перешийка.',
    action: 'Відкрити калькулятор',
    available: true,
  },
  {
    id: 'tirads',
    eyebrow: 'Оцінювання вузла',
    title: 'Калькулятор ACR TI-RADS',
    description:
      'Швидке визначення балів, категорії ACR TI-RADS і тактики відповідно до максимального розміру вузла.',
    action: 'Відкрити калькулятор',
    available: true,
  },
  {
    id: 'guide',
    eyebrow: 'Практичний довідник',
    title: 'Рекомендації та УЗ-атлас',
    description:
      'Техніка дослідження, стандартизований опис і перевірені приклади поширених патологічних змін.',
    action: 'Наступний етап',
    available: false,
  },
];

function ThyroidToolsHome({ onOpenTool }) {
  return (
    <section>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Інструменти ЩЗ</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Оберіть потрібний формат роботи</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Відкрийте повний протокол або скористайтеся окремим швидким інструментом без заповнення всієї форми.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {thyroidTools.map((tool) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className={`text-xs font-bold uppercase tracking-[0.16em] ${tool.available ? 'text-teal-700' : 'text-slate-400'}`}>
                  {tool.eyebrow}
                </p>
                {!tool.available ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">У розробці</span>
                ) : null}
              </div>
              <h4 className="mt-3 text-lg font-bold text-slate-950">{tool.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
              <span className={`mt-5 inline-flex text-sm font-bold ${tool.available ? 'text-teal-700' : 'text-slate-400'}`}>
                {tool.action}{tool.available ? ' →' : ''}
              </span>
            </>
          );

          return tool.available ? (
            <button
              key={tool.id}
              type="button"
              onClick={() => onOpenTool(tool.id)}
              className="rounded-lg border border-teal-300 bg-white p-5 text-left shadow-sm transition hover:border-teal-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              {content}
            </button>
          ) : (
            <article key={tool.id} className="rounded-lg border border-slate-200 bg-white p-5">
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function ThyroidUltrasoundModule() {
  const [activeTool, setActiveTool] = useState('home');
  const [volumeData, setVolumeData] = useState({
    right: { length: '', thickness: '', width: '' },
    left: { length: '', thickness: '', width: '' },
    isthmusThickness: '',
  });
  const [tiradsData, setTiradsData] = useState(initialTiradsData);
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

  if (activeTool === 'home') {
    return <ThyroidToolsHome onOpenTool={setActiveTool} />;
  }

  if (activeTool === 'volume') {
    return <ThyroidVolumeCalculator data={volumeData} onChange={setVolumeData} onBack={() => setActiveTool('home')} />;
  }

  if (activeTool === 'tirads') {
    return <ThyroidTiradsCalculator data={tiradsData} onChange={setTiradsData} onBack={() => setActiveTool('home')} />;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setActiveTool('home')}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
      >
        ← До інструментів ЩЗ
      </button>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
        <div className="space-y-4">
        <UltrasoundComplaintsField value={data.complaints} onChange={(value) => updateData('complaints', value)} />
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
    </div>
  );
}
