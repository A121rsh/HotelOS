import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper"; // ✅ HELPER USE KIYA
import { redirect } from "next/navigation";
import AddRoomModal from "@/components/AddRoomModal";
import RoomActions from "@/components/RoomActions"; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; 
import { 
  BedDouble, 
  Search
} from "lucide-react";

export default async function RoomsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // 1. ✅ NAYE LOGIC SE HOTEL NIKALA (Fixes "Unknown field hotel" error)
  const hotel = await getHotelByUserId(session.user.id as string);

  if (!hotel) {
      return <div>Hotel not found or Access Denied.</div>;
  }

  // 2. ✅ AB HOTEL ID SE ROOMS NIKALE
  const rooms = await db.room.findMany({
      where: { hotelId: hotel.id },
      orderBy: { number: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Room Inventory</h1>
            <p className="text-slate-500 text-sm">Manage room types, pricing, and inventory.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search room number..." className="pl-9 bg-white" />
            </div>
            {/* Modal ko hotel ID pass karne ki zaroorat nahi agar wo server action use kar raha hai */}
            <AddRoomModal />
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200"
          >
            {/* Top Row: Type & Status */}
            <div className="flex justify-between items-start mb-3">
                 <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
                    {room.type}
                 </Badge>
                 
                 <div className="flex items-center gap-1.5" title={`Status: ${room.status}`}>
                    <span className={`h-2.5 w-2.5 rounded-full 
                        ${room.status === 'AVAILABLE' ? 'bg-green-500 animate-pulse' : 
                          room.status === 'BOOKED' ? 'bg-blue-500' : 
                          room.status === 'DIRTY' ? 'bg-orange-500' : 'bg-slate-400'}
                    `}></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {room.status === 'AVAILABLE' ? 'Active' : room.status}
                    </span>
                 </div>
            </div>

            {/* Room Number */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <BedDouble className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">{room.number}</h3>
                    <p className="text-xs text-slate-400">Room Number</p>
                </div>
            </div>

            <div className="h-px bg-slate-100 mb-4" />

            {/* Bottom Row: Price & Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-xl font-bold text-slate-900">₹{room.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-medium"> /night</span>
                </div>

                <RoomActions room={room} />
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {rooms.length === 0 && (
            <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                    <BedDouble className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No rooms in inventory.</p>
                <p className="text-xs text-slate-400 mt-1">Add rooms to start booking.</p>
            </div>
        )}
      </div>
    </div>
  );
}