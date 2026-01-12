"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarDays, 
  Users, 
  Settings, 
  Building2,
  Sparkles, 
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Interface banaya taaki ye prop accept kar sake
interface SidebarProps {
  hotelName?: string;
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Rooms Status",
    icon: BedDouble,
    href: "/dashboard/rooms",
    color: "text-violet-500",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    href: "/dashboard/bookings",
    color: "text-pink-700",
  },
  {
    label: "Guest Database",
    icon: Users,
    href: "/dashboard/guests",
    color: "text-orange-700",
  },
  {
    label: "Housekeeping",
    icon: Sparkles,
    href: "/dashboard/housekeeping",
    color: "text-emerald-500",
  },
];

// ✅ Prop 'hotelName' receive kiya (Default: "Hotel O.S.")
export default function Sidebar({ hotelName = "Hotel O.S." }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-950 text-white border-r border-slate-800">
      
      {/* 1. DYNAMIC BRAND LOGO */}
      <div className="px-3 py-2">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10 transition-opacity hover:opacity-80">
          <div className="relative w-10 h-10 mr-4 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
             {/* Agar Hotel ka naam hai, to uska Pehla Akshar (Initial) dikhao */}
             <span className="text-xl font-bold text-white uppercase">
                {hotelName.charAt(0)}
             </span>
             {/* <Building2 className="h-6 w-6 text-white" /> (Optional Icon) */}
          </div>
          <div>
            {/* ✅ Yahan Asli Hotel ka Naam aayega */}
            <h1 className="text-lg font-bold tracking-tight truncate w-40" title={hotelName}>
                {hotelName}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Manager Panel</p>
          </div>
        </Link>
      </div>
      
      {/* 2. MAIN MENU */}
      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">
            Operations
        </p>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200 ease-in-out",
              pathname === route.href ? "text-white bg-blue-600/10 border border-blue-600/20 shadow-sm" : "text-slate-400"
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3 transition-transform group-hover:scale-110", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </div>
      
      {/* 3. SETTINGS */}
      <div className="px-3 mt-auto pt-4 border-t border-slate-800">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            System
        </p>
        <Link
            href="/dashboard/settings"
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-slate-800/50 rounded-xl transition-all",
              pathname === "/dashboard/settings" ? "text-white bg-slate-800" : "text-slate-400"
            )}
        >
            <div className="flex items-center flex-1">
              <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              Settings
            </div>
        </Link>
      </div>
    </div>
  );
}