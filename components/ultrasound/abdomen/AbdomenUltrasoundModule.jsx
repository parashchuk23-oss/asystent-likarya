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

const initialData = {
  liver: {
    mode: 'normal',
    rightLobeLength: '',
    leftLobeLength: '',
    caudateLobe: '',
    contours: 'smooth',
    echogenicity: 'medium',
    structure: 'homogeneous',
    changes: [],
    otherChange: '',
    portalVein: '',
    hepaticVeins: 'notDilated',
    bileDucts: 'notDilated',
  },
  gallbladder: {
    mode: 'normal',
    shape: 'ovoid',
    inflection: 'none',
    length: '',
    width: '',
    wall: '',
    content: 'anechoic',
    stones: [],
    polyps: [],
  },
  commonBileDuct: {
    diameter: '',
    lumen: 'free',
  },
  pancreas: {
    mode: 'normal',
    head: '',
    body: '',
    tail: '',
    contours: 'smooth',
    echogenicity: 'medium',
    structure: 'homogeneous',
    wirsung: '',
    peripancreaticTissue: 'без особливостей',
    lesions: [],
  },
  spleen: {
    mode: 'normal',
    length: '',
    width: '',
    echogenicity: 'medium',
    structure: 'homogeneous',
    splenicVein: '',
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
    text: '',
  },
};

function buildReport(data) {
  return {
    overview: generateAbdomenOverview(data),
    conclusion: generateAbdomenConclusion(data),
    recommendations: generateAbdomenRecommendations(data),
  };
}

export default function AbdomenUltrasoundModule() {
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

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД органів черевної порожнини</h3>
              <p className="mt-1 text-sm text-slate-600">Конструктор протоколу: оберіть зміни лише там, де вони потрібні.</p>
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
            onFreeFluidChange={(value) => updateData('freeFluid', value)}
            onLymphNodesChange={(value) => updateData('lymphNodes', value)}
            onHollowOrgansChange={(value) => updateData('hollowOrgans', value)}
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
  );
}
