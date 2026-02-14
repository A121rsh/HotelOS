import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import {
    Globe,
    ShieldCheck,
    Activity,
    RefreshCw,
    Search,
    TrendingUp,
    Layers
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
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6 font-inter min-h-screen">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Globe className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Channel Manager</h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                <div className="flex items-center gap-2 bg-[#a1f554]/10 px-3 py-1 rounded-full border border-[#a1f554]/20">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse" />
                                    <span className="text-[#a1f554] font-semibold text-xs">{activeChannels.length} Active</span>
                                </div>
                                <span className="text-slate-400 text-xs">
                                    {totalBookings} Total Bookings
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-[320px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#a1f554] transition-colors" />
                            <input
                                placeholder="Search channels..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 placeholder:text-slate-500 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white focus:outline-none"
                            />
                        </div>
                        <AddChannelModal hotelId={hotel.id} />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    label="Total Bookings"
                    value={totalBookings}
                    icon={TrendingUp}
                    color="blue"
                    subtext="All time"
                />
                <StatCard
                    label="Active Channels"
                    value={activeChannels.length}
                    icon={Globe}
                    color="green"
                    subtext="Connected"
                />
                <StatCard
                    label="Mapped Units"
                    value={channels.reduce((acc, c) => acc + c.mappings.length, 0)}
                    icon={Layers}
                    color="purple"
                    subtext="Synchronized"
                />
                <StatCard
                    label="System Status"
                    value="Active"
                    icon={Activity}
                    color="cyan"
                    subtext="All systems operational"
                />
            </div>

            {/* Channels Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-[#a1f554] rounded-full" />
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">Connected Channels</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{channels.length} channels configured</p>
                        </div>
                    </div>
                </div>

                {channels.length === 0 ? (
                    <div className="py-20 md:py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <div className="h-16 w-16 md:h-20 md:w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a1f554]/20">
                            <Globe className="h-8 w-8 md:h-10 md:w-10 text-[#a1f554]" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Channels Connected</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 px-4">
                            Connect to booking platforms like Booking.com, Airbnb, or Expedia to start receiving reservations.
                        </p>
                        <AddChannelModal hotelId={hotel.id} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                        {channels.map((channel) => (
                            <ChannelCard key={channel.id} channel={channel} rooms={rooms} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-br from-[#0f110d]/60 to-black/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                            <ShieldCheck className="h-5 w-5 text-[#a1f554]" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-white">Channel Sync Status</h2>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        All channels are synchronized in real-time. Changes to rates and availability are automatically distributed across all connected platforms.
                    </p>
                </div>
                <Button className="h-12 px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl shrink-0 w-full md:w-auto">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync All Channels
                </Button>
            </div>
        </div>
    );
}

function StatCard({ 
    label, 
    value, 
    icon: Icon, 
    color, 
    subtext 
}: { 
    label: string; 
    value: string | number; 
    icon: any; 
    color: string; 
    subtext: string;
}) {
    const colorClasses = {
        blue: {
            bg: 'bg-[#8ba4b8]/10',
            text: 'text-[#8ba4b8]',
            border: 'border-[#8ba4b8]/20'
        },
        green: {
            bg: 'bg-[#a1f554]/10',
            text: 'text-[#a1f554]',
            border: 'border-[#a1f554]/20'
        },
        purple: {
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            border: 'border-purple-500/20'
        },
        cyan: {
            bg: 'bg-cyan-500/10',
            text: 'text-cyan-400',
            border: 'border-cyan-500/20'
        }
    };

    const currentColor = colorClasses[color as keyof typeof colorClasses];

    return (
        <div className={cn(
            "bg-[#0f110d] rounded-2xl p-5 md:p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group",
            currentColor.border
        )}>
            <div className="flex items-center justify-between relative z-10 mb-4">
                <div className={cn(
                    "h-11 w-11 md:h-12 md:w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                    currentColor.bg
                )}>
                    <Icon className={cn("h-5 w-5 md:h-6 md:w-6", currentColor.text)} />
                </div>
                <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{subtext}</div>
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-sm font-semibold text-slate-400">{label}</p>
            </div>

            <div className={cn(
                "absolute -right-6 -bottom-6 h-20 w-20 md:h-24 md:w-24 opacity-5 pointer-events-none transition-all duration-500 group-hover:scale-110",
                currentColor.text
            )}>
                <Icon className="h-full w-full" />
            </div>
        </div>
    );
}