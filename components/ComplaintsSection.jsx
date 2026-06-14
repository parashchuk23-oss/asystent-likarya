import FormField from './FormField';
import SectionHeader from './SectionHeader';
import { textareaClass } from './formStyles';

export default function ComplaintsSection({ formData, onChange }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeader icon="💬" title="Скарги" subtitle="Основні та другорядні скарги пацієнта" />
      <FormField label="Скарги пацієнта">
        <textarea
          value={formData.complaints}
          onChange={(event) => onChange('complaints', event.target.value)}
          placeholder="Біль за грудиною, задишка, серцебиття..."
          rows={4}
          className={textareaClass}
        />
      </FormField>
    </section>
  );
}
