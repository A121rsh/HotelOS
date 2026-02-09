
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
import { ShieldCheck, ShieldAlert, Wifi, Ban, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ApproveSubscriptionButton } from "./ApproveSubscriptionButton";

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Registered Hotels</h1>
                <Button>Export CSV</Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hotel Name</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Current Plan</TableHead>
                            <TableHead>Stats</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hotels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No hotels found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            hotels.map((hotel) => (
                                <TableRow key={hotel.id}>
                                    <TableCell className="font-medium">
                                        {hotel.name}
                                        <div className="text-xs text-muted-foreground">{hotel.mobile}</div>
                                    </TableCell>
                                    <TableCell>
                                        {hotel.user?.name || "No User"}
                                        <div className="text-xs text-muted-foreground">{hotel.user?.email || hotel.hotelEmail}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {hotel.subscription ? (
                                                <>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                                                        {hotel.subscription.plan.name}
                                                    </Badge>
                                                    {(hotel.subscription.status as string) === "PENDING_APPROVAL" && (
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 w-fit">
                                                            <Clock className="h-3 w-3" /> Awaiting Approval
                                                        </Badge>
                                                    )}
                                                </>
                                            ) : (
                                                <Badge variant="outline" className="bg-slate-100 text-slate-600 w-fit">
                                                    Free (Legacy)
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="font-bold">{hotel._count.rooms}</span> Rooms
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {hotel._count.bookings} Bookings
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {hotel.isActive ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Banned
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {format(hotel.createdAt, "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {(hotel.subscription?.status as string) === "PENDING_APPROVAL" && (
                                                <ApproveSubscriptionButton hotelId={hotel.id} />
                                            )}
                                            <Link href={`/admin/hotels/${hotel.id}/features`}>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <ShieldCheck className="h-4 w-4 mr-1" /> Features
                                                </Button>
                                            </Link>

                                            {hotel.isActive ? (
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Ban className="h-4 w-4 mr-1" /> Ban
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Unban
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
