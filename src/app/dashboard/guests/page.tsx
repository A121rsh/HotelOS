import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure you have Shadcn Avatar or remove if not
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function GuestsPage() {
  const session = await auth();
  
  // 1. Saari Bookings fetch karo
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
    include: { 
        hotel: { 
            include: { 
                bookings: {
                    orderBy: { createdAt: 'desc' }
                }
            } 
        } 
    }
  });

  const allBookings = user?.hotel?.bookings || [];

  // 2. Logic: Bookings ko "Unique Guests" me convert karna (By Mobile Number)
  // Ye thoda magic code hai jo repeat guests ko merge kar dega
  const uniqueGuestsMap = new Map();

  allBookings.forEach((booking) => {
    const mobile = booking.guestMobile;

    if (!uniqueGuestsMap.has(mobile)) {
        // Agar pehli baar dikha
        uniqueGuestsMap.set(mobile, {
            id: booking.id,
            name: booking.guestName,
            mobile: booking.guestMobile,
            email: booking.guestEmail,
            idType: booking.idType,
            visits: 1,
            totalSpent: booking.totalAmount,
            lastVisit: booking.checkIn,
            bookings: [booking] // History save kar rahe hain
        });
    } else {
        // Agar repeat guest hai (Same Mobile)
        const guest = uniqueGuestsMap.get(mobile);
        guest.visits += 1;
        guest.totalSpent += booking.totalAmount;
        // Check agar ye visit nayi hai to date update karo
        if (new Date(booking.checkIn) > new Date(guest.lastVisit)) {
            guest.lastVisit = booking.checkIn;
        }
        guest.bookings.push(booking);
    }
  });

  // Map ko Array me badal lo taaki map kar sakein
  const guests = Array.from(uniqueGuestsMap.values());

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Guest Database</h1>
            <p className="text-slate-500 mt-1">
                You have welcomed <span className="font-bold text-blue-600">{guests.length} unique guests</span> so far.
            </p>
        </div>
        
        {/* Search Bar (Visual Only for now) */}
        <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input placeholder="Search guests..." className="pl-9 bg-white" />
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guests.map((guest) => (
            <Card key={guest.mobile} className="hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border-2 border-white shadow-sm">
                        {guest.name.charAt(0)}
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900">{guest.name}</CardTitle>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                                {guest.idType}
                            </Badge>
                            {guest.visits > 1 && (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 text-[10px] px-1 py-0 h-5">
                                    Loyal Guest
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 mt-2">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {guest.mobile}
                        </div>
                        {guest.email && (
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="h-4 w-4 text-slate-400" />
                                {guest.email}
                            </div>
                        )}
                        
                        <div className="h-px bg-slate-100 my-3" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Visits</p>
                                <p className="text-lg font-bold text-slate-900">{guest.visits}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Spent</p>
                                <p className="text-lg font-bold text-green-600">₹{guest.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 text-center mt-2">
                            Last visit: {new Date(guest.lastVisit).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}

        {guests.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
                <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No guests found yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}