import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

export default function GeneralStatusForm({ formData, onChange, mode }) {
  return (
    <div className="space-y-1">
      <FormField label="Загальний стан">
        <div className="mt-1 flex flex-wrap gap-2">
          {['задовільний', 'відносно задовільний', 'середній', 'тяжкий'].map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 transition ${
                formData.generalCondition === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
              }`}
            >
              <input
                type="radio"
                name="generalCondition"
                value={option}
                checked={formData.generalCondition === option}
                onChange={() => onChange('generalCondition', option)}
                className="h-4 w-4 cursor-pointer text-blue-600"
              />
              <span className="text-sm font-medium">{option}</span>
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

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Шкірні покриви">
          <input
            type="text"
            value={formData.skinCondition}
            onChange={(event) => onChange('skinCondition', event.target.value)}
            className={inputClass}
          />
        </FormField>

        {mode !== 'short' ? (
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
        ) : null}
      </div>

      {mode !== 'short' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Лімфатичні вузли">
            <input
              type="text"
              value={formData.lymphNodes}
              onChange={(event) => onChange('lymphNodes', event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Живіт">
            <input
              type="text"
              value={formData.abdomen}
              onChange={(event) => onChange('abdomen', event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
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

        <FormField label="Маса тіла" hint="кг">
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

        <FormField label="ІМТ" hint="кг/м²">
          <input
            type="text"
            value={formData.bmi}
            readOnly
            placeholder="Автоматично"
            className={`${inputClass} bg-slate-50 text-slate-600`}
          />
        </FormField>
      </div>

      {mode === 'expanded' ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
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
          </div>

          <div className="grid gap-3 md:grid-cols-3">
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

            <FormField label="Симптом поколочування">
              <input
                type="text"
                value={formData.cvsSymptom}
                onChange={(event) => onChange('cvsSymptom', event.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>
        </>
      ) : null}
    </div>
  );
}
