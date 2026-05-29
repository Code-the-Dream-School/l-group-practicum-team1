import { useEffect, useState } from "react";
import Header from "./Header";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { isLoggedIn, logout } from "../../utils/auth";

import "./PageLayout.css";

export default function PageLayout({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

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

  return (
    <div className="page-layout">
      <div className="page-container">
        <Header
          loggedIn={loggedIn}
          onLoginClick={openLogin}
          onLogout={handleLogout}
        />

        <main className="page-main">{children}</main>
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
      </div>
    </div>
  );
}
