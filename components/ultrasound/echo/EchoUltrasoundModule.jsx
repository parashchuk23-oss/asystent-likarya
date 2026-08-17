'use client';

import { useEffect, useMemo, useState } from 'react';
import AccordionSection from '../../AccordionSection';
import { echoReferenceNotes } from '../../../data/ultrasound/echoReferenceRanges';
import { calculateEchoDerived } from '../../../utils/ultrasound/echo/echoCalculations';
import { buildEchoReport } from '../../../utils/ultrasound/echo/echoReportGenerator';
import EchoReportPreview from './EchoReportPreview';
import {
  EchoAtriaAortaSection,
  EchoBasicDataSection,
  EchoDiastolicSection,
  EchoFocusedSection,
  EchoLeftVentricleSection,
  EchoPericardiumIvcSection,
  EchoRightVentricleSection,
  EchoValvesSection,
  EchoViewsSection,
} from './EchoSections';

const initialData = {
  basic: {
    mode: 'standard',
    transducer: 'p21x',
    sex: 'male',
    height: '',
    weight: '',
    cwDoppler: 'optional',
    tdi: 'optional',
    ecg: 'optional',
  },
  focused: {
    lvFunction: '',
    rvDilation: '',
    pericardialFluid: '',
    ivcComment: '',
    valveComment: '',
    otherFindings: '',
  },
  views: {
    plax: '',
    psax: '',
    a4c: '',
    a2c: '',
    a3c: '',
    subcostal: '',
  },
  leftVentricle: {
    lvidd: '',
    lvids: '',
    ivsd: '',
    lvpwd: '',
    visualEf: '',
    manualEf: '',
    edv: '',
    esv: '',
    teichholzEdv: '',
    teichholzEsv: '',
    regionalMotion: '',
    regionalDetails: '',
  },
  diastolic: {
    e: '',
    a: '',
    dt: '',
    ePrimeSeptal: '',
    ePrimeLateral: '',
    trVmax: '',
    comment: '',
  },
  rightVentricle: {
    basalDiameter: '',
    tapse: '',
    fac: '',
    sPrime: '',
    visualFunction: '',
    comment: '',
  },
  leftAtrium: {
    apSize: '',
    volume: '',
  },
  rightAtrium: {
    area: '',
    visualDilation: '',
  },
  aorta: {
    annulus: '',
    sinuses: '',
    stj: '',
    ascending: '',
  },
  aorticValve: {
    type: '',
    morphology: '',
    regurgitation: '',
    vmax: '',
    lvotDiameter: '',
    lvotVti: '',
    avVti: '',
  },
  mitralValve: {
    morphology: '',
    regurgitation: '',
  },
  tricuspidValve: {
    regurgitation: '',
    trVmax: '',
  },
  pulmonaryValve: {
    regurgitation: '',
  },
  pericardium: {
    fluid: '',
    separation: '',
    tamponadeSigns: '',
  },
  ivc: {
    maxDiameter: '',
    minDiameter: '',
    rap: '',
  },
  conclusionManual: '',
};

function buildReport(data) {
  return buildEchoReport(data);
}

export default function EchoUltrasoundModule() {
  const [data, setData] = useState(initialData);
  const [openSection, setOpenSection] = useState('basic');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const derived = useMemo(() => calculateEchoDerived(data), [data]);
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
    setOpenSection('basic');
    setAutoUpdate(true);
  };

  const toggleSection = (sectionId) => {
    setOpenSection((current) => (current === sectionId ? null : sectionId));
  };

  const isFocused = data.basic.mode === 'focused';

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Ехокардіографія</h3>
              <p className="mt-1 text-sm text-slate-600">
                Структурований протокол трансторакального УЗД серця. Орієнтовано на практичну роботу
                з SonoSite Edge / Edge II без обовʼязкових advanced-функцій.
              </p>
            </div>
            <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
              Сформувати протокол
            </button>
          </div>
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
            {echoReferenceNotes.sonosite} Поля CW Doppler, TDI та ECG позначаються як опційні.
          </div>
        </div>

        <AccordionSection id="echo-basic" title="1. Основні дані" subtitle="Режим, датчик, BSA, опції апарата" isOpen={openSection === 'basic'} onToggle={() => toggleSection('basic')}>
          <EchoBasicDataSection data={data.basic} onChange={updateData} derived={derived} />
        </AccordionSection>

        {isFocused ? (
          <AccordionSection id="echo-focused" title="2. Швидке Ехо / POCUS" subtitle="Глобальна функція ЛШ, ПШ, перикард, НПВ, груба клапанна патологія" isOpen={openSection === 'focused'} onToggle={() => toggleSection('focused')}>
            <EchoFocusedSection data={data.focused} onChange={updateData} />
          </AccordionSection>
        ) : (
          <>
            <AccordionSection id="echo-views" title="2. Послідовність огляду" subtitle="PLAX, PSAX, A4C, A2C, A3C, субкостальна позиція" isOpen={openSection === 'views'} onToggle={() => toggleSection('views')}>
              <EchoViewsSection data={data.views} onChange={updateData} />
            </AccordionSection>
            <AccordionSection id="echo-lv" title="3. Лівий шлуночок" subtitle="Розміри, ФВ, Simpson, Teichholz, маса ЛШ, геометрія, регіональна скоротливість" isOpen={openSection === 'lv'} onToggle={() => toggleSection('lv')}>
              <EchoLeftVentricleSection data={data.leftVentricle} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-diastolic" title="4. Діастолічна функція" subtitle="PW Doppler, TDI за наявності опції, E/A, E/eʼ" isOpen={openSection === 'diastolic'} onToggle={() => toggleSection('diastolic')}>
              <EchoDiastolicSection data={data.diastolic} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-rv" title="5. Правий шлуночок" subtitle="Розмір, TAPSE, FAC, TDI Sʼ, візуальна функція" isOpen={openSection === 'rv'} onToggle={() => toggleSection('rv')}>
              <EchoRightVentricleSection data={data.rightVentricle} onChange={updateData} />
            </AccordionSection>
            <AccordionSection id="echo-atria-aorta" title="6. Передсердя та аорта" subtitle="ЛП, LAVI, ПП, кільце АК, синуси, висхідна аорта" isOpen={openSection === 'atriaAorta'} onToggle={() => toggleSection('atriaAorta')}>
              <EchoAtriaAortaSection data={data} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-valves" title="7. Клапани" subtitle="АК, МК, ТК, клапан ЛА, Doppler за наявності опції" isOpen={openSection === 'valves'} onToggle={() => toggleSection('valves')}>
              <EchoValvesSection data={data} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-pericardium-ivc" title="8. Перикард і НПВ" subtitle="Рідина, ознаки гемодинамічної значущості, НПВ, RAP" isOpen={openSection === 'pericardiumIvc'} onToggle={() => toggleSection('pericardiumIvc')}>
              <EchoPericardiumIvcSection data={data} onChange={updateData} derived={derived} />
            </AccordionSection>
          </>
        )}
      </div>

      <EchoReportPreview
        overview={report.overview}
        conclusion={report.conclusion}
        recommendations={report.recommendations}
        onOverviewChange={(value) => setReport((current) => ({ ...current, overview: value }))}
        onConclusionChange={(value) => setReport((current) => ({ ...current, conclusion: value }))}
        onRecommendationsChange={(value) => setReport((current) => ({ ...current, recommendations: value }))}
        autoUpdate={autoUpdate}
        onAutoUpdateChange={setAutoUpdate}
        onRegenerate={regenerate}
        onClear={clear}
      />
    </div>
  );
}
