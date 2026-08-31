import { textareaClass } from '../formStyles';

export default function UltrasoundComplaintsField({ value, onChange }) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-white p-4">
      <span className="mb-1 block text-sm font-semibold text-slate-700">Скарги</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Необов’язково. Якщо поле заповнене, скарги буде додано до протоколу."
        className={textareaClass}
      />
    </label>
  );
}
