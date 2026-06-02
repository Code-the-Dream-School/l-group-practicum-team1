import { useEffect, useState } from "react";
import TournamentRegistrationButton from "./TournamentRegistrationButton";
import PlayerCount from "../players/PlayerCount";
import { getTournaments } from "../../services/tournamentService";
import {
  getTournamentStatus,
  formatTournamentDateRange,
  getTournamentResult,
} from "../../utils/tournament";
import { CalendarDays, MapPin, Clock, Trophy, Layers } from "lucide-react";
import "./TournamentHeader.css";
import TournamentResult from "./TournamentResult";

function TournamentHeader({ tournamentId, registrationClosed, rounds = [] }) {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTournament() {
      try {
        const tournaments = await getTournaments();

        const selectedTournament = tournaments.find(
          (tournament) => tournament.id === tournamentId,
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

  const status = getTournamentStatus(tournament);

  const lastRound = [...rounds].sort(
    (a, b) => b.roundNumber - a.roundNumber,
  )[0];

  const finalMatch = lastRound?.matches?.[0];

  const isTournamentCompleted =
    lastRound?.roundNumber === tournament.totalRounds &&
    Boolean(finalMatch?.winnerPlayerId);

  const winners = isTournamentCompleted ? getTournamentResult(rounds) : null;

  return (
    <header className="tournament-header">
      <h1>{tournament.name}</h1>

      {status === "upcoming" && !registrationClosed && (
        <TournamentRegistrationButton
          tournamentId={tournamentId}
          registrationClosed={registrationClosed}
        />
      )}

      <div className="tournament-card-top">
        <span className="tournament-type-badge">
          <Trophy size={14} />
          {tournament.tournamentType}
        </span>

        <span className={`status-badge status-${status}`}>
          {status === "live" && "🟢 Live"}
          {status === "upcoming" && "🔵 Upcoming"}
          {status === "completed" && "⚫ Finished"}
        </span>
      </div>

      <div className="tournament-info-list">
        <p>
          <CalendarDays size={18} />
          {formatTournamentDateRange(tournament.startDate, tournament.endDate)}
        </p>

        <p>
          <MapPin size={18} />
          {tournament.location}
        </p>

        <p>
          <Clock size={18} />
          {tournament.timeControl}
        </p>
      </div>

      {winners && <TournamentResult winners={winners} />}

      <div className="tournament-header-stats">
        <PlayerCount
          tournamentId={tournament.id}
          totalRounds={tournament.totalRounds}
        />

        <span>
          <Layers size={16} />
          {tournament.totalRounds} Rounds
        </span>
      </div>
    </header>
  );
}

export default TournamentHeader;
