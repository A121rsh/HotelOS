import { db } from "@/lib/db";
import { CheckCircle2, Home, Camera, Printer, Share2, Hotel, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import PrintTrigger from "@/components/public/PrintTrigger";
import { Badge } from "@/components/ui/badge";

interface SuccessPageProps {
  params: Promise<{ hotelId: string }>;
  searchParams: Promise<{ bookingId: string }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { hotelId } = await params;
  const { bookingId } = await searchParams;

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-8 rounded-[2rem] border border-red-100 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2 font-outfit">Invalid Request</h2>
          <p className="opacity-80">Booking reference missing.</p>
        </div>
      </div>
    );
  }

  const hotel = await db.hotel.findUnique({
    where: { id: hotelId }
  });

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { room: true }
  });

  if (!booking || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-100 text-slate-600 p-8 rounded-[2rem] text-center max-w-md shadow-xl">
          <h2 className="text-2xl font-bold mb-2 font-outfit text-slate-900">Booking Not Found</h2>
          <p className="opacity-80 mb-6">We couldn't retrieve your booking details.</p>
          <Button asChild className="rounded-xl px-8 py-6">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-12 md:py-24 px-4 font-inter">

      {/* Brand Logo */}
      <div className="mb-12 flex flex-col items-center">
        <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 animate-bounce">
          <Hotel className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-black font-outfit text-slate-900 tracking-tight italic">
          Hotel<span className="text-blue-600">OS</span>
        </h2>
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:shadow-none print:border-none">

          {/* Success Banner */}
          <div className="bg-slate-900 p-10 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] h-64 w-64 bg-emerald-500 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-1 mb-4 font-black tracking-[0.2em] text-[10px] uppercase">Reservation Confirmed</Badge>
              <h1 className="text-4xl font-black font-outfit tracking-tight mb-2">Booked & Secured!</h1>
              <p className="text-slate-400 font-medium">Thank you, <span className="text-white font-bold">{booking.guestName}</span>. Your stay at <span className="text-blue-400">{hotel.name}</span> is confirmed.</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">

            {/* Reference Tile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-dashed border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Booking Reference</p>
                <p className="text-2xl font-black font-outfit text-slate-900 tracking-wider">#{booking.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50 print:hidden shrink-0">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <PrintTrigger />
              </div>
            </div>

            {/* Stay Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <DetailItem label="Guest Name" value={booking.guestName} icon={UserIcon} />
                <DetailItem label="Room Type" value={booking.room.type} sub={`Room ${booking.room.number}`} icon={BedDoubleIcon} />
              </div>
              <div className="space-y-6">
                <DetailItem label="Check-In" value={format(booking.checkIn, "EEEE, dd MMM")} sub="After 2:00 PM" icon={CalendarIcon} />
                <DetailItem label="Check-Out" value={format(booking.checkOut, "EEEE, dd MMM")} sub="Before 11:00 AM" icon={CalendarIcon} />
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="bg-slate-50/80 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stay Cost</p>
                  <p className="text-4xl font-black font-outfit text-slate-900">₹{booking.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Status</p>
                  {booking.paidAmount > 0 ? (
                    <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 font-black text-[10px] rounded-lg shadow-lg shadow-emerald-500/20">PAID ONLINE</Badge>
                  ) : (
                    <Badge className="bg-amber-500 text-white border-none px-4 py-1.5 font-black text-[10px] rounded-lg shadow-lg shadow-amber-500/20">PAY AT HOTEL</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Tips & Extras */}
            <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 p-5 rounded-3xl bg-blue-50 border border-blue-100 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Guaranteed</p>
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">This booking is protected by HotelOS security protocols. Your room is reserved and guaranteed for your arrival.</p>
                </div>
              </div>
              <div className="w-full md:w-auto p-5 rounded-3xl bg-slate-100 border border-slate-200 flex items-center gap-3 print:hidden">
                <Camera className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-[10px] font-bold text-slate-500 leading-tight">Can't print? <br /> Take a screenshot.</p>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-center print:hidden">
            <Link href={`/hotel/${hotelId}`}>
              <Button variant="ghost" className="rounded-2xl h-14 px-8 font-black text-slate-500 hover:text-blue-600 transition-all hover:bg-white group">
                <Home className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Return to Hotel Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, sub, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-slate-900 truncate leading-tight">{value}</p>
        {sub && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{sub}</p>}
      </div>
    </div>
  )
}

// Minimal icons to avoid weight
function UserIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function BedDoubleIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" /></svg> }
function CalendarIcon(props: any) { return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg> }
