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
  console.log("AddPlayers component rendered");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);

  const { tournamentId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // useEffect(() => {
  //   async function fetchPageData() {
  //     try {
  //       // add later selectedPlayersResponse
  //       const [tournamentResponse] = await Promise.all([
  //         fetch(`${API_URL}/api/admin/tournament/${tournamentId}`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }),
  //         // fetch(`${API_URL}/api/admin/tournaments/${tournamentId}/players`, {
  //         //   headers: { Authorization: `Bearer ${token}` },
  //         // }),
  //       ]);
  //       const tournamentData = await tournamentResponse.json();
  //       // const selectedPlayersData = await selectedPlayersResponse.json();
  //       console.log("tournamentData=====", tournamentData);

  //       setTournament(tournamentData);
  //       // setSelectedPlayers(selectedPlayersData.map((item) => item.player));
  //       setSelectedPlayers([]);
  //     } catch (error) {
  //       console.error("Fetch page data error:", error);
  //     }
  //   }

  //   if (tournamentId) {
  //     fetchPageData();
  //   }
  // }, [tournamentId, token]);

  // async function fetchPageData() {
  //   try {
  //     console.log(
  //       "full URL:",
  //       `${API_URL}/api/admin/tournament/${tournamentId}`,
  //     );
  //     const response = await fetch(
  //       `${API_URL}/api/admin/tournament/${tournamentId}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );

  //     console.log("after fetch");
  //     console.log("status:", response.status);

  //     const data = await response.json();

  //     console.log("tournamentData=====", data);

  //     setTournament(data.tournament || data);
  //   } catch (error) {
  //     console.error("fetch error:", error);
  //   }
  // }

  // NOTE: wait for API
  async function handleAddTournamentPlayers() {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/tournaments/${tournamentId}/players`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tournamentId, players: selectedPlayers }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add tournament players");
      }

      const data = await response.json();
    } catch (error) {
      console.error("Add tournament players error:", error);
    }
  }

  async function handleGenerateFirstRound() {
    console.log("tournament was started...");
    navigate(`/tournaments/${tournament.id}/rounds`);
    // TODO: add generating first round
    // try {
    //   const response = await fetch(
    //     `${API_URL}/api/admin/tournaments/${tournamentId}/players`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({ tournamentId, players: selectedPlayers }),
    //     },
    //   );

    //   if (!response.ok) {
    //     throw new Error("Failed to add tournament players");
    //   }

    //   const data = await response.json();
    // } catch (error) {
    //   console.error("Add tournament players error:", error);
    // }
  }

  useEffect(() => {
    async function getTournamentData() {
      try {
        const response = await fetch(
          `${API_URL}/api/admin/tournament/${tournamentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();

        setTournament(data.tournament || data);
      } catch (error) {
        console.error("fetch error:", error);
      }
    }

    if (tournamentId) {
      getTournamentData();
    }
  }, [tournamentId]);

  function handleAddPlayer(player) {
    setSelectedPlayers((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) return prev;

      return [...prev, player];
    });
  }

  function handleRemovePlayer(playerId) {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId));
  }

  return (
    <PageLayout>
      <AddTournamentPlayers
        tournament={tournament}
        selectedPlayers={selectedPlayers}
        setSelectedPlayers={setSelectedPlayers}
        onSubmit={handleAddTournamentPlayers}
        handleAddPlayer={handleAddPlayer}
        handleRemovePlayer={handleRemovePlayer}
        handleGenerateFirstRound={handleGenerateFirstRound}
      />
    </PageLayout>
  );
}
