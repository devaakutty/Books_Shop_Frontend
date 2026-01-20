"use client";

import { useRouter } from "next/navigation";
import { LogOut, Globe, Languages, BookText, ChevronRight, LayoutGrid, Sparkles } from "lucide-react";

const CategoryCard = ({ category, onClick }) => (
  <button 
    onClick={onClick}
    className="group bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-lg hover:shadow-violet-200 hover:-translate-y-1.5 transition-all duration-500 text-left relative overflow-hidden active:scale-95 flex flex-col h-full"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-100 to-transparent rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform" />
    
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-xl transition-all group-hover:rotate-6 ${
      category.id === "all" 
        ? "bg-slate-900 text-white shadow-slate-200" 
        : "bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-violet-100"
    }`}>
      {category.icon}
    </div>
    
    <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tighter uppercase italic">{category.name}</h3>
    <p className="text-slate-400 font-bold text-[10px] leading-tight mb-4 flex-1">
      {category.description}
    </p>
    
    <div className={`flex items-center gap-1 font-black text-[9px] uppercase tracking-widest ${
      category.id === "all" ? "text-slate-900" : "text-violet-600"
    }`}>
      Explore <ChevronRight size={12} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

export default function WelcomePage({ onLogout }) {
  const router = useRouter();

  const categories = [
    { id: "all", name: "Archives", description: "The full divine library.", icon: <LayoutGrid size={22} strokeWidth={2.5} /> },
    { id: "English", name: "English", description: "Global classics & lore.", icon: <Globe size={22} strokeWidth={2.5} /> },
    { id: "Tamil", name: "Tamil", description: "Sangam & modern scripts.", icon: <Languages size={22} strokeWidth={2.5} /> },
    { id: "Telugu", name: "Telugu", description: "Golden cultural epics.", icon: <BookText size={22} strokeWidth={2.5} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout(); else router.push("/login");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col overflow-hidden font-sans">
      
      {/* COMPACT NAVBAR */}
      <nav className="bg-white/30 backdrop-blur-xl border-b border-white sticky top-0 z-50 shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-slate-900 p-1.5 rounded-lg shadow-md">
                <Sparkles className="text-violet-400" size={16} />
             </div>
             <h1 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase">
                Book of <span className="text-violet-600">Heaven.</span>
             </h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 text-slate-400 hover:text-red-500 font-black text-[9px] uppercase tracking-[0.2em] transition-all px-4 py-2 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100"
          >
            <LogOut size={14} strokeWidth={3} /> Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center items-center px-6 max-w-5xl mx-auto w-full">
        
        {/* CENTERED COMPACT HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-4 shadow-lg shadow-violet-200">
            <Sparkles size={10} /> The Library
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter leading-none uppercase italic">
            Enter the <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Realm.</span>
          </h2>
          <p className="text-slate-400 text-sm font-bold max-w-md mx-auto leading-relaxed">
            Choose a dialect to reveal the handpicked scrolls.
          </p>
        </div>

        {/* COMPACT CATEGORIES GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              category={cat} 
              onClick={() => router.push(cat.id === "all" ? "/products" : `/products?language=${cat.id}`)} 
            />
          ))}
        </div>

        {/* SOCIAL PROOF */}
        <div className="mt-12 flex items-center gap-4 p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm">
            <div className="flex -space-x-2 ml-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest pr-3">
              Join <span className="text-violet-600">2k+</span> Collectors
            </p>
        </div>
      </main>
    </div>
  );
}