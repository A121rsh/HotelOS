"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    LogOut,
    Hotel,
    History,
    Settings,
    TrendingUp,
    Menu,
    X,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface SuperAdminSidebarProps {
    email: string;
}

export default function SuperAdminSidebar({ email }: SuperAdminSidebarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Hotels", href: "/admin/hotels", icon: Hotel },
        { label: "Finance", href: "/admin/finance", icon: TrendingUp },
        { label: "Activity Logs", href: "/admin/logs", icon: History },
        { label: "Plans", href: "/admin/plans", icon: CreditCard },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-[#0f110d] border-r border-white/10 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#a1f554] rounded-full blur-[150px] opacity-5" />

            {/* Brand Header */}
            <div className="p-6 md:p-8 relative z-10 border-b border-white/10">
                <Link href="/admin" className="group block">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-[#a1f554] rounded-xl flex items-center justify-center shadow-lg shadow-[#a1f554]/20 group-hover:scale-105 transition-transform">
                            <Hotel className="h-6 w-6 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                Hotel<span className="text-[#a1f554]">OS</span>
                            </h2>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 md:p-6 space-y-2 relative z-10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                isActive
                                    ? "bg-[#a1f554]/10 border border-[#a1f554]/20 text-[#a1f554]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "text-[#a1f554]")} />
                            <span className="text-sm font-semibold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 md:p-6 space-y-4 relative z-10 border-t border-white/10">
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                    <div className="h-10 w-10 rounded-lg bg-[#8ba4b8]/20 flex items-center justify-center text-[#8ba4b8] shrink-0">
                        <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">{email}</p>
                        <p className="text-xs text-[#a1f554]">Super Admin</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={async () => {
                        await signOut({ redirect: false });
                        window.location.href = "/";
                    }}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0f110d] border-b border-white/10 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#a1f554] rounded-lg flex items-center justify-center">
                        <Hotel className="h-5 w-5 text-black" />
                    </div>
                    <h2 className="text-lg font-bold text-white">
                        Hotel<span className="text-[#a1f554]">OS</span>
                    </h2>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="h-10 w-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-40">
                <SidebarContent />
            </aside>

            {/* Desktop Spacer */}
            <div className="hidden lg:block w-72 shrink-0" />
        </>
    );
}