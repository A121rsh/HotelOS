import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Search, Users, Star, TrendingUp, Calendar, ArrowRight, MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function GuestsPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const hotel = await getHotelByUserId(session.user.id as string);

    if (!hotel) {
        return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;
    }

    const allBookings = await db.booking.findMany({
        where: { hotelId: hotel.id },
        orderBy: { createdAt: 'desc' }
    });

    const uniqueGuestsMap = new Map();

    allBookings.forEach((booking) => {
        const mobile = booking.guestMobile;

        if (!uniqueGuestsMap.has(mobile)) {
            uniqueGuestsMap.set(mobile, {
                id: booking.id,
                name: booking.guestName,
                mobile: booking.guestMobile,
                email: booking.guestEmail,
                idType: booking.idType,
                visits: 1,
                totalSpent: booking.totalAmount,
                lastVisit: booking.checkIn,
                bookings: [booking]
            });
        } else {
            const guest = uniqueGuestsMap.get(mobile);
            guest.visits += 1;
            guest.totalSpent += booking.totalAmount;
            if (new Date(booking.checkIn) > new Date(guest.lastVisit)) {
                guest.lastVisit = booking.checkIn;
            }
            guest.bookings.push(booking);
        }
    });

    const guests = Array.from(uniqueGuestsMap.values()).sort((a: any, b: any) => b.visits - a.visits);

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* HEADER SECTION */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 tracking-tight leading-tight">Guest Relations Hub</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[10px]">{guests.length} Unique Guests</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Data Secured
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search guests by name or phone..."
                                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-all text-base font-medium shadow-inner shadow-slate-100"
                            />
                        </div>
                        <Button className="h-14 px-8 btn-premium rounded-2xl font-black group shadow-xl shadow-blue-500/20 uppercase tracking-widest">
                            Export CRM
                        </Button>
                    </div>
                </div>
            </div>

            {/* GUESTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {guests.map((guest: any) => (
                    <div
                        key={guest.mobile}
                        className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500"
                    >
                        {/* Top Badge Overlay */}
                        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                            {guest.visits > 2 && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg shadow-sm">
                                    Elite Member
                                </Badge>
                            )}
                            <Badge variant="outline" className="h-5 px-1.5 font-black text-[8px] border-slate-100 text-slate-400 uppercase tracking-widest bg-white">
                                {guest.idType}
                            </Badge>
                        </div>

                        {/* Profile Section */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="h-24 w-24 rounded-[2rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-slate-900 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                {guest.name.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black font-outfit text-slate-900 truncate w-full px-2">{guest.name}</h3>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                                <Star className={cn("h-3 w-3", guest.visits > 1 ? "text-amber-400 fill-current" : "text-slate-200")} />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Property Guest</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-50 mb-8" />

                        {/* Engagement Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stays</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-slate-900">{guest.visits}</span>
                                    {guest.visits > 1 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                                </div>
                            </div>
                            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total LTV</p>
                                <span className="text-xl font-black text-emerald-600">₹{guest.totalSpent.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-50 group-hover:border-blue-50 transition-colors">
                                <Phone className="h-4 w-4 text-slate-300" />
                                <span className="text-xs font-bold text-slate-600">{guest.mobile}</span>
                            </div>
                            {guest.email ? (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-50 group-hover:border-blue-50 transition-colors">
                                    <Mail className="h-4 w-4 text-slate-300" />
                                    <span className="text-xs font-bold text-slate-600 truncate">{guest.email}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 italic opacity-50">
                                    <Mail className="h-4 w-4 text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400">Email not collected</span>
                                </div>
                            )}
                        </div>

                        {/* Final Footer Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 capitalize">
                                    Seen {new Date(guest.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 group/btn">
                                Details <ChevronRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {guests.length === 0 && (
                    <div className="col-span-full text-center py-40 border-4 border-dashed border-slate-100 rounded-[3rem] bg-white shadow-inner">
                        <div className="h-24 w-24 bg-slate-50 rounded-full shadow-xl flex items-center justify-center mx-auto mb-8 border-8 border-white">
                            <Users className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900 mb-2">Guestbook Empty</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                            You haven't recorded any guest data yet. New entries will appear automatically after check-ins.
                        </p>
                    </div>
                )}
            </div>

            {/* CRM Retention Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                    <Star className="h-48 w-48 fill-current" />
                </div>
                <div className="space-y-4 max-w-xl">
                    <h2 className="text-3xl font-black font-outfit leading-tight">Mastering Guest Retention</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Analyze guest spending patterns and visit frequencies to identify your most valuable customers. Reward loyalty with personalized offers to drive repeat business.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0">
                    <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 text-center">
                        <p className="text-4xl font-black font-outfit text-blue-400 mb-1">
                            {guests.filter(g => g.visits > 1).length}
                        </p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Repeat Guests</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 text-center">
                        <p className="text-4xl font-black font-outfit text-emerald-400 mb-1">
                            ₹{guests.reduce((acc, g) => acc + g.totalSpent, 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</p>
                    </div>
                </div>
            </div>
        </div>
    );
}