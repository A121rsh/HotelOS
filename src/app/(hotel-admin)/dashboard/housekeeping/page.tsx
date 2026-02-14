import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import HousekeepingView from "@/components/dashboard/HousekeepingView";

export default async function HousekeepingPage() {
    const session = await auth();
    const hotel = await getHotelByUserId(session?.user?.id as string);

    if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;

    const rooms = await db.room.findMany({
        where: { hotelId: hotel.id },
        orderBy: { number: 'asc' }
    });

    const dirtyRooms = rooms.filter(r => r.status === 'DIRTY');
    const cleanRooms = rooms.filter(r => r.status === 'AVAILABLE');
    const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE');
    const occupiedRooms = rooms.filter(r => r.status === 'BOOKED');

    return (
        <HousekeepingView
            rooms={rooms}
            dirtyRooms={dirtyRooms}
            cleanRooms={cleanRooms}
            maintenanceRooms={maintenanceRooms}
            occupiedRooms={occupiedRooms}
        />
    );
}
