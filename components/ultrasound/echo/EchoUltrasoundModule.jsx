'use client';

import { useEffect, useMemo, useState } from 'react';
import AccordionSection from '../../AccordionSection';
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
    sex: 'male',
    height: '170',
    weight: '75',
  },
  focused: {
    lvFunction: 'preserved',
    rvDilation: 'notDilated',
    pericardialFluid: 'none',
    ivcComment: 'не розширена, колабує на вдиху',
    valveComment: 'грубої клапанної патології не виявлено',
    otherFindings: '',
  },
  views: {
    plax: 'Візуалізація достатня для оцінки кореня аорти, ЛП, ЛШ, АК, МК та перикарда.',
    psax: 'ЛШ округлої форми, скоротливість симетрична, ПШ без очевидної дилатації.',
    a4c: 'Камери серця без очевидної дилатації, глобальна скоротливість ЛШ збережена.',
    a2c: 'Додаткова оцінка ЛШ і ЛП без суттєвих особливостей.',
    a3c: 'Вихідний тракт ЛШ, АК та МК без грубих структурних змін.',
    subcostal: 'Перикардіальна рідина не візуалізується, НПВ не розширена.',
  },
  leftVentricle: {
    lvidd: '48',
    lvids: '31',
    ivsd: '9',
    lvpwd: '9',
    visualEf: 'preserved',
    manualEf: '60',
    edv: '110',
    esv: '44',
    teichholzEdv: '',
    teichholzEsv: '',
    regionalMotion: 'normal',
    regionalDetails: '',
  },
  diastolic: {
    e: '75',
    a: '60',
    dt: '190',
    ePrimeSeptal: '8',
    ePrimeLateral: '12',
    trVmax: '2.4',
    comment: 'Дані не свідчать про явне підвищення тиску наповнення ЛШ; інтерпретувати разом з клінікою.',
  },
  rightVentricle: {
    basalDiameter: '35',
    tapse: '22',
    fac: '40',
    sPrime: '12',
    visualFunction: 'preserved',
    comment: 'ПШ не дилатований, систолічна функція збережена.',
  },
  leftAtrium: {
    apSize: '36',
    volume: '50',
  },
  rightAtrium: {
    area: '16',
    visualDilation: 'notDilated',
  },
  aorta: {
    annulus: '22',
    sinuses: '32',
    stj: '28',
    ascending: '34',
  },
  aorticValve: {
    type: 'tricuspid',
    morphology: 'normal',
    regurgitation: 'none',
    vmax: '1.3',
    lvotDiameter: '20',
    lvotVti: '20',
    avVti: '25',
  },
  mitralValve: {
    morphology: 'normal',
    regurgitation: 'none',
  },
  tricuspidValve: {
    regurgitation: 'trivial',
    trVmax: '2.4',
  },
  pulmonaryValve: {
    regurgitation: 'none',
  },
  pericardium: {
    fluid: 'none',
    separation: '0',
    tamponadeSigns: '',
  },
  ivc: {
    maxDiameter: '18',
    minDiameter: '8',
    rap: '3',
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
                Структурований протокол трансторакального УЗД серця з локальними розрахунками та
                короткими орієнтирами норми під показниками.
              </p>
            </div>
            <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
              Сформувати протокол
            </button>
          </div>
        </div>

        <AccordionSection id="echo-basic" title="1. Основні дані" subtitle="Режим, BSA, опції апарата" isOpen={openSection === 'basic'} onToggle={() => toggleSection('basic')}>
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
            <AccordionSection id="echo-diastolic" title="4. Діастолічна функція" subtitle="E/A, eʼ, E/eʼ, DT та TR Vmax" isOpen={openSection === 'diastolic'} onToggle={() => toggleSection('diastolic')}>
              <EchoDiastolicSection data={data.diastolic} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-rv" title="5. Правий шлуночок" subtitle="Розмір, TAPSE, FAC, TDI Sʼ, візуальна функція" isOpen={openSection === 'rv'} onToggle={() => toggleSection('rv')}>
              <EchoRightVentricleSection data={data.rightVentricle} onChange={updateData} />
            </AccordionSection>
            <AccordionSection id="echo-atria-aorta" title="6. Передсердя та аорта" subtitle="ЛП, LAVI, ПП, кільце АК, синуси, висхідна аорта" isOpen={openSection === 'atriaAorta'} onToggle={() => toggleSection('atriaAorta')}>
              <EchoAtriaAortaSection data={data} onChange={updateData} derived={derived} />
            </AccordionSection>
            <AccordionSection id="echo-valves" title="7. Клапани" subtitle="АК, МК, ТК, клапан ЛА, морфологія та гемодинаміка" isOpen={openSection === 'valves'} onToggle={() => toggleSection('valves')}>
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
