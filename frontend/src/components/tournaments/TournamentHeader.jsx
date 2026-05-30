import { useEffect, useState } from "react";

import { getTournaments } from "../../services/tournamentService";
import {
  getTournamentStatus,
  formatTournamentDateRange,
} from "../../utils/tournament";

function TournamentHeader({ tournamentId }) {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTournament() {
      try {
        const tournaments = await getTournaments();

        const selectedTournament = tournaments.find(
          (tournament) => tournament.id === tournamentId
        );

        setTournament(selectedTournament);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTournament();
  }, [tournamentId]);

  if (isLoading) {
    return <h1>Loading tournament...</h1>;
  }

  if (!tournament) {
    return <h1>Tournament not found</h1>;
  }

  return (
    <header>
      <h1>{tournament.name}</h1>

      <p>
        {getTournamentStatus(tournament) === "live" && "🟢 Live"}
        {getTournamentStatus(tournament) === "upcoming" && "🔵 Upcoming"}
        {getTournamentStatus(tournament) === "completed" && "⚫ Finished"}
      </p>

      <p>📍 {tournament.location}</p>

      <p>
        📅 {formatTournamentDateRange(tournament.startDate, tournament.endDate)}
      </p>

      <p>♟️ {tournament.timeControl}</p>

      <p>🏆 {tournament.tournamentType}</p>
    </header>
  );
}

export default TournamentHeader;
