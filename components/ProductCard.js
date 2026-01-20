"use client";

import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
  const router = useRouter();

  // Handle price object or flat number
  const displayPrice = product.price?.sellingPrice || product.price || 0;

  return (
    <div 
      onClick={() => router.push(`/productDetail/${product._id}`)}
      className="group relative bg-white rounded-[2.5rem] p-6 cursor-pointer border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
          {product.details?.genre || "Literature"}
        </span>
      </div>

      {/* Image Container */}
      <div className="h-56 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 overflow-hidden relative">
        <img 
          src={product.images?.[0] || "/placeholder.png"} 
          alt={product.title} 
          className="max-h-[80%] w-auto object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2 drop-shadow-2xl" 
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors duration-500" />
      </div>

      {/* Book Metadata */}
      <div className="flex-1">
        <h2 className="text-slate-900 font-black text-lg leading-tight truncate mb-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h2>
        <p className="text-slate-400 text-xs font-bold mb-4 italic">
          by {product.author}
        </p>
      </div>

      {/* Price & Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
          <p className="text-xl font-black text-slate-900 tracking-tighter">₹{displayPrice}</p>
        </div>
        
        <div className="bg-slate-900 text-white p-3 rounded-xl transition-all duration-300 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-200">
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}