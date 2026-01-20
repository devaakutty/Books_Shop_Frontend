"use client";

import { ArrowRight, Languages, Book, Globe, ChevronRight } from "lucide-react";

export default function CategoryCard({ category, onClick }) {
  // Enhanced icon mapping to handle your specific category IDs
  const getIcon = (id) => {
    const iconProps = { 
      size: 32, 
      className: "text-indigo-600 transition-transform group-hover:scale-110 duration-500" 
    };
    
    switch (id?.toLowerCase()) {
      case "english": 
        return <Globe {...iconProps} />;
      case "tamil": 
        return <Languages {...iconProps} />;
      case "telugu": 
        return <Book {...iconProps} />;
      default: 
        return <Book {...iconProps} />;
    }
  };

  return (
    <div
      onClick={() => onClick(category)}
      className="group cursor-pointer bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm transition-all duration-500 flex flex-col items-center text-center hover:bg-white hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-100 active:scale-95 relative overflow-hidden"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors duration-500" />
      
      {/* Icon Container */}
      <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] group-hover:bg-indigo-50 transition-colors duration-500 relative z-10">
        {getIcon(category.id)}
      </div>
      
      {/* Text Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors">
          {category.name}
        </h2>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-bold uppercase tracking-tighter line-clamp-2">
          {category.description}
        </p>
      </div>

      {/* Modern Action Button */}
      <div className="mt-auto flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-200">
        Browse Collection <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}