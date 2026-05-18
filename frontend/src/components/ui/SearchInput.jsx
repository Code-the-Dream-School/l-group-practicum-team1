import Input from "./Input";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="font-semibold">Search:</label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
}
