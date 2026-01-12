import { auth } from "@/auth";
import { db } from "@/lib/db";
import HousekeepingCard from "@/components/HousekeepingCard";
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react";

export default async function HousekeepingPage() {
  const session = await auth();
  
  // Data Fetching
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: { 
        hotel: { 
            include: { 
                rooms: {
                    orderBy: { number: 'asc' } // Room number wise sort
                } 
            } 
        } 
    }
  });

  const rooms = user?.hotel?.rooms || [];

  // Stats Calculation
  const dirtyRooms = rooms.filter(r => r.status === 'DIRTY');
  const cleanRooms = rooms.filter(r => r.status === 'AVAILABLE');
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-emerald-500" /> Housekeeping
            </h1>
            <p className="text-slate-500 mt-1">Manage room cleaning status and maintenance tasks.</p>
        </div>
      </div>

      {/* 2. STATS OVERVIEW (Dashboard style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dirty Card */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Needs Cleaning</p>
                <h2 className="text-3xl font-bold text-orange-900 mt-1">{dirtyRooms.length}</h2>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
        </div>

        {/* Clean Card */}
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-green-600 font-semibold text-sm uppercase tracking-wider">Ready / Clean</p>
                <h2 className="text-3xl font-bold text-green-900 mt-1">{cleanRooms.length}</h2>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
        </div>

        {/* Maintenance Card */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-slate-600 font-semibold text-sm uppercase tracking-wider">Maintenance</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{maintenanceRooms.length}</h2>
            </div>
            <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-slate-600" />
            </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. PRIORITY SECTION: DIRTY ROOMS (Sabse upar dikhega) */}
      {dirtyRooms.length > 0 && (
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" /> Priority: To Clean
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dirtyRooms.map(room => (
                    <HousekeepingCard key={room.id} room={room} />
                ))}
            </div>
        </div>
      )}

      {/* 4. OTHER ROOMS (Ready & Others) */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-semibold text-slate-500">All Other Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80 hover:opacity-100 transition-opacity">
            {/* Clean Rooms */}
            {cleanRooms.map(room => (
                <HousekeepingCard key={room.id} room={room} />
            ))}
            {/* Maintenance Rooms */}
            {maintenanceRooms.map(room => (
                <HousekeepingCard key={room.id} room={room} />
            ))}
            {/* Booked Rooms (Inko Housekeeping chhed nahi sakta usually, but dikhana zaroori hai) */}
            {rooms.filter(r => r.status === 'BOOKED').map(room => (
                 <div key={room.id} className="border-2 border-blue-100 bg-blue-50/30 rounded-xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-slate-700">{room.number}</h3>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">OCCUPIED</span>
                    </div>
                    <p className="text-xs text-blue-400 mt-4">Currently Guest Inside</p>
                 </div>
            ))}
        </div>
      </div>

    </div>
  );
}