import { useMemo, useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import TournamentPlayerSelector from "./TournamentPlayerSelector";
import Select from "../ui/Select";
import "./Form.css";

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
  validate,
  errors,
}) {
  async function handleSubmit() {
    if (!validate()) return;
    await handleCreateTournament();
  }

  return (
    <>
      <section className="form-section">
        <h2 className="form-title">Create Tournament</h2>

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
          <Button onClick={handleSubmit}>Create</Button>{" "}
        </div>
      </section>
    </>
  );
}
