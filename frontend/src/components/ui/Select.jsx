import "./Select.css";

export default function Select({ id, value, name, onChange, options = [] }) {
  return (
    <select
      id={id}
      name={name}
      className="select"
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
