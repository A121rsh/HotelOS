import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper"; // ✅ HELPER
import NewBookingForm from "@/components/NewBookingForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewBookingPage() {
  const session = await auth();
  
  // 1. ✅ NAYE LOGIC SE HOTEL NIKALA
  const hotel = await getHotelByUserId(session?.user?.id as string);

  if (!hotel) {
      return <div>Hotel not found or Access Denied.</div>;
  }

  // 2. ✅ HOTEL ID USE KARKE ROOMS NIKALE
  const rooms = await db.room.findMany({
      where: { 
        hotelId: hotel.id,
        status: "AVAILABLE" 
      },
      orderBy: { number: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/bookings">
            <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-900">New Reservation</h1>
            <p className="text-slate-500 text-sm">Create a booking with KYC & Payment details.</p>
        </div>
      </div>

      {/* Form Component */}
      <NewBookingForm rooms={rooms} />
    </div>
  );
}