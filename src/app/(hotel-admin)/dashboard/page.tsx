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
  CheckCircle2,
  XCircle,
  AlertCircle,
  Home,
  Hotel,
  Building,
  Users,
  ShieldCheck,
  Bell,
  Settings,
  PlusCircle,
  ChevronRight,
  Zap,
  Star
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role;

  if (role === "HOUSEKEEPING") redirect("/dashboard/housekeeping");
  if (role === "ADMIN") redirect("/admin");

  const hotelBasic = await getHotelByUserId(session.user.id as string);
  if (!hotelBasic) redirect("/onboarding");

  const hotelData = await db.hotel.findUnique({
    where: { id: hotelBasic.id },
    include: {
      rooms: { orderBy: { number: 'asc' } },
      bookings: {
        orderBy: { createdAt: 'desc' },
        include: { room: true },
        take: 50
      },
      user: true
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
    new Date(b.checkIn).toDateString() === new Date().toDateString()
    && b.status === 'CONFIRMED'
  );

  const recentBookings = bookings.slice(0, 5);
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">

      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Hotel className="h-64 w-64 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">Property Dashboard</Badge>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-[10px] font-bold ml-1 text-white/60">PREMIUM</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-outfit tracking-tight">
                Welcome back, <span className="text-blue-400 truncate">{hotelData.name}</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Everything is running smoothly. Your occupancy rate is <span className="text-white font-bold">{occupancyRate}%</span> today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="h-14 px-8 btn-premium rounded-2xl font-bold shadow-xl shadow-blue-500/20 group" asChild>
                <Link href="/dashboard/bookings/new">
                  <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                  New Reservation
                </Link>
              </Button>
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SYSTEMS ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          trend="+12.5%"
          color="emerald"
          isOwner={role === "OWNER"}
        />
        <StatCard
          title="Occupancy"
          value={`${occupancyRate}%`}
          icon={BarChart3}
          trend="Stable"
          color="blue"
          progress={occupancyRate}
        />
        <StatCard
          title="Today's Arrivals"
          value={todaysCheckIns.length}
          icon={ArrowDownLeft}
          description="Expected arrivals today"
          color="indigo"
        />
        <StatCard
          title="Need Cleaning"
          value={dirtyRooms}
          icon={Sparkles}
          description="Rooms pending housekeeping"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Recent Bookings Area */}
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black font-outfit text-slate-900">Recent Arrivals</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Monitoring the latest guests at your property</CardDescription>
                </div>
                <Button variant="outline" className="rounded-xl font-bold border-slate-200" asChild>
                  <Link href="/dashboard/bookings">View All <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="p-6 hover:bg-slate-50/80 transition-all group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-sm">
                            {booking.guestName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate text-lg">{booking.guestName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="bg-white text-slate-600 font-bold border-slate-100">Room {booking.room.number}</Badge>
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="font-black text-slate-900 text-lg">₹{booking.totalAmount.toLocaleString()}</p>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
                            booking.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              booking.status === 'PENDING' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                "bg-red-50 text-red-600 border border-red-100"
                          )}>
                            {booking.status === 'CONFIRMED' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-slate-200" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-400">No recent activity detected.</p>
                      <p className="text-sm text-slate-300">New bookings will appear here instantly.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Operations Quick Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-50 p-2.5 rounded-xl">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-black font-outfit text-slate-900">Room Strategy</h3>
              </div>
              <div className="space-y-6">
                <StatusLine label="Clean & Ready" count={availableRooms} total={totalRooms} color="bg-emerald-500" />
                <StatusLine label="Currently Occupied" count={occupiedRooms} total={totalRooms} color="bg-blue-500" />
                <StatusLine label="Turnover Needed" count={dirtyRooms} total={totalRooms} color="bg-amber-500" />
              </div>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2.5 rounded-xl">
                  <PieChart className="h-6 w-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-black font-outfit text-slate-900">Queue Manager</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Pending Bookings</span>
                  <span className="text-xl font-black text-amber-600">{pendingBookings}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">Tasks in Progress</span>
                  <span className="text-xl font-black text-indigo-600">0</span>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800" asChild>
                  <Link href="/dashboard/tasks">Manage Queue</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column / Quick Actions */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8">
            <h3 className="text-xl font-black font-outfit text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4">
              <ActionBtn href="/dashboard/bookings/new" icon={Calendar} label="New Booking" sub="Direct entry" color="blue" />
              <ActionBtn href="/dashboard/rooms" icon={BedDouble} label="Room Master" sub="Manage inventory" color="emerald" />
              <ActionBtn href="/dashboard/housekeeping?status=dirty" icon={Sparkles} label="Housekeeping" sub="Cleaning log" color="amber" />
              <ActionBtn href="/dashboard/guests" icon={Users} label="Guest Hub" sub="Member management" color="indigo" />
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-xl font-black font-outfit mb-2">Help Center</h3>
              <p className="text-slate-400 text-sm mb-6 font-medium">Need assistance managing your property? We're here 24/7.</p>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold h-12">
                Get Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, description, color, progress, isOwner = true }: any) {
  if (!isOwner && title === "Total Revenue") return null;

  return (
    <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
            color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              color === 'blue' ? 'bg-blue-50 text-blue-600' :
                color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  'bg-amber-50 text-amber-600'
          )}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <Badge className={cn(
              "rounded-full font-black text-[10px] px-2 py-0.5",
              trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
            )}>{trend}</Badge>
          )}
        </div>
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-black font-outfit text-slate-900">{value}</p>
          {description && <p className="text-xs text-slate-400 mt-2 font-medium">{description}</p>}
          {progress !== undefined && (
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatusLine({ label, count, total, color }: any) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
        <span className="text-slate-500">{label}</span>
        <span className="text-slate-900">{count}/{total}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ActionBtn({ href, icon: Icon, label, sub, color }: any) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all">
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
          color === 'blue' ? 'bg-blue-100 text-blue-600' :
            color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
              color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                'bg-amber-100 text-amber-600'
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900 truncate leading-tight">{label}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{sub}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}

function PieChart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}