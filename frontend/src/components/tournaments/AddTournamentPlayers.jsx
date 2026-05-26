import { useMemo, useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import TournamentPlayerSelector from "./TournamentPlayerSelector";
import Select from "../ui/Select";
import "./Form.css";

export default function AddTournamentPlayers({
  tournament,
  selectedPlayers,
  setSelectedPlayers,
  handleAddPlayer,
  handleRemovePlayer,
  handleGenerateFirstRound,
}) {
  if (!tournament) {
    return <p>Loading tournament...</p>;
  }

  async function handleSubmit() {
    await handleCreateTournamentPlayers();
  }

  const playersNeeded = 2 ** tournament.totalRounds;

  return (
    <>
      <section className="form-section">
        <div className="form-summary">
          <p>Tournament: {tournament.name}</p>
          <p>
            Rounds: {tournament.totalRounds || 1} Players needed:{" "}
            {playersNeeded || 2}
          </p>
          <div className="form-round">
            <Button onClick={handleGenerateFirstRound}>
              Generate First Round
            </Button>
          </div>{" "}
        </div>
        <div className="form-grid single">
          <div>
            <TournamentPlayerSelector
              maxPlayers={playersNeeded}
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
              // onChange={setSelectedPlayers}
              onRemovePlayer={handleRemovePlayer}
              onAddPlayer={handleAddPlayer}
            />
          </div>
        </div>
      </section>
    </>
  );
}
