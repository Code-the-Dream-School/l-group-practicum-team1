export default function FormField({ label, children, error }) {
  return (
    <div className={`form-field ${error ? "error" : ""}`}>
      <label className="form-label">{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
