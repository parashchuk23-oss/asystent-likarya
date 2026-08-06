import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

export default function NeurologicalStatusForm({ formData, onChange, mode }) {
  return (
    <div className="space-y-1">
      <div className="grid gap-3 md:grid-cols-3">
        <FormField label="Свідомість">
          <input
            type="text"
            value={formData.neuroConsciousness}
            onChange={(event) => onChange('neuroConsciousness', event.target.value)}
            className={inputClass}
          />
        </FormField>

        <FormField label="Орієнтація">
          <input
            type="text"
            value={formData.neuroOrientation}
            onChange={(event) => onChange('neuroOrientation', event.target.value)}
            className={inputClass}
          />
        </FormField>

        <FormField label="Мова">
          <input
            type="text"
            value={formData.neuroSpeech}
            onChange={(event) => onChange('neuroSpeech', event.target.value)}
            className={inputClass}
          />
        </FormField>
      </div>

      {mode !== 'short' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Зіниці">
            <input
              type="text"
              value={formData.neuroPupils}
              onChange={(event) => onChange('neuroPupils', event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Черепні нерви">
            <input
              type="text"
              value={formData.neuroCranialNerves}
              onChange={(event) => onChange('neuroCranialNerves', event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Рухова сфера">
          <input
            type="text"
            value={formData.neuroMotorStrength}
            onChange={(event) => onChange('neuroMotorStrength', event.target.value)}
            className={inputClass}
          />
        </FormField>

        {mode !== 'short' ? (
          <FormField label="Чутливість">
            <input
              type="text"
              value={formData.neuroSensory}
              onChange={(event) => onChange('neuroSensory', event.target.value)}
              className={inputClass}
            />
          </FormField>
        ) : null}
      </div>

      {mode !== 'short' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Координація">
            <input
              type="text"
              value={formData.neuroCoordination}
              onChange={(event) => onChange('neuroCoordination', event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Менінгеальні знаки">
            <input
              type="text"
              value={formData.neuroMeningealSigns}
              onChange={(event) => onChange('neuroMeningealSigns', event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      ) : (
        <FormField label="Менінгеальні знаки">
          <input
            type="text"
            value={formData.neuroMeningealSigns}
            onChange={(event) => onChange('neuroMeningealSigns', event.target.value)}
            className={inputClass}
          />
        </FormField>
      )}

      {mode === 'expanded' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <FormField label="Патологічні рефлекси">
            <input
              type="text"
              value={formData.neuroPathologicalReflexes}
              onChange={(event) => onChange('neuroPathologicalReflexes', event.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Хода">
            <input
              type="text"
              value={formData.neuroGait}
              onChange={(event) => onChange('neuroGait', event.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>
      ) : null}
    </div>
  );
}
