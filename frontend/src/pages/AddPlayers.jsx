import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import PageLayout from "../components/layout/PageLayout";
import TournamentPlayerSelector from "../components/tournaments/TournamentPlayerSelector";
import AddTournamentPlayers from "../components/tournaments/AddTournamentPlayers";
const API_URL = import.meta.env.VITE_API_URL;

export default function AddPlayers() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);
  // TODO : if tournament starts => navigate to tournament detail page (admin view)

  const { tournamentId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPageData() {
      try {
        const [tournamentResponse, selectedPlayersResponse] = await Promise.all(
          [
            fetch(`${API_URL}/api/admin/tournament/${tournamentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_URL}/api/tournaments/${tournamentId}/players`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ],
        );
        const tournamentData = await tournamentResponse.json();
        const selectedPlayersData = await selectedPlayersResponse.json();

        setTournament(tournamentData.tournament || tournamentData);
        setSelectedPlayers(selectedPlayersData.data.map((item) => item.user));
      } catch (error) {
        console.error("Fetch page data error:", error);
      }
    }

    if (tournamentId) {
      fetchPageData();
    }
  }, [tournamentId, token]);

  async function handleAddTournamentPlayer(player) {
    try {
      const response = await fetch(
        `${API_URL}/api/tournaments/${tournamentId}/players`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tournamentId,
            userId: player.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add tournament players");
      }

      setSelectedPlayers((prev) => {
        const exists = prev.some((p) => p.id === player.id);
        if (exists) return prev;
        return [...prev, player];
      });

      const data = await response.json();
    } catch (error) {
      console.error("Add tournament players error:", error);
    }
  }

  async function handleGenerateFirstRound() {
    console.log("tournament was started...");
    try {
      const response = await fetch(
        `${API_URL}/api/tournaments/${tournamentId}/rounds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate a tournament round");
      }

      const data = await response.json();

      navigate(`/tournaments/${tournamentId}/rounds`);
    } catch (error) {
      console.error("Create tournament round error:", error);
    }
  }

  async function handleRemoveTournamentPlayer(playerId) {
    try {
      const response = await fetch(
        `${API_URL}/api/tournaments/${tournamentId}/players/${playerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete tournament player");
      }

      setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
      const data = await response.json();
    } catch (error) {
      console.error("Delete tournament player error:", error);
    }
  }

  return (
    <PageLayout>
      <AddTournamentPlayers
        tournament={tournament}
        selectedPlayers={selectedPlayers}
        setSelectedPlayers={setSelectedPlayers}
        handleAddPlayer={handleAddTournamentPlayer}
        handleRemovePlayer={handleRemoveTournamentPlayer}
        handleGenerateFirstRound={handleGenerateFirstRound}
      />
    </PageLayout>
  );
}
