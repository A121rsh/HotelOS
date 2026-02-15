import { db } from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, MapPin, Star, Hotel, ArrowLeft } from "lucide-react";
import BookingForm from "@/components/public/BookingForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookPageProps {
    params: Promise<{ hotelId: string }>;
    searchParams: Promise<{ roomId: string; checkIn: string; checkOut: string }>;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
    const { hotelId } = await params;
    const { roomId, checkIn, checkOut } = await searchParams;

    if (!roomId || !checkIn || !checkOut) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-[#0f110d] p-6 rounded-3xl border border-white/10 text-center max-w-md">
                    <h2 className="text-xl font-bold mb-2 text-white">Invalid Request</h2>
                    <p className="text-slate-400">Missing booking details. Please try searching again.</p>
                </div>
            </div>
        );
    }

    const hotel = await db.hotel.findUnique({
        where: { id: hotelId }
    });

    const room = await db.room.findUnique({
        where: { id: roomId }
    });

    if (!room || !hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-[#0f110d] p-8 rounded-3xl border border-white/10 text-center max-w-md shadow-2xl">
                    <Hotel className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <h2 className="text-2xl font-bold mb-2 text-white">Not Found</h2>
                    <p className="text-slate-400 mb-6">The hotel or room is no longer available.</p>
                    <Button asChild className="h-12 px-8 rounded-xl bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * days;

    return (
        <div className="min-h-screen bg-black">
            <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Form */}
                    <div className="flex-1 space-y-8 order-2 lg:order-1">
                        <div className="space-y-2 mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Complete Booking</h1>
                            <p className="text-slate-400 text-lg">Enter your details to confirm reservation</p>
                        </div>

                        <div className="bg-[#0f110d] rounded-2xl shadow-2xl p-6 md:p-10 border border-white/10">
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
                    </div>

                    {/* Summary */}
                    <div className="lg:w-[420px] order-1 lg:order-2">
                        <div className="sticky top-32 space-y-6">
                            <Card className="rounded-2xl border-white/10 shadow-2xl overflow-hidden bg-[#0f110d]">
                                <div className="relative h-24 bg-gradient-to-br from-[#a1f554]/20 to-transparent flex items-center justify-center border-b border-white/10">
                                    <Badge className="bg-[#a1f554] text-black border-none font-semibold px-3 py-1">
                                        Limited Availability
                                    </Badge>
                                </div>

                                <CardHeader className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-2xl font-bold text-white">{room.type}</CardTitle>
                                        <div className="flex items-center gap-1 text-[#a1f554]">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-bold">4.8</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        <span>Room #{room.number}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 md:p-8 pt-0 space-y-6">
                                    {/* Dates */}
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500">Check-In</p>
                                            <p className="font-semibold text-white">{format(new Date(checkIn), "dd MMM yyyy")}</p>
                                        </div>
                                        <div className="h-8 w-px bg-white/10" />
                                        <div className="space-y-1 text-right">
                                            <p className="text-xs text-slate-500">Check-Out</p>
                                            <p className="font-semibold text-white">{format(new Date(checkOut), "dd MMM yyyy")}</p>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Rate for {days} nights</span>
                                            <span className="text-white font-semibold">₹{(room.price * days).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Taxes & Fees</span>
                                            <span className="text-[#a1f554] font-semibold text-xs">Included</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Total</p>
                                                <p className="text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
                                            </div>
                                            <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20">
                                                Best Price
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-6 md:p-8 pt-0">
                                    <div className="flex items-center gap-3 p-4 bg-[#a1f554]/10 rounded-2xl border border-[#a1f554]/20 w-full">
                                        <ShieldCheck className="h-6 w-6 text-[#a1f554] shrink-0" />
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Your booking is <span className="font-bold text-[#a1f554]">secure</span> and protected by HotelOS.
                                        </p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}