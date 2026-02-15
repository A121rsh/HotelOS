import { db } from "@/lib/db";
import { CheckCircle2, Home, Share2, Hotel } from "lucide-react";
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
        <div className="bg-[#0f110d] p-8 rounded-3xl border border-white/10 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2 text-white">Invalid Request</h2>
          <p className="text-slate-400">Booking reference missing.</p>
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
        <div className="bg-[#0f110d] p-8 rounded-3xl border border-white/10 text-center max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold mb-2 text-white">Booking Not Found</h2>
          <p className="text-slate-400 mb-6">We couldn't retrieve your booking details.</p>
          <Button asChild className="h-12 rounded-xl px-8 bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 md:py-24 px-4 bg-black">
      <div className="max-w-2xl w-full">

        <div className="bg-[#0f110d] rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

          {/* Success Banner */}
          <div className="bg-gradient-to-br from-[#0f110d] to-black p-10 text-center text-white relative border-b border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="h-20 w-20 bg-[#a1f554] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#a1f554]/20">
                <CheckCircle2 className="h-10 w-10 text-black" />
              </div>
              <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 px-4 py-1 mb-4 font-semibold">
                Reservation Confirmed
              </Badge>
              <h1 className="text-4xl font-bold mb-2">Booking Successful!</h1>
              <p className="text-slate-400">
                Thank you, <span className="text-white font-semibold">{booking.guestName}</span>. Your stay at <span className="text-[#a1f554]">{hotel.name}</span> is confirmed.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">

            {/* Reference */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Booking Reference</p>
                <p className="text-2xl font-bold text-white">#{booking.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <PrintTrigger />
              </div>
            </div>

            {/* Stay Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailItem label="Guest Name" value={booking.guestName} />
                <DetailItem label="Room" value={`${booking.room.type} - Room ${booking.room.number}`} />
              </div>
              <div className="space-y-4">
                <DetailItem label="Check-In" value={format(booking.checkIn, "dd MMM yyyy")} />
                <DetailItem label="Check-Out" value={format(booking.checkOut, "dd MMM yyyy")} />
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-white">₹{booking.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-2">Payment Status</p>
                  {booking.paidAmount > 0 ? (
                    <Badge className="bg-[#a1f554] text-black border-none px-4 py-1.5 font-semibold">
                      Paid Online
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-1.5 font-semibold">
                      Pay at Hotel
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-5 rounded-2xl bg-[#a1f554]/10 border border-[#a1f554]/20">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-[#a1f554] font-semibold">Important:</span> Please carry a valid ID for check-in. Your room will be ready after 2:00 PM on your check-in date.
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="p-8 bg-black/40 border-t border-white/10 flex justify-center">
            <Link href={`/hotel/${hotelId}`}>
              <Button variant="ghost" className="h-12 px-6 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                <Home className="mr-2 h-5 w-5" />
                Return to Hotel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}