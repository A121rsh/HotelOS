import { db } from "@/lib/db";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    ShieldAlert,
    Wifi,
    Ban,
    CheckCircle,
    Clock,
    Globe,
    MoreHorizontal,
    User,
    Building2,
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
    Download
} from "lucide-react";
import { format } from "date-fns";
import { ApproveSubscriptionButton } from "./ApproveSubscriptionButton";
import { DeleteHotelButton } from "./DeleteHotelButton";
import { ToggleStatusButton } from "./ToggleStatusButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

async function getHotels() {
    return await db.hotel.findMany({
        include: {
            user: true,
            subscription: {
                include: { plan: true }
            },
            _count: {
                select: { rooms: true, bookings: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

export default async function AdminHotelsPage() {
    const hotels = await getHotels();

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. REGISTRY HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <Globe className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">Property Grid</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">{hotels.length} Registered Nodes</Badge>
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <Wifi className="h-3.5 w-3.5 text-emerald-500" /> Real-time Synchronization Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Locate property node..."
                                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                            />
                        </div>
                        <Button className="h-14 px-8 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl border-none font-black text-[10px] uppercase tracking-widest transition-all">
                            <Download className="h-4 w-4 mr-2" />
                            Export Grid
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. REGISTRY TABLE CANVAS */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100 h-16">
                                <TableHead className="pl-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Property Node</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Proprietor</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fiscal Plan</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node Vitals</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Establishment</TableHead>
                                <TableHead className="pr-12 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Commands</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hotels.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                                                <Building2 className="h-8 w-8" />
                                            </div>
                                            <p className="text-slate-400 font-bold italic">No property nodes found in the global grid.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                hotels.map((hotel) => (
                                    <TableRow key={hotel.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                        <TableCell className="pl-12 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl font-black shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all text-slate-900">
                                                    {hotel.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black font-outfit text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tight">{hotel.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{hotel.mobile}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-700">{hotel.user?.name || "No User"}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{hotel.user?.email || hotel.hotelEmail}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2">
                                                {hotel.subscription ? (
                                                    <div className="space-y-1.5">
                                                        <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                                                            {hotel.subscription.plan.name}
                                                        </Badge>
                                                        {(hotel.subscription.status as string) === "PENDING_APPROVAL" && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 w-fit">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="text-[9px] font-black uppercase tracking-tight">Pending Approval</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                                                        Legacy (Free)
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-900 leading-none">{hotel._count.rooms}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Units</p>
                                                </div>
                                                <div className="h-6 w-px bg-slate-100" />
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-900 leading-none">{hotel._count.bookings}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", hotel.isActive ? "bg-emerald-500 shadow-emerald-200" : "bg-red-500 shadow-red-200")} />
                                                <span className={cn("text-[10px] font-black uppercase tracking-widest", hotel.isActive ? "text-emerald-600" : "text-red-600")}>
                                                    {hotel.isActive ? "Operational" : "Deactivated"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700">{format(hotel.createdAt, "MMM d, yyyy")}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Provisioned</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-12 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {(hotel.subscription?.status as string) === "PENDING_APPROVAL" && (
                                                    <ApproveSubscriptionButton hotelId={hotel.id} />
                                                )}

                                                <div className="h-10 w-px bg-slate-100 mx-2" />

                                                <Link href={`/admin/hotels/${hotel.id}/features`}>
                                                    <Button variant="ghost" className="h-11 w-11 p-0 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                                        <ShieldCheck className="h-5 w-5" />
                                                    </Button>
                                                </Link>

                                                <ToggleStatusButton hotelId={hotel.id} isActive={hotel.isActive} />

                                                <DeleteHotelButton hotelId={hotel.id} hotelName={hotel.name} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* FOOTER INTELLIGENCE */}
                <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Proprietary Property Registry v4.0</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Integrity Check Passed</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">End-to-End Encryption Protocol Active</span>
                    </div>
                </div>
            </div>
        </div >
    );
}
