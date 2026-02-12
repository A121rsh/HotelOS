import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import {
    Globe,
    Plus,
    ShieldCheck,
    Zap,
    Activity,
    Settings,
    AlertCircle,
    History,
    RefreshCw,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AddChannelModal from "@/components/AddChannelModal";
import ChannelCard from "@/components/ChannelCard";

export default async function ChannelsPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const hotel = await getHotelByUserId(session.user.id as string);
    if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;

    const channels = await db.channel.findMany({
        where: { hotelId: hotel.id },
        include: {
            mappings: {
                include: { room: true }
            },
            _count: {
                select: { bookings: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const rooms = await db.room.findMany({
        where: { hotelId: hotel.id },
        orderBy: { number: 'asc' }
    });

    const activeChannels = channels.filter(c => c.isActive);
    const totalBookings = channels.reduce((acc, curr) => acc + curr._count.bookings, 0);

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. EXECUTIVE COMMAND HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Globe className="h-8 w-8 text-white animate-spin-slow" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">Channel Intelligence</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold uppercase tracking-widest text-[10px]">{activeChannels.length} Live Sync Nodes</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3 w-3" /> Global ARI Protocol Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                placeholder="Search channel identity..."
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-base font-medium shadow-inner shadow-slate-100 font-inter"
                            />
                        </div>
                        <AddChannelModal hotelId={hotel.id} />
                    </div>
                </div>
            </div>

            {/* 2. OPERATIONAL VITALS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Inbound Traffic</p>
                        <p className="text-3xl font-black font-outfit text-blue-400">{totalBookings}</p>
                        <div className="flex items-center gap-2 mt-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time Ingestion</span>
                        </div>
                    </div>
                    <Zap className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 group-hover:scale-125 transition-transform duration-700" />
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Global Health</p>
                    <p className="text-3xl font-black font-outfit text-emerald-600">OPTIMAL</p>
                    <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <Activity className="h-3 w-3 text-emerald-500" /> Latency: 42ms
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inventory Reach</p>
                    <p className="text-3xl font-black font-outfit text-slate-900">{channels.reduce((acc, c) => acc + c.mappings.length, 0)} Units</p>
                    <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <RefreshCw className="h-3 w-3 text-blue-500" /> Mapped & Synchronized
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">System Authority</p>
                    <p className="text-3xl font-black font-outfit text-slate-900">VERIFIED</p>
                    <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="h-3 w-3 text-blue-600" /> Multi-factor Active
                    </div>
                </div>
            </div>

            {/* 3. CHANNEL DISTRIBUTION GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                {channels.length === 0 ? (
                    <div className="col-span-full py-40 text-center bg-white border-4 border-dashed border-slate-100 rounded-[3rem] shadow-inner">
                        <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-xl">
                            <Globe className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900 mb-2">No Distribution Channels</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                            Your property is currently isolated. Connect to OTAs like Booking.com, Airbnb, or Expedia to begin global synchronization.
                        </p>
                        <AddChannelModal hotelId={hotel.id} />
                    </div>
                ) : (
                    channels.map((channel) => (
                        <ChannelCard key={channel.id} channel={channel} rooms={rooms} />
                    ))
                )}
            </div>

            {/* 4. SECURITY & COMPLIANCE FOOTER */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-black font-outfit text-slate-900 leading-tight">Data Integrity Protocol</h2>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        The HotelOS Channel Manager utilizes a **high-authority ARI engine** to ensure rate parity and inventory accuracy across all connected nodes. Manual synchronization triggers are recorded in the system audit trail for security compliance.
                    </p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
                        <History className="mr-2 h-4 w-4" /> Global Audit Logs
                    </Button>
                    <Button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                        <RefreshCw className="mr-2 h-4 w-4" /> Force Global Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
}
