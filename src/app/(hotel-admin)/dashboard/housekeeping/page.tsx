import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import HousekeepingCard from "@/components/HousekeepingCard";
import { Sparkles, AlertCircle, CheckCircle, ShieldCheck, Zap, BedDouble, Filter, Search, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. EXECUTIVE HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Housekeeping Control</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold uppercase tracking-widest text-[10px]">{dirtyRooms.length} Pending Turnovers</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3 w-3" /> Live Operations
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                placeholder="Search room number..."
                                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500 transition-all text-base font-medium shadow-inner shadow-slate-100 font-inter"
                            />
                        </div>
                        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                            <Filter className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. EFFICIENCY METRICS (Interactive Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusMetric
                    label="Dirty Rooms"
                    count={dirtyRooms.length}
                    total={rooms.length}
                    color="orange"
                    icon={AlertCircle}
                    subtext="Needs attention"
                />
                <StatusMetric
                    label="Ready to Sell"
                    count={cleanRooms.length}
                    total={rooms.length}
                    color="emerald"
                    icon={CheckCircle}
                    subtext="Verified clean"
                />
                <StatusMetric
                    label="Maintenance"
                    count={maintenanceRooms.length}
                    total={rooms.length}
                    color="slate"
                    icon={Zap}
                    subtext="Out of service"
                />
                <StatusMetric
                    label="Occupied"
                    count={occupiedRooms.length}
                    total={rooms.length}
                    color="blue"
                    icon={BedDouble}
                    subtext="Guest in-room"
                />
            </div>

            {/* 3. PRIORITY WORKFLOW: NEEDS CLEANING */}
            {dirtyRooms.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-orange-500 rounded-full" />
                        <h2 className="text-2xl font-black font-outfit text-slate-800 tracking-tight">Priority Turnovers</h2>
                        <Badge className="bg-orange-100 text-orange-600 border-none font-bold uppercase tracking-widest text-[9px] px-2">High Impact</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {dirtyRooms.map(room => (
                            <HousekeepingCard key={room.id} room={room} />
                        ))}
                    </div>
                </div>
            )}

            {/* 4. OPERATIONAL MONITORING: ALL OTHER ROOMS */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-slate-300 rounded-full" />
                        <h2 className="text-xl font-bold font-outfit text-slate-500 tracking-tight">Property Status Overview</h2>
                    </div>
                    <p className="hidden md:block text-xs font-bold text-slate-400 italic">Hover for management actions</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* Clean Rooms */}
                    {cleanRooms.map(room => (
                        <HousekeepingCard key={room.id} room={room} />
                    ))}

                    {/* Maintenance Rooms */}
                    {maintenanceRooms.map(room => (
                        <HousekeepingCard key={room.id} room={room} />
                    ))}

                    {/* Occupied Rooms (Display Only - High End Cards) */}
                    {occupiedRooms.map(room => (
                        <div key={room.id} className="group relative bg-blue-50/20 border border-blue-100 rounded-[2rem] p-8 shadow-sm transition-all duration-300">
                            <div className="absolute top-6 right-6">
                                <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                                    Occupied
                                </Badge>
                            </div>
                            <div className="flex items-center gap-5 mb-8">
                                <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                    <BedDouble className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-1">{room.number}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guest Inside</p>
                                </div>
                            </div>
                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-50 flex items-center gap-3 group-hover:bg-white/80 transition-all">
                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Info className="h-4 w-4 text-blue-600" />
                                </div>
                                <p className="text-[10px] font-bold text-blue-400 leading-tight">
                                    Cleaning available after guest checkout or request.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

function StatusMetric({ label, count, total, color, icon: Icon, subtext }: any) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                    color === 'orange' ? 'bg-orange-50 text-orange-600' :
                        color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                            color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                'bg-slate-50 text-slate-600'
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black font-outfit text-slate-900">{count}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pct}% of Total</span>
                </div>
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                    <div className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        color === 'orange' ? 'bg-orange-500' :
                            color === 'emerald' ? 'bg-emerald-500' :
                                color === 'blue' ? 'bg-blue-500' : 'bg-slate-500'
                    )} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">{subtext}</p>
            </div>
            <div className={cn(
                "absolute -right-4 -bottom-4 h-24 w-24 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700",
                color === 'orange' ? 'text-orange-900' :
                    color === 'emerald' ? 'text-emerald-900' :
                        color === 'blue' ? 'text-blue-900' : 'text-slate-900'
            )}>
                <Icon className="h-full w-full" />
            </div>
        </Card>
    );
}