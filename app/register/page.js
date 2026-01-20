"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Legacy Created! Welcome to the Archive.");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.message || "Email already registered in our scrolls.");
      }
    } catch (err) {
      alert("Network disruption. Heaven's gates are temporarily closed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Locked h-screen to prevent scrolling and centered content */
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-700 p-4 font-sans overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-[100px] -ml-40 -mb-40"></div>

      <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-[400px] border border-white/20 relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-fuchsia-200 rotate-3">
            <UserPlus className="text-fuchsia-400" size={24} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            New <span className="text-violet-600">Legacy.</span>
          </h1>
          <p className="text-slate-400 text-[9px] mt-2 font-black uppercase tracking-[0.3em]">Join the Collectors</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Identity</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-fuchsia-500 transition-all font-bold text-xs text-slate-800 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Registry Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="email"
                required
                placeholder="name@heaven.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-fuchsia-500 transition-all font-bold text-xs text-slate-800 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Secret Cipher</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-fuchsia-500 transition-all font-bold text-xs text-slate-800 outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 mt-2 rounded-xl font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 tracking-widest text-[10px] uppercase ${
              loading 
              ? "bg-slate-300 cursor-not-allowed" 
              : "bg-slate-900 hover:bg-fuchsia-600 active:scale-95 shadow-fuchsia-100"
            }`}
          >
            {loading ? "COMMITTING TO SCROLLS..." : "BEGIN JOURNEY"}
            {!loading && <ArrowRight size={14} strokeWidth={3} />}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-50 pt-5">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-loose">
            Already a Collector?{" "}
            <Link href="/login" className="text-violet-600 underline underline-offset-4 ml-1">
              Access Portal
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 flex items-center gap-3 text-white/40 text-[8px] font-black uppercase tracking-[0.4em]">
        <Sparkles size={10} /> Infinite Wisdom Awaits <Sparkles size={10} />
      </div>
    </div>
  );
}