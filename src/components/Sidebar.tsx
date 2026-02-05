"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface SidebarProps {
  hotelName?: string;
}

export default function Sidebar({ hotelName = "HotelOS" }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Routes
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: "/dashboard/bookings",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
    },
    {
      label: "Rooms",
      icon: BedDouble,
      href: "/dashboard/rooms",
      roles: ["OWNER", "MANAGER"],
    },
    {
      label: "Guests",
      icon: Users,
      href: "/dashboard/guests",
      roles: ["OWNER", "MANAGER", "FRONT_DESK"],
    },
    {
      label: "Housekeeping",
      icon: Sparkles,
      href: "/dashboard/housekeeping",
      roles: ["OWNER", "MANAGER", "FRONT_DESK", "HOUSEKEEPING"],
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/dashboard/tasks",
      roles: ["OWNER", "MANAGER"],
    },
    {
      label: "Staff",
      icon: Users2,
      href: "/dashboard/staff",
      roles: ["OWNER"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["OWNER"],
    },
  ];

  const filteredRoutes = routes.filter((route) =>
    role ? route.roles.includes(role) : false
  );

  // Get user initials
  const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || "U";

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Hotel className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {hotelName}
            </h1>
            <p className="text-xs text-slate-400">
              Management Suite
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="p-4 mx-4 mt-4 rounded-lg bg-slate-800 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
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
            pathname === route.href || pathname.startsWith(route.href + "/");
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800">
        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
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

      {/* Desktop Sidebar - ALWAYS EXPANDED */}
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

      {/* Spacer for desktop - ALWAYS ml-64 */}
      <div className="hidden md:block w-64" />
    </>
  );
}