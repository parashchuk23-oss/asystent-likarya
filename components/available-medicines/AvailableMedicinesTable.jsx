'use client';

import { sendGAEvent } from '@next/third-parties/google';
import {
  buildTabletkiSearchUrl,
  formatCopayment,
  formatPackageQuantity,
} from '../../utils/availableMedicines';

function trackTabletkiClick() {
  sendGAEvent('event', 'medicine_availability_external_click', {
    source: 'tabletki_ua',
  });
}

export default function AvailableMedicinesTable({ medicines }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          <tr>
            <th className="border-b border-slate-200 px-3 py-3">Діюча речовина</th>
            <th className="border-b border-slate-200 px-3 py-3">Торгова назва</th>
            <th className="border-b border-slate-200 px-3 py-3">Дозування</th>
            <th className="border-b border-slate-200 px-3 py-3">Виробник</th>
            <th className="border-b border-slate-200 px-3 py-3 text-center">Кількість в упаковці</th>
            <th className="border-b border-slate-200 px-3 py-3 text-right">Доплата пацієнта</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id} className="transition hover:bg-blue-50/40">
              <td className="border-b border-slate-100 px-3 py-2.5 font-medium text-slate-950">
                {medicine.activeIngredient || 'Немає даних'}
              </td>
              <td className="border-b border-slate-100 px-3 py-2.5 text-slate-800">
                <span className="block">{medicine.tradeName || 'Немає даних'}</span>
                <a
                  href={buildTabletkiSearchUrl(medicine)}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  onClick={trackTabletkiClick}
                  aria-label="Перевірити на Tabletki.ua — відкриється у новій вкладці"
                  className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold leading-5 text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <span>Перевірити на Tabletki.ua</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </td>
              <td className="border-b border-slate-100 px-3 py-2.5 text-slate-700">
                {medicine.dosage || 'Немає даних'}
              </td>
              <td className="border-b border-slate-100 px-3 py-2.5 text-slate-700">
                {medicine.manufacturer || 'Немає даних'}
              </td>
              <td className="border-b border-slate-100 px-3 py-2.5 text-center text-slate-700">
                {formatPackageQuantity(medicine)}
              </td>
              <td className="border-b border-slate-100 px-3 py-2.5 text-right font-semibold text-slate-950">
                {formatCopayment(medicine.copayment)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
