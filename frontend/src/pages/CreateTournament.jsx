import { useMemo, useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import PageLayout from "../components/layout/PageLayout";
import TournamentPlayerSelector from "../components/tournaments/TournamentPlayerSelector";
import CreateTournamentForm from "../components/tournaments/CreateTournamentForm";

export default function CreateTournament() {
  const formats = ["online", "offline"];
  const tournametTypes = ["single"];
  const totalRoundsDefault = "1";

  const initialTournament = {
    name: "",
    location: "",
    timeControl: "",
    format: formats[0],
    totalRounds: totalRoundsDefault,
    category: "",
    tournamentType: tournametTypes[0],
    startDate: "",
    endDate: "",
  };

  const [tournament, setTournament] = useState(initialTournament);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const playersNeeded = useMemo(() => {
    const rounds = Number(tournament.totalRounds);
    if (!rounds) return 0;
    return 2 ** rounds;
  }, [tournament.totalRounds]);

  function handleChange(event) {
    const { name, value } = event.target;

    setTournament((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    const payload = {
      tournament,
      players: selectedPlayers.map((player) => player.id),
    };

    console.log("Create tournament payload:", payload);

    // TODO: Make API call to create tournament
  }

  return (
    <PageLayout>
      <div className="px-8 py-6">
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
        />
      </div>
    </PageLayout>
  );
}
