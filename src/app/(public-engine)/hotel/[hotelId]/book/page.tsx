import { db } from "@/lib/db";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard } from "lucide-react";
import BookingForm from "@/components/public/BookingForm";

interface BookPageProps {
    params: Promise<{ hotelId: string }>;
    searchParams: Promise<{ roomId: string; checkIn: string; checkOut: string }>;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const { hotelId } = resolvedParams;
    const { roomId, checkIn, checkOut } = resolvedSearchParams;

    if (!roomId || !checkIn || !checkOut) {
        return <div>Invalid Booking Request</div>;
    }

    // Room details fetch karo price dikhane ke liye
    const room = await db.room.findUnique({
        where: { id: roomId }
    });

    if (!room) return <div>Room not found</div>;

    const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * days;



    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Confirm Your Booking</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* LEFT: Guest Details Form */}
                <div className="md:col-span-2">
                    <BookingForm
                        hotelId={hotelId}
                        roomId={roomId}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        roomPrice={room.price}
                        days={days}
                        roomType={room.type}
                    />
                </div>

                {/* RIGHT: Booking Summary */}
                <div>
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="pb-4 border-b border-slate-200">
                                <div className="text-sm text-slate-500">Room Type</div>
                                <div className="font-bold text-slate-900 text-lg">{room.type}</div>
                            </div>

                            <div className="pb-4 border-b border-slate-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" /> Check-In
                                    </span>
                                    <span className="font-medium">{format(new Date(checkIn), "dd MMM yyyy")}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" /> Check-Out
                                    </span>
                                    <span className="font-medium">{format(new Date(checkOut), "dd MMM yyyy")}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-500 pt-1">
                                    <span>Duration</span>
                                    <span>{days} Night(s)</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-600">Price per night</span>
                                    <span>₹{room.price}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-slate-300 pt-3 mt-3">
                                    <span className="font-bold text-lg">Total Amount</span>
                                    <span className="font-bold text-lg text-green-600">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}