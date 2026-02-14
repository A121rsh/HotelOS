import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import RoomsView from "@/components/dashboard/RoomsView";

export default async function RoomsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);
  
  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Hotel not found or you don't have permission to access it.</p>
        </div>
      </div>
    );
  }

  const rooms = await db.room.findMany({
    where: { hotelId: hotel.id },
    orderBy: { number: 'asc' }
  });

  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'AVAILABLE').length,
    booked: rooms.filter(r => r.status === 'BOOKED').length,
    maintenance: rooms.filter(r => r.status === 'DIRTY').length,
    potentialRevenue: rooms.reduce((acc, r) => acc + r.price, 0)
  };

  return <RoomsView rooms={rooms} stats={stats} hotelId={hotel.id} />;
}