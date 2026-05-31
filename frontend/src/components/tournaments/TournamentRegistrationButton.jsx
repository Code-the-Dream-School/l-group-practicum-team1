import { useEffect, useState } from "react";
import { UserPlus, UserMinus, Lock } from "lucide-react";

import { getCurrentUser } from "../../utils/auth";
import {
  getTournamentPlayers,
  signUpForTournament,
  withdrawFromTournament,
} from "../../services/playerService";

import "./TournamentRegistrationButton.css";

function TournamentRegistrationButton({ tournamentId, registrationClosed }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = getCurrentUser();

  useEffect(() => {
    async function checkRegistrationStatus() {
      setMessage("");
      setError("");

      if (!user) {
        setIsRegistered(false);
        setIsCheckingRegistration(false);
        return;
      }

      try {
        const players = await getTournamentPlayers(tournamentId);

        const userIsRegistered = players.some(
          (player) => player.user?.id === user.id
        );

        setIsRegistered(userIsRegistered);
      } catch (err) {
        setError(err.message || "Could not check registration status");
      } finally {
        setIsCheckingRegistration(false);
      }
    }

    checkRegistrationStatus();
  }, [tournamentId, user]);

  async function handleRegistrationToggle() {
    setMessage("");
    setError("");

    if (registrationClosed) {
      setError("Registration is closed because the tournament has started.");
      return;
    }

    if (!user) {
      setError("Please log in before registering for this tournament.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isRegistered) {
        const data = await withdrawFromTournament(tournamentId, user.id);

        setIsRegistered(false);
        setMessage(data.message || "You withdrew from the tournament.");
      } else {
        const data = await signUpForTournament(tournamentId, user.id);

        setIsRegistered(true);
        setMessage(data.message || "Successfully registered for tournament!");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  function getButtonContent() {
    if (registrationClosed) {
      return (
        <>
          <Lock size={18} />
          Registration Closed
        </>
      );
    }

    if (isSubmitting) {
      return "Processing...";
    }

    if (isRegistered) {
      return (
        <>
          <UserMinus size={18} />
          Withdraw
        </>
      );
    }

    return (
      <>
        <UserPlus size={18} />
        Register
      </>
    );
  }

  return (
    <div className="registration-action">
      <button
        className={
          isRegistered ? "registration-button withdraw" : "registration-button"
        }
        onClick={handleRegistrationToggle}
        disabled={isCheckingRegistration || isSubmitting || registrationClosed}
      >
        {getButtonContent()}
      </button>

      {message && (
        <p className="success-message registration-message">{message}</p>
      )}

      {error && <p className="error-message registration-message">{error}</p>}
    </div>
  );
}

export default TournamentRegistrationButton;
