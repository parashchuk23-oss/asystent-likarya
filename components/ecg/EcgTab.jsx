'use client';

import { useMemo, useState } from 'react';
import { ecgModules } from '../../data/ecg/ecgModules';
import EcgSidebar from './EcgSidebar';
import AxisModule from './modules/AxisModule';
import ComingSoonEcgModule from './modules/ComingSoonEcgModule';
import EcgChecklistModule from './modules/EcgChecklistModule';
import QtQtcModule from './modules/QtQtcModule';

function renderModule(activeModule) {
  if (activeModule.id === 'checklist') return <EcgChecklistModule />;
  if (activeModule.id === 'qt') return <QtQtcModule />;
  if (activeModule.id === 'axis') return <AxisModule />;
  return <ComingSoonEcgModule module={activeModule} />;
}

export default function EcgTab() {
  const [activeId, setActiveId] = useState('checklist');
  const activeModule = useMemo(
    () => ecgModules.find((module) => module.id === activeId) || ecgModules[0],
    [activeId],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">ЕКГ-помічник</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">Цифровий помічник для структурованої інтерпретації ЕКГ</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
          Модуль допомагає лікарю послідовно пройти логіку аналізу ЕКГ: від базового
          чек-листа до інтервалів, електричної осі та майбутніх алгоритмів провідності,
          STEMI, тахікардій і ЕКГ-синдромів.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-slate-200 bg-white p-3">
          <EcgSidebar modules={ecgModules} activeModule={activeModule.id} onSelect={setActiveId} />
        </aside>
        <main>{renderModule(activeModule)}</main>
      </div>
    </div>
  );
}
