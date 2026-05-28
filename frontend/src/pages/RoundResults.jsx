import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/PageLayout";
import MatchResults from "../components/tournaments/MatchResults";
const API_URL = import.meta.env.VITE_API_URL;

export default function RoundResults() {
  const [tournament, setTournament] = useState({});
  const [rounds, setRounds] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

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
      setActiveTab(results.data[0].roundNumber);

      setRounds(results.data);

      // navigate(`/tournaments/${data.tournament.id}/players`);
    } catch (error) {
      console.error("Get rounds error:", error);
    }
  }

  useEffect(() => {
    if (tournamentId) {
      getRounds();
    }
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

    console.log("Next round generated:", result);

    getRounds();
  }

  const activeRound = rounds.find((round) => round.roundNumber === activeTab);
  console.log("activeRound", activeRound);

  const activeRoundMatches = activeRound?.matches || [];
  console.log("activeRoundMatches", activeRoundMatches);

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

            <h2>Round {activeTab} Matches: </h2>
            <MatchResults matches={activeRoundMatches} />
            <div className="round-actions">
              <Button onClick={handleGenerateNextRound}>
                Generate Next Round
              </Button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
