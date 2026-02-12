import { db } from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarDays, CreditCard, ShieldCheck, MapPin, Star, Hotel, ArrowLeft } from "lucide-react";
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
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 text-center max-w-md">
                    <h2 className="text-xl font-bold mb-2 font-outfit">Invalid Booking Request</h2>
                    <p className="opacity-80">We couldn't find the necessary booking details. Please try searching for rooms again.</p>
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
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-slate-100 text-slate-600 p-8 rounded-[2rem] text-center max-w-md shadow-xl">
                    <Hotel className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <h2 className="text-2xl font-bold mb-2 font-outfit text-slate-900">Resource Not Found</h2>
                    <p className="opacity-80 mb-6">The hotel or room you are looking for is no longer available.</p>
                    <Button asChild className="rounded-xl px-8 py-6">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * days;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header / Brand Bar */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href={`/hotel/${hotelId}`} className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Hotel className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-black font-outfit text-slate-900 tracking-tight">{hotel.name}</span>
                            <div className="flex items-center gap-1.5 leading-none mt-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Official Booking Site</span>
                            </div>
                        </div>
                    </Link>
                    <Link href={`/hotel/${hotelId}`}>
                        <Button variant="ghost" className="rounded-xl text-slate-500 font-bold hover:text-blue-600">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Edit Dates
                        </Button>
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT: Guest Details Form */}
                    <div className="flex-1 space-y-8 order-2 lg:order-1">
                        <div className="space-y-2 mb-8">
                            <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 tracking-tight">Final Details</h1>
                            <p className="text-slate-500 text-lg font-medium">Please provide your information to secure your stay.</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
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

                    {/* RIGHT: Booking Summary Card */}
                    <div className="lg:w-[420px] order-1 lg:order-2">
                        <div className="sticky top-32 space-y-6">
                            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                                <div className="relative h-32 bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                                    <div className="relative text-center">
                                        <Badge className="bg-emerald-500 text-white border-none font-black px-3 py-1 mb-2">LIMITED AVAILABILITY</Badge>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Reservation Details</p>
                                    </div>
                                </div>
                                <CardHeader className="p-8 pb-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-2xl font-black font-outfit text-slate-900">{room.type}</CardTitle>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-sm font-black">4.8</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                        <MapPin className="h-4 w-4" />
                                        <span>Standard Floor, North Wing</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-6 space-y-6">
                                    {/* Dates Bar */}
                                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-In</p>
                                            <p className="font-bold text-slate-900">{format(new Date(checkIn), "dd MMM yyyy")}</p>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200" />
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-Out</p>
                                            <p className="font-bold text-slate-900">{format(new Date(checkOut), "dd MMM yyyy")}</p>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-slate-500">Rate for {days} nights</span>
                                            <span className="text-slate-900">₹{(room.price * days).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-slate-500">Service Charges & Taxes</span>
                                            <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Included</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Stay</p>
                                                <p className="text-4xl font-black font-outfit text-slate-900 tracking-tight">₹{totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 mb-1">BEST PRICE</p>
                                                <Badge className="bg-blue-50 text-blue-600 border-blue-100 shadow-none">GUARANTEED</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 pt-0">
                                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 w-full">
                                        <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                                        <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                            Your reservation is <span className="font-black underline">fully encrypted</span> and protected by HotelOS security protocols.
                                        </p>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
                                    <CreditCard className="h-5 w-5 mx-auto mb-2 text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Secure Payments</p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
                                    <CalendarDays className="h-5 w-5 mx-auto mb-2 text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Instant Confirm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}