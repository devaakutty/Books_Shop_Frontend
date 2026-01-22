"use client";

import { useState, useEffect, useCallback } from "react";
import LoginPage from "./login/page";
import WelcomePage from "./welcome/page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const handleLogout = useCallback(() => {
    console.log("Forcing Logout...");
    localStorage.removeItem("token");
    localStorage.removeItem("lastActive");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const lastActive = localStorage.getItem("lastActive");
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;

    console.log("Checking Auth. Token:", !!token, "Last Active:", lastActive);

    if (token) {
      if (!lastActive) {
        // Token exists but no time recorded? Security risk, log out.
        handleLogout();
      } else if (now - parseInt(lastActive) > FIVE_MINUTES) {
        // Too much time has passed
        handleLogout();
      } else {
        // Session is still fresh
        setIsLoggedIn(true);
        localStorage.setItem("lastActive", now.toString());
      }
    } else {
      setIsLoggedIn(false);
    }
    
    setCheckingAuth(false);
  }, [handleLogout]);

  const handleLoginSuccess = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("lastActive", Date.now().toString());
    }
    setIsLoggedIn(true);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main>
      {isLoggedIn ? (
        <WelcomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}