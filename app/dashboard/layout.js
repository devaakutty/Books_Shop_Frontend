"use client";

import { Package, LogOut, BookOpen, ShoppingCart, CreditCard, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // SDLC Security Note: Clear session data on logout
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/welcome", icon: <LayoutDashboard size={20} /> },
    { name: "Products", href: "/products", icon: <BookOpen size={20} /> },
    { name: "My Cart", href: "/cart", icon: <ShoppingCart size={20} /> },
    { name: "Checkout", href: "/checkout", icon: <CreditCard size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter italic">BOOK.</h1>
        </div>

        <nav className="flex-1 space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                pathname === item.href
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}