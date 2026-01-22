"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage({ onLoginSuccess }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LOGOUT LOGIC START ---
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActive");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    // 1. Check if user has been away for more than 5 minutes on load
    const lastActive = localStorage.getItem("lastActive");
    if (lastActive) {
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() - parseInt(lastActive) > fiveMinutes) {
        handleLogout();
      }
    }

    // 2. Inactivity Timer (30 minutes of no mouse/keyboard movement)
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Record current time as "Last Active"
      localStorage.setItem("lastActive", Date.now().toString());
      
      // Set logout for 30 minutes of idleness
      inactivityTimer = setTimeout(handleLogout, 30 * 60 * 1000);
    };

    // Listen for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer(); // Initialize

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, [handleLogout]);

  // --- LOGOUT LOGIC END ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://books-shop-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("lastActive", Date.now().toString()); // Set initial activity
        
        if (onLoginSuccess) onLoginSuccess();
        else router.push("/"); 
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 p-4 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-[380px] border border-white/20 relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
            <LogIn className="text-violet-400" size={24} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">
            Heaven <span className="text-violet-600">Portal.</span>
          </h1>
          <p className="text-slate-400 text-[9px] mt-1 font-black uppercase tracking-[0.3em]">Identity Verification</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Registry</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-violet-500 transition-all font-bold text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Secret Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl focus:border-violet-500 transition-all font-bold text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 tracking-widest text-[10px] uppercase ${
              loading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-slate-900 hover:bg-violet-600 active:scale-95"
            }`}
          >
            {loading ? "Syncing..." : "Open Gates"}
            {!loading && <ArrowRight size={14} strokeWidth={3} />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-loose">
            New Seeker?{" "}
            <Link href="/register" className="text-violet-600 underline underline-offset-4 ml-1">
              Create Legacy
            </Link>
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 flex items-center gap-3 text-white/30 text-[8px] font-black uppercase tracking-[0.4em]">
        <Sparkles size={10} /> Secure Node Terminal <Sparkles size={10} />
      </div>
    </div>
  );
}