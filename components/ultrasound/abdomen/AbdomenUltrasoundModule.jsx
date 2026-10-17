'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateAbdomenConclusion, generateAbdomenRecommendations } from '../../../utils/ultrasound/abdomen/abdomenConclusionGenerator';
import { generateAbdomenOverview } from '../../../utils/ultrasound/abdomen/abdomenReportGenerator';
import AccordionSection from '../../AccordionSection';
import AdditionalAbdomenFindingsForm from './AdditionalAbdomenFindingsForm';
import AbdomenReportPreview from './AbdomenReportPreview';
import CommonBileDuctForm from './CommonBileDuctForm';
import GallbladderForm from './GallbladderForm';
import LiverForm from './LiverForm';
import PancreasForm from './PancreasForm';
import SpleenForm from './SpleenForm';
import UltrasoundComplaintsField from '../UltrasoundComplaintsField';
import { addComplaintsToOverview } from '../../../utils/ultrasound/reportComplaints';
import AbdomenPolypCalculator, { initialAbdomenPolypData } from './AbdomenPolypCalculator';
import AbdomenUltrasoundGuide from './AbdomenUltrasoundGuide';

const initialData = {
  complaints: '',
  liver: {
    rightLobeLength: '140',
    rightLobeAp: '110',
    leftLobeLength: '60',
    caudateLobe: '25',
    contours: 'smooth',
    echogenicity: 'medium',
    vascularPattern: 'preserved',
    posteriorAttenuation: 'none',
    diaphragmVisualization: 'clear',
    steatosisGrade: '',
    structure: 'homogeneous',
    changes: [],
    otherChange: '',
    portalVein: '10',
    hepaticVeins: 'notDilated',
    bileDucts: 'notDilated',
  },
  gallbladder: {
    notVisualized: false,
    shape: 'ovoid',
    inflection: 'none',
    length: '80',
    width: '30',
    wall: '2',
    wallThickeningType: 'diffuse',
    content: 'anechoic',
    stones: [],
    polyps: [],
    stoneDescription: '',
    projectionTenderness: 'no',
  },
  commonBileDuct: {
    diameter: '4',
    lumen: 'free',
  },
  pancreas: {
    head: '25',
    body: '15',
    tail: '25',
    contours: 'smooth',
    echogenicity: 'medium',
    structure: 'homogeneous',
    wirsung: '2',
    peripancreaticTissue: 'без особливостей',
    lesions: [],
    diffuseChangeType: '',
    additionalDescription: '',
  },
  spleen: {
    length: '105',
    width: '45',
    echogenicity: 'medium',
    structure: 'homogeneous',
    splenicVein: '6',
    lesions: [],
  },
  freeFluid: {
    status: 'no',
    localization: '',
  },
  lymphNodes: {
    status: 'no',
    size: '',
    localization: '',
  },
  hollowOrgans: {
    text: 'без видимих патологічних змін у доступних для огляду відділах',
  },
  stomach: {
    enabled: false,
    text: '',
  },
};

function buildReport(data) {
  return {
    overview: addComplaintsToOverview(generateAbdomenOverview(data), data.complaints),
    conclusion: generateAbdomenConclusion(data),
    recommendations: generateAbdomenRecommendations(data),
  };
}

const abdomenTools = [
  {
    id: 'protocol',
    eyebrow: 'Основний інструмент',
    title: 'Повний протокол УЗД ОЧП',
    description: 'Структурований огляд печінки, жовчного міхура, холедоха, підшлункової залози, селезінки та додаткових знахідок.',
    action: 'Відкрити протокол',
  },
  {
    id: 'polyps',
    eyebrow: 'Оцінювання знахідки',
    title: 'Поліпи жовчного міхура',
    description: 'Окремий інструмент для оцінки морфології, розміру, росту та рекомендованої тактики за SRU 2022.',
    action: 'Відкрити калькулятор',
  },
  {
    id: 'guide',
    eyebrow: 'Практичний довідник',
    title: 'Рекомендації та УЗ-атлас',
    description: 'Коротка пам’ятка з техніки, обов’язкових елементів протоколу, типових помилок і реальних УЗ-прикладів.',
    action: 'Відкрити довідник',
  },
];

function AbdomenToolsHome({ onOpenTool }) {
  return (
    <section>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Інструменти УЗД ОЧП</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">Оберіть потрібний формат роботи</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">Відкрийте повний протокол, окремо оцініть поліп жовчного міхура або скористайтеся практичною пам’яткою.</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {abdomenTools.map((tool) => (
          <button key={tool.id} type="button" onClick={() => onOpenTool(tool.id)} className="rounded-lg border border-teal-300 bg-white p-5 text-left shadow-sm transition hover:border-teal-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">{tool.eyebrow}</p>
            <h4 className="mt-3 text-lg font-bold text-slate-950">{tool.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
            <span className="mt-5 inline-flex text-sm font-bold text-teal-700">{tool.action} →</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function AbdomenUltrasoundModule() {
  const [activeTool, setActiveTool] = useState('home');
  const [polypData, setPolypData] = useState(initialAbdomenPolypData);
  const [data, setData] = useState(initialData);
  const [openSection, setOpenSection] = useState('liver');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildReport(data), [data]);
  const [report, setReport] = useState(generatedReport);

  useEffect(() => {
    if (autoUpdate) setReport(generatedReport);
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const regenerate = () => setReport(generatedReport);
  const clear = () => {
    setData(initialData);
    setReport(buildReport(initialData));
    setAutoUpdate(true);
    setOpenSection('liver');
  };
  const fillNormal = () => {
    setData(initialData);
    setReport(buildReport(initialData));
    setAutoUpdate(true);
  };

  if (activeTool === 'home') {
    return <AbdomenToolsHome onOpenTool={setActiveTool} />;
  }

  if (activeTool === 'polyps') {
    return <AbdomenPolypCalculator data={polypData} onChange={setPolypData} onBack={() => setActiveTool('home')} />;
  }

  if (activeTool === 'guide') {
    return <AbdomenUltrasoundGuide onBack={() => setActiveTool('home')} onOpenTool={setActiveTool} />;
  }

  return (
    <div className="space-y-4">
      <button type="button" onClick={() => setActiveTool('home')} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
        ← До інструментів УЗД ОЧП
      </button>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <UltrasoundComplaintsField value={data.complaints} onChange={(value) => updateData('complaints', value)} />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД органів черевної порожнини</h3>
              <p className="mt-1 text-sm text-slate-600">Конструктор протоколу з полями, заповненими нормальними значеннями за замовчуванням.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={fillNormal} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                Заповнити як норму
              </button>
              <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
                Сформувати протокол
              </button>
            </div>
          </div>
        </div>

        <AccordionSection id="abdomen-liver" title="1. Печінка" subtitle="Розміри, ехогенність, структура, судини" isOpen={openSection === 'liver'} onToggle={() => setOpenSection(openSection === 'liver' ? null : 'liver')}>
          <LiverForm data={data.liver} onChange={(value) => updateData('liver', value)} />
        </AccordionSection>

        <AccordionSection id="abdomen-gallbladder" title="2. Жовчний міхур" subtitle="Форма, стінка, вміст, конкременти, поліпи" isOpen={openSection === 'gallbladder'} onToggle={() => setOpenSection(openSection === 'gallbladder' ? null : 'gallbladder')}>
          <GallbladderForm data={data.gallbladder} onChange={(value) => updateData('gallbladder', value)} />
        </AccordionSection>

        <AccordionSection id="abdomen-cbd" title="3. Холедох" subtitle="Діаметр і просвіт" isOpen={openSection === 'cbd'} onToggle={() => setOpenSection(openSection === 'cbd' ? null : 'cbd')}>
          <CommonBileDuctForm data={data.commonBileDuct} onChange={(value) => updateData('commonBileDuct', value)} />
        </AccordionSection>

        <AccordionSection id="abdomen-pancreas" title="4. Підшлункова залоза" subtitle="Розміри, структура, Вірсунгова протока, утворення" isOpen={openSection === 'pancreas'} onToggle={() => setOpenSection(openSection === 'pancreas' ? null : 'pancreas')}>
          <PancreasForm data={data.pancreas} onChange={(value) => updateData('pancreas', value)} />
        </AccordionSection>

        <AccordionSection id="abdomen-spleen" title="5. Селезінка" subtitle="Розміри, структура, селезінкова вена, утворення" isOpen={openSection === 'spleen'} onToggle={() => setOpenSection(openSection === 'spleen' ? null : 'spleen')}>
          <SpleenForm data={data.spleen} onChange={(value) => updateData('spleen', value)} />
        </AccordionSection>

        <AccordionSection id="abdomen-other" title="6. Додатково" subtitle="Вільна рідина, лімфовузли, порожнисті органи" isOpen={openSection === 'other'} onToggle={() => setOpenSection(openSection === 'other' ? null : 'other')}>
          <AdditionalAbdomenFindingsForm
            freeFluid={data.freeFluid}
            lymphNodes={data.lymphNodes}
            hollowOrgans={data.hollowOrgans}
            stomach={data.stomach}
            onFreeFluidChange={(value) => updateData('freeFluid', value)}
            onLymphNodesChange={(value) => updateData('lymphNodes', value)}
            onHollowOrgansChange={(value) => updateData('hollowOrgans', value)}
            onStomachChange={(value) => updateData('stomach', value)}
          />
        </AccordionSection>
      </div>

      <AbdomenReportPreview
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
    </div>
  );
}
