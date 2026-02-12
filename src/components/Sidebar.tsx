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
  ChevronRight,
  PieChart,
  ShieldAlert,
  Globe
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      label: "Guest List",
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
      label: "Operations",
      icon: CheckSquare,
      href: "/dashboard/tasks",
      roles: ["OWNER", "MANAGER"],
      feature: "TASKS"
    },
    {
      label: "Channel Hub",
      icon: Globe,
      href: "/dashboard/channels",
      roles: ["OWNER", "MANAGER"],
      feature: "CHANNELS"
    },
    {
      label: "Team",
      icon: Users2,
      href: "/dashboard/staff",
      roles: ["OWNER"],
      feature: "STAFF"
    },
    {
      label: "Config",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["OWNER"],
      feature: "SETTINGS"
    },
    {
      label: "Subscriptions",
      icon: PieChart,
      href: "/dashboard/pricing",
      roles: ["OWNER"],
      feature: "PRICING"
    },
  ];

  /* 
  ✨ PERMISSION LOGIC
  - Owner: Has access to EVERYTHING.
  - Manager: Has access only to what is in their permissions array.
  - Front Desk / Housekeeping: Restricted by role + permissions (if applicable).
  */
  const userPermissions = (session?.user as any)?.permissions || [];

  const filteredRoutes = routes.filter((route) => {
    // 1. Role Check
    if (!role || !route.roles.includes(role)) return false;

    // 2. Global Hotel Feature Block
    if (blockedFeatures && blockedFeatures.includes(route.feature)) return false;

    // 3. SaaS Plan Restriction
    if (hasActivePlan && route.feature === "PRICING") return false;

    // 4. Lock Check
    if (isLocked) {
      return route.href === "/dashboard/pricing" || route.href === "/dashboard/bookings";
    }

    // 5. MANAGER PERMISSION CHECK
    if (role === "MANAGER") {
      if (!userPermissions.includes(route.feature)) {
        return false;
      }
    }

    return true;
  });

  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-950 text-white font-inter">
      {/* Header with Logo */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3">
          {hotelLogo ? (
            <img
              src={hotelLogo}
              alt="Hotel Logo"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Hotel className="h-6 w-6 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-bold text-lg leading-tight font-outfit truncate">
              {hotelName}
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Property Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Alert if active */}
      {isLocked && (
        <div className="mx-4 mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-xl flex items-center gap-3 animate-pulse">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-red-400 uppercase">Access Restricted</p>
            <p className="text-[9px] text-red-500/80 truncate">Renew plan to unlock features</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="px-3 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Management</p>
        {filteredRoutes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <route.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400")} />
              <span>{route.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
              <ChevronRight className={cn("ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0", isActive ? "hidden" : "block")} />
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-black shadow-lg">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate leading-none mb-1">{session?.user?.name || "Member"}</p>
              <p className="text-[10px] text-slate-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Mobile Toggle */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 z-40 md:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
            <Hotel className="h-5 w-5 text-white" />
          </div>
          <span className="font-black font-outfit text-slate-900 tracking-tight italic">HotelOS</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 md:hidden overflow-hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-100 bg-white">
        <SidebarContent />
      </aside>

      {/* Spacer */}
      <div className="hidden md:block w-72 shrink-0" />
    </>
  );
}
