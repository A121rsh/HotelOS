import { db } from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Wifi, User, ArrowRight, Star, ShieldCheck, MapPinned, Coffee, Tv } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SearchPageProps {
  params: Promise<{ hotelId: string }>;
  searchParams: Promise<{
    checkIn: string;
    checkOut: string;
    guests: string
  }>;
}

export default async function SearchResultsPage({ params, searchParams }: SearchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const hotelId = resolvedParams.hotelId;
  const checkIn = resolvedSearchParams.checkIn;
  const checkOut = resolvedSearchParams.checkOut;

  if (!checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center p-12 bg-[#0f110d] rounded-3xl shadow-2xl border border-white/10 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Dates Required</h2>
          <p className="text-slate-400 mb-8">Please select check-in and check-out dates to search for available rooms.</p>
          <Button asChild className="h-12 px-8 rounded-xl bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold">
            <Link href={`/hotel/${hotelId}`}>Select Dates</Link>
          </Button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const bookedRooms = await db.booking.findMany({
    where: {
      hotelId: hotelId,
      OR: [
        {
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate }
        }
      ],
      NOT: { status: "CANCELLED" }
    },
    select: { roomId: true }
  });

  const bookedRoomIds = bookedRooms.map(b => b.roomId);

  const availableRooms = await db.room.findMany({
    where: {
      hotelId: hotelId,
      id: { notIn: bookedRoomIds },
      status: "AVAILABLE"
    }
  });

  return (
    <div className="min-h-screen pb-20 bg-black">

      {/* Search Header */}
      <div className="bg-[#0f110d]/50 backdrop-blur-md border-b border-white/10 mb-12">

        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Available Rooms</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20">
                {availableRooms.length} rooms found
              </Badge>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#a1f554]/10 rounded-xl flex items-center justify-center border border-[#a1f554]/20">
                <MapPinned className="h-5 w-5 text-[#a1f554]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Stay Duration</p>
                <p className="text-sm font-semibold text-white">
                  {format(checkInDate, "dd MMM")} — {format(checkOutDate, "dd MMM")}
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <Link href={`/hotel/${hotelId}`}>
              <Button variant="ghost" className="h-12 rounded-xl text-sm font-semibold text-[#a1f554] hover:bg-[#a1f554]/10">
                Change Dates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {availableRooms.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-20 px-8 bg-[#0f110d] rounded-3xl shadow-2xl border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-4">No Rooms Available</h3>
            <p className="text-slate-400 mb-10 leading-relaxed">
              No rooms are available for the selected dates. Please try different dates or check back later.
            </p>
            <Button asChild className="h-12 px-10 rounded-xl bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold">
              <Link href={`/hotel/${hotelId}`}>Try Different Dates</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
              <div key={room.id} className="group bg-[#0f110d] border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#a1f554]/5 transition-all hover:-translate-y-1">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                  <Badge className="absolute top-4 right-4 z-20 bg-[#a1f554]/10 backdrop-blur-md border border-[#a1f554]/20 text-[#a1f554] px-3 py-1">
                    Available
                  </Badge>

                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white/60 text-xs mb-1">Room</p>
                    <p className="text-white font-bold text-lg">#{room.number}</p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Icons */}
                  <div className="flex gap-2 mb-4 -mt-10 relative z-30">
                    <div className="h-10 w-10 bg-[#a1f554]/10 rounded-xl border border-[#a1f554]/20 flex items-center justify-center">
                      <Wifi className="h-5 w-5 text-[#a1f554]" />
                    </div>
                    <div className="h-10 w-10 bg-[#8ba4b8]/10 rounded-xl border border-[#8ba4b8]/20 flex items-center justify-center">
                      <Tv className="h-5 w-5 text-[#8ba4b8]" />
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-1">{room.type}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <User className="h-3 w-3" />
                        <span>Max 2 Guests</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#a1f554]">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 text-xs text-slate-500">
                    <ShieldCheck className="h-3 w-3 text-[#a1f554]" />
                    <span>Verified Room</span>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">₹{room.price}</span>
                        <span className="text-slate-500 text-xs">/night</span>
                      </div>
                    </div>

                    <Link href={`/hotel/${hotelId}/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                      <Button className="h-12 px-6 rounded-xl bg-[#a1f554] hover:bg-[#8fd445] text-black font-semibold shadow-lg group">
                        Book <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}