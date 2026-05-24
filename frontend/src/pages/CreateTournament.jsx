import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import PageLayout from "../components/layout/PageLayout";
import TournamentPlayerSelector from "../components/tournaments/TournamentPlayerSelector";
import CreateTournamentForm from "../components/tournaments/CreateTournamentForm";
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateTournament() {
  const formats = ["ONLINE", "OFFLINE"];
  const tournametTypes = ["SINGLE"];
  const totalRoundsDefault = "1";

  const initialTournament = {
    name: "Test tournament",
    location: "NY",
    timeControl: "12",
    format: formats[0],
    totalRounds: totalRoundsDefault,
    category: "U14",
    tournamentType: tournametTypes[0],
    startDate: "",
    endDate: "",
  };

  const [tournament, setTournament] = useState(initialTournament);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const playersNeeded = useMemo(() => {
    const rounds = Number(tournament.totalRounds);
    if (!rounds) return 0;
    return 2 ** rounds;
  }, [tournament.totalRounds]);

  function validate() {
    const newErrors = {};

    if (!tournament.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!tournament.timeControl.trim()) {
      newErrors.timeControl = "Time control is required";
    }

    if (!tournament.format) {
      newErrors.format = "Format is required";
    }

    if (!tournament.totalRounds || Number(tournament.totalRounds) < 1) {
      newErrors.totalRounds = "Total rounds must be at least 1";
    }

    if (!tournament.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setTournament((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];
      return updatedErrors;
    });
  }

  function handleBack() {
    setStep(1);
  }

  function handleAddPlayer(player) {
    if (selectedPlayers.length >= playersNeeded) return;

    setSelectedPlayers((prev) => [...prev, player]);
  }

  function handleRemovePlayer(playerId) {
    setSelectedPlayers((prev) =>
      prev.filter((player) => player.id !== playerId),
    );
  }

  function handleNext() {
    setStep(2);
  }

  async function handleCreateTournament() {
    try {
      const response = await fetch(`${API_URL}/api/admin/createTournament`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tournament),
      });

      if (!response.ok) {
        throw new Error("Failed to create tournament");
      }

      const data = await response.json();

      navigate(`/tournaments/${data.tournament.id}/players`);
    } catch (error) {
      console.error("Create tournament error:", error);
    }
  }

  return (
    <PageLayout>
      <CreateTournamentForm
        tournament={tournament}
        setTournament={setTournament}
        selectedPlayers={selectedPlayers}
        setSelectedPlayers={setSelectedPlayers}
        playersNeeded={playersNeeded}
        handleAddPlayer={handleAddPlayer}
        handleRemovePlayer={handleRemovePlayer}
        handleCreateTournament={handleCreateTournament}
        handleChange={handleChange}
        formats={formats}
        tournametTypes={tournametTypes}
        validate={validate}
        errors={errors}
      />
    </PageLayout>
  );
}
