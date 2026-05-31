import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { getTournamentPlayers } from "../../services/playerService";
import { getMaxPlayers } from "../../utils/tournament";

function PlayerCount({ tournamentId, totalRounds }) {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const players = await getTournamentPlayers(tournamentId);

        setPlayerCount(players.length);
      } catch (error) {
        console.error(error);
      }
    }

    loadPlayers();
  }, [tournamentId]);

  const maxPlayers = getMaxPlayers(totalRounds);

  return (
    <span className="player-count">
      <Users size={15} />
      {playerCount}/{maxPlayers} Players
    </span>
  );
}

export default PlayerCount;
