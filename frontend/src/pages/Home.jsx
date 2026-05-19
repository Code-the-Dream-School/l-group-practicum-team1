import { useEffect, useState } from "react";

import Header from "../components/layout/Header";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";
import TournamentCard from "../components/tournaments/TournamentCard";
import { getTournaments } from "../services/tournamentService";
import { isLoggedIn, logout } from "../utils/auth";

import "./Home.css";

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [activeTab, setActiveTab] = useState("live");

  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTournaments() {
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (err) {
        setError(err.message || "Could not load tournaments");
      } finally {
        setIsLoading(false);
      }
    }

    loadTournaments();
  }, []);

  function openLogin() {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  }

  function openRegister() {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  }

  function handleLogout() {
    logout();
    setLoggedIn(false);
  }

  function handleLoginSuccess() {
    setLoggedIn(true);
  }

  function getTournamentStatus(tournament) {
    const today = new Date();
    const startDate = new Date(tournament.startDate);
    const endDate = tournament.endDate ? new Date(tournament.endDate) : null;

    if (startDate > today) {
      return "upcoming";
    }

    if (endDate && endDate < today) {
      return "completed";
    }

    return "live";
  }

  const liveTournaments = tournaments.filter(
    (tournament) => getTournamentStatus(tournament) === "live"
  );

  const upcomingTournaments = tournaments.filter(
    (tournament) => getTournamentStatus(tournament) === "upcoming"
  );

  const completedTournaments = tournaments.filter(
    (tournament) => getTournamentStatus(tournament) === "completed"
  );

  let tournamentsToShow = liveTournaments;

  if (activeTab === "upcoming") {
    tournamentsToShow = upcomingTournaments;
  }

  if (activeTab === "completed") {
    tournamentsToShow = completedTournaments;
  }

  return (
    <main className="home-page">
      <Header
        loggedIn={loggedIn}
        onLoginClick={openLogin}
        onLogout={handleLogout}
      />

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

        <button
          className={
            activeTab === "completed" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("completed")}
        >
          Finished Tournaments
        </button>
      </nav>

      <section className="tournaments-section">
        {isLoading && <p>Loading tournaments...</p>}

        {error && <p className="error-message">{error}</p>}

        {!isLoading && !error && (
          <div className="tournament-grid">
            {tournamentsToShow.length > 0 ? (
              tournamentsToShow.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))
            ) : (
              <p>No tournaments found.</p>
            )}
          </div>
        )}
      </section>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
        onRegisterSuccess={handleLoginSuccess}
      />
    </main>
  );
}

export default Home;
