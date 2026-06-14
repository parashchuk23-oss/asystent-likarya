export default function FormField({ label, required, error, children, hint }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs font-normal text-slate-400">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
