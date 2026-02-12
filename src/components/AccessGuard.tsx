"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AccessGuardProps {
    children: React.ReactNode;
    isLocked: boolean;
    isBlocked?: boolean;
    blockedFeatures: string[];
    hasActivePlan: boolean;
    subscriptionStatus?: string;
    role?: string;
    permissions?: string[];
}

const FEATURE_ROUTES = [
    { path: "/dashboard/bookings", feature: "BOOKINGS" },
    { path: "/dashboard/rooms", feature: "ROOMS" },
    { path: "/dashboard/guests", feature: "GUESTS" },
    { path: "/dashboard/housekeeping", feature: "HOUSEKEEPING" },
    { path: "/dashboard/tasks", feature: "TASKS" },
    { path: "/dashboard/staff", feature: "STAFF" },
    { path: "/dashboard/settings", feature: "SETTINGS" },
    { path: "/dashboard/pricing", feature: "PRICING" },
    { path: "/dashboard/channels", feature: "CHANNELS" },
    // Dashboard itself is usually allowed, but let's keep it here for mapping
    { path: "/dashboard", feature: "DASHBOARD" },
];

export function AccessGuard({
    children,
    isLocked,
    isBlocked = false,
    blockedFeatures,
    hasActivePlan,
    subscriptionStatus,
    role,
    permissions = []
}: AccessGuardProps) {
    const pathname = usePathname();
    const router = useRouter(); // Import useRouter

    // 1. Find which feature the user is trying to access
    const currentRoute = FEATURE_ROUTES.find(r => pathname === r.path || pathname.startsWith(r.path + "/"));

    if (!currentRoute) return <>{children}</>;

    const feature = currentRoute.feature;

    // 🛡️ CENTRAL AUTHORITY BLOCK
    if (isBlocked) {
        return <LockedState
            title="Authority Revoked"
            description="Access to this node has been suspended by the central administration due to unauthorized activity or pending review. Please contact support."
        />;
    }

    // 🛡️ MANAGER PERMISSION CHECK
    if (role === "MANAGER" && feature !== "DASHBOARD") {
        if (!permissions.includes(feature)) {
            // Instant Redirect
            // We return null to prevent flashing the protected content
            // The useEffect will handle the push, but we can also use a redirect component logic or just render nothing.
            // But we need to call router.push in effect.
            if (typeof window !== "undefined") {
                router.replace("/dashboard");
            }
            return null;
        }
    }

    // 2. Check Expiry or Pending Lock
    if (isLocked) {
        const allowedWhenLocked = ["BOOKINGS", "PRICING"];
        if (!allowedWhenLocked.includes(feature)) {
            if (subscriptionStatus === "PENDING_APPROVAL") {
                return <LockedState
                    title="Awaiting Authority"
                    description="Your payment has been received and is currently being verified. Root access will be granted once administration authorizes the node."
                    type="info"
                />;
            }

            return <LockedState
                title="Subscription Expired"
                description="Your access is restricted because your subscription has expired. Please renew your plan to continue using this feature."
                showPricing
            />;
        }
    }

    // 3. Check Admin Blocked Features
    if (blockedFeatures.includes(feature)) {
        return <LockedState
            title="Feature Restricted"
            description="This feature is not available in your current plan or has been restricted by the administrator."
        />;
    }

    // 4. Special Case: Hide Pricing if user has an active plan (User Request)
    if (hasActivePlan && feature === "PRICING") {
        return <LockedState
            title="Plan Active"
            description="You already have an active subscription plan. If you wish to manage your subscription, please contact support or wait for renewal."
            type="info"
        />;
    }

    return <>{children}</>;
}

function LockedState({
    title,
    description,
    showPricing = false,
    type = "error"
}: {
    title: string;
    description: string;
    showPricing?: boolean;
    type?: "error" | "info"
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
            <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse",
                type === "error" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            )}>
                <ShieldAlert className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                    <Button variant="outline" className="flex items-center gap-2 px-6 py-6 border-2">
                        <LayoutDashboard className="w-5 h-5" />
                        Back to Dashboard
                    </Button>
                </Link>

                {showPricing && (
                    <Link href="/dashboard/pricing">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-6 shadow-lg shadow-blue-200">
                            <CreditCard className="w-5 h-5" />
                            View Pricing Plans
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
