import { Link } from "react-router-dom";
import { isAdmin } from "../../utils/auth";
import {
  CalendarDays,
  MapPin,
  Clock,
  Trophy,
  Layers,
  Users,
  Edit,
  Trash2,
} from "lucide-react";

import "./TournamentCard.css";

function TournamentCard({ tournament, onDelete }) {
  const admin = isAdmin();

  const formattedDate = new Date(tournament.startDate).toLocaleDateString();

  const startDate = new Date(tournament.startDate);

  const endDate = new Date(tournament.endDate);

  const tournamentDates = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  const playerCount =
    tournament.playerCount ||
    tournament.playersCount ||
    tournament.tournamentPlayers?.length ||
    0;

  return (
    <div className="tournament-card-wrapper">
      <Link className="tournament-card" to={`/tournaments/${tournament.id}`}>
        <h3>{tournament.name}</h3>

        <div className="tournament-card-top">
          <span className="tournament-type-badge">
            <Trophy size={14} />
            {tournament.tournamentType}
          </span>
        </div>

        <div className="tournament-info-list">
          <p>
            <CalendarDays size={16} />
            {tournamentDates}
          </p>

          <p>
            <MapPin size={16} />
            {tournament.location}
          </p>

          <p>
            <Clock size={16} />
            {tournament.timeControl}
          </p>
        </div>

        <div className="tournament-stats">
          <span>
            <Layers size={15} />
            {tournament.totalRounds} Rounds
          </span>

          <span>
            <Users size={15} />
            {playerCount} Players
          </span>
        </div>
      </Link>

      {admin && (
        <div className="admin-actions">
          <button type="button" className="edit-button">
            <Edit size={16} />
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(tournament.id)}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TournamentCard;
