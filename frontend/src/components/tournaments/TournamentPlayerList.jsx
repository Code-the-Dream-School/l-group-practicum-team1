import { useEffect, useState } from "react";

import { getTournamentPlayers } from "../../services/playerService";

function TournamentPlayerList({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getTournamentPlayers(tournamentId);
        setPlayers(data);
      } catch (err) {
        setError(err.message || "Could not load players");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, [tournamentId]);

  return (
    <section>
      <h2>Registered Players</h2>

      {isLoading && <p>Loading players...</p>}

      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && players.length === 0 && (
        <p>No players registered yet.</p>
      )}

      {!isLoading && !error && players.length > 0 && (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.user?.firstName} {player.user?.lastName}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TournamentPlayerList;
