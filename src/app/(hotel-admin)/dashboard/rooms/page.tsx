import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import AddRoomModal from "@/components/AddRoomModal";
import RoomActions from "@/components/RoomActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BedDouble, Search, Sparkles, Filter, MoreVertical, LayoutGrid, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function RoomsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);
  if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;

  const rooms = await db.room.findMany({
    where: { hotelId: hotel.id },
    orderBy: { number: 'asc' }
  });

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

      {/* HEADER SECTION */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
              <BedDouble className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight leading-tight">Room Management</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[10px]">{rooms.length} Active Rooms</Badge>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">Live Management</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search by room number..."
                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-all text-base font-medium shadow-inner shadow-slate-100"
              />
            </div>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <Filter className="h-5 w-5" />
            </Button>
            <AddRoomModal />
          </div>
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
              <BedDouble className="h-24 w-24 -rotate-12" />
            </div>

            {/* Status & Category */}
            <div className="flex justify-between items-center mb-8">
              <Badge variant="outline" className="bg-slate-50 text-slate-500 font-black border-slate-100 uppercase tracking-widest text-[9px] px-3 py-1">
                {room.type}
              </Badge>

              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm",
                room.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  room.status === 'BOOKED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    room.status === 'DIRTY' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
              )}>
                <div className={cn("h-1.5 w-1.5 rounded-full",
                  room.status === 'AVAILABLE' ? 'bg-emerald-500 animate-pulse' :
                    room.status === 'BOOKED' ? 'bg-blue-500' :
                      room.status === 'DIRTY' ? 'bg-amber-500' : 'bg-slate-400'
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {room.status === 'AVAILABLE' ? 'Active' : room.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Identity Cell */}
            <div className="flex items-center gap-5 mb-8">
              <div className="h-16 w-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <BedDouble className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-1">{room.number}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit Identification</p>
              </div>
            </div>

            <div className="h-px bg-slate-50 mb-8" />

            {/* Financials & Actions */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nightly Rate</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-black font-outfit text-slate-900 tracking-tight">₹{room.price.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-slate-400 ml-1 uppercase">/Stay</span>
                </div>
              </div>

              <div className="pb-1">
                <RoomActions room={room} />
              </div>
            </div>

            {/* Micro-Interaction Bar */}
            <div className="absolute bottom-0 left-10 right-10 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full" />
          </div>
        ))}

        {/* Empty State */}
        {rooms.length === 0 && (
          <div className="col-span-full text-center py-40 border-4 border-dashed border-slate-100 rounded-[3rem] bg-white shadow-inner">
            <div className="h-24 w-24 bg-slate-50 rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 border-8 border-white">
              <BedDouble className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black font-outfit text-slate-900 mb-2">No Rooms Found</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
              Your digital floor plan is currently vacant. Start populating your property today.
            </p>
            <div className="flex justify-center">
              <AddRoomModal />
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold">Optimization Tip</p>
            <p className="text-xs text-slate-400">Regularly verify room statuses to maintain 100% reservation accuracy.</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Value</p>
            <p className="text-xl font-bold">₹{rooms.reduce((acc, r) => acc + r.price, 0).toLocaleString()}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Health</p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              OPTIMIZED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}