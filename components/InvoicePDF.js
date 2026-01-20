// "use client";

// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import { Download, FileCheck } from "lucide-react";

// export default function InvoicePDF({ order }) {
//   const downloadPDF = () => {
//     if (!order) {
//       alert("Order data not found!");
//       return;
//     }

//     const doc = new jsPDF();

//     // 1. Header & Branding
//     doc.setFontSize(22);
//     doc.setTextColor("#4F46E5"); // Indigo-600
//     doc.text("PROJECT BOOK", 105, 20, { align: "center" });
    
//     doc.setFontSize(10);
//     doc.setTextColor("#64748B"); // Slate-500
//     doc.text("Official Tax Invoice", 105, 28, { align: "center" });

//     // 2. Invoice Meta Data
//     doc.setTextColor("#1E293B");
//     doc.setFont("helvetica", "bold");
//     doc.text(`Invoice ID: ${order.invoiceId}`, 20, 45);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Date: ${order.date}`, 20, 50);

//     // 3. Customer Billing Info
//     doc.setFillColor("#F8FAFC");
//     doc.rect(20, 60, 170, 30, "F");
//     doc.setFont("helvetica", "bold");
//     doc.text("BILLED TO:", 25, 68);
//     doc.setFont("helvetica", "normal");
//     doc.text(`${order.customer?.name}`, 25, 75);
//     doc.text(`${order.customer?.email}`, 25, 81);
//     doc.text(`Ph: ${order.customer?.mobile}`, 25, 87);

//     // 4. Product Table
//     const tableData = order.items.map((item, index) => [
//       index + 1,
//       item.title,
//       item.quantity,
//       `INR ${item.price?.sellingPrice?.toFixed(2)}`,
//       `INR ${(item.price?.sellingPrice * item.quantity).toFixed(2)}`
//     ]);

//     autoTable(doc, {
//       startY: 100,
//       head: [["#", "Book Description", "Qty", "Unit Price", "Total"]],
//       body: tableData,
//       theme: "grid",
//       headStyles: { fillColor: "#4F46E5", textColor: "#FFFFFF" },
//       styles: { fontSize: 9 },
//     });

//     // 5. Financial Summary
//     const finalY = doc.lastAutoTable.finalY + 10;
//     doc.setFont("helvetica", "bold");
//     doc.text("Subtotal:", 130, finalY);
//     doc.text(`INR ${order.financials?.subtotal?.toFixed(2)}`, 190, finalY, { align: "right" });
    
//     doc.text("GST (5%):", 130, finalY + 7);
//     doc.text(`INR ${order.financials?.gst?.toFixed(2)}`, 190, finalY + 7, { align: "right" });

//     doc.setFontSize(14);
//     doc.setTextColor("#10B981"); // Emerald Total
//     doc.text("Grand Total:", 130, finalY + 17);
//     doc.text(`INR ${order.financials?.total?.toFixed(2)}`, 190, finalY + 17, { align: "right" });

//     // Save PDF
//     doc.save(`Invoice_${order.invoiceId}.pdf`);
//   };

//   return (
//     <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
//       <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
//         <FileCheck className="text-indigo-600" size={32} />
//       </div>
      
//       <h3 className="text-lg font-black text-slate-800 mb-1">Invoice Ready</h3>
//       <p className="text-slate-400 text-sm mb-6 font-medium">Ref: {order?.invoiceId}</p>
      
//       <button 
//         onClick={downloadPDF} 
//         className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
//       >
//         <Download size={18} /> Download PDF Receipt
//       </button>
//     </div>
//   );
// }