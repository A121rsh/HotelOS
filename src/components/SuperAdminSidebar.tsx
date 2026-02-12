"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    LogOut,
    Hotel,
    ShieldCheck,
    Activity,
    ChevronRight,
    Globe,
    Zap,
    History,
    Settings,
    TrendingUp,
    Menu,
    X
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

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navItems = [
        { label: "Intelligence", href: "/admin", icon: LayoutDashboard },
        { label: "Property Grid", href: "/admin/hotels", icon: HotelsIcon },
        { label: "Fiscal Registry", href: "/admin/finance", icon: TrendingUp },
        { label: "System Intelligence", href: "/admin/logs", icon: History },
        { label: "Fiscal architect", href: "/admin/plans", icon: CreditCard },
        { label: "Authority Protocol", href: "/admin/settings", icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-slate-900 text-white font-inter">
            {/* BRAND CORE */}
            <div className="p-10 pb-12">
                <Link href="/admin" className="group block">
                    <div className="flex items-center gap-4 transition-transform duration-500 group-hover:scale-105">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10 group-hover:rotate-6 transition-all">
                            <Hotel className="h-6 w-6 text-slate-900" />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black font-outfit tracking-tight leading-none italic">
                                Hotel<span className="text-blue-500">OS</span>
                            </h2>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <ShieldCheck className="h-3 w-3" />
                                <p className="text-[8px] font-black uppercase tracking-[0.3em]">Command Center</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* NAVIGATION LAYER */}
            <nav className="flex-1 px-8 space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 ml-2">Global Operations</p>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 border border-transparent hover:shadow-2xl hover:shadow-white/5",
                                isActive
                                    ? "bg-white text-slate-900 shadow-xl shadow-white/10"
                                    : "bg-slate-800/20 hover:bg-white/5 text-white/70 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={cn("h-5 w-5 transition-opacity", isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100")} />
                                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                            </div>
                            <ChevronRight className={cn("h-4 w-4 transition-all", isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0")} />
                        </Link>
                    );
                })}
            </nav>

            {/* SYSTEM HEALTH MONITOR */}
            <div className="px-8 pb-10 mt-auto">
                <div className="bg-slate-800/40 rounded-[2rem] p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Health</span>
                        </div>
                        <Zap className="h-3 w-3 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[98%] transition-all" />
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
                            <span>Platform Efficiency</span>
                            <span className="text-white">99.8%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOGOUT / PROFILE LAYER */}
            <div className="p-8 border-t border-white/5 bg-slate-950/20">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 pr-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">{email}</p>
                            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Master Authority</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="h-10 w-10 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-6 z-[60] shadow-xl">
                <div className="flex items-center gap-3">
                    <Hotel className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-black font-outfit uppercase tracking-tighter">
                        Hotel<span className="text-blue-500">OS</span> Admin
                    </h2>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"
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
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-80 z-[70] lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 bg-slate-900 text-white flex-col fixed inset-y-0 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] z-50">
                <SidebarContent />
            </aside>

            {/* Spacer for desktop */}
            <div className="hidden lg:block w-80 shrink-0" />
        </>
    );
}

function HotelsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="8" x="2" y="2" rx="2" /><path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" /><path d="M10 18H2" /><path d="M10 14H2" /><path d="M2 22h12" /><path d="M16 14v8" /><path d="M20 14v8" /><path d="M22 18h-4" /></svg>
    )
}
