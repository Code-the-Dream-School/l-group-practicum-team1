import { useEffect, useMemo, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function TournamentPlayerSelector({
  selectedPlayers,
  setSelectedPlayers,
  onChange,
  onAddPlayer,
  onRemovePlayer,
  maxPlayers,
}) {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockPlayers = [
    { id: 1, firstName: "John", lastName: "Miller", rating: 1500 },
    { id: 2, firstName: "Anna", lastName: "Smith", rating: 1200 },
    { id: 3, firstName: "Anna", lastName: "Brown", rating: 1300 },
    { id: 4, firstName: "Anastasia", lastName: "Lee", rating: 1100 },
  ];

  const searchResults = mockPlayers.filter((player) => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    return (
      search &&
      fullName.includes(search.toLowerCase()) &&
      !selectedPlayers.some((selected) => selected.id === player.id)
    );
  });

  // useEffect(() => {
  //   async function fetchPlayers() {
  //     try {
  //       setIsLoading(true);

  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/players?search=${search}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch players");
  //       }

  //       const data = await response.json();

  //       setPlayers(data.data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchPlayers();
  // }, []);

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return [];

    return mockPlayers.filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const alreadySelected = selectedPlayers.some(
        (selected) => selected.id === player.id,
      );

      return fullName.includes(search.toLowerCase()) && !alreadySelected;
    });
  }, [mockPlayers, selectedPlayers, search]);

  function handleSelectPlayer(player) {
    if (maxPlayers && selectedPlayers.length >= maxPlayers) return;

    onAddPlayer(player);
    setSearch("");
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-sm">
        <h3 className="mb-2 text-xl font-bold">Add players:</h3>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type player name..."
        />

        {filteredPlayers.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow">
            {filteredPlayers.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => handleSelectPlayer(player)}
                  className="w-full cursor-pointer px-3 py-2 text-left hover:bg-gray-100"
                >
                  {player.firstName} {player.lastName}
                  {player.rating && (
                    <span className="ml-2 text-sm text-gray-500">
                      Rating: {player.rating}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-6 text-xl font-bold">
          Selected Players for this Tournament: {selectedPlayers.length} /{" "}
          {maxPlayers || "N"}
        </h3>

        {selectedPlayers.length === 0 ? (
          <p className="text-gray-500">No players selected yet.</p>
        ) : (
          <ol className="space-y-2 text-lg">
            {selectedPlayers.map((player) => (
              <li key={player.id} className="flex gap-8">
                <span>
                  {player.firstName} {player.lastName}
                </span>

                <span>Rating: {player.rating}</span>

                <button
                  type="button"
                  onClick={() => onRemovePlayer(player.id)}
                  className="cursor-pointer font-bold hover:underline"
                >
                  [Remove]
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
