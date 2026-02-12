"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markRoomClean, markRoomDirty, markRoomMaintenance } from "@/actions/housekeeping";
import { Sparkles, Trash2, Wrench, CheckCircle2, AlertTriangle, Loader2, BedDouble, ChevronRight } from "lucide-react";
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

    return (
        <div className={cn(
            "group relative bg-white border rounded-[2rem] p-8 shadow-xl transition-all duration-500 hover:shadow-2xl",
            isDirty ? "border-orange-100 shadow-orange-500/5" :
                isClean ? "border-emerald-100 shadow-emerald-500/5 hover:border-emerald-200" :
                    "border-slate-100 shadow-slate-500/5"
        )}>
            {/* Decorative Background Icon */}
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
                {isDirty ? <AlertTriangle className="h-24 w-24 -rotate-12" /> :
                    isClean ? <CheckCircle2 className="h-24 w-24 -rotate-12" /> :
                        <Wrench className="h-24 w-24 -rotate-12" />}
            </div>

            {/* Header: Room & Type */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl",
                        isDirty ? "bg-orange-600 text-white shadow-orange-500/20" :
                            isClean ? "bg-emerald-600 text-white shadow-emerald-500/20" :
                                "bg-slate-900 text-white shadow-slate-900/20"
                    )}>
                        <BedDouble className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-1">{room.number}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{room.type}</p>
                    </div>
                </div>
                <Badge className={cn(
                    "rounded-full font-black text-[9px] px-3 py-1 uppercase tracking-widest border-none shadow-sm",
                    isDirty ? "bg-orange-100 text-orange-600" :
                        isClean ? "bg-emerald-100 text-emerald-600" :
                            "bg-slate-100 text-slate-600"
                )}>
                    {room.status === 'AVAILABLE' ? 'Verified' : room.status}
                </Badge>
            </div>

            <div className="h-px bg-slate-50 mb-8" />

            {/* Status Messaging */}
            <div className="mb-8">
                <div className={cn(
                    "flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-all",
                    isDirty ? "bg-orange-50 text-orange-700 border-orange-100" :
                        isClean ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            "bg-slate-50 text-slate-600 border-slate-100"
                )}>
                    {isDirty ? <AlertTriangle className="h-4 w-4" /> :
                        isClean ? <CheckCircle2 className="h-4 w-4" /> :
                            <Wrench className="h-4 w-4" />}
                    <span className="uppercase tracking-wide">
                        {isDirty ? "Turnover Required" :
                            isClean ? "Ready for Guests" :
                                "Maintenance in Progress"}
                    </span>
                </div>
            </div>

            {/* Action Controls */}
            <div className="space-y-3">
                {isDirty && (
                    <Button
                        onClick={() => handleAction(markRoomClean, room.id)}
                        disabled={loading}
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 group/btn transition-all text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>
                                <Sparkles className="h-5 w-5 mr-3 transition-transform group-hover/btn:scale-125" />
                                Finish Cleaning
                            </>
                        )}
                    </Button>
                )}

                {isClean && (
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleAction(markRoomDirty, room.id)}
                            disabled={loading}
                            className="h-14 rounded-2xl font-black border-orange-100 text-orange-600 hover:bg-orange-50 transition-all text-[10px] uppercase tracking-widest"
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Dirty
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleAction(markRoomMaintenance, room.id)}
                            disabled={loading}
                            className="h-14 rounded-2xl font-black border-slate-100 text-slate-600 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest"
                        >
                            <Wrench className="h-4 w-4 mr-2" /> Repair
                        </Button>
                    </div>
                )}

                {isMaintenance && (
                    <Button
                        onClick={() => handleAction(markRoomClean, room.id)}
                        disabled={loading}
                        className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-lg shadow-slate-900/20 group/btn transition-all text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>
                                <CheckCircle2 className="h-5 w-5 mr-3 transition-transform group-hover/btn:scale-125" />
                                Return to Pool
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Micro-Action Indicator */}
            <div className={cn(
                "absolute bottom-0 left-10 right-10 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full",
                isDirty ? "bg-orange-600" : isClean ? "bg-emerald-600" : "bg-slate-600"
            )} />
        </div>
    );
}