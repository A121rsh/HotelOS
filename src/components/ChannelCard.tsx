"use client";

import {
    Globe,
    Zap,
    Settings,
    RefreshCw,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Plug,
    Box,
    ChevronRight
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
        if (!confirm("Are you sure you want to delete this channel? This will remove all mappings and stop synchronization.")) return;
        setIsDeleting(true);
        const res = await deleteChannel(channel.id);
        setIsDeleting(false);
        if (!res.success) toast.error(res.error);
    }

    const channelLogos: Record<string, { bg: string, text: string }> = {
        BOOKING_COM: { bg: "bg-blue-500/10", text: "text-blue-500" },
        AIRBNB: { bg: "bg-rose-500/10", text: "text-rose-500" },
        EXPEDIA: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
        AGODA: { bg: "bg-purple-500/10", text: "text-purple-500" },
        ICAL: { bg: "bg-[#8ba4b8]/10", text: "text-[#8ba4b8]" }
    };

    const currentTheme = channelLogos[channel.type] || { bg: "bg-white/10", text: "text-white" };

    return (
        <div className="group relative bg-[#0f110d] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl hover:border-[#a1f554]/30 transition-all duration-300 overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className={cn(
                        "h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 shrink-0",
                        currentTheme.bg
                    )}>
                        <Globe className={cn("h-6 w-6 md:h-7 md:w-7", currentTheme.text)} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight truncate">{channel.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge className="bg-white/5 text-slate-400 border-white/10 text-xs font-medium px-2 py-0.5">
                                {channel.type.replace('_', '.')}
                            </Badge>
                            {channel.isActive ? (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-[#a1f554]">
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse" />
                                    Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                    <AlertCircle className="h-3 w-3" /> Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                        title="Settings"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg hover:bg-red-500/10 text-red-500/50 hover:text-red-500"
                        title="Delete channel"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-400 mb-1">Mapped Rooms</p>
                    <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-[#8ba4b8]" />
                        <span className="text-xl font-bold text-white">{channel.mappings.length}</span>
                    </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-400 mb-1">Bookings</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#a1f554]" />
                        <span className="text-xl font-bold text-white">{channel._count.bookings}</span>
                    </div>
                </div>
            </div>

            {/* Mapped Rooms Preview */}
            <div className="space-y-3 mb-6">
                <p className="text-xs font-semibold text-slate-400">Room Mappings</p>
                <div className="space-y-2">
                    {channel.mappings.slice(0, 3).map((mapping: any) => (
                        <div key={mapping.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-[#a1f554]/10 text-[#a1f554] flex items-center justify-center text-xs font-bold shrink-0 border border-[#a1f554]/20">
                                    {mapping.room.number}
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white truncate">{mapping.room.type}</p>
                                    <p className="text-xs text-slate-500 truncate">ID: {mapping.externalRoomId}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                                <p className="text-sm font-bold text-[#a1f554]">
                                    ₹{mapping.room.price + (mapping.markupType === 'FIXED' ? mapping.markupValue : (mapping.room.price * mapping.markupValue / 100))}
                                </p>
                                <p className="text-xs text-slate-500">Synced</p>
                            </div>
                        </div>
                    ))}
                    {channel.mappings.length > 3 && (
                        <p className="text-center text-xs font-medium text-slate-500 py-1">
                            + {channel.mappings.length - 3} more rooms
                        </p>
                    )}
                    {channel.mappings.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <Plug className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-xs font-medium text-slate-500">No rooms mapped</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={handleSync}
                    disabled={isSyncing || !channel.isActive}
                    className="flex-1 h-11 bg-[#a1f554] hover:bg-[#8fd445] text-black rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                    {isSyncing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Zap className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            Sync Now
                        </>
                    )}
                </Button>
                <ManageMappingsModal channel={channel} rooms={rooms} />
            </div>

            {/* Hover Accent Line */}
            <div className={cn(
                "absolute bottom-0 left-6 right-6 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full",
                currentTheme.bg.replace('/10', '')
            )} />
        </div>
    );
}