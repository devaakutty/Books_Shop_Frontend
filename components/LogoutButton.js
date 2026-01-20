"use client";

import { LogOut, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    // SDLC Security Note: Total session wipe
    localStorage.clear();
    
    // Smooth navigation back to login gate
    router.push("/login");
    
    // Refresh to ensure all protected states are reset
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Main Logout Trigger */}
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 group"
      >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Sign Out
      </button>

      {/* Confirmation Tooltip */}
      {showConfirm && (
        <div className="absolute bottom-full left-0 mb-4 w-48 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 z-50">
          <div className="flex items-center gap-2 text-slate-800 mb-3">
            <AlertCircle size={16} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-tight">Are you sure?</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleLogout}
              className="flex-1 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black hover:bg-red-600 transition-colors"
            >
              YES
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black hover:bg-slate-200 transition-colors"
            >
              NO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}