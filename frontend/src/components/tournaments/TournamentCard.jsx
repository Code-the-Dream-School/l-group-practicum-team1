import { Link } from "react-router-dom";
import "./TournamentCard.css";

function TournamentCard({ tournament }) {
  return (
    <Link className="tournament-card" to={`/tournaments/${tournament.id}`}>
      <h3>{tournament.name}</h3>
      <p>{new Date(tournament.startDate).toLocaleDateString()}</p>
      <p>{tournament.location}</p>
      <p>{tournament.timeControl}</p>

      <div className="tournament-stats">
        <span>{tournament.totalRounds} Rounds</span>
        <span>{tournament.tournamentType}</span>
      </div>
    </Link>
  );
}

export default TournamentCard;
