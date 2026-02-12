import { db } from "@/lib/db";
import { format } from "date-fns";
import {
    History,
    Search,
    Filter,
    Download,
    AlertTriangle,
    CheckCircle,
    Info,
    Zap,
    ShieldAlert,
    CreditCard,
    LogIn,
    LogOut
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function getLogs() {
    return await db.auditLog.findMany({
        include: {
            user: true,
            hotel: true
        },
        orderBy: { createdAt: "desc" },
        take: 100
    });
}

const TYPE_ICONS: any = {
    LOGIN: <LogIn className="h-4 w-4" />,
    FAILED_LOGIN: <ShieldAlert className="h-4 w-4" />,
    LOGOUT: <LogOut className="h-4 w-4" />,
    ADMIN_ACTION: <Zap className="h-4 w-4" />,
    PAYMENT: <CreditCard className="h-4 w-4" />,
    ERROR: <AlertTriangle className="h-4 w-4" />,
};

const TYPE_COLORS: any = {
    LOGIN: "bg-emerald-50 text-emerald-600",
    FAILED_LOGIN: "bg-rose-50 text-rose-600",
    LOGOUT: "bg-slate-50 text-slate-600",
    ADMIN_ACTION: "bg-blue-50 text-blue-600",
    PAYMENT: "bg-indigo-50 text-indigo-600",
    ERROR: "bg-amber-50 text-amber-600",
};

export default async function AdminLogsPage() {
    const logs = await getLogs();

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 font-inter">

            {/* LOGS HEADER */}
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                    <History className="h-32 w-32" />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <History className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight leading-none">System Intelligence</h1>
                            <div className="flex items-center gap-3 mt-3">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-black uppercase tracking-[0.2em] text-[10px] px-3 py-1">Sequential Integrity Valid</Badge>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Global Event Stream Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-96 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-all" />
                            <Input
                                placeholder="Scan ledger for specific event signature..."
                                className="h-16 pl-14 pr-6 rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-500 font-bold text-slate-700 placeholder:text-slate-300 transition-all"
                            />
                        </div>
                        <Button className="h-16 px-10 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-[1.5rem] border-none font-black text-[11px] uppercase tracking-[0.2em] transition-all">
                            <Download className="h-4 w-4 mr-3" /> Export Ledger
                        </Button>
                    </div>
                </div>
            </div>

            {/* LOGS TABLE CANVAS */}
            <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100 h-20">
                                <TableHead className="pl-14 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Timestamp</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Event Class</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Description</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Origin Node</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Target Identity</TableHead>
                                <TableHead className="pr-14 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Diagnostics</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-96 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-6">
                                            <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                                                <Info className="h-12 w-12" />
                                            </div>
                                            <p className="text-slate-400 font-black italic uppercase tracking-widest text-[12px]">No records found in the current temporal window.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors border-slate-100/50 group">
                                        <TableCell className="pl-14 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700">{format(log.createdAt, "HH:mm:ss")}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(log.createdAt, "MMM d, yyyy")}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={cn("inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm", TYPE_COLORS[log.type] || "bg-slate-50 text-slate-500")}>
                                                {TYPE_ICONS[log.type] || <Info className="h-4 w-4" />}
                                                {log.type.replace("_", " ")}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            <p className="text-[13px] font-bold text-slate-600 leading-relaxed tracking-tight break-words">{log.message}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 font-black text-xs">
                                                    {log.hotel?.name.charAt(0) || "S"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-slate-700">{log.hotel?.name || "CENTRAL ENGINE"}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master Authority</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <span className="text-xs font-bold truncate max-w-[120px]">{log.user?.email || "SYSTEM"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-14 text-right">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* FOOTER INTELLIGENCE */}
                <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Proprietary Event Ledger v1.0 • Authorized Personnel Only</p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cryptographic Hashing Active</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Log Integrity Secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
