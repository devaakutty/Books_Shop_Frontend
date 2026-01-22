"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, Loader2, Plus, Trash2, BookOpen, Search, X, Sparkles } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedLanguage = searchParams.get("language");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  const fetchCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://books-shop-backend.vercel.app/api/products");

        // const res = await fetch("books-shop-backend.vercel.app/api/products");
        if (!res.ok) throw new Error("API Failure");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
    window.addEventListener("storage", fetchCart);
    return () => window.removeEventListener("storage", fetchCart);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = String(product.title || "");
      const author = String(product.author || "");
      const genre = String(product.details?.genre || "");
      const lang = String(product.details?.language || "");

      const matchesSearch = `${title} ${author} ${genre}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedLanguage 
        ? lang.toLowerCase() === selectedLanguage.toLowerCase()
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, products, selectedLanguage]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const updated = [...cart];
    const index = updated.findIndex(i => i._id === product._id);
    if (index > -1) {
      updated[index] = { ...updated[index], quantity: (updated[index].quantity || 1) + 1 };
    } else {
      updated.push({ ...product, quantity: 1 });
    }
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemoveFromCart = (e, id) => {
    e.stopPropagation();
    const updated = cart.filter(i => i._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  if (!isClient || loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-indigo-50">
        <Loader2 className="animate-spin text-violet-600 mb-4" size={60} strokeWidth={3} />
        <p className="text-violet-600 font-black uppercase tracking-[0.3em] text-xs">Opening Heaven's Library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-900 font-sans pb-20">
      
      {/* COLORFUL NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div onClick={() => router.push("/")} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">
               Book of <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Heaven</span>
            </h1>
          </div>
          
          <button onClick={() => router.push("/cart")} className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-violet-600 transition-all shadow-xl shadow-violet-200 active:scale-95">
            <div className="relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-fuchsia-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block font-black uppercase text-xs tracking-widest">My Stack</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* VIBRANT HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <header className="relative">
            <div className="absolute -top-6 -left-2 text-fuchsia-400 opacity-50"><Sparkles size={40}/></div>
            <h2 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none drop-shadow-sm">
              {selectedLanguage ? selectedLanguage : "Catalog"}
            </h2>
            <p className="text-violet-500 font-black uppercase text-[11px] tracking-[0.4em] mt-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-violet-500"></span> {filteredProducts.length} Divine Volumes
            </p>
          </header>

          {/* SEARCH BAR GLASSMORPHISM */}
          <div className="relative w-full md:w-[450px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-violet-400 group-focus-within:text-violet-600 transition-colors" size={22} />
            <input 
              type="text"
              placeholder="Search title, author or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-14 py-6 bg-white/50 backdrop-blur-md rounded-[2.5rem] border-2 border-white shadow-xl focus:border-violet-400 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500">
                <X size={22} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* COLORFUL GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map(product => {
              const isInCart = cart.some(i => i._id === product._id);
              // FIXED RENDERING LOGIC
              const displayPrice = product.price?.sellingPrice ?? (typeof product.price === 'number' ? product.price : 0);
              const displayGenre = String(product.details?.genre || "Literature");

              return (
                <div key={product._id} onClick={() => router.push(`/productDetail/${product._id}`)} 
                  className="group relative bg-white rounded-[3.5rem] p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-violet-200 hover:-translate-y-4 transition-all duration-500 cursor-pointer flex flex-col">
                  
                  {/* Floating Genre Tag */}
                  <div className="absolute top-6 left-6 z-10">
                     <span className="bg-white/90 backdrop-blur-md text-violet-600 text-[9px] px-4 py-2 rounded-2xl font-black uppercase tracking-widest shadow-sm border border-violet-50">
                      {displayGenre}
                    </span>
                  </div>

                  <div className="h-64 mb-8 rounded-[3rem] bg-gradient-to-br from-slate-50 to-violet-50 flex items-center justify-center overflow-hidden relative group-hover:rotate-2 transition-transform">
                    <img src={product.images?.[0] || "/placeholder.png"} alt={product.title} 
                      className="h-[85%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  <div className="text-center flex-1">
                    <h3 className="font-black text-slate-900 text-xl truncate uppercase tracking-tighter mb-1 leading-tight">{product.title}</h3>
                    <p className="text-slate-400 text-[11px] font-black uppercase italic mb-6 tracking-wide">{product.author}</p>
                    
                    <div className="bg-violet-50 inline-block px-6 py-2 rounded-2xl mb-8">
                       <p className="text-3xl font-black text-violet-600 tracking-tighter italic">₹{displayPrice}</p>
                    </div>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    {!isInCart ? (
                      <button onClick={e => handleAddToCart(e, product)} 
                        className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-300 transition-all active:scale-95">
                        <Plus size={16} className="inline mr-2 stroke-[4px]" /> Add to Stack
                      </button>
                    ) : (
                      <button onClick={e => handleRemoveFromCart(e, product._id)} 
                        className="w-full py-5 rounded-[2rem] bg-fuchsia-50 text-fuchsia-600 border-2 border-fuchsia-100 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-fuchsia-600 hover:text-white transition-all active:scale-95">
                        <Trash2 size={16} className="inline mr-2 stroke-[3px]" /> Remove Item
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in">
            <div className="bg-violet-100 p-16 rounded-[4rem] mb-10 text-violet-400">
              <Search size={80} strokeWidth={3} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Heavens Empty</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto">We couldn't find any divine scrolls matching your search query.</p>
            <button onClick={() => {setSearchQuery(""); router.push('/products')}} 
              className="mt-10 bg-violet-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-violet-200 transition-all active:scale-95">
              Reset Collection
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductCatalogPageWithSuspense() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-violet-50"><Loader2 className="animate-spin text-violet-600" size={50} /></div>}>
      <CatalogContent />
    </Suspense>
  );
}