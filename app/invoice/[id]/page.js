"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams, useRouter } from "next/navigation";
import { FileText, Download, ArrowLeft, CheckCircle, User, Mail, Phone } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // SDLC Note: Fetching the transaction record from LocalStorage
    const savedOrder = JSON.parse(localStorage.getItem("lastOrder"));
    if (savedOrder) {
      setOrder(savedOrder);
    }
    setIsLoaded(true);
  }, []);

  const downloadPDF = () => {
    if (!order) return;
    const doc = new jsPDF();

    // PDF Header Styling
    doc.setFontSize(22);
    doc.setTextColor("#4F46E5"); // Indigo-600
    doc.text("BOOK PROJECT TAX INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor("#6B7280");
    doc.text(`Invoice ID: ${order.invoiceId}`, 20, 35);
    doc.text(`Date: ${order.date}`, 20, 40);

    // Billed To Box
    doc.setFillColor("#F8FAFC");
    doc.rect(20, 50, 170, 35, "F");
    doc.setTextColor("#1E293B");
    doc.setFont("helvetica", "bold");
    doc.text("BILLED TO:", 25, 58);
    
    doc.setFontSize(11);
    doc.text(`Name: ${order.customer?.name}`, 25, 66);
    doc.text(`Email: ${order.customer?.email || "N/A"}`, 25, 72);
    doc.text(`Mobile: ${order.customer?.mobile}`, 25, 78);
    doc.setFont("helvetica", "normal");

    // PDF Table Generation
    const tableData = order.items.map((item, index) => [
      index + 1,
      item.title,
      item.quantity,
      `INR ${item.price?.sellingPrice?.toFixed(2)}`,
      `5%`,
      `INR ${(item.price?.sellingPrice * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["#", "Book Title", "Qty", "Price", "Tax", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF" },
      styles: { fontSize: 9 },
    });

    // Final Calculations Positioning
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor("#64748B");
    
    doc.text("Subtotal:", 130, finalY);
    doc.text(`INR ${order.financials?.subtotal?.toFixed(2)}`, 190, finalY, { align: "right" });

    doc.text("Total GST (5%):", 130, finalY + 8);
    doc.text(`INR ${order.financials?.gst?.toFixed(2)}`, 190, finalY + 8, { align: "right" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#10B981"); // Emerald-500
    doc.text("Grand Total:", 130, finalY + 20);
    doc.text(`INR ${order.financials?.total?.toFixed(2)}`, 190, finalY + 20, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor("#94A3B8");
    doc.text("This is a computer-generated invoice.", 105, 280, { align: "center" });

    doc.save(`Invoice_${order.invoiceId}.pdf`);
    
    // Clear lastOrder after download to maintain state cleaniness
    localStorage.removeItem("lastOrder");
    router.push("/products");
  };

  if (!isLoaded) return null;

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-slate-100">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="text-slate-300" />
        </div>
        <p className="font-bold text-slate-800 tracking-tight">Invoice not found.</p>
        <button onClick={() => router.push("/products")} className="mt-4 text-indigo-600 font-bold text-sm">Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-10 bg-slate-50 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
        
        {/* Visual Header */}
        <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-block bg-indigo-500 p-2 rounded-xl mb-4">
               <CheckCircle size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Payment Successful</h1>
            <p className="text-slate-400 font-medium">Order ID: {order.invoiceId}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.2em] mb-1">Transaction Date</p>
            <p className="font-bold text-lg">{order.date}</p>
          </div>
        </div>

        <div className="p-10">
          {/* Customer & Payment Meta */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <div className="space-y-3">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To</h2>
              <div className="flex items-center gap-3 text-slate-900 font-black text-lg">
                <User size={18} className="text-indigo-500"/> {order.customer?.name}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                <Mail size={16} className="text-slate-400"/> {order.customer?.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-bold">
                <Phone size={16} className="text-slate-400"/> {order.customer?.mobile}
              </div>
            </div>
            
            <div className="md:text-right space-y-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Info</h2>
              <p className="font-black text-slate-900 uppercase">Method: {order.paymentMethod}</p>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <CheckCircle size={12}/> Verified
              </span>
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-4 mb-10">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Order Details</h2>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-50">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800">{item.title}</span>
                      <span className="text-xs font-bold text-slate-400">
                        Qty: {item.quantity} × INR {item.price?.sellingPrice?.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-black text-slate-900">
                      ₹{(item.price?.sellingPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-6 border-t border-slate-100">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>₹{order.financials?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                <span>Tax (GST 5%)</span>
                <span>₹{order.financials?.gst?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-900">
                <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                  ₹{order.financials?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
            >
              <Download size={18} /> Download Invoice PDF
            </button>
            <button
              onClick={() => router.push("/welcome")}
              className="px-8 py-5 rounded-[1.5rem] font-black border-2 border-slate-200 text-slate-400 uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition active:scale-95"
            >
              <ArrowLeft size={16} /> New Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}