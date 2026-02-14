import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Search, Users, Star, TrendingUp, Calendar, ArrowRight, MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import GuestsView from "@/components/dashboard/GuestsView";

export default async function GuestsPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const hotel = await getHotelByUserId(session.user.id as string);

    if (!hotel) {
        return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;
    }

    const allBookings = await db.booking.findMany({
        where: { hotelId: hotel.id },
        orderBy: { createdAt: 'desc' }
    });

    const uniqueGuestsMap = new Map();

    allBookings.forEach((booking) => {
        const mobile = booking.guestMobile;

        if (!uniqueGuestsMap.has(mobile)) {
            uniqueGuestsMap.set(mobile, {
                id: booking.id,
                name: booking.guestName,
                mobile: booking.guestMobile,
                email: booking.guestEmail,
                idType: booking.idType,
                visits: 1,
                totalSpent: booking.totalAmount,
                lastVisit: booking.checkIn,
                bookings: [booking]
            });
        } else {
            const guest = uniqueGuestsMap.get(mobile);
            guest.visits += 1;
            guest.totalSpent += booking.totalAmount;
            if (new Date(booking.checkIn) > new Date(guest.lastVisit)) {
                guest.lastVisit = booking.checkIn;
            }
            guest.bookings.push(booking);
        }
    });

    const guests = Array.from(uniqueGuestsMap.values()).sort((a: any, b: any) => b.visits - a.visits);

    return (
        <GuestsView initialGuests={guests} />
    );
}