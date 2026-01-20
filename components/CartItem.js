"use client";

import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item, onRemove, onQuantityChange }) {
  // Safety check for pricing
  const price = item.price?.sellingPrice || item.price || 0;

  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-5">
        {/* Book Cover Preview */}
        <div className="w-20 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-50">
          <img 
            src={item.images?.[0] || "/placeholder.png"} 
            alt={item.title} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Book Info */}
        <div>
          <h4 className="font-black text-slate-800 text-lg leading-tight line-clamp-1">{item.title}</h4>
          <p className="text-indigo-600 font-bold mt-1 tracking-tight">₹{price.toFixed(2)}</p>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
            ISBN: {item.isbn || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Modern Quantity Selector */}
        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
          <button 
            onClick={() => onQuantityChange(item._id, Math.max(1, (item.quantity || 1) - 1))}
            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            <Minus size={14} />
          </button>
          
          <span className="w-8 text-center font-black text-slate-700 text-sm">
            {item.quantity || 1}
          </span>
          
          <button 
            onClick={() => onQuantityChange(item._id, (item.quantity || 1) + 1)}
            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => onRemove(item._id)} 
          className="p-3 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all active:scale-95"
          title="Remove Item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}