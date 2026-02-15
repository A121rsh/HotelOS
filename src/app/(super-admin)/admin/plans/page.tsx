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
import {
    Edit,
    CreditCard,
    Plus,
    Check,
    Package,
    DoorOpen,
    Calendar,
    Users
} from "lucide-react";
import Link from "next/link";
import { DeletePlanButton } from "./DeletePlanButton";
import { cn } from "@/lib/utils";

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
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <CreditCard className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Subscription Plans</h1>
                            <p className="text-slate-400 text-sm mt-1">{plans.length} active plans</p>
                        </div>
                    </div>

                    <Link href="/admin/plans/new">
                        <Button className="h-12 px-6 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold transition-all shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Plan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Plans Table */}
            <div className="bg-[#0f110d] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/40 border-b border-white/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 text-xs font-semibold text-slate-400">Plan</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Price</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Limits</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Features</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Subscribers</TableHead>
                                <TableHead className="pr-6 text-right text-xs font-semibold text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-white/5">
                            {plans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-white/5 transition-colors border-none group">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 border border-[#a1f554]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Package className="h-5 w-5 text-[#a1f554]" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-white group-hover:text-[#a1f554] transition-colors">{plan.name}</h4>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{plan.description}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div>
                                            <p className="text-xl font-bold text-white">₹{plan.price.toLocaleString()}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">per month</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <DoorOpen className="h-4 w-4 text-[#8ba4b8]" />
                                                <span className="text-white font-medium">
                                                    {plan.maxRooms === -1 ? "Unlimited" : plan.maxRooms}
                                                </span>
                                                <span className="text-slate-500 text-xs">rooms</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-purple-400" />
                                                <span className="text-white font-medium">
                                                    {plan.maxBookings === -1 ? "Unlimited" : plan.maxBookings}
                                                </span>
                                                <span className="text-slate-500 text-xs">bookings</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {plan.features.slice(0, 2).map((feature, i) => (
                                                <Badge key={i} className="bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20 text-xs font-medium">
                                                    {feature}
                                                </Badge>
                                            ))}
                                            {plan.features.length > 2 && (
                                                <Badge className="bg-white/5 text-slate-400 border border-white/10 text-xs">
                                                    +{plan.features.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 w-fit">
                                            <Users className="h-4 w-4 text-[#a1f554]" />
                                            <span className="text-lg font-bold text-white">{plan._count.subscriptions}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="pr-6 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/admin/plans/${plan.id}`}>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                                >
                                                    <Edit className="h-4 w-4" />
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

                {/* Footer */}
                {plans.length > 0 && (
                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center">
                            Showing {plans.length} subscription {plans.length === 1 ? 'plan' : 'plans'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}