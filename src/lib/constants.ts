import {
    LayoutDashboard,
    CalendarDays,
    BedDouble,
    Users,
    Sparkles,
    CheckSquare,
    Settings,
    PieChart
} from "lucide-react";

export const FEATURE_LIST = [
    {
        id: "DASHBOARD",
        label: "Dashboard Access",
        description: "View executive analytics and real-time property vitals.",
        icon: LayoutDashboard,
        href: "/dashboard"
    },
    {
        id: "BOOKINGS",
        label: "Booking Engine",
        description: "Manage guest stays, registrations, and fiscal check-ins.",
        icon: CalendarDays,
        href: "/dashboard/bookings"
    },
    {
        id: "ROOMS",
        label: "Inventory Control",
        description: "Architect room nodes and manage classification inventory.",
        icon: BedDouble,
        href: "/dashboard/rooms"
    },
    {
        id: "GUESTS",
        label: "Guest Registry",
        description: "Access historical guest documents and contact protocols.",
        icon: Users,
        href: "/dashboard/guests"
    },
    {
        id: "HOUSEKEEPING",
        label: "Environmental Health",
        description: "Monitor room sanitation and housekeeping status orbs.",
        icon: Sparkles,
        href: "/dashboard/housekeeping"
    },
    {
        id: "TASKS",
        label: "Operational Queue",
        description: "Initialize and monitor staff workflow tasks.",
        icon: CheckSquare,
        href: "/dashboard/tasks"
    }
];
