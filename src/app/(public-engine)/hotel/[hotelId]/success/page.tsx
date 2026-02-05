import { db } from "@/lib/db";
import { CheckCircle2, Home, Camera } from "lucide-react"; // ✅ Camera add kiya
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import PrintTrigger from "@/components/public/PrintTrigger";

interface SuccessPageProps {
  params: Promise<{ hotelId: string }>;
  searchParams: Promise<{ bookingId: string }>;
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { hotelId } = resolvedParams;
  const { bookingId } = resolvedSearchParams;

  if (!bookingId) return <div>Invalid Request</div>;

  // Booking details fetch karo
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { room: true }
  });

  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100 print:shadow-none print:border-none">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Booking Confirmed!
        </h1>

        <p className="text-slate-500 mb-8">
          Thank you,{" "}
          <span className="font-bold text-slate-900">
            {booking.guestName}
          </span>
          . Your stay is reserved.
        </p>

        {/* Booking Details Ticket */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left space-y-3 border border-slate-200 print:bg-white print:border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Booking ID</span>
            <span className="font-mono font-bold text-slate-900">
              #{booking.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <hr className="border-slate-200 print:border-slate-800" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Room</span>
            <span className="font-medium text-slate-900">
              {booking.room.type} (Room {booking.room.number})
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Check-In</span>
            <span className="font-medium text-slate-900">
              {format(booking.checkIn, "dd MMM yyyy")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Check-Out</span>
            <span className="font-medium text-slate-900">
              {format(booking.checkOut, "dd MMM yyyy")}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-slate-500">
              Amount Due (at Hotel)
            </span>
            <span className="font-bold text-green-600 text-lg">
              ₹{booking.totalAmount}
            </span>
          </div>
        </div>

        {/* Actions (Print me hide) */}
        <div className="space-y-3 print:hidden">
          <Link href={`/hotel/${hotelId}`}>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 h-12">
              <Home className="mr-2 h-4 w-4" /> Go to Home
            </Button>
          </Link>

          <PrintTrigger />
        </div>

        {/* ✅ Screenshot Tip */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-100 p-3 rounded-lg print:hidden animate-in fade-in slide-in-from-bottom-2">
          <Camera className="h-4 w-4 text-slate-400" />
          <span>
            Tip: If you can't print, please take a screenshot of this page for your records.
          </span>
        </div>

      </div>
    </div>
  );
}
