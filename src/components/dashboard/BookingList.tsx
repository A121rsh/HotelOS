"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Calendar,
    Phone,
    ArrowRight,
    Download,
    CheckCircle2,
    Clock,
    User,
    RefreshCw,
    DoorOpen,
    IndianRupee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import BookingActions from "@/components/BookingActions";

interface BookingListProps {
    bookings: any[];
}

export default function BookingList({ bookings: initialBookings }: BookingListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const filteredBookings = useMemo(() => {
        return initialBookings.filter(booking => {
            const matchesSearch =
                booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.room.number.toString().includes(searchQuery) ||
                booking.guestMobile.includes(searchQuery);

            const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [initialBookings, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: initialBookings.length,
            confirmed: initialBookings.filter(b => b.status === 'CONFIRMED').length,
            checkedIn: initialBookings.filter(b => b.status === 'CHECKED_IN').length,
            checkedOut: initialBookings.filter(b => b.status === 'CHECKED_OUT').length,
        };
    }, [initialBookings]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Total", value: stats.total, icon: Calendar, color: "bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20" },
                    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                    { label: "Checked In", value: stats.checkedIn, icon: DoorOpen, color: "bg-[#8ba4b8]/10 text-[#8ba4b8] border-[#8ba4b8]/20" },
                    { label: "Checked Out", value: stats.checkedOut, icon: CheckCircle2, color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={stat.label}
                        className={cn(
                            "bg-[#0f110d] p-5 md:p-6 rounded-2xl border shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group",
                            stat.color
                        )}
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={cn("h-11 w-11 md:h-12 md:w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", stat.color)}>
                                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-0.5">{stat.label}</p>
                                <h4 className="text-2xl md:text-3xl font-bold leading-none">{stat.value}</h4>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-[#0f110d] p-4 md:p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search guest name, room, or phone..."
                        className="pl-11 h-12 rounded-xl bg-white/5 border-white/10 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 text-white placeholder:text-slate-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                    {["ALL", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"].map((status) => (
                        <Button
                            key={status}
                            variant="ghost"
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-semibold transition-all shrink-0",
                                statusFilter === status
                                    ? "bg-[#a1f554] text-black hover:bg-[#8fd445]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
                            )}
                        >
                            {status === "ALL" ? "All" : status.replace('_', ' ')}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                        onClick={handleRefresh}
                        title="Refresh"
                    >
                        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin text-[#a1f554]")} />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                        title="Export"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Bookings Table/List */}
            <div className="bg-[#0f110d] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black/40 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Guest</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Room & Dates</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredBookings.map((booking, idx) => (
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                                        key={booking.id}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer relative"
                                    >
                                        <td className="px-6 py-4 relative">
                                            <Link href={`/dashboard/bookings/${booking.id}`} className="absolute inset-0 z-0" />
                                            <div className="flex items-center gap-3 relative z-10 pointer-events-none">
                                                <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 text-[#a1f554] flex items-center justify-center font-bold text-sm border border-[#a1f554]/20 group-hover:scale-110 transition-transform shrink-0">
                                                    {booking.guestName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-white text-sm truncate">{booking.guestName}</div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Phone className="h-3 w-3 text-slate-500" />
                                                        <span className="text-xs text-slate-400">{booking.guestMobile}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 relative">
                                            <Link href={`/dashboard/bookings/${booking.id}`} className="absolute inset-0 z-0" />
                                            <div className="flex items-center gap-3 relative z-10 pointer-events-none">
                                                <div className="bg-[#a1f554] text-black px-2.5 py-1 rounded-lg font-bold text-xs shrink-0">
                                                    Room {booking.room.number}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="font-medium text-slate-300 text-xs flex items-center gap-1.5">
                                                        {new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        <ArrowRight className="h-3 w-3 text-slate-600" />
                                                        {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {Math.ceil(Math.abs(new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 relative">
                                            <Link href={`/dashboard/bookings/${booking.id}`} className="absolute inset-0 z-0" />
                                            <div className="relative z-10 pointer-events-none">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border",
                                                    booking.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        booking.status === 'CHECKED_IN' ? 'bg-[#8ba4b8]/10 text-[#8ba4b8] border-[#8ba4b8]/20' :
                                                            booking.status === 'CHECKED_OUT' ? 'bg-slate-700/50 text-slate-400 border-slate-600/50' :
                                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                )}>
                                                    <div className={cn("h-1.5 w-1.5 rounded-full",
                                                        booking.status === 'CONFIRMED' ? 'bg-blue-400 animate-pulse' :
                                                            booking.status === 'CHECKED_IN' ? 'bg-[#8ba4b8] animate-pulse' :
                                                                booking.status === 'CHECKED_OUT' ? 'bg-slate-500' : 'bg-yellow-400 animate-pulse'
                                                    )} />
                                                    {booking.status === 'CHECKED_IN' ? 'Checked In' : 
                                                     booking.status === 'CHECKED_OUT' ? 'Checked Out' :
                                                     booking.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 relative">
                                            <Link href={`/dashboard/bookings/${booking.id}`} className="absolute inset-0 z-0" />
                                            <div className="space-y-0.5 relative z-10 pointer-events-none">
                                                <div className="text-sm font-bold text-white">₹{booking.totalAmount.toLocaleString()}</div>
                                                <div className="flex items-center gap-1.5">
                                                    {booking.paidAmount >= booking.totalAmount ? (
                                                        <span className="text-xs text-[#a1f554] font-medium">Paid</span>
                                                    ) : (
                                                        <span className="text-xs text-red-400 font-medium">Due: ₹{(booking.totalAmount - booking.paidAmount).toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right relative z-30">
                                            <BookingActions
                                                bookingId={booking.id}
                                                status={booking.status}
                                                roomPrice={booking.room.price}
                                                dueAmount={booking.totalAmount - booking.paidAmount}
                                            />
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-white/5">
                    <AnimatePresence mode="popLayout">
                        {filteredBookings.map((booking) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={booking.id}
                                className="p-4 flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between">
                                    <Link href={`/dashboard/bookings/${booking.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-xl bg-[#a1f554] text-black flex items-center justify-center font-bold text-xs shrink-0">
                                            {booking.room.number}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-white text-sm truncate">{booking.guestName}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{booking.guestMobile}</p>
                                        </div>
                                    </Link>
                                    <BookingActions
                                        bookingId={booking.id}
                                        status={booking.status}
                                        roomPrice={booking.room.price}
                                        dueAmount={booking.totalAmount - booking.paidAmount}
                                    />
                                </div>

                                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Check-in / Check-out</p>
                                        <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                            {new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            <ArrowRight className="h-2.5 w-2.5 text-slate-600" />
                                            {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <div className={cn(
                                            "text-xs font-semibold",
                                            booking.status === 'CONFIRMED' ? 'text-blue-400' :
                                                booking.status === 'CHECKED_IN' ? 'text-[#8ba4b8]' :
                                                    booking.status === 'CHECKED_OUT' ? 'text-slate-400' : 'text-yellow-400'
                                        )}>
                                            {booking.status === 'CHECKED_IN' ? 'Checked In' : 
                                             booking.status === 'CHECKED_OUT' ? 'Checked Out' :
                                             booking.status.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-bold text-white">₹{booking.totalAmount.toLocaleString()}</span>
                                        <span className="text-xs text-slate-500">Total</span>
                                    </div>
                                    {booking.totalAmount - booking.paidAmount > 0 && (
                                        <div className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/20 text-xs font-medium">
                                            Due: ₹{(booking.totalAmount - booking.paidAmount).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 md:py-32 px-4 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl"
                >
                    <div className="h-16 w-16 md:h-20 md:w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a1f554]/20">
                        <Search className="h-8 w-8 md:h-10 md:w-10 text-[#a1f554]" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Bookings Found</h3>
                    <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters</p>
                    <Button 
                        variant="ghost" 
                        onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }} 
                        className="text-[#a1f554] hover:text-[#8fd445] hover:bg-[#a1f554]/10"
                    >
                        Clear Filters
                    </Button>
                </motion.div>
            )}
        </div>
    );
}