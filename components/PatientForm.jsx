'use client';

import AccordionSection from './AccordionSection';
import ComplaintsSection from './ComplaintsSection';
import ObjectiveStatusSection from './ObjectiveStatusSection';
import FormField from './FormField';
import { inputClass, textareaClass } from './formStyles';

export default function PatientForm({
  formData,
  onChange,
  onGenerateConclusion,
  onClearConclusion,
  openSection,
  onToggleSection,
}) {
  return (
    <form className="space-y-3">
      <AccordionSection
        id="passport"
        title="Паспортна частина"
        subtitle="Основні дані пацієнта"
        isOpen={openSection === 'passport'}
        onToggle={() => onToggleSection('passport')}
      >
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
              type="text"
              inputMode="numeric"
              value={formData.birthDate}
              onChange={(event) => onChange('birthDate', event.target.value)}
              placeholder="дд.мм.рррр"
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
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
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
      </AccordionSection>

      <AccordionSection
        id="complaints"
        title="Скарги"
        subtitle="Основні та другорядні скарги пацієнта"
        isOpen={openSection === 'complaints'}
        onToggle={() => onToggleSection('complaints')}
      >
        <ComplaintsSection formData={formData} onChange={onChange} />
      </AccordionSection>

      <AccordionSection
        id="objective-status"
        title="Об'єктивний статус"
        subtitle="Дані огляду та обстеження"
        isOpen={openSection === 'objective-status'}
        onToggle={() => onToggleSection('objective-status')}
      >
        <ObjectiveStatusSection formData={formData} onChange={onChange} />
      </AccordionSection>

      <AccordionSection
        id="clinical-data"
        title="Клінічні дані"
        subtitle="Діагноз та рекомендації"
        isOpen={openSection === 'clinical-data'}
        onToggle={() => onToggleSection('clinical-data')}
      >
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

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={onGenerateConclusion}
              className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700"
            >
              Розрахувати
            </button>
            <button
              type="button"
              onClick={onClearConclusion}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              Очистити
            </button>
          </div>
        </div>
      </AccordionSection>
    </form>
  );
}
