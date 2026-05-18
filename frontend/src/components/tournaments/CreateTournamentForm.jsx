import { useMemo, useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import TournamentPlayerSelector from "./TournamentPlayerSelector";
import Select from "../ui/Select";

export default function CreateTournamentForm({
  tournament,
  setTournament,
  selectedPlayers,
  setSelectedPlayers,
  playersNeeded,
  handleAddPlayer,
  handleRemovePlayer,
  handleCreateTournament,
  handleChange,
  formats,
  tournametTypes,
}) {
  const [step, setStep] = useState(1);

  function handleBack() {
    setStep(1);
  }

  function handleNext() {
    setStep(2);
  }

  return (
    <>
      {step === 1 && (
        <section className="p-5 border border-black rounded-2xl">
          <h2 className="mb-8 text-center text-xl">
            Create Tournament: Tournament Details
          </h2>
          <p className="mb-8 text-center text-md">Step 1 of 2</p>

          <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <FormField label="Name*">
                <Input
                  name="name"
                  value={tournament.name}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Location">
                <Input
                  name="location"
                  value={tournament.location}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Time Control*">
                <Input
                  name="timeControl"
                  value={tournament.timeControl}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Format*">
                <Select
                  options={formats.map((format) => ({
                    label: format,
                    value: format,
                  }))}
                  name="format"
                  value={tournament.format}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Total Rounds*">
                <Input
                  name="totalRounds"
                  type="number"
                  min="1"
                  value={tournament.totalRounds}
                  onChange={handleChange}
                  required
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
                <Select
                  options={tournametTypes.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  name="format"
                  value={tournament.type}
                  onChange={handleChange}
                />
              </FormField>
            </div>

            <div className="space-y-5">
              <FormField label="Start Date*">
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
              disabled={!tournament.name || !tournament.totalRounds}
            >
              Next: Add Players
            </Button>{" "}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="p-5 border border-black rounded-2xl">
          <h2 className="mb-8 text-center text-xl">
            Create Tournament: Add Players
          </h2>
          <p className="mb-8 text-center text-md">Step 2 of 2</p>
          <div className="mb-8 font-bold">
            <p>Tournament: {tournament.name || "[Tournament Name]"}</p>
            <p>Rounds: {tournament.totalRounds || 1}</p>
            <p>Players needed: {playersNeeded || 2}</p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <TournamentPlayerSelector
                maxPlayers={playersNeeded}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                onChange={setSelectedPlayers}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
              />
            </div>
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
    </>
  );
}
