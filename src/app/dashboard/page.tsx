import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper"; // ✅ Helper use karenge
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  IndianRupee, 
  BedDouble, 
  CalendarCheck, 
  ArrowUpRight, 
  ArrowDownLeft,
  Sparkles,
  Plus,
  Clock,
  DoorOpen,
  TrendingUp,
  CreditCard,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // ✅ STEP 1: Pata karo ye user kaunse hotel se juda hai
  const hotelBasic = await getHotelByUserId(session.user.id as string);

  if (!hotelBasic) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-slate-800">No Hotel Found 🏨</h2>
        <p className="text-slate-500">You don't seem to be linked to any hotel.</p>
        <Link href="/register">
          <Button>Register New Hotel</Button>
        </Link>
      </div>
    );
  }

  // ✅ STEP 2: Us Hotel ID se saara data (Rooms, Bookings) mangwa lo
  const hotelData = await db.hotel.findUnique({
    where: { id: hotelBasic.id },
    include: {
      rooms: { orderBy: { number: 'asc' } },
      bookings: {
        orderBy: { createdAt: 'desc' },
        include: { room: true },
      }
    }
  });

  if (!hotelData) return <div>Loading...</div>;

  const { rooms, bookings } = hotelData;

  // --- CALCULATIONS (Logic wahi purana hai) ---
  
  const totalRooms = rooms.length;
  // Occupied logic
  const occupiedRooms = rooms.filter(r => r.status === 'BOOKED').length;
  const dirtyRooms = rooms.filter(r => r.status === 'DIRTY').length;
  
  // Occupancy Rate
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Revenue (Total Paid Amount)
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, booking) => acc + booking.paidAmount, 0);

  // Today's Activity
  const today = new Date().toISOString().split('T')[0];
  
  const todaysCheckIns = bookings.filter(b => 
    new Date(b.checkIn).toISOString().split('T')[0] === today && b.status === 'CONFIRMED'
  );
  
  const todaysCheckOuts = bookings.filter(b => 
    new Date(b.checkOut).toISOString().split('T')[0] === today && b.status === 'CHECKED_IN'
  );

  const recentBookings = bookings.slice(0, 5);


  // --- UI RENDER ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">
                Welcome back! Here's what's happening at <span className="font-semibold text-blue-600">{hotelData.name}</span> today.
            </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-sm font-medium text-slate-600">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Revenue</CardTitle>
                <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <IndianRupee className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-slate-400 mt-1">Lifetime earnings</p>
            </CardContent>
        </Card>

        {/* Occupancy */}
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Occupancy</CardTitle>
                <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <BedDouble className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{occupancyRate}%</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${occupancyRate}%` }}></div>
                </div>
            </CardContent>
        </Card>

        {/* Arrivals */}
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Arrivals</CardTitle>
                <div className="h-8 w-8 bg-violet-50 rounded-full flex items-center justify-center text-violet-600">
                    <ArrowDownLeft className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{todaysCheckIns.length}</div>
                <p className="text-xs text-slate-400 mt-1">Guests arriving today</p>
            </CardContent>
        </Card>

        {/* Dirty Rooms */}
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase">Cleaning</CardTitle>
                <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                    <Sparkles className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dirtyRooms}</div>
                <p className="text-xs text-slate-400 mt-1">Rooms to clean</p>
            </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500"/> Recent Bookings
                </CardTitle>
                <Link href="/dashboard/bookings" className="text-xs text-blue-600 hover:underline">View All</Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">No bookings yet.</div>
                    ) : (
                        recentBookings.map(b => (
                            <div key={b.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {b.guestName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{b.guestName}</p>
                                        <p className="text-xs text-slate-500">Room {b.room.number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">₹{b.totalAmount}</p>
                                    <Badge variant="outline" className="text-[10px]">{b.status}</Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
            <Card className="bg-slate-900 text-white shadow-xl border-slate-800 overflow-hidden relative">
                 <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 relative z-10 text-lg">⚡ Quick Actions</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-3 relative z-10">
                    <Link href="/dashboard/bookings/new" className="block">
                        <div className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all flex justify-between items-center cursor-pointer">
                            <span className="text-sm font-bold">New Booking</span>
                            <ArrowUpRight className="h-4 w-4 opacity-50"/>
                        </div>
                    </Link>
                    <Link href="/dashboard/rooms" className="block">
                        <div className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all flex justify-between items-center cursor-pointer">
                            <span className="text-sm font-bold">Manage Rooms</span>
                            <ArrowUpRight className="h-4 w-4 opacity-50"/>
                        </div>
                    </Link>
                 </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 text-sm">
                <p className="font-bold flex items-center gap-2 mb-1">💡 Pro Tip</p>
                <p className="opacity-80">Check-out guests before 11 AM to avoid extra charges logic.</p>
            </div>
        </div>

      </div>
    </div>
  );
}