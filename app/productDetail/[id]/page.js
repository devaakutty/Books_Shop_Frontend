"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, ShoppingBag, Loader2, Plus, Trash2, 
  BookOpen, Globe, Hash, FileText, Building2, 
  CheckCircle2, Sparkles, ShieldCheck
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://books-shop-backend.vercel.app/api/products/${id}`);
        const data = await res.json();
        setBook(data);
        setCart(JSON.parse(localStorage.getItem("cart")) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const toggleCart = () => {
    const isInCart = cart.some(item => item._id === book._id);
    const updatedCart = isInCart 
      ? cart.filter(item => item._id !== book._id) 
      : [...cart, { ...book, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-violet-50">
      <Loader2 className="animate-spin text-violet-600" size={50} />
    </div>
  );

  const isInCart = cart.some(item => item._id === book._id);
  const discount = book.price?.costPrice > book.price?.sellingPrice 
    ? Math.round(((book.price.costPrice - book.price.sellingPrice) / book.price.costPrice) * 100) 
    : 0;

  return (
    /* h-screen + overflow-hidden prevents page scrolling */
    <div className="h-screen w-full bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 p-4 md:p-8 flex flex-col overflow-hidden font-sans">
      
      {/* 1. TOP NAV - Fixed Height */}
      <div className="max-w-7xl mx-auto w-full mb-4">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-violet-600 font-black uppercase text-[10px] tracking-widest group">
          <div className="bg-white p-2 rounded-xl shadow-md group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={16} strokeWidth={3} /> 
          </div>
          Back
        </button>
      </div>

      {/* 2. MAIN CARD - Flexible Height */}
      <div className="max-w-7xl mx-auto w-full flex-1 bg-white/70 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white overflow-hidden grid lg:grid-cols-2">
        
        {/* Left: Image (Stretches to fill) */}
        <div className="bg-gradient-to-br from-slate-50 to-violet-50 flex flex-col justify-center items-center p-8 relative border-r border-white">
          {discount > 0 && (
            <div className="absolute top-6 left-6 bg-fuchsia-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black italic shadow-lg z-10">
                {discount}% OFF
            </div>
          )}
          <img 
            src={book.images?.[0]} 
            className="h-full max-h-[70vh] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105" 
          />
        </div>

        {/* Right: Info (Scrolls internally if content is too long) */}
        <div className="p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <span className="bg-violet-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest uppercase">
                {book.details?.genre}
              </span>
              <span className="border-2 border-emerald-500 text-emerald-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest uppercase">
                {book.condition}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-none uppercase italic tracking-tighter mb-2">
              {book.title}
            </h1>
            <p className="font-black text-violet-600 tracking-wide text-sm">By {book.author}</p>
          </div>

          {/* Price Box */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white flex justify-between items-center mb-6 shadow-xl shadow-indigo-200">
            <div>
              <p className="text-indigo-300 text-[9px] font-black uppercase tracking-widest mb-1">Heavenly Price</p>
              <p className="text-5xl font-black italic tracking-tighter text-indigo-400">₹{book.price?.sellingPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-emerald-400 flex items-center gap-2 justify-end uppercase">
                <ShieldCheck size={14} /> Tax Included
              </p>
              <p className="text-[9px] text-white/40 font-bold uppercase mt-1">{book.publisher}</p>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Language', val: book.details?.language, icon: Globe },
              { label: 'Pages', val: book.details?.pages, icon: FileText },
              { label: 'ISBN', val: book.isbn, icon: Hash },
              { label: 'Format', val: book.details?.format, icon: BookOpen },
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl">
                <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                  <spec.icon size={16} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">{spec.label}</p>
                  <p className="font-black text-slate-900 text-xs truncate max-w-[100px]">{spec.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Inventory */}
          <div className="mb-6 flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${book.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                {book.stock > 0 ? `${book.stock} Units Available` : 'Out of Stock'}
              </span>
            </div>
            <p className="text-[9px] font-black text-indigo-400 uppercase italic">{book.details?.edition}</p>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <button 
              onClick={toggleCart}
              disabled={book.stock <= 0}
              className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg tracking-widest text-[11px] uppercase ${
                book.stock <= 0 ? "bg-slate-200 text-slate-400" :
                isInCart 
                  ? "bg-white text-fuchsia-600 border-2 border-fuchsia-100 shadow-fuchsia-100" 
                  : "bg-slate-900 text-white hover:bg-violet-600 shadow-violet-200"
              }`}
            >
              {isInCart ? <><Trash2 size={16} /> Remove from Stack</> : <><ShoppingBag size={16} strokeWidth={3} /> Add to Collection</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}