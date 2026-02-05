import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Wifi, User, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    return <div className="p-10 text-center">Please select dates first.</div>;
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header Summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Available Rooms</h1>
        <p className="text-slate-500 mt-2">
          Showing results for <span className="font-bold text-slate-900">{format(checkInDate, "dd MMM")}</span> to <span className="font-bold text-slate-900">{format(checkOutDate, "dd MMM")}</span>
        </p>
      </div>

      {/* Rooms Grid */}
      {availableRooms.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <h3 className="text-xl font-bold text-slate-600">No Rooms Available 😔</h3>
            <p className="text-slate-400">Please try changing your dates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableRooms.map((room) => (
                <div key={room.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col">
                    {/* Placeholder Image */}
                    <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
                        Room Image
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900">{room.type} Room</h3>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                                Available
                            </span>
                        </div>
                        
                        <div className="text-slate-500 text-sm mb-4 space-y-1">
                            <div className="flex items-center gap-2"><User className="h-4 w-4"/> Max 2 Guests</div>
                            <div className="flex items-center gap-2"><Wifi className="h-4 w-4"/> Free Wifi</div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-slate-900">₹{room.price}</span>
                                <span className="text-xs text-slate-400">/night</span>
                            </div>
                            
                            {/* BOOK NOW BUTTON */}
                            <Link href={`/hotel/${hotelId}/book?roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`}>
                                <Button className="bg-slate-900 hover:bg-slate-800">
                                    Book <ArrowRight className="ml-1 h-4 w-4"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}