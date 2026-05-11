import { useState } from "react";

import LoginModal from "../components/auth/LoginModal";
import mockTournaments, { getTournamentStatus } from "../data/mockTournaments";

import "./Home.css";

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("live");

  const liveTournaments = mockTournaments.filter(
    (tournament) => getTournamentStatus(tournament) === "live"
  );

  const upcomingTournaments = mockTournaments.filter(
    (tournament) => getTournamentStatus(tournament) === "upcoming"
  );

  const tournamentsToShow =
    activeTab === "live" ? liveTournaments : upcomingTournaments;

  return (
    <main className="home-page">
      <header className="home-header">
        <h1 className="app-title">Chess Tournament App</h1>

        <button className="login-button" onClick={() => setIsLoginOpen(true)}>
          Login
        </button>
      </header>

      <section className="dev-links">
        <h2>Temporary Development Links</h2>

        <div className="dev-links-list">
          <a href="/admin/tournaments/tournament-1">Admin Tournament View</a>

          <a href="/admin/tournaments/new">Create Tournament</a>

          <a href="/admin/tournaments/tournament-1/results">Results Preview</a>
        </div>
      </section>

      <nav className="tournament-tabs">
        <button
          className={activeTab === "live" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("live")}
        >
          Live Tournaments
        </button>

        <button
          className={
            activeTab === "upcoming" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Tournaments
        </button>
      </nav>

      <section className="tournaments-section">
        <div className="tournament-grid">
          {tournamentsToShow.length > 0 ? (
            tournamentsToShow.map((tournament) => (
              <article className="tournament-card" key={tournament.id}>
                <h3>{tournament.name}</h3>

                <p>{tournament.start_date}</p>

                <p>{tournament.location}</p>

                <p>{tournament.time_control}</p>

                <div className="tournament-stats">
                  <span>{tournament.total_rounds} Rounds</span>

                  <span>{tournament.tournament_type}</span>
                </div>
              </article>
            ))
          ) : (
            <p>No tournaments found.</p>
          )}
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </main>
  );
}

export default Home;
