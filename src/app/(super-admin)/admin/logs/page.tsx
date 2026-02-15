import { db } from "@/lib/db";
import { format } from "date-fns";
import {
    History,
    Download,
    AlertTriangle,
    Info,
    Zap,
    ShieldAlert,
    CreditCard,
    LogIn,
    LogOut,
    User
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
    LOGIN: LogIn,
    FAILED_LOGIN: ShieldAlert,
    LOGOUT: LogOut,
    ADMIN_ACTION: Zap,
    PAYMENT: CreditCard,
    ERROR: AlertTriangle,
};

const TYPE_COLORS: any = {
    LOGIN: "bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20",
    FAILED_LOGIN: "bg-red-500/10 text-red-500 border-red-500/20",
    LOGOUT: "bg-white/5 text-slate-400 border-white/10",
    ADMIN_ACTION: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAYMENT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ERROR: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default async function AdminLogsPage() {
    const logs = await getLogs();

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 pb-20 px-4 md:px-6">

            {/* Header */}
            <div className="bg-gradient-to-br from-[#0f110d]/90 to-black/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-10" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="h-14 w-14 md:h-16 md:w-16 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20">
                            <History className="h-7 w-7 md:h-8 md:w-8 text-[#a1f554]" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white">Activity Logs</h1>
                            <p className="text-slate-400 text-sm mt-1">{logs.length} recent events</p>
                        </div>
                    </div>

                    <Button className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 font-semibold transition-all">
                        <Download className="h-4 w-4 mr-2" />
                        Export Logs
                    </Button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-[#0f110d] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black/40 border-b border-white/10">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="pl-6 text-xs font-semibold text-slate-400">Time</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Type</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Message</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-400">Hotel</TableHead>
                                <TableHead className="pr-6 text-xs font-semibold text-slate-400">User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-white/5">
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                                <Info className="h-8 w-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-sm">No activity logs found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => {
                                    const Icon = TYPE_ICONS[log.type] || Info;
                                    
                                    return (
                                        <TableRow key={log.id} className="hover:bg-white/5 transition-colors border-none group">
                                            <TableCell className="pl-6 py-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{format(log.createdAt, "HH:mm:ss")}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{format(log.createdAt, "MMM d, yyyy")}</p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge className={cn(
                                                    "inline-flex items-center gap-2 font-semibold text-xs border",
                                                    TYPE_COLORS[log.type] || "bg-white/5 text-slate-400 border-white/10"
                                                )}>
                                                    <Icon className="h-3 w-3" />
                                                    {log.type.replace("_", " ")}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="max-w-md">
                                                <p className="text-sm text-slate-300 break-words">{log.message}</p>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-[#a1f554]/10 flex items-center justify-center border border-[#a1f554]/20 text-xs font-bold text-[#a1f554]">
                                                        {log.hotel?.name.charAt(0).toUpperCase() || "S"}
                                                    </div>
                                                    <span className="text-sm font-medium text-white truncate max-w-[150px]">
                                                        {log.hotel?.name || "System"}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="pr-6">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-slate-500" />
                                                    <span className="text-sm text-slate-400 truncate max-w-[150px]">
                                                        {log.user?.email || "System"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                {logs.length > 0 && (
                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10">
                        <p className="text-xs text-slate-500 text-center">
                            Showing {logs.length} most recent {logs.length === 1 ? 'log' : 'logs'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}