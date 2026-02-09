
import { db } from "@/lib/db";
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
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { DeletePlanButton } from "./DeletePlanButton";

async function getPlans() {
    return await db.subscriptionPlan.findMany({
        include: {
            _count: {
                select: { subscriptions: true }
            }
        },
        orderBy: { price: "asc" }
    });
}

export default async function AdminPlansPage() {
    const plans = await getPlans();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subscription Plans</h1>
                <Link href="/admin/plans/new">
                    <Button>Create New Plan</Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Limits</TableHead>
                            <TableHead>Features</TableHead>
                            <TableHead>Subscribers</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan.id}>
                                <TableCell className="font-medium">
                                    {plan.name}
                                    <div className="text-xs text-muted-foreground">{plan.description}</div>
                                </TableCell>
                                <TableCell>
                                    ₹{plan.price}/mo
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        Rooms: {plan.maxRooms}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Bookings: {plan.maxBookings === -1 ? "Unlimited" : plan.maxBookings}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {plan.features.slice(0, 2).map((f, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                                        ))}
                                        {plan.features.length > 2 && (
                                            <Badge variant="outline" className="text-xs">+{plan.features.length - 2} more</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {plan._count.subscriptions} Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/plans/${plan.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                        </Link>
                                        <DeletePlanButton planId={plan.id} planName={plan.name} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
