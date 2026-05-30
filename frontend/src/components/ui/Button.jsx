import "./Button.css";
export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${disabled ? "btn-disabled" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
