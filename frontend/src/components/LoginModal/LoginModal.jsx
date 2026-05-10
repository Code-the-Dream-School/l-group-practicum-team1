import { useState } from "react";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose }) {
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      console.log("Login response:", data);

      setMessage(data.message || "Login successful");

      setEmail("");
      setPassword("");

      // localStorage.setItem("token", data.token);
    } catch (err) {
      setError("Could not connect to the server");
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
      </div>
    </div>
  );
}

export default LoginModal;
