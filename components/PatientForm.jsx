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
            <span className="mb-1 block text-slate-600">Дата прийому</span>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(event) => onChange('visitDate', event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Дата народження</span>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(event) => onChange('birthDate', event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Вік</span>
            <input
              type="text"
              value={formData.age ? `${formData.age} р.` : ''}
              readOnly
              placeholder="Розраховується автоматично"
              className={`${inputClass} bg-slate-50 text-slate-600`}
            />
          </label>

          <div className="text-sm">
            <span className="mb-1 block text-slate-600">Стать</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'жінка', label: 'Жінка' },
                { value: 'чоловік', label: 'Чоловік' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    formData.sex === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="patient-sex"
                    value={option.value}
                    checked={formData.sex === option.value}
                    onChange={(event) => onChange('sex', event.target.value)}
                    className="h-4 w-4"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
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
