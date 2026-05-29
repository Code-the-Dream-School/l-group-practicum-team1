import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/PageLayout";
import MatchResults from "../components/tournaments/MatchResults";
import "./RoundResults.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function RoundResults() {
  const [tournament, setTournament] = useState({});
  const [rounds, setRounds] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const token = localStorage.getItem("token");
  const { tournamentId } = useParams();

  async function getRounds() {
    try {
      const response = await fetch(
        `${API_URL}/api/tournaments/${tournamentId}/rounds`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get rounds");
      }

      const results = await response.json();

      console.log("data rounds: \n", results.data);
      console.log("pagination: \n", results.pagination);

      setTournament(results.data[0].tournament);
      if (!activeTab) {
        setActiveTab(results.data[0].roundNumber);
      }

      setRounds(results.data);
    } catch (error) {
      console.error("Get rounds error:", error);
    }
  }

  useEffect(() => {
    if (tournamentId) {
      getRounds();
    }

    const isFinal = activeRound?.roundNumber === tournament.totalRounds;
  }, [tournamentId]);

  async function handleGenerateNextRound() {
    const response = await fetch(
      `${API_URL}/api/tournaments/${tournamentId}/rounds`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.log("Generate next round error:", result);
      return;
    }

    await getRounds();
    setActiveTab(result.roundNumber);
  }

  const activeRound = rounds.find((round) => round.roundNumber === activeTab);
  console.log("activeRound", activeRound);

  const activeRoundMatches = activeRound?.matches || [];
  console.log("activeRoundMatches", activeRoundMatches);

  // latest created round
  const lastRound = rounds[rounds.length - 1];

  const isTournamentCompleted =
    lastRound?.roundNumber === tournament?.totalRounds &&
    lastRound?.matches?.every((m) => m.winnerPlayerId !== null);

  console.log("isTournamentCompleted in RoundResults:", isTournamentCompleted);

  // based on current an active tab
  const isActiveRoundCompleted = activeRound?.matches?.every(
    (match) => match.winnerPlayerId !== null,
  );

  // active tab is the latest created round
  const isLatestCreatedRound =
    activeRound?.roundNumber === lastRound?.roundNumber;

  const showGenerateNextRoundButton =
    !isTournamentCompleted && isLatestCreatedRound && isActiveRoundCompleted;

  return (
    <PageLayout>
      <div>
        {!tournament ? (
          <p>Loading tournament...</p>
        ) : (
          <>
            <nav className="rounds-tabs">
              {rounds.map((round) => (
                <button
                  key={round.roundNumber}
                  className={
                    activeTab === round.roundNumber
                      ? "tab-button active"
                      : "tab-button"
                  }
                  onClick={() => setActiveTab(round.roundNumber)}
                >
                  Round {round.roundNumber}
                </button>
              ))}
            </nav>

            <MatchResults
              matches={activeRoundMatches}
              isTournamentCompleted={isTournamentCompleted}
              onMatchSaved={getRounds}
            />
            {!isTournamentCompleted &&
              isActiveRoundCompleted &&
              isLatestCreatedRound && (
                <div className="round-actions">
                  <p className="round-status success">
                    All matches completed. Generate next round.
                  </p>
                  <Button
                    disabled={!isActiveRoundCompleted}
                    onClick={handleGenerateNextRound}
                  >
                    Generate Next Round
                  </Button>
                </div>
              )}

            {isTournamentCompleted && (
              <div className="round-actions">
                <p className="round-status success">Tournament completed!</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
