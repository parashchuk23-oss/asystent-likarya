'use client';

import { formatCopayment, formatPackageQuantity } from '../../utils/availableMedicines';

export default function AvailableMedicinesTable({ medicines }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
      <table className="min-w-[880px] w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          <tr>
            <th className="border-b border-slate-200 px-3 py-3">Діюча речовина</th>
            <th className="border-b border-slate-200 px-3 py-3">Торгова назва</th>
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
                {medicine.tradeName || 'Немає даних'}
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
