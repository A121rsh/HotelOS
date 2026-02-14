import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import NewBookingForm from "@/components/NewBookingForm";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewBookingPage() {
  const session = await auth();

  const hotel = await getHotelByUserId(session?.user?.id as string);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Calendar className="h-8 w-8 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Hotel not found or you don't have permission to access it.</p>
        </div>
      </div>
    );
  }

  const rooms = await db.room.findMany({
    where: {
      hotelId: hotel.id,
      status: "AVAILABLE"
    },
    orderBy: { number: 'asc' }
  });

  return (
    <div className="min-h-screen text-white font-inter">
      <div className="max-w-[1400px] mx-auto py-8 md:py-10 px-4 md:px-6">
        {/* Back Button */}
        <Link href="/dashboard/bookings">
          <Button 
            variant="ghost" 
            className="mb-6 text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Bookings
          </Button>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />
          
          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20 shadow-lg shadow-[#a1f554]/5">
              <Calendar className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">New Booking</h1>
              <p className="text-slate-400 text-sm mt-1">Create a new reservation</p>
            </div>
          </div>
        </div>

        {/* Form Component */}
        <NewBookingForm rooms={rooms} />
      </div>
    </div>
  );
}