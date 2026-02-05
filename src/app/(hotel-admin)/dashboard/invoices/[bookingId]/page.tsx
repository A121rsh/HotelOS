import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import { ArrowLeft, Phone, Mail, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ✅ Props ka Type change kiya (Next.js 15 Support)
interface InvoicePageProps {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ gst?: string }>;
}

export default async function InvoicePage(props: InvoicePageProps) {
  const session = await auth();
  if (!session) return redirect("/login");

  // ✅ Step 1: Params aur SearchParams ko Await karo
  const params = await props.params;
  const searchParams = await props.searchParams;

  const bookingId = params.bookingId;
  const gstRate = parseInt(searchParams.gst || "0");

  // ✅ Step 2: Database Fetching (Ab ID sahi milegi)
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { 
        room: true,
        hotel: true 
    }
  });

  if (!booking) return notFound();

  // Step 3: Calculations
  const roomTotal = booking.totalAmount;
  const gstAmount = (roomTotal * gstRate) / 100;
  const grandTotal = roomTotal + gstAmount;
  
  const advancePaid = booking.paidAmount;
  const balanceDue = grandTotal - advancePaid;

  // Dates formatting
  const checkIn = new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const checkOut = new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const days = Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center print:bg-white print:p-0">
      
      {/* Top Controls (Print me nahi dikhenge) */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 print:hidden">
        <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4"/> Back
            </Button>
        </Link>
        <PrintButton />
      </div>

      {/* --- INVOICE PAPER --- */}
      <div className="bg-white w-full max-w-3xl p-12 rounded-xl shadow-xl print:shadow-none print:w-full print:max-w-none print:p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">{booking.hotel.name}</h1>
                
                {booking.hotel.address && (
                    <p className="text-sm text-slate-500 max-w-xs flex items-start gap-2">
                        <MapPin className="h-3 w-3 mt-1 shrink-0" /> {booking.hotel.address}
                    </p>
                )}
                
                <div className="flex gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {booking.hotel.mobile}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {booking.hotel.hotelEmail}</span>
                </div>

                {booking.hotel.gstNumber && (
                    <p className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> GSTIN: {booking.hotel.gstNumber}
                    </p>
                )}
            </div>

            <div className="text-right">
                <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tighter">Invoice</h2>
                <p className="text-slate-500 font-medium mt-1">#{booking.id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-slate-400 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
        </div>

        {/* BILL TO */}
        <div className="flex justify-between mb-8">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                <h3 className="text-lg font-bold text-slate-900">{booking.guestName}</h3>
                <p className="text-slate-600 text-sm">{booking.guestMobile}</p>
                <p className="text-slate-500 text-xs mt-1 uppercase">{booking.idType} : {booking.idNumber}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Stay Details</p>
                <p className="text-slate-900 font-medium">Room {booking.room.number} — <span className="text-slate-500 text-sm">{booking.room.type}</span></p>
                <p className="text-slate-600 text-sm mt-1">{checkIn} → {checkOut}</p>
                <p className="text-slate-500 text-sm">Total Nights: {days}</p>
            </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm text-left mb-8">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                <tr>
                    <th className="p-3 rounded-l-lg">Description</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Days</th>
                    <th className="p-3 text-right rounded-r-lg">Amount</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                <tr>
                    <td className="p-3 font-medium text-slate-900">Room Accommodation</td>
                    <td className="p-3 text-right">₹{booking.room.price}</td>
                    <td className="p-3 text-right">{days}</td>
                    <td className="p-3 text-right font-bold">₹{roomTotal.toLocaleString('en-IN')}</td>
                </tr>
                
                {gstRate > 0 ? (
                    <tr>
                        <td className="p-3 font-medium text-slate-600">GST ({gstRate}%)</td>
                        <td className="p-3 text-right text-slate-400">-</td>
                        <td className="p-3 text-right text-slate-400">-</td>
                        <td className="p-3 text-right font-bold text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</td>
                    </tr>
                ) : (
                   <tr>
                        <td className="p-3 font-medium text-slate-400 italic">Tax (GST Exempt)</td>
                        <td className="p-3 text-right text-slate-400">-</td>
                        <td className="p-3 text-right text-slate-400">-</td>
                        <td className="p-3 text-right text-slate-400">₹0</td>
                    </tr> 
                )}
            </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end">
            <div className="w-72 space-y-3">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{roomTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>Tax (GST)</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-slate-200 pt-3 mt-2">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-green-600 font-medium text-sm pt-2">
                    <span>Less: Advance Paid</span>
                    <span>- ₹{advancePaid.toLocaleString('en-IN')}</span>
                </div>
                
                <div className={`flex justify-between text-lg font-bold p-3 rounded-lg border mt-2
                    ${balanceDue > 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}
                `}>
                    <span>{balanceDue > 0 ? "Balance Due" : "Net Payable"}</span>
                    <span>₹{Math.max(0, balanceDue).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 border-t border-slate-100 pt-8 text-center">
            <p className="text-slate-900 font-bold text-sm">Thank you for staying with {booking.hotel.name}!</p>
            <p className="text-slate-400 text-xs mt-1">
                For any queries, please contact us at {booking.hotel.mobile}
            </p>
        </div>
      </div>
    </div>
  );
}