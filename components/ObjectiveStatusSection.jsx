import FormField from './FormField';
import SectionHeader from './SectionHeader';
import { inputClass, textareaClass } from './formStyles';

export default function ObjectiveStatusSection({ formData, onChange }) {
  return (
    <section className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
      <SectionHeader icon="🩺" title="Об'єктивний статус" subtitle="Дані огляду та обстеження" />

      <FormField label="Загальний стан">
        <div className="mt-1 flex flex-wrap gap-5">
          {['задовільний', 'відносно задовільний', 'середній', 'тяжкий'].map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:border-blue-200 hover:bg-blue-50">
              <input
                type="radio"
                name="generalCondition"
                value={option}
                checked={formData.generalCondition === option}
                onChange={() => onChange('generalCondition', option)}
                className="h-4 w-4 cursor-pointer text-blue-600"
              />
              <span className="text-sm font-medium text-slate-700">{option}</span>
            </label>
          ))}
        </div>
        <input
          type="text"
          value={formData.generalConditionNote}
          onChange={(event) => onChange('generalConditionNote', event.target.value)}
          placeholder="Додаткова інформація"
          className={`${inputClass} mt-3`}
        />
      </FormField>

      <FormField label="Шкірні покриви">
        <input
          type="text"
          value={formData.skinCondition}
          onChange={(event) => onChange('skinCondition', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Тип будови тіла">
        <select
          value={formData.bodyType}
          onChange={(event) => onChange('bodyType', event.target.value)}
          className={inputClass}
        >
          <option value="нормостенічний">нормостенічний</option>
          <option value="астенічний">астенічний</option>
          <option value="гіперстенічний">гіперстенічний</option>
        </select>
      </FormField>

      <FormField label="Лімфатичні вузли">
        <input
          type="text"
          value={formData.lymphNodes}
          onChange={(event) => onChange('lymphNodes', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Щитоподібна залоза">
        <input
          type="text"
          value={formData.thyroid}
          onChange={(event) => onChange('thyroid', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Ротова порожнина">
        <input
          type="text"
          value={formData.oralCavity}
          onChange={(event) => onChange('oralCavity', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField label="Зріст" hint="см">
          <input
            type="number"
            value={formData.height}
            onChange={(event) => onChange('height', event.target.value)}
            placeholder="170"
            min="100"
            max="250"
            className={inputClass}
          />
        </FormField>

        <FormField label="Вага" hint="кг">
          <input
            type="number"
            value={formData.weight}
            onChange={(event) => onChange('weight', event.target.value)}
            placeholder="75"
            min="20"
            max="300"
            className={inputClass}
          />
        </FormField>

        <FormField label="Індекс маси тіла" hint="кг/м²">
          <input
            type="text"
            value={formData.bmi}
            readOnly
            placeholder="Автоматично"
            className={`${inputClass} bg-slate-50 text-slate-600`}
          />
        </FormField>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Артеріальний тиск" hint="мм рт.ст.">
          <input
            type="text"
            inputMode="numeric"
            value={formData.bloodPressure}
            onChange={(event) => onChange('bloodPressure', event.target.value)}
            placeholder="120-80"
            className={inputClass}
          />
        </FormField>

        <FormField label="ЧСС" hint="уд/хв">
          <input
            type="number"
            value={formData.heartRate}
            onChange={(event) => onChange('heartRate', event.target.value)}
            placeholder="72"
            min="20"
            max="300"
            className={inputClass}
          />
        </FormField>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Аускультація серця" hint="тони, шуми">
          <textarea
            value={formData.heartAuscultation}
            onChange={(event) => onChange('heartAuscultation', event.target.value)}
            placeholder="Тони серця ритмічні, звучні. Шуми не вислуховуються."
            rows={3}
            className={textareaClass}
          />
        </FormField>

        <FormField label="Аускультація легень" hint="дихання, хрипи">
          <textarea
            value={formData.lungAuscultation}
            onChange={(event) => onChange('lungAuscultation', event.target.value)}
            placeholder="Дихання везикулярне. Хрипів немає."
            rows={3}
            className={textareaClass}
          />
        </FormField>
      </div>

      <FormField label="Живіт">
        <input
          type="text"
          value={formData.abdomen}
          onChange={(event) => onChange('abdomen', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Дефекація">
        <input
          type="text"
          value={formData.defecation}
          onChange={(event) => onChange('defecation', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Сечовипускання">
        <input
          type="text"
          value={formData.urination}
          onChange={(event) => onChange('urination', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Симптом поколочування по попереку">
        <input
          type="text"
          value={formData.cvsSymptom}
          onChange={(event) => onChange('cvsSymptom', event.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField label="Набряки">
        <input
          type="text"
          value={formData.edema}
          onChange={(event) => onChange('edema', event.target.value)}
          className={inputClass}
        />
      </FormField>
    </section>
  );
}
