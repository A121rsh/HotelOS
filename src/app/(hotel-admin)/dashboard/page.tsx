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
  Star,
  Activity,
  LogOut,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NotificationBell } from "@/components/dashboard/Notifications";
import type { NotificationItem } from "@/components/dashboard/Notifications";


export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role;

  if (role === "HOUSEKEEPING") redirect("/dashboard/housekeeping");
  if (role === "ADMIN") redirect("/admin");

  const hotelBasic = await getHotelByUserId(session.user.id as string);
  if (!hotelBasic) redirect("/register");

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

  // --- NOTIFICATIONS GENERATION ---
  const notifications: NotificationItem[] = bookings.slice(0, 10).map(booking => {
    let type: "BOOKING_PENDING" | "CHECK_IN" | "CHECK_OUT" | "SYSTEM" = "SYSTEM";
    let title = "System Update";
    let message = `Booking update for ${booking.guestName}`;

    if (booking.status === "PENDING") {
      type = "BOOKING_PENDING";
      title = "New Booking Request";
      message = `${booking.guestName} requested Room ${booking.room.number}`;
    } else if (booking.status === "CONFIRMED") {
      type = "CHECK_IN";
      title = "Booking Confirmed";
      message = `${booking.guestName} confirmed for Room ${booking.room.number}`;
    } else if (booking.status === "CHECKED_OUT") { // Assuming this status exists or maps to it
      type = "CHECK_OUT";
      title = "Guest Checked Out";
      message = `${booking.guestName} checked out of Room ${booking.room.number}`;
    }

    return {
      id: booking.id,
      type: type as any,
      title,
      message,
      timestamp: new Date(booking.updatedAt || booking.createdAt),
      // FORCE UNREAD for demonstration/testing so badge appears for recent items
      read: false,
      link: `/dashboard/bookings/${booking.id}`
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="max-w-[1800px] mx-auto space-y-6 pb-10 p-6 bg-[#0a0a0a] min-h-screen text-white font-inter">

      {/* 1. TOP HEADER - Context Aware */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse shadow-[0_0_10px_#a1f554]" />
            <span className="text-[9px] font-black tracking-[0.2em] text-[#a1f554] uppercase">System Operational</span>
          </div>
          <h1 className="text-3xl font-black font-outfit text-white tracking-tight uppercase italic-none">
            {getGreeting()}, <span className="text-[#a1f554]">{session.user.name?.split(" ")[0]}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HotelOS Command Center</span>
          </div>

          {/* Notifications */}
          <NotificationBell notifications={notifications} />

          <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button className="rounded-full h-10 w-10 p-0 bg-[#a1f554] hover:bg-[#a2db3f] text-black shadow-[0_0_20px_rgba(161,245,84,0.3)] hover:shadow-[0_0_30px_rgba(161,245,84,0.5)] transition-all">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* 2. BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(160px,auto)] animate-in fade-in zoom-in duration-500 fill-mode-backwards">

        {/* A. REVENUE CARD (Wide) */}
        <div className="col-span-1 md:col-span-2 row-span-1 relative group overflow-hidden rounded-[2rem] bg-[#111] border border-white/5 shadow-2xl">
          {/* Background Ambient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#a1f554]/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 ease-out">
            <IndianRupee className="h-40 w-40 text-white" />
          </div>

          <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#a1f554]/10 flex items-center justify-center text-[#a1f554] border border-[#a1f554]/20 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(161,245,84,0.1)]">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#a1f554] uppercase tracking-widest block mb-1">Total Revenue</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#a1f554]/10 text-[#a1f554] border-none px-2 py-0.5 rounded-md font-bold">+12.4%</Badge>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">vs last cycle</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-5xl font-black font-outfit text-white tracking-tighter group-hover:translate-x-1 transition-transform">
                ₹{totalRevenue.toLocaleString()}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3">Gross income • Confirmed Bookings</p>
            </div>
          </div>
        </div>

        {/* B. LIVE OCCUPANCY (Standard - Vertical) */}
        <div className="col-span-1 row-span-2 relative group overflow-hidden rounded-[2rem] bg-[#0c0c0c] border border-white/5 shadow-2xl p-8 flex flex-col items-center justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#a1f55405,transparent_70%)]" />

          <div className="relative z-10 w-full flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Occupancy Load</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse shadow-[0_0_10px_#a1f554]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-6 my-auto scale-110">
            <div className="relative h-48 w-48 group-hover:scale-105 transition-transform duration-500">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#222" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="#a1f554" strokeWidth="6"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * occupancyRate / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1500 ease-out drop-shadow-[0_0_15px_rgba(161,245,84,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-5xl font-black font-outfit tracking-tighter text-white">{occupancyRate}%</span>
                <span className="text-[9px] text-[#a1f554] uppercase tracking-[0.3em] font-black mt-2">Live</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full bg-[#151515] rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Capacity</span>
              <span className="text-xs font-black text-white">{availableRooms} Rooms</span>
            </div>
            <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
              <div className="h-full bg-[#a1f554] rounded-full shadow-[0_0_10px_#a1f554]" style={{ width: `${(availableRooms / totalRooms) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* C. QUICK ACTIONS (Grid) */}
        <div className="col-span-1 row-span-1 grid grid-cols-2 gap-3 h-full">
          <Link href="/dashboard/bookings/new" className="relative group overflow-hidden rounded-[2rem] bg-[#111] border border-white/5 hover:border-[#a1f554]/30 transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(161,245,84,0.05)]">
            <div className="h-12 w-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#a1f554] transition-colors duration-300">
              <Calendar className="h-5 w-5 text-slate-400 group-hover:text-black transition-colors" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">New Booking</span>
          </Link>
          <Link href="/dashboard/guests" className="relative group overflow-hidden rounded-[2rem] bg-[#111] border border-white/5 hover:border-[#a1f554]/30 transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:shadow-[0_0_30px_rgba(161,245,84,0.05)]">
            <div className="h-12 w-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#a1f554] transition-colors duration-300">
              <Users className="h-5 w-5 text-slate-400 group-hover:text-black transition-colors" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Guest Data</span>
          </Link>
        </div>

        {/* D. MOVEMENT CONTROL (Arrivals) */}
        <div className="col-span-1 row-span-1 rounded-[2rem] bg-[#111] border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[#a1f554]/20 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-24 w-24 text-white" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between">
              <div className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-white/5 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 text-[#a1f554]">
                <div className="h-1 w-1 rounded-full bg-[#a1f554] animate-pulse" />
                Today's Arrivals
              </div>
            </div>

            <div className="flex items-baseline gap-1 mt-auto">
              <h3 className="text-6xl font-black font-outfit tracking-tighter text-white leading-none">{todaysCheckIns.length}</h3>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Pax</span>
            </div>
          </div>
        </div>

        {/* E. HOUSEKEEPING (Clean Card) */}
        <div className="col-span-1 row-span-1 rounded-[2rem] bg-[#111] border border-white/5 p-6 flex flex-col justify-between relative group hover:border-red-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between relative z-10">
            <div className="h-10 w-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-slate-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <Badge variant="outline" className={cn("border-none bg-[#1a1a1a]", dirtyRooms > 0 ? "text-red-500 animate-pulse" : "text-[#a1f554]")}>
              {dirtyRooms > 0 ? "ATTENTION REQUIRED" : "ALL SYSTEMS GREEN"}
            </Badge>
          </div>
          <div className="relative z-10">
            <div className="flex items-end gap-2 mb-2">
              <h3 className="text-3xl font-black text-white">{dirtyRooms}</h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dirty Units</span>
            </div>
            <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${(dirtyRooms / totalRooms) * 100}%` }} />
            </div>
          </div>
          <Link href="/dashboard/housekeeping" className="absolute inset-0 z-20" />
        </div>

        {/* F. LIVE FEED (Timeline) */}
        <div className="col-span-1 md:col-span-2 row-span-2 rounded-[2rem] bg-[#111] border border-white/5 p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black font-outfit text-white uppercase tracking-tight">Live Feed</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Node Updates</p>
            </div>
            <Link href="/dashboard/bookings" className="px-4 py-2 rounded-xl bg-[#1a1a1a] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-[#222] transition-all">View Log</Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide relative z-10">
            <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-[#222]" />

            <div className="space-y-6">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, i) => (
                  <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`} className="flex gap-6 group hover:opacity-80 transition-opacity">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-4 border-[#111] shrink-0 z-10 transition-transform group-hover:scale-110",
                      booking.status === 'CONFIRMED' ? "bg-[#a1f554] text-black" :
                        booking.status === 'PENDING' ? "bg-amber-400 text-black" :
                          "bg-red-500 text-white"
                    )}>
                      {booking.status === 'CONFIRMED' ? <CheckCircle2 className="h-4 w-4" /> :
                        booking.status === 'PENDING' ? <Clock className="h-4 w-4" /> :
                          <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-[#151515] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-white">
                          {booking.guestName}
                        </p>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          {new Date(booking.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 font-medium">
                        {booking.status === 'CONFIRMED' ? "Authenticated at " :
                          booking.status === 'PENDING' ? "Requesting Access for " : "Terminated Access for "}
                        <span className="text-[#a1f554]">Unit {booking.room.number}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest",
                          booking.status === 'CONFIRMED' ? "bg-[#a1f554]/10 text-[#a1f554]" :
                            booking.status === 'PENDING' ? "bg-amber-400/10 text-amber-400" :
                              "bg-red-500/10 text-red-500"
                        )}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                  <Activity className="h-12 w-12 mb-4 text-[#333]" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No recent signal</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* G. PENDING ACTIONS */}
        <div className="col-span-1 md:col-span-2 row-span-1 rounded-[2rem] bg-[#111] border border-white/5 p-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#a1f554]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#a1f554]/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center border border-white/10 text-[#a1f554]">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white leading-tight font-outfit">{pendingBookings} Pending</h3>
              <p className="text-xs font-bold text-[#a1f554] uppercase tracking-widest opacity-80">Awaiting Authorization</p>
            </div>
          </div>
          <Button size="lg" className="relative z-10 bg-[#a1f554] hover:bg-[#a2db3f] text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(161,245,84,0.2)] transition-all hover:scale-105" asChild>
            <Link href="/dashboard/tasks">
              Execute Tasks <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}