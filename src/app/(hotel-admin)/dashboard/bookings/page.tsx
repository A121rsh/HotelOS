import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BookingList from "@/components/dashboard/BookingList";

export default async function BookingsPage() {
    const session = await auth();
    const hotel = await getHotelByUserId(session?.user?.id as string);

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Calendar className="h-8 w-8 text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-400">Hotel not found or you don't have permission to access it.</p>
                </div>
            </div>
        );
    }

    const bookings = await db.booking.findMany({
        where: { hotelId: hotel.id },
        include: {
            room: true,
            createdBy: true
        },
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6 font-inter min-h-screen">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20 shadow-lg shadow-[#a1f554]/5">
                            <Calendar className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Bookings</h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                <div className="flex items-center gap-2 bg-[#a1f554]/10 px-3 py-1.5 rounded-full border border-[#a1f554]/20">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse shadow-sm shadow-[#a1f554]" />
                                    <span className="text-[#a1f554] font-semibold text-xs">{bookings.length} Total</span>
                                </div>
                                <span className="text-slate-400 text-xs flex items-center gap-1.5">
                                    <ShieldCheck className="h-3 w-3 text-[#a1f554]" /> 
                                    Secure
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href="/dashboard/bookings/new">
                        <Button className="h-12 md:h-14 px-4 md:px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl group w-full sm:w-auto">
                            <Plus className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            New Booking
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Booking List */}
            <BookingList bookings={bookings} />
        </div>
    );
}