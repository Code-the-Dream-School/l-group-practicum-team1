import Input from "./Input";
import "./SearchInput.css";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="search-input">
      <label className="search-label">Search:</label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="search-field"
      />
    </div>
  );
}
