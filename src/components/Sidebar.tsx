"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  Sparkles,
  Settings,
  LogOut,
  CheckSquare,
  Menu,
  X,
  Users2,
  Hotel,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface SidebarProps {
  hotelName?: string;
  hotelLogo?: string | null;
  isLocked?: boolean;
  blockedFeatures?: string[];
  hasActivePlan?: boolean;
}

export default function Sidebar({
  hotelName = "HotelOS",
  hotelLogo = null,
  isLocked = false,
  blockedFeatures = [],
  hasActivePlan = false,
}: SidebarProps) {

  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ✅ Redirect if Locked
  useEffect(() => {
    if (isLocked) {
      // Allow pricing, settings, AND BOOKINGS
      const allowedPaths = ["/dashboard/pricing", "/dashboard/bookings"];
      const isAllowed = allowedPaths.some(p => pathname === p) || pathname.startsWith("/dashboard/settings");

      if (!isAllowed) {
        router.push("/dashboard/pricing");
      }
    }
  }, [isLocked, pathname, router]);

  // Routes (Role Based)
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
      feature: "DASHBOARD"
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: "/dashboard/bookings",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
      feature: "BOOKINGS"
    },
    {
      label: "Rooms",
      icon: BedDouble,
      href: "/dashboard/rooms",
      roles: ["OWNER", "MANAGER"],
      feature: "ROOMS"
    },
    {
      label: "Guests",
      icon: Users,
      href: "/dashboard/guests",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
      feature: "GUESTS"
    },
    {
      label: "Housekeeping",
      icon: Sparkles,
      href: "/dashboard/housekeeping",
      roles: ["OWNER", "MANAGER", "FRONT_DESK", "HOUSEKEEPING"],
      feature: "HOUSEKEEPING"
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/dashboard/tasks",
      roles: ["OWNER", "MANAGER"],
      feature: "TASKS"
    },
    {
      label: "Staff",
      icon: Users2,
      href: "/dashboard/staff",
      roles: ["OWNER"],
      feature: "STAFF"
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["OWNER"],
      feature: "SETTINGS"
    },
    {
      label: "Plans & Usage",
      icon: Sparkles,
      href: "/dashboard/pricing",
      roles: ["OWNER"],
      feature: "PRICING"
    },
  ];

  const filteredRoutes = routes.filter((route) => {
    // 1. Check Role
    if (!role || !route.roles.includes(role)) return false;

    // 2. Check Admin Blocked Features
    if (blockedFeatures && blockedFeatures.includes(route.feature)) return false;

    // 3. Hide Pricing if already has active plan
    if (hasActivePlan && route.feature === "PRICING") return false;

    // 4. Check Lock Status (Expiration)
    if (isLocked) {
      // Allow Bookings and Pricing
      return route.href === "/dashboard/pricing" || route.href === "/dashboard/bookings";
    }

    return true;
  });

  const userInitial =
    session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      {/* Hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header with Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        {hotelLogo ? (
          <img
            src={hotelLogo}
            alt="Hotel Logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Hotel className="h-6 w-6 text-white" />
          </div>
        )}

        <div>
          <h1 className="font-semibold text-lg leading-tight">
            {hotelName}
          </h1>
          <p className="text-xs text-slate-400">
            Management Suite
          </p>
        </div>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="p-4 mx-4 mt-4 rounded-lg bg-slate-800 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
        {filteredRoutes.map((route) => {
          const isActive =
            pathname === route.href ||
            pathname.startsWith(route.href + "/");

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-white"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Spacer */}
      <div className="hidden md:block w-64" />
    </>
  );
}
