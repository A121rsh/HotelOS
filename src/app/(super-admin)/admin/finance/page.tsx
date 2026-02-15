import { db } from "@/lib/db";
import { format } from "date-fns";
import {
    IndianRupee,
    TrendingUp,
    Download,
    FileText,
    Building2,
    Calendar,
    CheckCircle,
    Clock
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

    const totalRevenue = records.reduce((acc, r) => acc + r.amount, 0);
    const paidCount = records.filter(r => r.status === "PAID").length;
    const pendingCount = records.length - paidCount;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <IndianRupee className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Finance</h1>
                            <p className="text-slate-400 text-sm mt-1">{records.length} total transactions</p>
                        </div>
                    </div>

                    <Button className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-semibold transition-all">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Paid"
                    value={paidCount}
                    icon={CheckCircle}
                    color="blue"
                />
                <StatCard
                    title="Pending"
                    value={pendingCount}
                    icon={Clock}
                    color="yellow"
                />
            </div>

            {/* Transactions Table */}
            <div className="bg-[#0f110d] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/40 border-b border-white/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 text-xs font-semibold text-slate-400">Transaction</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Hotel</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Plan</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Amount</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Status</TableHead>
                                <TableHead className="pr-6 text-right text-xs font-semibold text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-white/5">
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                                <IndianRupee className="h-8 w-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-sm">No transactions found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                records.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-white/5 transition-colors border-none group">
                                        <TableCell className="pl-6 py-4">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{record.paymentId || "Internal"}</p>
                                                <div className="flex items-center gap-2 mt-1 text-slate-500">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-xs">{format(record.createdAt, "MMM d, yyyy")}</span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-[#a1f554]/10 border border-[#a1f554]/20 flex items-center justify-center text-lg font-bold text-[#a1f554]">
                                                    {record.hotel.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{record.hotel.name}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">ID: {record.hotelId.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge className="bg-white/5 border border-white/10 text-slate-400 font-medium text-xs">
                                                {record.subscription?.plan.name || "Custom"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <span className="text-lg font-bold text-white">₹{record.amount.toLocaleString()}</span>
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={cn(
                                                "font-semibold text-xs",
                                                record.status === "PAID"
                                                    ? "bg-[#a1f554]/10 text-[#a1f554] border border-[#a1f554]/20"
                                                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            )}>
                                                {record.status === "PAID" ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1 inline" />
                                                        Paid
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-3 w-3 mr-1 inline" />
                                                        Pending
                                                    </>
                                                )}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="pr-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    className="h-9 w-9 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                {records.length > 0 && (
                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center">
                            Showing {records.length} {records.length === 1 ? 'transaction' : 'transactions'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    color 
}: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
}) {
    const colorClasses: any = {
        green: "bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20",
        blue: "bg-[#8ba4b8]/10 text-[#8ba4b8] border-[#8ba4b8]/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    return (
        <div className="bg-[#0f110d] p-5 md:p-6 rounded-2xl border border-white/10 shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border", colorClasses[color])}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-400 mb-1">{title}</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
}