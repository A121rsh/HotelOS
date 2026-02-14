"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { cn } from "@/lib/utils"
import { Wifi, WifiOff } from "lucide-react"

export function NetworkStatus({ className }: { className?: string }) {
    const isOnline = useOnlineStatus()

    if (isOnline) {
        return (
            <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20", className)}>
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">System Active</span>
            </div>
        )
    }

    return (
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse", className)}>
            <WifiOff className="h-3 w-3 text-red-500" />
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Disconnected</span>
        </div>
    )
}
