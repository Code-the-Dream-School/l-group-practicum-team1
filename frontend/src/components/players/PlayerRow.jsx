export default function PlayerRow({ player, onAdd }) {
  return (
    <tr className="border-b">
      <td className="py-3">
        {player.firstName} {player.lastName}
      </td>
      <td>{player.rating || "-"}</td>
      <td>{player.email || "-"}</td>
      <td>
        <button onClick={() => onAdd(player)} className="text-blue-600">
          Add
        </button>
      </td>
    </tr>
  );
}
