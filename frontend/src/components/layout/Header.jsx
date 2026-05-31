import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, LogIn, LogOut, User, Trophy } from "lucide-react";
import "./Header.css";

function Header({ user, loggedIn, onLoginClick, onLogout }) {
  const isAdmin = user?.role === "ADMIN";
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <Link to="/" className="app-title-link">
        <Trophy size={24} className="app-logo" />
        Chess Tournament App
      </Link>

      <div className="header-actions">
        {loggedIn && user && (
          <Link to="/profile" className="user-status">
            <User size={16} />

            <span>{user.firstName}</span>

            {user.role === "ADMIN" && (
              <span className="admin-badge">ADMIN</span>
            )}
          </Link>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-button"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {loggedIn ? (
          <button className="login-button" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        ) : (
          <button className="login-button" onClick={onLoginClick}>
            <LogIn size={16} />
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
