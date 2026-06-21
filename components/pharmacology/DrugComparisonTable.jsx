export default function DrugComparisonTable({ drugs }) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1040px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              {[
                'МНН',
                'Звичайна доза',
                'Максимальна доза',
                'Кратність',
                'Період напіввиведення',
                'Орієнтовна сила',
                'Практичний коментар',
              ].map((heading) => (
                <th key={heading} scope="col" className="border-b border-slate-200 px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {drugs.map((drug) => (
              <tr key={drug.internationalName} className="align-top hover:bg-slate-50/70">
                <th scope="row" className="px-4 py-4 font-semibold text-slate-950">
                  {drug.internationalName}
                </th>
                <td className="px-4 py-4">{drug.usualDose}</td>
                <td className="px-4 py-4">{drug.maxDose}</td>
                <td className="px-4 py-4">{drug.frequency}</td>
                <td className="px-4 py-4">{drug.halfLife}</td>
                <td className="max-w-56 px-4 py-4">Залежить від дози та клінічного контексту</td>
                <td className="max-w-72 px-4 py-4">{drug.practicalUse[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
