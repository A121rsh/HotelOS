import { db } from "@/lib/db";
import { format } from "date-fns";
import { createPublicBooking } from "@/actions/create-public-booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

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

  // Form Submit Handler (Server Action wrapper)
  async function handleSubmit(formData: FormData) {
    "use server";
    const res = await createPublicBooking(formData);
    if (res.error) {
        // Error handling (Real app me toast dikhayenge)
        console.log(res.error);
    } else if (res.success) {
        redirect(`/hotel/${hotelId}/success?bookingId=${res.bookingId}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Confirm Your Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT: Guest Details Form */}
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <input type="hidden" name="hotelId" value={hotelId} />
                        <input type="hidden" name="roomId" value={roomId} />
                        <input type="hidden" name="checkIn" value={checkIn} />
                        <input type="hidden" name="checkOut" value={checkOut} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input name="guestName" placeholder="e.g. Rahul Kumar" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Mobile Number</Label>
                                <Input name="guestMobile" placeholder="+91 98765..." required />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input name="guestEmail" type="email" placeholder="rahul@example.com" required />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg">
                                <CreditCard className="mr-2 h-5 w-5" /> Confirm & Pay Later
                            </Button>
                            <p className="text-xs text-center text-slate-500 mt-2">
                                No payment required today. Pay at hotel during check-in.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
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
                                <CalendarDays className="h-4 w-4"/> Check-In
                            </span>
                            <span className="font-medium">{format(new Date(checkIn), "dd MMM yyyy")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 flex items-center gap-2">
                                <CalendarDays className="h-4 w-4"/> Check-Out
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