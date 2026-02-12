"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle, Loader2 } from "lucide-react";
import { toggleHotelStatus } from "@/actions/toggle-hotel-status";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToggleStatusButtonProps {
    hotelId: string;
    isActive: boolean;
}

export function ToggleStatusButton({ hotelId, isActive }: ToggleStatusButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const res = await toggleHotelStatus(hotelId);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Critical failure in authority override.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        className={`h-11 w-11 p-0 rounded-2xl transition-all shadow-sm ${isActive
                                ? "bg-slate-50 hover:bg-red-600 hover:text-white text-red-600"
                                : "bg-slate-50 hover:bg-emerald-600 hover:text-white text-emerald-600"
                            }`}
                        onClick={handleToggle}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isActive ? (
                            <Ban className="h-5 w-5" />
                        ) : (
                            <CheckCircle className="h-5 w-5" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-none text-white font-bold text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl">
                    <p>{isActive ? "Revoke Node Authority" : "Restore Node Authority"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
