import EcgDisclaimer from '../EcgDisclaimer';
import EcgModuleShell from '../EcgModuleShell';

export default function ComingSoonEcgModule({ module }) {
  return (
    <EcgModuleShell
      eyebrow="ЕКГ"
      title={module.title}
      description={module.description}
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-bold text-slate-950">Запланована структура</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>Ввід клінічно важливих ознак.</li>
          <li>Результат або покрокова інтерпретація.</li>
          <li>Наступний клінічний крок.</li>
          <li>Диференційний ряд.</li>
          <li>Коли потрібно діяти негайно.</li>
          <li>Обережна примітка щодо ESC / міжнародних рекомендацій.</li>
        </ul>
      </div>
      <p className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
        Цей підрозділ підготовлений в архітектурі, але ще не активований як клінічний інструмент.
        Його можна додавати окремим етапом без перебудови вкладки ЕКГ.
      </p>
      <EcgDisclaimer />
    </EcgModuleShell>
  );
}
