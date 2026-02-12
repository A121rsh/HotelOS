"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RealtimeProviderProps {
    children: React.ReactNode;
}

/**
 * 🛰️ AUTONOMOUS PULSE SYNC (No API Keys Required)
 * This provider implements a high-efficiency polling strategy that simulates 
 * realtime behavior without external dependencies like Pusher or Firebase.
 */
export function RealtimeProvider({ children }: RealtimeProviderProps) {
    const router = useRouter();

    useEffect(() => {
        // 1. ACTIVE PULSE: Synchronize data every 8 seconds to capture background transactions
        const interval = setInterval(() => {
            router.refresh();
        }, 8000);

        // 2. FOCUS REVALIDATION: Instantly sync when the user returns to the portal
        const handleFocus = () => {
            router.refresh();
        };

        // 3. VISIBILITY SYNC: Sync when the page becomes visible (tab switch etc.)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                router.refresh();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [router]);

    return <>{children}</>;
}
