'use client';

import { useEffect, useMemo, useState } from 'react';
import AccordionSection from '../../AccordionSection';
import RenalAdrenalForm from './RenalAdrenalForm';
import RenalKidneyForm from './RenalKidneyForm';
import RenalReportPreview from './RenalReportPreview';
import RenalUrinaryTractForm from './RenalUrinaryTractForm';
import {
  generateRenalConclusion,
  generateRenalOverview,
  generateRenalRecommendations,
} from '../../../utils/ultrasound/renal/renalReportGenerator';

const normalKidney = {
  position: 'typical',
  ptosisNote: '',
  length: '105',
  width: '50',
  contours: 'smooth',
  contourClarity: 'clear',
  corticomedullary: 'preserved',
  parenchyma: '16',
  sinusEchogenicity: 'normal',
  vascularPattern: 'preserved',
  collectingSystem: 'notDilated',
  collectingSystemDetails: '',
  lesionsStatus: 'absent',
  lesionsDetails: '',
  stonesStatus: 'absent',
  stonesDetails: '',
  microInclusions: 'no',
};

const initialData = {
  rightKidney: { ...normalKidney, length: '105', width: '50' },
  leftKidney: { ...normalKidney, length: '106', width: '51' },
  rightAdrenal: {
    status: 'notVisualized',
    details: '',
  },
  leftAdrenal: {
    status: 'notVisualized',
    details: '',
  },
  ureters: {
    status: 'notDilated',
    details: '',
  },
  renalArteries: {
    stenosis: 'no',
    details: '',
  },
  bladder: {
    volume: '250',
    wallStatus: 'notThickened',
    wallThickness: '3',
    content: 'anechoic',
    contentDetails: '',
    pathologyStatus: 'absent',
    pathologyDetails: '',
    uretericOrifices: 'notDilated',
    residualVolume: '0',
  },
};

function buildReport(data) {
  return {
    overview: generateRenalOverview(data),
    conclusion: generateRenalConclusion(data),
    recommendations: generateRenalRecommendations(data),
  };
}

export default function RenalUltrasoundModule() {
  const [data, setData] = useState(initialData);
  const [openSection, setOpenSection] = useState('rightKidney');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildReport(data), [data]);
  const [report, setReport] = useState(generatedReport);

  useEffect(() => {
    if (autoUpdate) setReport(generatedReport);
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));

  const toggleSection = (sectionId) => {
    setOpenSection((current) => (current === sectionId ? null : sectionId));
  };

  const regenerate = () => setReport(generatedReport);

  const fillNormal = () => {
    setData(initialData);
    setReport(buildReport(initialData));
    setAutoUpdate(true);
  };

  const clear = () => {
    fillNormal();
    setOpenSection('rightKidney');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД нирок та сечовидільної системи</h3>
              <p className="mt-1 text-sm text-slate-600">
                Конструктор протоколу з нормальними значеннями за замовчуванням і живим попереднім переглядом.
              </p>
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

        <AccordionSection
          id="renal-right-kidney"
          title="1. Права нирка"
          subtitle="Розташування, розміри, паренхіма, ЧМС, утворення, конкременти"
          isOpen={openSection === 'rightKidney'}
          onToggle={() => toggleSection('rightKidney')}
        >
          <RenalKidneyForm title="Права нирка" data={data.rightKidney} onChange={(value) => updateData('rightKidney', value)} />
        </AccordionSection>

        <AccordionSection
          id="renal-right-adrenal"
          title="2. Правий наднирник"
          subtitle="Візуалізація та опис змін"
          isOpen={openSection === 'rightAdrenal'}
          onToggle={() => toggleSection('rightAdrenal')}
        >
          <RenalAdrenalForm title="Правий наднирник" data={data.rightAdrenal} onChange={(value) => updateData('rightAdrenal', value)} />
        </AccordionSection>

        <AccordionSection
          id="renal-left-kidney"
          title="3. Ліва нирка"
          subtitle="Розташування, розміри, паренхіма, ЧМС, утворення, конкременти"
          isOpen={openSection === 'leftKidney'}
          onToggle={() => toggleSection('leftKidney')}
        >
          <RenalKidneyForm title="Ліва нирка" data={data.leftKidney} onChange={(value) => updateData('leftKidney', value)} />
        </AccordionSection>

        <AccordionSection
          id="renal-left-adrenal"
          title="4. Лівий наднирник"
          subtitle="Візуалізація та опис змін"
          isOpen={openSection === 'leftAdrenal'}
          onToggle={() => toggleSection('leftAdrenal')}
        >
          <RenalAdrenalForm title="Лівий наднирник" data={data.leftAdrenal} onChange={(value) => updateData('leftAdrenal', value)} />
        </AccordionSection>

        <AccordionSection
          id="renal-urinary-tract"
          title="5. Сечоводи, ниркові артерії, сечовий міхур"
          subtitle="Сечоводи, дані за стеноз, об’єм міхура, стінка, вміст, залишкова сеча"
          isOpen={openSection === 'urinaryTract'}
          onToggle={() => toggleSection('urinaryTract')}
        >
          <RenalUrinaryTractForm
            ureters={data.ureters}
            arteries={data.renalArteries}
            bladder={data.bladder}
            onUretersChange={(value) => updateData('ureters', value)}
            onArteriesChange={(value) => updateData('renalArteries', value)}
            onBladderChange={(value) => updateData('bladder', value)}
          />
        </AccordionSection>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
          Модуль формує чернетку протоколу УЗД. Остаточний опис, висновок і рекомендації перевіряє та редагує лікар УЗД.
        </div>
      </div>

      <RenalReportPreview
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
