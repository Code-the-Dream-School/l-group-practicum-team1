export default function FormField({ label, children, error }) {
  return (
    <div className="space-y-1">
      <label className="block font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
