"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DoorOpen,
    Search,
    CheckCircle2,
    Users,
    IndianRupee,
    Wrench,
    TrendingUp,
    Bed
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AddRoomModal from "@/components/AddRoomModal";
import RoomActions from "@/components/RoomActions";

interface Room {
    id: string;
    number: string;
    type: string;
    price: number;
    status: string;
    capacity?: number;
    image?: string | null;
}

interface Stats {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
    potentialRevenue: number;
}

export default function RoomsView({ rooms, stats, hotelId }: { rooms: Room[], stats: Stats, hotelId: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    const filteredRooms = rooms.filter(room => {
        const matchesSearch =
            room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterStatus === "ALL" || room.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const statusConfig = {
        AVAILABLE: { label: "Available", color: "text-[#a1f554]", bg: "bg-[#a1f554]/10", border: "border-[#a1f554]/20" },
        BOOKED: { label: "Booked", color: "text-[#8ba4b8]", bg: "bg-[#8ba4b8]/10", border: "border-[#8ba4b8]/20" },
        DIRTY: { label: "Maintenance", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6 font-inter min-h-screen">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden mt-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <DoorOpen className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Room Management</h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                <div className="flex items-center gap-2 bg-[#a1f554]/10 px-3 py-1 rounded-full border border-[#a1f554]/20">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse" />
                                    <span className="text-[#a1f554] font-semibold text-xs">{stats.total} Rooms</span>
                                </div>
                                <span className="text-slate-400 text-xs">
                                    {stats.available} Available
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-[320px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#a1f554] transition-colors" />
                            <Input
                                placeholder="Search rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 placeholder:text-slate-500 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white"
                            />
                        </div>
                        <AddRoomModal />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 pt-8 border-t border-white/5">
                    <StatCard label="Available" value={stats.available} icon={CheckCircle2} color="green" />
                    <StatCard label="Booked" value={stats.booked} icon={DoorOpen} color="blue" />
                    <StatCard label="Maintenance" value={stats.maintenance} icon={Wrench} color="yellow" />
                    <StatCard label="Revenue Potential" value={`₹${stats.potentialRevenue.toLocaleString()}`} icon={TrendingUp} color="purple" />
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {["ALL", "AVAILABLE", "BOOKED", "DIRTY"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
                            filterStatus === status
                                ? "bg-[#a1f554] text-black"
                                : "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10"
                        )}
                    >
                        {status === "ALL" ? "All Rooms" : status === "DIRTY" ? "Maintenance" : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Rooms Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredRooms.map((room, index) => {
                        const config = statusConfig[room.status as keyof typeof statusConfig];

                        return (
                            <motion.div
                                layout
                                key={room.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.03,
                                }}
                                className="group relative bg-[#0f110d] border border-white/10 rounded-2xl overflow-hidden hover:border-[#a1f554]/30 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-40 bg-black/40 overflow-hidden">
                                    {room.image ? (
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            src={room.image}
                                            alt={`Room ${room.number}`}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f110d] to-black">
                                            <Bed className="h-12 w-12 text-slate-800 group-hover:text-[#a1f554]/20 transition-colors" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <Badge className={cn("text-xs font-semibold backdrop-blur-md", config?.bg, config?.border, config?.color)}>
                                            {room.type.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <RoomActions room={room} />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f110d] via-transparent to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Room {room.number}</h3>
                                            <div className={cn("flex items-center gap-2 mt-2 px-3 py-1 rounded-lg w-fit", config?.bg)}>
                                                <div className={cn("h-1.5 w-1.5 rounded-full", room.status === 'AVAILABLE' ? 'bg-[#a1f554]' : room.status === 'BOOKED' ? 'bg-[#8ba4b8]' : 'bg-yellow-500')} />
                                                <span className={cn("text-xs font-semibold", config?.color)}>
                                                    {config?.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">Per Night</p>
                                            <p className="text-xl font-bold text-[#a1f554]">₹{room.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/10" />

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Users className="h-4 w-4" />
                                            <span>{room.capacity || 2} Guests</span>
                                        </div>
                                        <span className="text-xs text-slate-500">ID: {room.id.slice(-4).toUpperCase()}</span>
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute bottom-0 left-6 right-6 h-1 bg-[#a1f554] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Empty State */}
                {filteredRooms.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-full text-center py-20 md:py-32 bg-white/5 border border-dashed border-white/10 rounded-3xl"
                    >
                        <div className="h-16 w-16 md:h-20 md:w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a1f554]/20">
                            <DoorOpen className="h-8 w-8 md:h-10 md:w-10 text-[#a1f554]" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Rooms Found</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 px-4">
                            {searchQuery || filterStatus !== "ALL"
                                ? "Try adjusting your search or filters"
                                : "Add your first room to get started"
                            }
                        </p>
                        {!searchQuery && filterStatus === "ALL" && (
                            <AddRoomModal />
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
    color
}: {
    label: string;
    value: string | number;
    icon: any;
    color: string;
}) {
    const colorClasses = {
        green: {
            bg: 'bg-[#a1f554]/10',
            text: 'text-[#a1f554]',
            border: 'border-[#a1f554]/20'
        },
        blue: {
            bg: 'bg-[#8ba4b8]/10',
            text: 'text-[#8ba4b8]',
            border: 'border-[#8ba4b8]/20'
        },
        yellow: {
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-400',
            border: 'border-yellow-500/20'
        },
        purple: {
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            border: 'border-purple-500/20'
        }
    };

    const currentColor = colorClasses[color as keyof typeof colorClasses];

    return (
        <div className="flex items-center gap-3">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110",
                currentColor.bg
            )}>
                <Icon className={cn("h-5 w-5", currentColor.text)} />
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className={cn("text-2xl font-bold", currentColor.text)}>{value}</p>
            </div>
        </div>
    );
}