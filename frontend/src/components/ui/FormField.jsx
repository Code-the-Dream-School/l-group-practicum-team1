import "./FormField.css";

export default function FormField({ label, children, error, htmlFor }) {
  return (
    <div className={`form-field ${error ? "error" : ""}`}>
      <label className="form-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
