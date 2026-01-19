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
  LogOut,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react"; 
import { useSession } from "next-auth/react"; 

interface SidebarProps {
    hotelName?: string;
}

export default function Sidebar({ hotelName }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  const role = session?.user?.role;

  // ✅ SIMPLIFIED ROUTES
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["OWNER", "MANAGER"] 
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      href: "/dashboard/bookings",
      roles: ["OWNER", "MANAGER"]
    },
    {
      label: "Rooms",
      icon: BedDouble,
      href: "/dashboard/rooms",
      roles: ["OWNER", "MANAGER"]
    },
    {
      label: "Guests",
      icon: Users,
      href: "/dashboard/guests",
      roles: ["OWNER", "MANAGER"]
    },
    {
      label: "Housekeeping",
      icon: Sparkles,
      href: "/dashboard/housekeeping",
      roles: ["OWNER", "MANAGER"]
    },
    // Staff aur Settings sirf OWNER dekhega
    {
      label: "Staff",
      icon: Shield,
      href: "/dashboard/staff",
      roles: ["OWNER"] 
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["OWNER"] 
    },
{
      label: "Tasks",
      icon: CheckSquare, // lucide-react se import karein
      href: "/dashboard/tasks",
      roles: ["OWNER", "MANAGER"] // ✅ Dono dekh sakte hain
    },
    
  ];

  

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