import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookingDetailView from "@/components/dashboard/BookingDetailView";

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) redirect("/login");
    const { id } = await params;

    const hotel = await getHotelByUserId(session.user.id as string);
    
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

    const booking = await db.booking.findUnique({
        where: { id: id, hotelId: hotel.id },
        include: { room: true }
    });

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Calendar className="h-10 w-10 text-slate-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Booking Not Found</h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-8 px-4">
                        This reservation could not be located. It may have been deleted or archived.
                    </p>
                    <Link href="/dashboard/bookings">
                        <Button className="h-12 px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Bookings
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Days until arrival logic
    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let statusMessage = "Booking details";
    if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
        if (diffDays > 0) statusMessage = `Guest arrives in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
        else if (diffDays === 0) statusMessage = `Guest arrives today`;
        else statusMessage = `Check-in was ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} ago`;
    } else if (booking.status === 'CHECKED_IN') {
        statusMessage = `Currently staying in Room ${booking.room.number}`;
    } else if (booking.status === 'CHECKED_OUT') {
        statusMessage = `Guest has checked out`;
    } else if (booking.status === 'CANCELLED') {
        statusMessage = `Booking cancelled`;
    }

    return (
        <BookingDetailView
            booking={JSON.parse(JSON.stringify(booking))}
            statusMessage={statusMessage}
            id={id}
        />
    );
}