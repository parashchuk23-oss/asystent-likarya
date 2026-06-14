'use client';

import ComplaintsSection from './ComplaintsSection';
import ObjectiveStatusSection from './ObjectiveStatusSection';
import FormField from './FormField';
import SectionHeader from './SectionHeader';
import { inputClass, textareaClass } from './formStyles';

export default function PatientForm({ formData, onChange }) {
  return (
    <form className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader icon="👤" title="Паспортна частина" subtitle="Основні дані пацієнта" />

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Вік</span>
            <input
              type="number"
              value={formData.age}
              onChange={(event) => onChange('age', event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Дата прийому</span>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(event) => onChange('visitDate', event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <ComplaintsSection formData={formData} onChange={onChange} />
      <ObjectiveStatusSection formData={formData} onChange={onChange} />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeader icon="📋" title="Заключні дані" subtitle="Діагноз та рекомендації" />

        <div className="space-y-3">
          <FormField label="Діагноз">
            <textarea
              value={formData.diagnosis}
              onChange={(event) => onChange('diagnosis', event.target.value)}
              className={textareaClass}
            />
          </FormField>

          <FormField label="Рекомендації">
            <textarea
              value={formData.recommendations}
              onChange={(event) => onChange('recommendations', event.target.value)}
              className={textareaClass}
            />
          </FormField>
        </div>
      </section>
    </form>
  );
}
