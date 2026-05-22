import { Link } from "react-router-dom";
import "./Header.css";

function Header({ loggedIn, onLoginClick, onLogout }) {
  return (
    <header className="home-header">
      <Link to="/" className="app-title-link">
        <h1 className="app-title">Chess Tournament App</h1>
      </Link>

      {loggedIn ? (
        <button className="login-button" onClick={onLogout}>
          Logout
        </button>
      ) : (
        <button className="login-button" onClick={onLoginClick}>
          Login
        </button>
      )}
    </header>
  );
}

export default Header;
