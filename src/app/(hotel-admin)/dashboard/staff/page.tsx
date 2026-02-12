import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Trash2, User, Sparkles, Users, UserCheck, ShieldCheck, Search, Filter, MoreVertical, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddStaffModal from "@/components/AddStaffModal";
import EditStaffModal from "@/components/EditStaffModal";
import { deleteStaff } from "@/actions/staff";
import { cn } from "@/lib/utils";

export default async function StaffPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const user = await db.user.findUnique({
        where: { email: session.user.email as string },
        include: { ownedHotel: true }
    });

    const hotel = user?.ownedHotel;

    if (!hotel) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center animate-in fade-in duration-700">
                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center shadow-inner border-8 border-white">
                    <Shield className="h-10 w-10 text-slate-300" />
                </div>
                <div>
                    <h2 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">Access Restricted</h2>
                    <p className="text-slate-400 font-medium max-w-sm mt-2">Only Property Owners can govern staff access and organizational roles.</p>
                </div>
                <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-slate-200">
                    Return to Command Center
                </Button>
            </div>
        );
    }

    const staffList = await db.user.findMany({
        where: { workingAtId: hotel.id },
        orderBy: { createdAt: 'desc' }
    });

    const totalStaffCount = staffList.length + 1; // Including Owner

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. EXECUTIVE HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Human Resources</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[10px]">{totalStaffCount} Personnel Active</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3 w-3" /> Access Control Protocol
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                placeholder="Search personnel..."
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-base font-medium shadow-inner shadow-slate-100 font-inter"
                            />
                        </div>
                        <AddStaffModal />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                {/* 1. ROOT ADMINISTRATOR CARD (Owner) */}
                <div className="group relative bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
                        <Crown className="h-40 w-40 fill-current" />
                    </div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="h-20 w-20 rounded-[1.8rem] bg-white text-slate-900 flex items-center justify-center text-3xl font-black shadow-xl">
                            {session.user.name?.charAt(0)}
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg backdrop-blur-md">
                            Primary System Admin
                        </Badge>
                    </div>

                    <div className="space-y-1 relative z-10">
                        <h3 className="text-2xl font-black font-outfit tracking-tight leading-none mb-1">{session.user.name}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-8">
                            <Mail className="h-3 w-3" /> {session.user.email}
                        </p>
                    </div>

                    <div className="h-px bg-white/5 mb-8" />

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                                <span className="text-[10px] font-black uppercase text-emerald-400">Full Access</span>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Root Authority</span>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* 2. OPERATIONAL STAFF CARDS */}
                {staffList.map((staff) => (
                    <div
                        key={staff.id}
                        className={cn(
                            "group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500",
                            staff.role === 'FRONT_DESK' ? "hover:border-blue-200" : "hover:border-emerald-200"
                        )}
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className={cn(
                                "h-20 w-20 rounded-[1.8rem] flex items-center justify-center text-3xl font-black transition-all duration-500 group-hover:scale-110",
                                staff.role === 'FRONT_DESK' ? "bg-blue-50 text-blue-600 shadow-blue-500/5" : "bg-emerald-50 text-emerald-600 shadow-emerald-500/5"
                            )}>
                                {staff.name?.charAt(0)}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className={cn(
                                    "font-black text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border-none",
                                    staff.role === 'FRONT_DESK' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {staff.role.replace('_', ' ')}
                                </Badge>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Member since {new Date(staff.createdAt).getFullYear()}</span>
                            </div>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-2xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-1">{staff.name}</h3>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-2 truncate">
                                <Mail className="h-3 w-3" /> {staff.email}
                            </p>
                        </div>

                        <div className="h-px bg-slate-50 mb-8" />

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/50 rounded-xl border border-slate-50 group-hover:bg-white transition-colors">
                                    <UserCheck className="h-3 w-3 text-slate-400" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Access Active</span>
                                </div>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1 mt-1">
                                    {staff.permissions?.length || 0} Nodes Delegated
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <EditStaffModal staff={staff} />
                                <form action={async () => {
                                    "use server";
                                    await deleteStaff(staff.id);
                                }}>
                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl text-red-100 hover:text-red-600 hover:bg-red-50 transition-all">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Visual Context Bar */}
                        <div className={cn(
                            "absolute bottom-0 left-10 right-10 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full uppercase text-[8px] font-black text-center flex items-center justify-center",
                            staff.role === 'FRONT_DESK' ? "bg-blue-600" : "bg-emerald-600"
                        )} />
                    </div>
                ))}

                {/* EMPTY STATE */}
                {staffList.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white/50 border-4 border-dashed border-slate-100 rounded-[3rem] animate-pulse">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                            <Users className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black font-outfit text-slate-900 mb-2">Team Not Assembled</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">Your organizational team is currently empty. Add key personnel to begin operational delegation.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-4 max-w-2xl">
                    <h2 className="text-2xl font-black font-outfit text-slate-900 leading-tight">Operational Security Information</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Managing personnel access ensures property data integrity. Delegating roles like **Front Desk** and **Housekeeping** allows staff to focus on specific operational sectors while protecting executive-level data.
                    </p>
                </div>
                <div className="flex gap-4 shrink-0">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-lg shadow-slate-200/50 min-w-[160px]">
                        <p className="text-3xl font-black font-outfit text-blue-600 mb-1">
                            {staffList.filter(s => s.role === 'FRONT_DESK').length}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Receptionists</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-lg shadow-slate-200/50 min-w-[160px]">
                        <p className="text-3xl font-black font-outfit text-emerald-600 mb-1">
                            {staffList.filter(s => s.role === 'HOUSEKEEPING').length}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Housekeepers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Minimalist CheckCircle for local use since I didn't import it at top (wait, I did, but let's be safe)
function CheckCircle2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
    )
}