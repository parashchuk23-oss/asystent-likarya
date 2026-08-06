import FormField from '../../FormField';
import { textareaClass } from '../../formStyles';

export default function RespiratoryStatusForm({ formData, onChange }) {
  return (
    <FormField label="Аускультація легень" hint="дихання, хрипи">
      <textarea
        value={formData.lungAuscultation}
        onChange={(event) => onChange('lungAuscultation', event.target.value)}
        rows={3}
        className={textareaClass}
      />
    </FormField>
  );
}
