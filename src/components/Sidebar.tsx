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
  Shield,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react"; // Logout ke liye
import { useSession } from "next-auth/react"; // ✅ Role check karne ke liye

interface SidebarProps {
    hotelName?: string;
}

export default function Sidebar({ hotelName }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession(); // Session se role nikalo
  const role = session?.user?.role;

  // 1. Saare Routes Define karo
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["OWNER", "FRONT_DESK", "HOUSEKEEPING"] // Sabke liye
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: "/dashboard/bookings",
      roles: ["OWNER", "FRONT_DESK"] // Housekeeping ko nahi dikhega
    },
    {
      label: "Rooms",
      icon: BedDouble,
      href: "/dashboard/rooms",
      roles: ["OWNER", "FRONT_DESK"]
    },
    {
      label: "Guests",
      icon: Users,
      href: "/dashboard/guests",
      roles: ["OWNER", "FRONT_DESK"]
    },
    {
      label: "Housekeeping",
      icon: Sparkles,
      href: "/dashboard/housekeeping",
      roles: ["OWNER", "FRONT_DESK", "HOUSEKEEPING"]
    },
    {
      label: "Staff",
      icon: Shield,
      href: "/dashboard/staff",
      roles: ["OWNER"] // ✅ Sirf Owner ke liye
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["OWNER"] // ✅ Sirf Owner ke liye
    },
  ];

  // 2. Filter Routes based on Role
  const filteredRoutes = routes.filter(route => 
    role ? route.roles.includes(role) : false
  );

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            {hotelName || "Hotel O.S."}
          </h1>
        </Link>
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-blue-500" : "text-zinc-400")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Footer / Logout */}
      <div className="px-3 py-2">
         <Button 
            onClick={() => signOut()} 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
         >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
         </Button>
      </div>
    </div>
  );
}