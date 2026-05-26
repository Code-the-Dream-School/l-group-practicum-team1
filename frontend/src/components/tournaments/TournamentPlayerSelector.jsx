import { useEffect, useMemo, useState } from "react";
import Input from "../ui/Input";
import "./TournamentPlayerSelector.css";

export default function TournamentPlayerSelector({
  selectedPlayers,
  onAddPlayer,
  onRemovePlayer,
  maxPlayers,
}) {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState([]); // players from search
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  // fetch search players
  useEffect(() => {
    async function fetchPlayers() {
      if (!search.length) return;
      try {
        setIsLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/users?search=${encodeURIComponent(search)}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }

        const data = await response.json();

        setPlayers(data.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayers();
  }, [search]);

  // filter players from search
  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return [];

    return players.filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      const alreadySelected = selectedPlayers.some(
        (selected) => selected.id === player.id,
      );

      return fullName.includes(search.toLowerCase()) && !alreadySelected;
    });
  }, [players, selectedPlayers, search]);

  function handleSelectPlayer(player) {
    if (maxPlayers && selectedPlayers.length >= maxPlayers) return;

    onAddPlayer(player);
    setSearch("");
  }

  return (
    <div className="player-selector">
      <div className="player-search">
        <h3 className="player-selector-title">Add players:</h3>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type player name..."
        />

        {filteredPlayers.length > 0 && (
          <ul className="player-dropdown">
            {filteredPlayers.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => handleSelectPlayer(player)}
                  className="player-dropdown-btn"
                >
                  {player.firstName} {player.lastName}
                  {player.rating && (
                    <span className="player-rating">
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
        <h3 className="player-selector-title selected-title">
          Selected Players: {selectedPlayers.length} / {maxPlayers || "N"}
        </h3>

        {selectedPlayers.length === 0 ? (
          <p className="empty-text">No players selected yet.</p>
        ) : (
          <ol className="selected-player-list">
            {selectedPlayers.map((player) => (
              <li key={player.id} className="selected-player">
                <span>
                  {player.firstName} {player.lastName}
                </span>

                <span>Rating: {player.rating}</span>

                <button
                  type="button"
                  onClick={() => onRemovePlayer(player.id)}
                  className="remove-player-btn"
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
