export default function Select({ value, name, onChange, options = [] }) {
  return (
    <select
      name={name}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
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
