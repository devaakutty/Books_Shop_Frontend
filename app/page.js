"use client";

import { useState, useEffect } from "react";
import LoginPage from "./login/page";
// import WelcomePage from "./welcome/page";
import WelcomePage from "./welcome/page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // SDLC Maintenance Phase: Persisting User Session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart"); // Clear session data
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = (token) => {
    // In your LoginPage, make sure you pass the token to this function
    if (token) {
      localStorage.setItem("token", token);
    }
    setIsLoggedIn(true);
  };

  // Prevent UI flickering while checking localStorage
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen">
      {isLoggedIn ? (
        <WelcomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </main>
  );
}