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
    Trash,
    CreditCard,
    Activity,
    Zap,
    Plus,
    ShieldCheck,
    ArrowUpRight,
    Check,
    ChevronRight,
    Search,
    Package
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
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. FISCAL ARCHITECT HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <CreditCard className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">Fiscal Architect</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[9px] px-2 py-0.5">{plans.length} Pricing Engines</Badge>
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Subscription Protocol Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <Link href="/admin/plans/new">
                            <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white rounded-2xl border-none font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 group">
                                <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                                Architect New Plan
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. PLANS REGISTRY CANVAS */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100 h-16">
                                <TableHead className="pl-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Plan Identity</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fiscal Model</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Constraints</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Feature Set</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Establishment</TableHead>
                                <TableHead className="pr-12 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Commands</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                    <TableCell className="pl-12 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all">
                                                <Package className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black font-outfit text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tight">{plan.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 truncate max-w-[200px]">{plan.description}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-xl font-black font-outfit text-slate-900 leading-none">₹{plan.price.toLocaleString()}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Per Cycle (Monthly)</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Units:</span>
                                                <span className="text-xs font-black text-slate-700">{plan.maxRooms === -1 ? "Unlimited" : plan.maxRooms}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Registry:</span>
                                                <span className="text-xs font-black text-slate-700">{plan.maxBookings === -1 ? "Unlimited" : plan.maxBookings}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                                            {plan.features.slice(0, 2).map((feature, i) => (
                                                <Badge key={i} className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                                                    <Check className="h-2 w-2" /> {feature}
                                                </Badge>
                                            ))}
                                            {plan.features.length > 2 && (
                                                <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">
                                                    +{plan.features.length - 2} System Hooks
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 border border-slate-100 w-fit group-hover:bg-white group-hover:border-blue-100 transition-all">
                                            <span className="text-lg font-black font-outfit text-slate-900">{plan._count.subscriptions}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Subscribers</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-12 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/admin/plans/${plan.id}`}>
                                                <Button variant="ghost" className="h-11 w-11 p-0 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                                    <Edit className="h-5 w-5" />
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

                {/* FISCAL INTEGRITY FOOTER */}
                <div className="p-10 bg-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 opacity-50">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Platform Sovereignty v4.2</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pricing Engines Secured by Global Consensus</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/5">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Fiscal Operations Only</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
