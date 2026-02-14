"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markRoomClean, markRoomDirty, markRoomMaintenance } from "@/actions/housekeeping";
import { Sparkles, Trash2, Wrench, CheckCircle2, AlertTriangle, Loader2, BedDouble, ChevronRight, Info, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HousekeepingCardProps {
    room: {
        id: string;
        number: string;
        type: string;
        status: string;
    };
}

export default function HousekeepingCard({ room }: HousekeepingCardProps) {
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: Function, id: string) => {
        setLoading(true);
        try {
            await action(id);
        } catch (error) {
            console.error("Housekeeping action failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isDirty = room.status === "DIRTY";
    const isClean = room.status === "AVAILABLE";
    const isMaintenance = room.status === "MAINTENANCE";
    const isOccupied = room.status === "BOOKED";

    return (
        <div className={cn(
            "group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col min-h-[380px] hover:-translate-y-1.5",
            isDirty ? "hover:border-orange-500/30" :
                isClean ? "hover:border-[#B0FF4D]/30" :
                    isOccupied ? "hover:border-blue-500/30" :
                        "hover:border-slate-500/30"
        )}>
            {/* 1. LEFT INDICATOR PILLAR */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-700 rounded-l-[2rem]",
                isDirty ? "bg-orange-500 shadow-[2px_0_15px_rgba(249,115,22,0.4)]" :
                    isClean ? "bg-[#B0FF4D] shadow-[2px_0_15px_rgba(176,255,77,0.4)]" :
                        isOccupied ? "bg-blue-500 shadow-[2px_0_15px_rgba(59,130,246,0.4)]" :
                            "bg-slate-700"
            )} />

            {/* 2. HEADER: COMMAND IDENTITY */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-0.5">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.3em] font-black italic">UNIT_ID</p>
                    <h3 className="text-5xl font-black font-outfit text-white tracking-tighter italic uppercase leading-none">
                        {room.number}
                    </h3>
                </div>
                <Badge className={cn(
                    "rounded-lg font-black text-[8px] px-2.5 py-1 uppercase tracking-widest border-none shrink-0",
                    isDirty ? "bg-orange-500 text-white" :
                        isClean ? "bg-[#B0FF4D] text-black" :
                            isOccupied ? "bg-blue-600 text-white" :
                                "bg-slate-800 text-slate-300"
                )}>
                    {isClean ? 'STABLE' : isDirty ? 'DIRTY' : isOccupied ? 'OCCUPIED' : 'OFFLINE'}
                </Badge>
            </div>

            {/* 3. OPERATIONAL TELEMETRY (Scanning Pill) */}
            <div className="mb-6 relative z-10">
                <div className={cn(
                    "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-md transition-all text-[9px] font-black tracking-[0.1em] uppercase italic bg-black/40 w-full overflow-hidden",
                    isDirty ? "text-orange-500 border-orange-500/10" :
                        isClean ? "text-[#B0FF4D] border-[#B0FF4D]/10" :
                            isOccupied ? "text-blue-400 border-blue-500/20" :
                                "text-slate-400 border-white/5"
                )}>
                    <div className="relative flex items-center justify-center shrink-0">
                        {isDirty ? <AlertTriangle className="h-3.5 w-3.5 animate-pulse" /> :
                            isClean ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                                isOccupied ? <BedDouble className="h-3.5 w-3.5" /> :
                                    <Wrench className="h-3.5 w-3.5" />}
                    </div>
                    <span className="truncate">
                        {isDirty ? "PROTOCOL_REQUIRED" :
                            isClean ? "INTEGRITY_STABLE" :
                                isOccupied ? "GUEST_LOADED" :
                                    "MAINTENANCE_LOCK"}
                    </span>
                </div>
            </div>

            {/* 4. TACTICAL INFO PAD */}
            <div className="mb-6 relative z-10">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 transition-all group-hover:bg-white/[0.03] overflow-hidden">
                    <div className={cn(
                        "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center border shadow-xl transition-transform group-hover:rotate-12",
                        isOccupied ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            "bg-black/40 border-white/5 text-slate-500"
                    )}>
                        <Info className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                        <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">DATA_FEED</p>
                        <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase tracking-wide italic opacity-80 truncate">
                            {isDirty ? "Turnover cycle pending." :
                                isClean ? "Ready for re-entry." :
                                    isOccupied ? "Privacy mode active." :
                                        "Room offline."}
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. HUD ACTIONS */}
            <div className="mt-auto relative z-10">
                {isDirty && (
                    <Button
                        onClick={() => handleAction(markRoomClean, room.id)}
                        disabled={loading}
                        className="w-full h-12 bg-[#B0FF4D] hover:bg-[#c4ff6b] text-black rounded-xl font-black shadow-[0_5px_15px_rgba(176,255,77,0.2)] transition-all text-[9.5px] uppercase tracking-[0.2em]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" /> INITIALIZE_CLEANSE
                            </>
                        )}
                    </Button>
                )}

                {isClean && (
                    <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Button
                            variant="outline"
                            onClick={() => handleAction(markRoomDirty, room.id)}
                            disabled={loading}
                            className="h-10 rounded-lg font-black border-white/5 bg-white/[0.03] text-orange-500 hover:bg-orange-500/10 transition-all text-[8px] uppercase tracking-widest italic"
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> TAG_DIRTY
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleAction(markRoomMaintenance, room.id)}
                            disabled={loading}
                            className="h-10 rounded-lg font-black border-white/5 bg-white/[0.03] text-slate-400 hover:bg-white/10 transition-all text-[8px] uppercase tracking-widest italic"
                        >
                            <Wrench className="h-3.5 w-3.5 mr-1.5" /> REPAIR
                        </Button>
                    </div>
                )}

                {isMaintenance && (
                    <Button
                        onClick={() => handleAction(markRoomClean, room.id)}
                        disabled={loading}
                        className="w-full h-12 bg-white text-black hover:bg-slate-100 rounded-xl font-black shadow-xl transition-all text-[9.5px] uppercase tracking-[0.2em]"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> RELEASE_NODE
                            </>
                        )}
                    </Button>
                )}

                {isOccupied && (
                    <div className="flex items-center justify-center gap-2 h-12 px-4 bg-blue-500/5 border border-blue-500/10 rounded-xl font-black text-blue-400 text-[8px] uppercase tracking-[0.3em] italic shadow-inner">
                        <Activity className="h-3.5 w-3.5" /> NODE_LOADED_ACTIVE
                    </div>
                )}
            </div>
        </div>
    );
}
