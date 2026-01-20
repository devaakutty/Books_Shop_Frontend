"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { 
  X, CheckCircle, User, ArrowLeft, ShieldCheck, CreditCard, Banknote, Loader2, Sparkles, Phone, Mail
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  // Form & Cart States
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvc: "" });
  const [cart, setCart] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setIsLoaded(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price?.sellingPrice || item.price || 0) * (item.quantity || 1), 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const validateForm = () => {
    if (!name.trim()) return "Customer name is required";
    if (!/^\d{10}$/.test(mobile)) return "Enter a valid 10-digit mobile number";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
    if (paymentMethod === "Card") {
      if (cardInfo.number.length < 16) return "Enter a 16-digit card number";
      if (!cardInfo.expiry.includes("/")) return "Use MM/YY format";
      if (cardInfo.cvc.length < 3) return "Enter 3-digit CVC";
    }
    if (cart.length === 0) return "Your stack is empty";
    return null;
  };

  const handleFinalOrder = async () => {
    const error = validateForm();
    if (error) return alert(error);
    
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const order = {
      invoiceId: `INV-${Date.now()}`,
      customer: { name, mobile, email },
      items: cart,
      financials: { subtotal, gst, total },
      paymentMethod,
      date: new Date().toLocaleString()
    };

    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");
    setIsProcessing(false);
    router.push(`/invoice/${order.invoiceId}`);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Colorful Back Nav */}
        <button onClick={() => router.back()} className="flex items-center gap-3 text-violet-600 hover:text-fuchsia-600 font-black uppercase text-xs tracking-[0.2em] mb-10 transition-all group">
          <div className="bg-white p-3 rounded-xl shadow-lg group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={18} strokeWidth={3} /> 
          </div>
          Return to Stack
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Customer Info - Heavenly Style */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
              <h2 className="text-3xl font-black mb-10 text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                <div className="bg-violet-600 p-2 rounded-lg"><User className="text-white" size={24}/></div>
                1. Billing Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" size={18} />
                    <input type="text" placeholder="FULL NAME" value={name} onChange={(e) => setName(e.target.value)} 
                    className="w-full pl-12 p-5 bg-slate-50/50 border-2 border-transparent rounded-2xl font-black text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all" />
                </div>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" size={18} />
                    <input type="tel" placeholder="MOBILE" value={mobile} onChange={(e) => setMobile(e.target.value)} 
                    className="w-full pl-12 p-5 bg-slate-50/50 border-2 border-transparent rounded-2xl font-black text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all" />
                </div>
                <div className="relative md:col-span-2">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400" size={18} />
                    <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-12 p-5 bg-slate-50/50 border-2 border-transparent rounded-2xl font-black text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            {/* 2. Payment Details */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
              <h2 className="text-3xl font-black mb-10 text-slate-900 uppercase tracking-tighter italic flex items-center gap-4">
                <div className="bg-violet-600 p-2 rounded-lg"><ShieldCheck className="text-white" size={24}/></div>
                2. Divine Payment
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-10">
                {['UPI', 'Card', 'Cash'].map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)} 
                    className={`p-5 rounded-2xl border-4 font-black transition-all active:scale-95 ${paymentMethod === m ? "border-violet-600 bg-violet-50 text-violet-600 shadow-lg shadow-violet-100" : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"}`}>
                    {m}
                  </button>
                ))}
              </div>

              <div className="p-10 bg-gradient-to-br from-slate-900 to-violet-950 rounded-[2.5rem] text-white min-h-[250px] flex flex-col justify-center relative overflow-hidden group">
                <Sparkles className="absolute top-6 right-6 text-violet-500/30 group-hover:rotate-12 transition-transform" size={40} />
                
                {paymentMethod === "UPI" && (
                  <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
                    <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Select Provider to Generate QR</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {["GPAY", "PHONEPE", "PAYTM"].map(app => (
                        <button key={app} onClick={() => setShowQR(true)} className="px-8 py-3 bg-white/10 border border-white/10 rounded-2xl font-black hover:bg-violet-600 transition-all uppercase text-xs tracking-widest">{app}</button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === "Card" && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-400"/> Encrypted Secure Gateway
                    </p>
                    <input type="text" maxLength="16" placeholder="CARD NUMBER" value={cardInfo.number}
                      onChange={(e) => setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})}
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-black outline-none focus:border-violet-500 focus:bg-white/10 transition-all" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM / YY" value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                          className="p-5 bg-white/5 border border-white/10 rounded-2xl font-black outline-none focus:border-violet-500" />
                        <input type="text" maxLength="3" placeholder="CVC" value={cardInfo.cvc}
                          onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value.replace(/\D/g, '')})}
                          className="p-5 bg-white/5 border border-white/10 rounded-2xl font-black outline-none focus:border-violet-500" />
                    </div>
                  </div>
                )}

                {paymentMethod === "Cash" && (
                  <div className="text-center space-y-4 animate-in fade-in zoom-in-95">
                    <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Banknote className="text-emerald-400" size={30} />
                    </div>
                    <p className="font-black text-2xl italic uppercase tracking-tighter">Handover on Arrival</p>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                      Please prepare <span className="text-emerald-400 font-black">₹{total.toFixed(2)}</span> <br/> for our delivery disciple.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1 sticky top-12">
            <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 shadow-2xl shadow-violet-200/50 border border-white/5 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-black mb-10 border-b border-white/10 pb-4 uppercase italic tracking-widest text-indigo-400">Bill Summary</h2>
              <div className="space-y-5 mb-12">
                <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest"><span>Tax (GST 5%)</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="pt-10">
                  <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase block mb-2">Grand Total</span>
                  <span className="text-6xl font-black text-white tracking-tighter italic block">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleFinalOrder} 
                disabled={isProcessing}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white py-6 rounded-[2rem] font-black shadow-xl shadow-violet-900/50 transition-all active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Verifying...</> : <><CheckCircle size={18}/> Confirm Order</>}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* UPI QR Modal - Heavenly Glass */}
      {showQR && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[4rem] p-12 max-w-sm w-full text-center relative shadow-3xl animate-in zoom-in-95 duration-500">
            <button onClick={() => setShowQR(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors"><X size={28} strokeWidth={4}/></button>
            <h3 className="text-3xl font-black mb-2 text-slate-900 uppercase tracking-tighter italic">Divine Scan</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Secure Gateway Activated</p>
            <div className="bg-slate-50 p-10 rounded-[3rem] inline-block mb-10 border-4 border-slate-100 shadow-inner">
              <QRCodeSVG value={`upi://pay?pa=bookvault@upi&pn=BookVault&am=${total.toFixed(2)}&cu=INR`} size={220} />
            </div>
            <button 
              onClick={handleFinalOrder} 
              disabled={isProcessing}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-violet-600 transition-all shadow-xl uppercase tracking-widest text-xs"
            >
               {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} strokeWidth={4}/> I have paid ₹{total.toFixed(2)}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}