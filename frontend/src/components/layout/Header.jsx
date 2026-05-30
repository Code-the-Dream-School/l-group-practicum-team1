import { Link } from "react-router-dom";
import "./Header.css";

function Header({ user, loggedIn, onLoginClick, onLogout }) {
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="home-header">
      <Link to="/" className="app-title-link">
        <h1 className="app-title">Chess Tournament App</h1>
      </Link>

      <div className="header-actions">
        {loggedIn && user && (
          <div className="logged-user">
            <span>Logged as {user.firstName}</span>

            {isAdmin && <span className="admin-badge">ADMIN</span>}
          </div>
        )}

        {loggedIn ? (
          <button className="login-button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
