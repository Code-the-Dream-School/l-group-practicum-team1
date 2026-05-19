import { useState } from "react";
import { registerUser } from "../../services/authService";
import { saveAuthData } from "../../utils/auth";
import "./RegisterModal.css";

function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please complete all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({
        firstName,
        lastName,
        email,
        password,
      });

      console.log("Register response:", data);

      saveAuthData(data);

      onRegisterSuccess();

      setMessage(data.message || "Account created successfully");

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onClose();
    } catch (err) {
      setError(err.message || "Could not create account");
    }
  }

  function handleClose() {
    setError("");
    setMessage("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="register-modal">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="registerEmail">Email</label>
          <input
            id="registerEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="registerPassword">Password</label>
          <input
            id="registerPassword"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit">Register</button>
        </form>

        <p className="auth-switch-text">
          Already have an account?{" "}
          <button className="auth-switch-button" onClick={onSwitchToLogin}>
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
