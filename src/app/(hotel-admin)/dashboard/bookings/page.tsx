import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Calendar, ArrowRight, ChevronRight, User, MoreHorizontal, ShieldCheck } from "lucide-react";
import BookingActions from "@/components/BookingActions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- Custom Icons for IDs ---
const Icons = {
    Aadhar: () => (
        <div className="h-4 w-4 bg-orange-100 rounded-sm flex items-center justify-center text-[8px] font-black text-orange-600 border border-orange-200">Ad</div>
    ),
    Passport: () => (
        <div className="h-4 w-4 bg-blue-100 rounded-sm flex items-center justify-center text-[8px] font-black text-blue-600 border border-blue-200">Ps</div>
    ),
    IDCard: () => (
        <div className="h-4 w-4 bg-slate-100 rounded-sm flex items-center justify-center text-[8px] font-black text-slate-600 border border-slate-200">Id</div>
    )
};

export default async function BookingsPage() {
    const session = await auth();
    const hotel = await getHotelByUserId(session?.user?.id as string);

    if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;

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
        <div className="max-w-[1600px] mx-auto space-y-8 pb-10 font-inter">

            {/* HEADER SECTION */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight leading-tight">Bookings & Reservations</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold uppercase tracking-widest text-[10px]">{bookings.length} Total Records</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Real-time Sync
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href="/dashboard/bookings/new">
                        <Button className="btn-premium h-14 px-8 rounded-2xl font-black group shadow-xl shadow-blue-500/20 text-lg uppercase tracking-widest">
                            <Plus className="mr-2 h-6 w-6 group-hover:rotate-90 transition-transform" />
                            New Booking
                        </Button>
                    </Link>
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="text-center py-32 px-4">
                        <div className="bg-slate-50 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-xl">
                            <Calendar className="h-14 w-14 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black font-outfit text-slate-900 mb-4">No Bookings Yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium text-lg leading-relaxed mb-10">
                            Your reservation calendar is awaiting its first entry. Ready to welcome a guest?
                        </p>
                        <Link href="/dashboard/bookings/new">
                            <Button className="h-14 px-10 rounded-2xl font-black bg-slate-900 text-white hover:bg-black transition-all">
                                Create Your First Booking
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guest Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room & Stay</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ledger</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all">

                                        {/* Guest Details */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-base border-2 border-slate-100 group-hover:border-blue-200 group-hover:scale-105 transition-all shadow-sm">
                                                    {booking.guestName.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-slate-900 text-base leading-tight truncate">{booking.guestName}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="h-5 px-1.5 font-black text-[9px] border-slate-100 text-slate-500 bg-white">
                                                            {booking.idType === 'AADHAR' ? <Icons.Aadhar /> :
                                                                booking.idType === 'PASSPORT' ? <Icons.Passport /> : <Icons.IDCard />}
                                                            <span className="ml-1 uppercase">{booking.idType}</span>
                                                        </Badge>
                                                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                                                            <Phone className="h-3 w-3" /> {booking.guestMobile}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Room & Stay */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg shadow-slate-900/10">
                                                    R{booking.room.number}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                                        {formatDate(booking.checkIn)}
                                                        <ArrowRight className="h-3 w-3 text-slate-300" />
                                                        {formatDate(booking.checkOut)}
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {getNights(booking.checkIn, booking.checkOut)} Nights • {booking.room.type}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                booking.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    booking.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        booking.status === 'CHECKED_OUT' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                            'bg-red-50 text-red-600 border-red-100'
                                            )}>
                                                <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse",
                                                    booking.status === 'CONFIRMED' ? 'bg-blue-500' :
                                                        booking.status === 'CHECKED_IN' ? 'bg-emerald-500' :
                                                            booking.status === 'CHECKED_OUT' ? 'bg-slate-500' : 'bg-red-500'
                                                )} />
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </td>

                                        {/* Ledger */}
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="text-base font-black text-slate-900 tracking-tight">₹{booking.totalAmount.toLocaleString()}</div>
                                                <div className="flex items-center gap-1.5">
                                                    {booking.paidAmount >= booking.totalAmount ? (
                                                        <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5">Settled</Badge>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Balance: ₹{(booking.totalAmount - booking.paidAmount).toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end items-center">
                                                <BookingActions
                                                    bookingId={booking.id}
                                                    status={booking.status}
                                                    roomPrice={booking.room.price}
                                                    dueAmount={booking.totalAmount - booking.paidAmount}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatDate(date: any) {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getNights(start: any, end: any) {
    return Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
}