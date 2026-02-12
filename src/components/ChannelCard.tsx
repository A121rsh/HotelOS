"use client";

import {
    Globe,
    Zap,
    Settings,
    RefreshCw,
    ArrowUpRight,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Plug,
    MapPin,
    IndianRupee,
    ChevronRight,
    Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { triggerManualSync, deleteChannel } from "@/actions/channel";
import { toast } from "sonner";
import ManageMappingsModal from "./ManageMappingsModal";

export default function ChannelCard({ channel, rooms }: { channel: any, rooms: any[] }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleSync() {
        setIsSyncing(true);
        const res = await triggerManualSync(channel.id);
        setIsSyncing(false);
        if (res.success) {
            toast.success(res.success);
        } else {
            toast.error(res.error);
        }
    }

    async function handleDelete() {
        if (!confirm("Decommissioning this channel node will sever all active synchronization. Proceed with authorization?")) return;
        setIsDeleting(true);
        const res = await deleteChannel(channel.id);
        setIsDeleting(false);
        if (!res.success) toast.error(res.error);
    }

    const channelLogos: Record<string, string> = {
        BOOKING_COM: "bg-blue-600",
        AIRBNB: "bg-rose-500",
        EXPEDIA: "bg-yellow-600",
        AGODA: "bg-purple-600",
        ICAL: "bg-slate-700"
    };

    return (
        <div className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 overflow-hidden">

            {/* 1. CHANNEL IDENTITY */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500",
                        channelLogos[channel.type] || "bg-slate-900"
                    )}>
                        <Globe className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900 leading-tight truncate max-w-[200px]">{channel.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-slate-100 text-slate-400 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-lg">
                                {channel.type.replace('_', '.')}
                            </Badge>
                            {channel.isActive ? (
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Synchronized
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    <AlertCircle className="h-3 w-3" /> Node Offline
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100"
                    >
                        <Settings className="h-4 w-4 text-slate-400" />
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 text-red-200 hover:text-red-500"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 2. OPERATIONAL METRICS */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 group-hover:bg-white transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Mappings</p>
                    <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-blue-500" />
                        <span className="text-xl font-black text-slate-900">{channel.mappings.length} Units</span>
                    </div>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 group-hover:bg-white transition-colors">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inbound Reservations</p>
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-emerald-500" />
                        <span className="text-xl font-black text-slate-900">{channel._count.bookings}</span>
                    </div>
                </div>
            </div>

            {/* 3. MAPPED ROOMS PREVIEW */}
            <div className="space-y-3 mb-8">
                <p className="px-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory Distribution</p>
                <div className="space-y-2">
                    {channel.mappings.slice(0, 3).map((mapping: any) => (
                        <div key={mapping.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-50 group-hover:border-blue-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                                    R{mapping.room.number}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-slate-900">{mapping.room.type}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Ext. ID: {mapping.externalRoomId}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-emerald-600 tracking-tight">
                                    ₹{mapping.room.price + (mapping.markupType === 'FIXED' ? mapping.markupValue : (mapping.room.price * mapping.markupValue / 100))}
                                </p>
                                <p className="text-[8px] font-bold text-slate-300 uppercase">Synced</p>
                            </div>
                        </div>
                    ))}
                    {channel.mappings.length > 3 && (
                        <p className="text-center text-[10px] font-bold text-slate-400 py-1">
                            + {channel.mappings.length - 3} more distribution nodes
                        </p>
                    )}
                    {channel.mappings.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-slate-50 rounded-2xl">
                            <Plug className="h-6 w-6 text-slate-100 mx-auto mb-2" />
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Active Mappings</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. SYNC COMMANDS */}
            <div className="flex gap-3">
                <Button
                    onClick={handleSync}
                    disabled={isSyncing || !channel.isActive}
                    className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest group/btn transition-all shadow-lg shadow-slate-900/10"
                >
                    {isSyncing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Zap className="mr-2 h-4 w-4 group-hover/btn:scale-125 transition-transform" />
                            Push ARI Node
                        </>
                    )}
                </Button>
                <ManageMappingsModal channel={channel} rooms={rooms} />
            </div>

            {/* Visual Context Accent */}
            <div className={cn(
                "absolute bottom-0 left-10 right-10 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-full",
                channelLogos[channel.type] || "bg-slate-900"
            )} />
        </div>
    );
}
