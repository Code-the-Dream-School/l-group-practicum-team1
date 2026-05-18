import { useMemo, useState, useEffect } from "react";

// Change these imports to match your project
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import FormField from "../components/ui/FormField";
import PageLayout from "../components/layout/PageLayout";
import TournamentPlayerSelector from "../components/tournaments/TournamentPlayerSelector";

const initialTournament = {
  name: "",
  location: "",
  timeControl: "",
  format: "Single Elimination",
  totalRounds: "",
  category: "",
  tournamentType: "",
  startDate: "",
  endDate: "",
};

export default function CreateTournamentForm() {
  const [step, setStep] = useState(1);
  const [tournament, setTournament] = useState(initialTournament);
  // const [search, setSearch] = useState("");
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
    console.log("handleAddPlayer player=====", player);
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
        <nav className="mb-6 flex gap-16 text-xl">
          <span>Home</span>
          <span className="font-bold">Tournaments</span>
          <span>Users</span>
        </nav>

        <p className="mb-8 text-xl">Tournaments → Create Tournament</p>

        {step === 1 && (
          <section>
            <h2 className="mb-8 text-center text-xl font-bold">Step 1 of 2</h2>

            <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <FormField label="Name">
                  <Input
                    name="name"
                    value={tournament.name}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Location">
                  <Input
                    name="location"
                    value={tournament.location}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Time Control">
                  <Input
                    name="timeControl"
                    value={tournament.timeControl}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Format">
                  <Input
                    name="format"
                    value={tournament.format}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Total Rounds">
                  <Input
                    name="totalRounds"
                    type="number"
                    min="1"
                    value={tournament.totalRounds}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Category">
                  <Input
                    name="category"
                    value={tournament.category}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Type">
                  <Input
                    name="tournamentType"
                    value={tournament.tournamentType}
                    onChange={handleChange}
                  />
                </FormField>
              </div>

              <div className="space-y-5">
                <FormField label="Start Date">
                  <Input
                    name="startDate"
                    type="date"
                    value={tournament.startDate}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Finish Date">
                  <Input
                    name="endDate"
                    type="date"
                    value={tournament.endDate}
                    onChange={handleChange}
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-24 flex justify-end">
              <Button
                onClick={handleNext}
                // disabled={!tournament.name || !tournament.totalRounds}
              >
                Next: Add Players
              </Button>{" "}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="mb-6 text-center text-xl font-bold">Step 2 of 2</h2>
            <div className="mb-8 font-bold">
              <p>Tournament: {tournament.name || "[Tournament Name]"}</p>
              <p>Rounds: {tournament.totalRounds || "[N]"}</p>
              <p>Players needed: {playersNeeded || "[m]"}</p>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                {/* <h3 className="mb-2 text-xl font-bold">Search players</h3> */}

                {/* <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name"
                /> */}

                <TournamentPlayerSelector
                  maxPlayers={playersNeeded}
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                  onChange={setSelectedPlayers}
                  onAddPlayer={handleAddPlayer}
                  onRemovePlayer={handleRemovePlayer}
                />
              </div>

              {/* <div>
                <h3 className="mb-8 text-xl font-bold">
                  Selected Players for this Tournament:{" "}
                  {selectedPlayers.length} / {playersNeeded || "N"}
                </h3>

                <ol className="space-y-2 text-lg font-bold">
                  {selectedPlayers.map((player, index) => (
                    <li key={player.id} className="flex gap-8">
                      <span>
                        {index + 1}. {player.firstName} {player.lastName}
                      </span>

                      <span>Rating: {player.rating}</span>

                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(selectedPlayers.id)}
                        className="cursor-pointer hover:underline"
                      >
                        [Remove]
                      </button>
                    </li>
                  ))}
                </ol>
              </div> */}
            </div>
            <div className="mt-24 flex justify-between">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>

              <Button
                onClick={handleCreateTournament}
                disabled={selectedPlayers.length !== playersNeeded}
              >
                Create Tournament
              </Button>
            </div>{" "}
          </section>
        )}
      </div>
    </PageLayout>
  );
}
