import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Users } from "lucide-react";

import PageLayout from "../components/layout/PageLayout";
import TournamentHeader from "../components/tournaments/TournamentHeader";
import TournamentRoundTabs from "../components/tournaments/TournamentRoundTabs";
import { getRounds } from "../services/tournamentService";
import { getTournamentResult } from "../utils/tournament";

import "./TournamentDetails.css";

function TournamentDetails() {
  const { tournamentId } = useParams();

  const [rounds, setRounds] = useState([]);
  const [roundsError, setRoundsError] = useState("");
  const [isLoadingRounds, setIsLoadingRounds] = useState(true);

  useEffect(() => {
    async function loadRounds() {
      try {
        const data = await getRounds(tournamentId);
        setRounds(data);
      } catch (err) {
        setRoundsError(err.message || "Could not load rounds");
      } finally {
        setIsLoadingRounds(false);
      }
    }

    loadRounds();
  }, [tournamentId]);

  return (
    <PageLayout>
      {({ user }) => {
        const isAdmin = user?.role === "ADMIN";
        const hasRounds = rounds.length > 0;

        return (
          <section className="tournament-details-page">
            <TournamentHeader
              tournamentId={tournamentId}
              registrationClosed={hasRounds}
              rounds={rounds}
            />

            {isAdmin && (
              <div className="tournament-detail-actions">
                {hasRounds ? (
                  <button
                    className="add-players-button disabled"
                    type="button"
                    disabled
                  >
                    <Users size={18} />
                    Add Players
                  </button>
                ) : (
                  <Link
                    to={`/tournaments/${tournamentId}/players`}
                    className="add-players-button"
                  >
                    <Users size={18} />
                    Add Players
                  </Link>
                )}
              </div>
            )}

            <section className="rounds-wrapper">
              {isLoadingRounds && <p>Loading rounds...</p>}

              {roundsError && <p className="error-message">{roundsError}</p>}

              {!isLoadingRounds && !roundsError && (
                <TournamentRoundTabs
                  rounds={rounds}
                  tournamentId={tournamentId}
                  user={user}
                />
              )}
            </section>
          </section>
        );
      }}
    </PageLayout>
  );
}

export default TournamentDetails;
