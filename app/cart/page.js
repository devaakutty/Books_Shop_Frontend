"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setIsLoaded(true);
  }, []);

  const syncCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQty = (id, delta) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = (item.quantity || 1) + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    syncCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    syncCart(updatedCart);
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.price?.sellingPrice || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const gst = totalAmount * 0.05;
  const grandTotal = totalAmount + gst;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen p-4 md:p-10 bg-gradient-to-br from-slate-50 to-indigo-50/30 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Animated Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 mb-8 text-indigo-500 hover:text-indigo-700 font-bold transition-all group bg-white px-5 py-2 rounded-full shadow-sm border border-indigo-100 w-fit"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Your Stack
            </h1>
            <p className="text-slate-500 font-medium mt-2">Ready to bring these masterpieces home?</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-indigo-100 shadow-lg border border-indigo-50">
             <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{cart.length} Books Selected</span>
          </div>
        </header>

        {cart.length === 0 ? (
          <div className="bg-white p-20 rounded-[4rem] text-center shadow-2xl shadow-indigo-100/50 border border-indigo-50">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
              <ShoppingBag className="text-white" size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-3">Your stack is empty!</h2>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">Every great reader starts with a single book. Find yours today.</p>
            <Link href="/welcome" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-12 py-5 rounded-2xl font-black shadow-lg shadow-indigo-200 hover:scale-105 transition-all inline-block">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div key={`${item._id}-${index}`} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center gap-8 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-500">
                  <div className="w-32 h-44 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-md group-hover:rotate-2 transition-transform">
                    <img 
                      src={item.images?.[0] || "https://via.placeholder.com/150"} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                        {item.details?.genre || "Literature"}
                    </span>
                    <h3 className="font-black text-2xl text-slate-800 leading-tight mt-3 mb-1 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-slate-400 font-bold italic text-sm mb-4">by {item.author}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-6">
                      <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
                        <button onClick={() => updateQty(item._id, -1)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-rose-500 shadow-sm transition-all active:scale-90">
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-black text-lg text-slate-800">{item.quantity || 1}</span>
                        <button onClick={() => updateQty(item._id, 1)} className="p-2 bg-white rounded-xl text-slate-400 hover:text-emerald-500 shadow-sm transition-all active:scale-90">
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-indigo-600 font-black text-2xl">
                        ₹{((item.price?.sellingPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>

                      <button onClick={() => removeItem(item._id)} className="ml-auto p-3 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white sticky top-10 shadow-3xl shadow-indigo-900/20 overflow-hidden relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <Zap className="text-amber-400 fill-amber-400" size={24} /> 
                    Summary
                </h2>
                
                <div className="space-y-5 mb-10">
                  <div className="flex justify-between text-slate-400 font-bold tracking-wide">
                    <span>Subtotal</span>
                    <span className="text-white">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold tracking-wide">
                    <span>Tax (GST 5%)</span>
                    <span className="text-white">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-6 flex justify-between items-center">
                    <span className="font-black uppercase text-xs tracking-widest text-indigo-400">Grand Total</span>
                    <span className="text-4xl font-black text-white tracking-tighter italic">
                        ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-black transition-all group shadow-xl shadow-indigo-500/20">
                  GO TO CHECKOUT
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
                    </div>
                    Safe & Secure
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}