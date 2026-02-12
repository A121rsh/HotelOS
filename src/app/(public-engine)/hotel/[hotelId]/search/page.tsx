import { db } from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Wifi, User, ArrowRight, Star, ShieldCheck, MapPinned, Zap, Coffee, Tv } from "lucide-react";
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
  // 1. Data receive karo
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const hotelId = resolvedParams.hotelId;
  const checkIn = resolvedSearchParams.checkIn;
  const checkOut = resolvedSearchParams.checkOut;

  if (!checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-w-md">
          <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 mb-4 tracking-tight">Timeline Selection Required</h2>
          <p className="text-slate-500 font-medium mb-8">Operational parameters require a check-in and check-out window to proceed with room allocation.</p>
          <Button asChild className="rounded-2xl h-14 px-8 bg-slate-900 hover:bg-black font-bold">
            <Link href={`/hotel/${hotelId}`}>Select Dates</Link>
          </Button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // 2. Wo rooms dhoondo jo BOOKED hain (Unhe hatana padega)
  // Logic: Koi bhi booking jo hamari dates ke beech mein aa rahi ho
  const bookedRooms = await db.booking.findMany({
    where: {
      hotelId: hotelId,
      OR: [
        {
          // Existing booking starts BEFORE our checkout AND ends AFTER our checkin
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate }
        }
      ],
      NOT: { status: "CANCELLED" }
    },
    select: { roomId: true }
  });

  const bookedRoomIds = bookedRooms.map(b => b.roomId);

  // 3. AVAILABLE Rooms dhoondo (Jo booked list mein nahi hain)
  const availableRooms = await db.room.findMany({
    where: {
      hotelId: hotelId,
      id: { notIn: bookedRoomIds }, // ✅ Magic Line: Jo booked nahi hain
      status: "AVAILABLE" // Sirf wo jo saaf hain aur ready hain
    }
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* Search Header Summary */}
      <div className="bg-white border-b border-slate-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 h-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-2">Available Accommodations</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500 font-bold px-3">
                {availableRooms.length} Options Found
              </Badge>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Node: {hotelId.split('-')[0]}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                <MapPinned className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Stay Duration</p>
                <p className="text-sm font-black font-outfit text-slate-900">
                  {format(checkInDate, "dd MMM")} — {format(checkOutDate, "dd MMM")}
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <Link href={`/hotel/${hotelId}`}>
              <Button variant="ghost" className="h-12 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50">
                Adjust Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Rooms Grid */}
        {availableRooms.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-20 px-8 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <div className="h-24 w-24 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Zap className="h-10 w-10 opacity-30" />
            </div>
            <h3 className="text-3xl font-black font-outfit text-slate-900 mb-4">No Inventory Available</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
              Current date parameters report 0 available nodes for this property.
              Please adjust your checkout window or check back later.
            </p>
            <Button asChild className="rounded-2xl h-14 px-10 bg-slate-900 hover:bg-black font-black uppercase tracking-widest text-xs">
              <Link href={`/hotel/${hotelId}`}>Restart Protocol</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableRooms.map((room) => (
              <div key={room.id} className="group relative bg-white border border-slate-100 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                {/* Image Placeholder with Gradient */}
                <div className="h-64 bg-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />

                  <Badge className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md border-white/20 text-white font-black px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em]">
                    PREMIUM UNIT
                  </Badge>

                  <div className="absolute bottom-6 left-6 z-20">
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Inventory ID</p>
                    <p className="text-white font-black font-outfit text-lg tracking-tight">#{room.number}</p>
                  </div>
                </div>

                <div className="p-8 pt-10 relative">
                  {/* Feature Icons Floating */}
                  <div className="absolute -top-10 right-8 flex gap-2">
                    <div className="h-10 w-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border border-slate-50">
                      <Wifi className="h-5 w-5" />
                    </div>
                    <div className="h-10 w-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border border-slate-50">
                      <Coffee className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black font-outfit text-2xl text-slate-900 tracking-tight leading-none mb-2">{room.type} Suite</h3>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <User className="h-3 w-3" /> Max Capacity: 2 Guests
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-black">4.9</span>
                      </div>
                      <span className="text-slate-400 text-[10px] font-bold">128 REVIEWS</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-xs bg-slate-50 px-3 py-2 rounded-xl">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Secure Node
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-xs bg-slate-50 px-3 py-2 rounded-xl">
                      <Tv className="h-3.5 w-3.5 text-blue-500" /> Entertainment System
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nightly Rate</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black font-outfit text-slate-900">₹{room.price}</span>
                        <span className="text-slate-400 font-bold text-xs">/night</span>
                      </div>
                    </div>

                    <Link href={`/hotel/${hotelId}/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                      <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-black font-black shadow-xl shadow-slate-900/20 group uppercase tracking-widest text-[10px]">
                        Secure Key <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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