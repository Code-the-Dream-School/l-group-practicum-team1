import React from "react";
import { Crown } from "lucide-react";
import "./TournamentCard.css";
import "./TournamentResult.css";

export default function TournamentResult(winners) {
  return (
    <>
      <div className="tournament-result">
        <div className="result-divider" />
        <div className="winner-block">
          <span className="winner-title tournament-type-badge">Champion</span>
          <div className="winner-name">
            {winners?.winner.user.firstName} {winners?.winner.user.lastName}
            <Crown size={16} className="winner-crown" />
          </div>
        </div>

        <div className="runner-up-block">
          <span className="runner-up-title tournament-type-badge">
            2nd place
          </span>
          <div className="runner-up-name">
            {winners?.runnerUp.user.firstName} {winners?.runnerUp.user.lastName}
          </div>
        </div>

        <p className="final-score">
          Final score: <span>{winners?.finalScore}</span>
        </p>
      </div>
    </>
  );
}
