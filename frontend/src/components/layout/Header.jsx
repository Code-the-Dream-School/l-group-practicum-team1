import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, LogIn, LogOut, User, Trophy, Menu, X } from "lucide-react";
import "./Header.css";

function Header({ user, loggedIn, onLoginClick, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogoutClick() {
    setMenuOpen(false);
    onLogout();
  }

  function handleLoginClick() {
    setMenuOpen(false);
    onLoginClick();
  }

  return (
    <header className="site-header">
      <Link to="/" className="app-title-link">
        <Trophy className="app-logo" />
        Chess Tournament App
      </Link>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={menuOpen ? "header-actions open" : "header-actions"}>
        {loggedIn && user && (
          <Link
            to="/profile"
            className="user-status"
            onClick={() => setMenuOpen(false)}
          >
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
          <span className="mobile-action-text">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {loggedIn ? (
          <button className="login-button" onClick={handleLogoutClick}>
            <LogOut size={16} />
          </button>
        ) : (
          <button className="login-button" onClick={handleLoginClick}>
            <LogIn size={16} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
