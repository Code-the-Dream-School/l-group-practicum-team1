import { Link } from "react-router-dom";
export default function TournamentRow({ tournament, onEdit, onDelete }) {
  return (
    <tr className="border-b">
      <td className="py-4">
        <Link
          to={`/tournaments/${tournament.id}`}
          className="text-blue-600 cursor-pointer"
        >
          {tournament.name}
        </Link>
      </td>
      <td>{tournament.location}</td>
      <td>{tournament.format}</td>
      <td>{tournament.category}</td>
      <td>{tournament.timeControl}</td>
      <td>{new Date(tournament.startDate).toLocaleDateString()}</td>
      <td>{new Date(tournament.endDate).toLocaleDateString()}</td>
      <td className="space-x-2">
        <button
          onClick={() => onEdit?.(tournament.id)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(tournament.id)}
          className="text-red-600 cursor-pointer hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
