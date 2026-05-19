import { useState } from "react";
import "./LoginModal.css";

import { loginUser } from "../../services/authService";
import { saveAuthData } from "../../utils/auth";

function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please complete all fields");
      return;
    }

    try {
      const data = await loginUser(email, password);

      console.log("Login response:", data);

      saveAuthData(data);

      onLoginSuccess();

      setMessage(data.message || "Login successful");

      setEmail("");
      setPassword("");

      onClose();
    } catch (err) {
      setError(err.message || "Could not login");
    }
  }

  function handleClose() {
    setError("");
    setMessage("");
    setEmail("");
    setPassword("");
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          {message && <p className="success-message">{message}</p>}

          <button type="submit">Sign In</button>
        </form>
        <p className="auth-switch-text">
          Don’t have an account yet?{" "}
          <button className="auth-switch-button" onClick={onSwitchToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
