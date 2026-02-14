import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Trash2, User, Users, UserCheck, ShieldCheck, Search, Crown, CheckCircle2 } from "lucide-react";
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
                <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                    <Shield className="h-10 w-10 text-slate-500" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Access Restricted</h2>
                    <p className="text-slate-400 max-w-sm mt-2">Only property owners can manage staff access and roles.</p>
                </div>
                <Button className="h-12 px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold">
                    Return to Dashboard
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
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6 font-inter min-h-screen">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Users className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Staff Management</h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">
                                <div className="flex items-center gap-2 bg-[#a1f554]/10 px-3 py-1 rounded-full border border-[#a1f554]/20">
                                    <div className="h-2 w-2 rounded-full bg-[#a1f554] animate-pulse" />
                                    <span className="text-[#a1f554] font-semibold text-xs">{totalStaffCount} Active</span>
                                </div>
                                <span className="text-slate-400 text-xs">Team Members</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-[320px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#a1f554] transition-colors" />
                            <input
                                placeholder="Search staff..."
                                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 placeholder:text-slate-500 focus:border-[#a1f554]/50 focus:ring-1 focus:ring-[#a1f554]/30 transition-all text-white focus:outline-none"
                            />
                        </div>
                        <AddStaffModal />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">

                {/* Owner Card */}
                <div className="group relative bg-gradient-to-br from-[#0f110d] to-black rounded-2xl p-6 shadow-2xl text-white overflow-hidden border border-[#a1f554]/20">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                        <Crown className="h-32 w-32 fill-current" />
                    </div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="h-16 w-16 rounded-xl bg-[#a1f554] text-black flex items-center justify-center text-2xl font-bold shadow-xl">
                            {session.user.name?.charAt(0)}
                        </div>
                        <Badge className="bg-[#a1f554]/20 text-[#a1f554] border-[#a1f554]/30 font-semibold text-xs px-3 py-1">
                            Owner
                        </Badge>
                    </div>

                    <div className="space-y-1 relative z-10 mb-6">
                        <h3 className="text-xl font-bold leading-none mb-2">{session.user.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3" /> {session.user.email}
                        </p>
                    </div>

                    <div className="h-px bg-white/10 mb-6" />

                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Status</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554]" />
                                <span className="text-[#a1f554] font-semibold">Active</span>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#8ba4b8]" />
                                <span className="text-xs font-medium">Full Access</span>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-[#a1f554]" />
                        </div>
                    </div>
                </div>

                {/* Staff Cards */}
                {staffList.map((staff) => (
                    <div
                        key={staff.id}
                        className={cn(
                            "group relative bg-[#0f110d] border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300",
                            staff.role === 'FRONT_DESK' ? "border-[#8ba4b8]/20 hover:border-[#8ba4b8]/40" : "border-purple-500/20 hover:border-purple-500/40"
                        )}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-transform duration-300 group-hover:scale-105",
                                staff.role === 'FRONT_DESK' ? "bg-[#8ba4b8]/10 text-[#8ba4b8]" : "bg-purple-500/10 text-purple-400"
                            )}>
                                {staff.name?.charAt(0)}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge className={cn(
                                    "font-semibold text-xs px-2 py-0.5",
                                    staff.role === 'FRONT_DESK' 
                                        ? "bg-[#8ba4b8]/10 text-[#8ba4b8] border-[#8ba4b8]/20" 
                                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                )}>
                                    {staff.role.replace('_', ' ')}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                    Since {new Date(staff.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-lg font-bold text-white leading-none mb-2">{staff.name}</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
                                <Mail className="h-3 w-3" /> {staff.email}
                            </p>
                        </div>

                        <div className="h-px bg-white/10 mb-6" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                                <UserCheck className="h-3 w-3 text-[#a1f554]" />
                                <span className="text-xs font-medium text-slate-300">Active</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <EditStaffModal staff={staff} />
                                <form action={async () => {
                                    "use server";
                                    await deleteStaff(staff.id);
                                }}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-9 w-9 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Accent Line */}
                        <div className={cn(
                            "absolute bottom-0 left-6 right-6 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full",
                            staff.role === 'FRONT_DESK' ? "bg-[#8ba4b8]" : "bg-purple-500"
                        )} />
                    </div>
                ))}

                {/* Empty State */}
                {staffList.length === 0 && (
                    <div className="col-span-full py-20 md:py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <div className="h-16 w-16 md:h-20 md:w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a1f554]/20">
                            <Users className="h-8 w-8 md:h-10 md:w-10 text-[#a1f554]" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Staff Members</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 px-4">
                            Add team members to delegate tasks and manage your property efficiently.
                        </p>
                        <AddStaffModal />
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="bg-gradient-to-br from-[#0f110d]/60 to-black/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-white">Team Overview</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Manage your team members and their access levels. Assign roles to control what each staff member can see and do.
                    </p>
                </div>
                <div className="flex gap-4 shrink-0 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 text-center min-w-[140px]">
                        <p className="text-2xl md:text-3xl font-bold text-[#8ba4b8] mb-1">
                            {staffList.filter(s => s.role === 'FRONT_DESK').length}
                        </p>
                        <p className="text-xs text-slate-400">Front Desk</p>
                    </div>
                    <div className="flex-1 md:flex-none bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 text-center min-w-[140px]">
                        <p className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                            {staffList.filter(s => s.role === 'HOUSEKEEPING').length}
                        </p>
                        <p className="text-xs text-slate-400">Housekeeping</p>
                    </div>
                </div>
            </div>
        </div>
    );
}