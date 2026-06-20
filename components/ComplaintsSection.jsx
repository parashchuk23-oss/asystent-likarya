import FormField from './FormField';
import { textareaClass } from './formStyles';

export default function ComplaintsSection({ formData, onChange }) {
  return (
    <>
      <FormField label="Скарги пацієнта">
        <textarea
          value={formData.complaints}
          onChange={(event) => onChange('complaints', event.target.value)}
          placeholder="Біль за грудиною, задишка, серцебиття..."
          rows={4}
          className={textareaClass}
        />
      </FormField>
    </>
  );
}
