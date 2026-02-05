import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  IndianRupee, 
  BedDouble, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  ArrowDownLeft,
  Calendar,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Building,
  Users,
  ShieldCheck,
  Bell,
  Settings,
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role; 

  // 🛑 RULE 1: Housekeeping ko seedha unke page par bhejo
  if (role === "HOUSEKEEPING") {
    redirect("/dashboard/housekeeping");
  }

  const hotelBasic = await getHotelByUserId(session.user.id as string);

  if (!hotelBasic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Hotel Found
            </h3>
            <p className="text-slate-600 mb-4">
              Please contact the system administrator to set up your hotel.
            </p>
            <Button variant="outline" asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  // --- CALCULATIONS ---
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'BOOKED').length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
  const dirtyRooms = rooms.filter(r => r.status === 'DIRTY').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  const totalRevenue = bookings
    .filter(b => b.status !== 'CANCELLED')
    .reduce((acc, booking) => acc + booking.paidAmount, 0);

  const todaysCheckIns = bookings.filter(b => 
    new Date(b.checkIn).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] 
    && b.status === 'CONFIRMED'
  );

  const todaysCheckOuts = bookings.filter(b => 
    new Date(b.checkOut).toISOString().split('T')[0] === new Date().toISOString().split('T')[0] 
    && b.status === 'CONFIRMED'
  );

  const recentBookings = bookings.slice(0, 5);
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {hotelData.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  {role.replace("_", " ")}
                </Badge>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Hotel
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue Card (Owner only) */}
        {role === "OWNER" && (
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Total Revenue
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">
                  +12% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Occupancy Card (Owner only) */}
        {role === "OWNER" && (
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Occupancy Rate
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {occupancyRate}%
              </div>
              <div className="mt-3 space-y-2">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{occupiedRooms} occupied</span>
                  <span>{availableRooms} available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Arrivals Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Today's Arrivals
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {todaysCheckIns.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {todaysCheckIns.slice(0, 3).map((booking, index) => (
                  <div key={index} className="h-6 w-6 rounded-full bg-violet-100 border-2 border-white text-violet-700 flex items-center justify-center text-xs font-bold">
                    {booking.guestName.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                guests checking in
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cleaning Card */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-500">
                Rooms to Clean
              </CardTitle>
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dirtyRooms}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-slate-500">
                  {totalRooms} total rooms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Bookings & Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Bookings Card */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">
                      Recent Bookings
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Latest hotel reservations and check-ins
                    </CardDescription>
                  </div>
                </div>
                {role === "OWNER" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-700">
                      View All
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No bookings yet</p>
                  <Button variant="outline" className="mt-3" asChild>
                    <Link href="/dashboard/bookings/new">Create First Booking</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {booking.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {booking.guestName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                                Room {booking.room.number}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {role === "OWNER" && (
                            <p className="font-bold text-slate-900">
                              ₹{booking.totalAmount.toLocaleString('en-IN')}
                            </p>
                          )}
                          <div className="mt-1">
                            {booking.status === 'CONFIRMED' ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirmed
                              </span>
                            ) : booking.status === 'PENDING' ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancelled
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Status Summary */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-blue-600" />
                Room Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="text-2xl font-bold text-blue-600">{occupiedRooms}</div>
                  <p className="text-sm text-slate-600 mt-1">Occupied</p>
                </div>
                <div className="text-center p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="text-2xl font-bold text-emerald-600">{availableRooms}</div>
                  <p className="text-sm text-slate-600 mt-1">Available</p>
                </div>
                <div className="text-center p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="text-2xl font-bold text-orange-600">{dirtyRooms}</div>
                  <p className="text-sm text-slate-600 mt-1">Needs Cleaning</p>
                </div>
                <div className="text-center p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="text-2xl font-bold text-slate-600">{totalRooms}</div>
                  <p className="text-sm text-slate-600 mt-1">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Frequently used operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* New Booking */}
              <Button className="w-full justify-start h-12 bg-white hover:bg-blue-50 border border-slate-200" asChild>
                <Link href="/dashboard/bookings/new">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">New Booking</p>
                      <p className="text-xs text-slate-500">Create reservation</p>
                    </div>
                  </div>
                </Link>
              </Button>

              {/* Manage Rooms (Owner only) */}
              {role === "OWNER" && (
                <Button className="w-full justify-start h-12 bg-white hover:bg-emerald-50 border border-slate-200" asChild>
                  <Link href="/dashboard/rooms">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <BedDouble className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-900">Manage Rooms</p>
                        <p className="text-xs text-slate-500">Add/Edit rooms</p>
                      </div>
                    </div>
                  </Link>
                </Button>
              )}

              {/* Housekeeping */}
              <Button className="w-full justify-start h-12 bg-white hover:bg-orange-50 border border-slate-200" asChild>
                <Link href="/dashboard/housekeeping">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">Housekeeping</p>
                      <p className="text-xs text-slate-500">Manage cleaning</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Hotel Info Card */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Hotel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {hotelData.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{hotelData.name}</p>
                  <p className="text-sm text-slate-500">Since {new Date(hotelData.createdAt).getFullYear()}</p>
                </div>
              </div>
              
              <div className="h-px bg-slate-200"></div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Contact</span>
                  <span className="font-medium text-slate-900">{hotelData.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Owner</span>
                  <span className="font-medium text-slate-900">{hotelData.ownerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-700">Confirmed</span>
                  </div>
                  <span className="font-bold text-slate-900">{confirmedBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm text-slate-700">Pending</span>
                  </div>
                  <span className="font-bold text-slate-900">{pendingBookings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}