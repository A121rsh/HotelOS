"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NetworkStatus } from "@/components/ui/network-status";
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Users,
  Sparkles,
  CheckSquare,
  Globe,
  Users2,
  Settings,
  PieChart,
  Hotel,
  ShieldAlert,
  ChevronRight,
  LogOut,
  X,
  Menu
} from "lucide-react";

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
    <div className="h-full flex flex-col bg-[#09090b] text-white font-inter border-r border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#b5f347]/5 to-transparent" />
      </div>

      {/* Header with Logo */}
      <div className="p-8 mb-2 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-[#b5f347] p-2 rounded-xl shadow-[0_0_20px_rgba(181,243,71,0.2)] group-hover:rotate-12 transition-transform duration-500">
            <Hotel className="h-5 w-5 text-black" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black font-outfit text-white tracking-tight uppercase italic-none">
              Hotel<span className="text-[#b5f347]">OS</span>
            </h1>
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="h-1 w-1 rounded-full bg-[#b5f347] animate-pulse" />
              <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em] leading-none">
                {hotelName}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Lock Alert if active */}
      {isLocked && (
        <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
          <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Access Restricted</p>
            <p className="text-[9px] text-red-400/60 truncate">Renew plan to unlock features</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide relative z-10 w-full">
        <div className="px-4 mb-4 flex items-center justify-between opacity-40">
          <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Command Menu</p>
          <div className="h-px bg-white/20 flex-1 ml-4" />
        </div>

        <ul className="space-y-1">
          <AnimatePresence mode="wait">
            {filteredRoutes.map((route) => {
              const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-300 rounded-xl overflow-hidden",
                      isActive
                        ? "text-[#b5f347] bg-[#b5f347]/10 backdrop-blur-md border border-[#b5f347]/20 shadow-[0_0_20px_rgba(181,243,71,0.05)]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <route.icon className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    <span className="tracking-wide text-[11px] uppercase font-black">{route.label}</span>
                  </Link>
                </li>
              );
            })}
          </AnimatePresence>
        </ul>
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-auto p-4 mx-4 mb-4 rounded-3xl bg-[#111] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#b5f347]/10 flex items-center justify-center border border-[#b5f347]/20 text-[#b5f347]">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-white uppercase tracking-wider truncate">{session?.user?.name?.split(" ")[0]}</p>
              <div className="flex items-center gap-1.5 opacity-50">
                <div className="h-1 w-1 rounded-full bg-[#b5f347]" />
                <p className="text-[8px] font-bold uppercase tracking-widest text-[#b5f347]">Online</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
            title="Disconnect"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-40 md:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-[#b5f347] p-1.5 rounded-lg shadow-[0_0_15px_rgba(181,243,71,0.3)]">
            <Hotel className="h-4 w-4 text-black" />
          </div>
          <span className="font-black font-outfit text-white tracking-tight uppercase">Hotel<span className="text-[#b5f347]">OS</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-transform"
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 md:hidden overflow-hidden shadow-2xl border-r border-[#b5f347]/20"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/5 bg-[#09090b]">
        <SidebarContent />
      </aside>

      {/* Spacer */}
      <div className="hidden md:block w-72 shrink-0 bg-[#09090b]" />
    </>
  );
}
