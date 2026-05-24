import { useMemo, useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import TournamentPlayerSelector from "./TournamentPlayerSelector";
import Select from "../ui/Select";
import "./CreateTournamentForm.css";

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
  const [errors, setErrors] = useState({});

  function validateStepOne() {
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

  function handleNext() {
    if (!validateStepOne()) return;
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  return (
    <>
      {step === 1 && (
        <section className="form-section">
          <h2 className="form-title">Create Tournament</h2>
          <p className="form-step">Step 1 of 2</p>

          <div className="form-grid">
            <div className="form-column">
              <FormField label="Name" htmlFor="name" error={errors.name}>
                <Input
                  name="name"
                  id="name"
                  value={tournament.name}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Location" htmlFor="location">
                <Input
                  name="location"
                  id="location"
                  value={tournament.location}
                  onChange={handleChange}
                />
              </FormField>

              <FormField
                label="Time Control"
                htmlFor="timeControl"
                error={errors.timeControl}
              >
                <Input
                  name="timeControl"
                  id="timeControl"
                  value={tournament.timeControl}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Format" htmlFor="format" error={errors.format}>
                <Select
                  options={formats.map((format) => ({
                    label: format,
                    value: format,
                  }))}
                  name="format"
                  id="format"
                  value={tournament.format}
                  onChange={handleChange}
                />
              </FormField>

              <FormField
                label="Total Rounds"
                htmlFor="totalRounds"
                error={errors.totalRounds}
              >
                <Input
                  name="totalRounds"
                  id="totalRounds"
                  type="number"
                  min="1"
                  value={tournament.totalRounds}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Category" htmlFor="category">
                <Input
                  name="category"
                  id="category"
                  value={tournament.category}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Type" htmlFor="tournamentType">
                <Select
                  options={tournametTypes.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  name="tournamentType"
                  id="tournamentType"
                  value={tournament.type}
                  onChange={handleChange}
                />
              </FormField>
            </div>

            <div className="form-column">
              <FormField
                label="Start Date"
                htmlFor="startDate"
                error={errors.startDate}
              >
                <Input
                  name="startDate"
                  id="startDate"
                  type="date"
                  value={tournament.startDate}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Finish Date" htmlFor="endDate">
                <Input
                  name="endDate"
                  id="endDate"
                  type="date"
                  value={tournament.endDate}
                  onChange={handleChange}
                />
              </FormField>
            </div>
          </div>

          <div className="form-actions end">
            <Button onClick={handleCreateTournament}>Create</Button>{" "}
          </div>
        </section>
      )}

      {/* {step === 2 && (
        <section className="form-section">
          <h2 className="form-title">Create Tournament</h2>
          <p className="form-step">Step 2 of 2</p>
          <div className="form-summary">
            <p>Tournament: {tournament.name || "[Tournament Name]"}</p>
            <p>
              Rounds: {tournament.totalRounds || 1} Players needed:{" "}
              {playersNeeded || 2}
            </p>
          </div>
          <div className="form-grid single">
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
          <div className="form-actions space-between">
            <Button onClick={handleBack}>Back</Button>

            <Button
              onClick={handleCreateTournament}
              // disabled={selectedPlayers.length !== playersNeeded}
            >
              Create Tournament
            </Button>
          </div>{" "}
        </section>
      )} */}
    </>
  );
}
