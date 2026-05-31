import { useState } from "react";
import { Link } from "react-router-dom";
import { Crown, ClipboardList } from "lucide-react";

import "./TournamentRoundTabs.css";

function TournamentRoundTabs({ rounds, tournamentId, user }) {
  const [activeRoundId, setActiveRoundId] = useState(rounds[0]?.id || "");
  const isAdmin = user?.role === "ADMIN";

  if (!rounds.length) {
    return (
      <section>
        <p>No rounds have been created yet.</p>
      </section>
    );
  }

  const activeRound =
    rounds.find((round) => round.id === activeRoundId) || rounds[0];

  return (
    <section className="rounds-section">
      <div className="round-tabs">
        {rounds.map((round) => (
          <button
            key={round.id}
            type="button"
            className={
              activeRound.id === round.id ? "round-tab active" : "round-tab"
            }
            onClick={() => setActiveRoundId(round.id)}
          >
            Round {round.roundNumber}
          </button>
        ))}
      </div>

      <article className="round-panel">
        <div className="round-panel-header">
          <h3>{activeRound.title || `Round ${activeRound.roundNumber}`}</h3>

          {isAdmin && (
            <Link
              to={`/tournaments/${tournamentId}/rounds`}
              className="round-results-button"
            >
              <ClipboardList size={16} />
              Results
            </Link>
          )}
        </div>

        {activeRound.matches?.length > 0 ? (
          <ul className="match-preview-list">
            {activeRound.matches.map((match) => {
              const player1 = match.player1?.user;
              const player2 = match.player2?.user;

              const player1Name = player1
                ? `${player1.firstName} ${player1.lastName}`
                : "TBD";

              const player2Name = player2
                ? `${player2.firstName} ${player2.lastName}`
                : "Bye";

              const winner =
                match.winnerPlayerId === match.player1Id
                  ? player1Name
                  : match.winnerPlayerId === match.player2Id
                  ? player2Name
                  : null;

              return (
                <li key={match.id} className="match-preview-item">
                  <div className="match-line">
                    <span
                      className={
                        winner === player1Name
                          ? "match-player winner-player"
                          : "match-player"
                      }
                    >
                      {player1Name}
                      {winner === player1Name && (
                        <Crown size={16} className="winner-crown" />
                      )}
                    </span>

                    <span className="match-vs">vs</span>

                    <span
                      className={
                        winner === player2Name
                          ? "match-player winner-player"
                          : "match-player"
                      }
                    >
                      {player2Name}
                      {winner === player2Name && (
                        <Crown size={16} className="winner-crown" />
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No matches available for this round.</p>
        )}
      </article>
    </section>
  );
}

export default TournamentRoundTabs;
