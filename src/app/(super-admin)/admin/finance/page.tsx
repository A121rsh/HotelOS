import { db } from "@/lib/db";
import { format } from "date-fns";
import {
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Search,
    FileText,
    CreditCard,
    Building2,
    Calendar,
    BadgeCheck,
    Clock,
    AlertCircle
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

async function getFinanceRecords() {
    return await db.subscriptionInvoice.findMany({
        include: {
            hotel: true,
            subscription: { include: { plan: true } }
        },
        orderBy: { createdAt: "desc" }
    });
}

export default async function AdminFinancePage() {
    const records = await getFinanceRecords();

    const totalVolume = records.reduce((acc, r) => acc + r.amount, 0);
    const paidCount = records.filter(r => r.status === "PAID").length;

    return (
        <div className="max-w-[1700px] mx-auto space-y-12 font-inter pb-20">

            {/* 1. FISCAL OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <CardWrapper
                    title="Gross Liquidity"
                    value={`₹${totalVolume.toLocaleString()}`}
                    subTitle="Aggregated lifetime volume"
                    icon={TrendingUp}
                    color="blue"
                />
                <CardWrapper
                    title="Settled Nodes"
                    value={paidCount}
                    subTitle="Successful fiscal transactions"
                    icon={BadgeCheck}
                    color="emerald"
                />
                <CardWrapper
                    title="Pending Settlements"
                    value={records.length - paidCount}
                    subTitle="Nodes awaiting synchronization"
                    icon={Clock}
                    color="amber"
                />
            </div>

            {/* 2. REGISTRY HEADER */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                    <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
                        <IndianRupee className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">Fiscal Registry</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Universal Payment Ledger v4.2</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-96 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
                        <Input
                            placeholder="Identify specific transaction node..."
                            className="h-16 pl-16 pr-8 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white font-bold text-slate-700 placeholder:text-slate-300"
                        />
                    </div>
                    <Button className="h-16 px-10 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] border-none font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20">
                        <Download className="h-4 w-4 mr-3" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* 3. FISCAL LEDGER TABLE */}
            <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100 h-24">
                                <TableHead className="pl-16 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction node</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Establishment</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Fiscal Plan</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Quantum</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Status</TableHead>
                                <TableHead className="pr-16 text-right text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Documentation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-96 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-6 opacity-40">
                                            <IndianRupee className="h-20 w-20 text-slate-300" />
                                            <p className="text-slate-500 font-bold italic text-lg tracking-tight">Zero fiscal events recorded in the current registry.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                                        <TableCell className="pl-16 py-10">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700 tracking-tight">{record.paymentId || "INTERNAL_CREDIT"}</span>
                                                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{format(record.createdAt, "MMM d, yyyy HH:mm")}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-900 font-black text-lg shadow-sm">
                                                    {record.hotel.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[13px] font-black text-slate-800 leading-none">{record.hotel.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: {record.hotelId.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-slate-900 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 text-white">
                                                {record.subscription?.plan.name || "Custom Plan"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-black text-slate-900">₹{record.amount.toLocaleString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm",
                                                record.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                {record.status === "PAID" ? <BadgeCheck className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                {record.status}
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-16 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all text-blue-600 shadow-sm">
                                                    <FileText className="h-5 w-5" />
                                                </Button>
                                                <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all text-slate-400">
                                                    <Download className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function CardWrapper({ title, value, subTitle, icon: Icon, color }: any) {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600 shadow-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
        amber: "bg-amber-50 text-amber-600 shadow-amber-100",
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 group hover:translate-y-[-8px] transition-all duration-500">
            <div className="flex flex-col gap-8">
                <div className={cn("h-20 w-20 rounded-[2rem] flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 shadow-xl", colorClasses[color])}>
                    <Icon className="h-10 w-10" />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{title}</h3>
                    <p className="text-5xl font-black font-outfit text-slate-900 tracking-tighter leading-none mb-4">{value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subTitle}</p>
                </div>
            </div>
        </div>
    );
}
