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
    Hotel,
    CheckCircle,
    Clock,
    User,
    Building2,
    Calendar,
    Download,
    Settings,
    Trash2,
    Power
} from "lucide-react";
import { format } from "date-fns";
import { ApproveSubscriptionButton } from "./ApproveSubscriptionButton";
import { DeleteHotelButton } from "./DeleteHotelButton";
import { ToggleStatusButton } from "./ToggleStatusButton";
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
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <Hotel className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Hotels</h1>
                            <p className="text-slate-400 text-sm mt-1">{hotels.length} total hotels</p>
                        </div>
                    </div>

                    <Button className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-semibold transition-all">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Hotels Table */}
            <div className="bg-[#0f110d] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/40 border-b border-white/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 text-xs font-semibold text-slate-400">Hotel</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Owner</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Plan</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Stats</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Created</TableHead>
                                <TableHead className="pr-6 text-right text-xs font-semibold text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-white/5">
                            {hotels.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                                <Building2 className="h-8 w-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-sm">No hotels found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                hotels.map((hotel) => (
                                    <TableRow key={hotel.id} className="hover:bg-white/5 transition-colors border-none group">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 border border-[#a1f554]/20 flex items-center justify-center text-lg font-bold text-[#a1f554] group-hover:scale-110 transition-transform">
                                                    {hotel.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white group-hover:text-[#a1f554] transition-colors">{hotel.name}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{hotel.mobile}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{hotel.user?.name || "N/A"}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{hotel.user?.email || hotel.hotelEmail}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {hotel.subscription ? (
                                                <div className="space-y-1.5">
                                                    <Badge className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 font-semibold text-xs">
                                                        {hotel.subscription.plan.name}
                                                    </Badge>
                                                    {(hotel.subscription.status as string) === "PENDING_APPROVAL" && (
                                                        <div className="flex items-center gap-1.5 text-yellow-400 text-xs">
                                                            <Clock className="h-3 w-3" />
                                                            <span>Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge className="bg-white/5 text-slate-400 border border-white/10 font-medium text-xs">
                                                    No Plan
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 text-[#8ba4b8]" />
                                                    <span className="text-sm font-medium text-white">{hotel._count.rooms}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-4 w-4 text-purple-400" />
                                                    <span className="text-sm font-medium text-white">{hotel._count.bookings}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    hotel.isActive ? "bg-[#a1f554]" : "bg-red-500"
                                                )} />
                                                <span className={cn(
                                                    "text-xs font-semibold",
                                                    hotel.isActive ? "text-[#a1f554]" : "text-red-400"
                                                )}>
                                                    {hotel.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium text-white">{format(hotel.createdAt, "MMM d, yyyy")}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{format(hotel.createdAt, "h:mm a")}</p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="pr-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {(hotel.subscription?.status as string) === "PENDING_APPROVAL" && (
                                                    <ApproveSubscriptionButton hotelId={hotel.id} />
                                                )}

                                                <Link href={`/admin/hotels/${hotel.id}/features`}>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-9 w-9 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                                    >
                                                        <Settings className="h-4 w-4" />
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

                {/* Footer */}
                {hotels.length > 0 && (
                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center">
                            Showing {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}