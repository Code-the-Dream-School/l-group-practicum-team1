// components/tournaments/TournamentRow.jsx
export default function TournamentRow({ tournament, onEdit, onDelete }) {
  return (
    <tr className="border-b">
      <td className="py-4">{tournament.name}</td>
      <td>{tournament.location}</td>
      <td>{tournament.format}</td>
      <td>{tournament.category}</td>
      <td>{tournament.timeControl}</td>
      <td>{tournament.startDate}</td>
      <td>{tournament.endDate}</td>
      <td className="space-x-2">
        <button
          onClick={() => onEdit?.(tournament.id)}
          className="text-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(tournament.id)}
          className="text-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
