"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LayoutDashboard, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AccessGuardProps {
    children: React.ReactNode;
    isLocked: boolean;
    blockedFeatures: string[];
    hasActivePlan: boolean;
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
    { path: "/dashboard", feature: "DASHBOARD" },
];

export function AccessGuard({ children, isLocked, blockedFeatures, hasActivePlan }: AccessGuardProps) {
    const pathname = usePathname();

    // 1. Find which feature the user is trying to access
    const currentRoute = FEATURE_ROUTES.find(r => pathname === r.path || pathname.startsWith(r.path + "/"));

    if (!currentRoute) return <>{children}</>;

    const feature = currentRoute.feature;

    // 2. Check Expiry Lock
    // If locked, only Bookings and Pricing are allowed
    if (isLocked) {
        const allowedWhenLocked = ["BOOKINGS", "PRICING"];
        if (!allowedWhenLocked.includes(feature)) {
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
