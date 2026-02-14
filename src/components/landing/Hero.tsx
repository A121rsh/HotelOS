"use client";

import { motion } from "framer-motion";
import { Star, MousePointer2, LayoutDashboard, Database, Shield, Radio, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
    // Definining cursor target positions within the mockup relative to center
    const cursorSequence = [
        { x: 120, y: -40, label: "Analyzing Revenue" },
        { x: -150, y: 80, label: "Syncing Nodes" },
        { x: 180, y: 120, label: "Optimizing Sync" },
        { x: 0, y: 0, label: "System Ready" }
    ];

    return (
        <section className="relative min-h-screen pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#0a0a0a]">
            {/* BACKGROUND GRADIENTS */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_#b5f34710_0%,_transparent_70%)] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

                    {/* TOP BADGE */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 md:mb-10"
                    >
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-3 w-3 fill-[#b5f347] text-[#b5f347]" />
                            ))}
                        </div>
                        <span className="text-[9px] md:text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            4.9 <span className="text-white/20">|</span> 12k Global Property Nodes
                        </span>
                    </motion.div>

                    {/* HEADLINE */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black font-outfit text-white tracking-tight leading-[1] mb-6 md:mb-8"
                    >
                        Propel Your <br />
                        Properties with <span className="text-[#b5f347]">HotelOS</span>
                    </motion.h1>

                    {/* SUBTEXT */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-base md:text-xl font-medium max-w-2xl leading-relaxed mb-10 md:mb-12"
                    >
                        Unify property management with high-velocity node sync, decentralized revenue models, and autonomous guest workflows.
                    </motion.p>

                    {/* BUTTONS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-32 w-full sm:w-auto"
                    >
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button className="w-full sm:h-14 sm:px-10 h-16 bg-[#b5f347] text-black rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#a2db3f] transition-all shadow-xl shadow-[#b5f347]/10 flex items-center justify-center gap-2 group">
                                Get Started <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/demo" className="w-full sm:w-auto">
                            <Button className="w-full sm:h-14 sm:px-10 h-16 bg-transparent text-white border border-white/20 rounded-full text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                Get a Demo
                            </Button>
                        </Link>
                    </motion.div>

                    {/* DASHBOARD MOCKUP - High Fidelity Dark Mode & Full Response */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="relative w-full max-w-5xl mx-auto"
                    >
                        <div className="relative group perspective-1000">
                            {/* Glow Effect behind dashboard */}
                            <div className="absolute -inset-4 bg-[#b5f347]/10 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            {/* Dashboard Frame */}
                            <div className="bg-[#1a1a1a] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-2 md:p-4 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl transform transition-transform duration-700">
                                <div className="bg-[#0f0f0f] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden aspect-[16/10] relative">

                                    {/* Sidebar and Navigation Simulation */}
                                    <div className="absolute top-0 left-0 bottom-0 w-16 md:w-20 bg-zinc-900/50 border-r border-white/5 flex flex-col items-center py-8 gap-8 hidden sm:flex">
                                        <div className="h-10 w-10 bg-[#b5f347]/10 rounded-xl flex items-center justify-center text-[#b5f347]">
                                            <LayoutDashboard className="h-5 w-5" />
                                        </div>
                                        <div className="h-10 w-10 text-slate-600 flex items-center justify-center">
                                            <Database className="h-5 w-5" />
                                        </div>
                                        <div className="h-10 w-10 text-slate-600 flex items-center justify-center">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div className="h-10 w-10 text-slate-600 flex items-center justify-center">
                                            <Radio className="h-5 w-5" />
                                        </div>
                                    </div>

                                    {/* Mockup Top Header */}
                                    <div className="absolute top-0 left-0 sm:left-20 right-0 h-12 md:h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-zinc-900/80 backdrop-blur-md z-10">
                                        <div className="flex gap-4 md:gap-8 items-center">
                                            <div className="h-2 w-16 bg-white/10 rounded-full" />
                                            <div className="h-2 w-16 bg-white/5 rounded-full hidden md:block" />
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-white/10 border border-white/10" />
                                            <div className="h-6 w-20 md:h-8 md:w-24 rounded-full bg-[#b5f347]/10 border border-[#b5f347]/20 flex items-center justify-center">
                                                <span className="text-[8px] md:text-[10px] font-black text-[#b5f347] uppercase">Connected</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mockup Main Canvas */}
                                    <div className="p-4 md:p-8 pt-16 md:pt-24 sm:pl-24 md:pl-28 grid grid-cols-12 gap-4 md:gap-6 h-full overflow-hidden">

                                        {/* Main Chart Card */}
                                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                                            <div className="bg-[#151515] rounded-[2rem] p-6 md:p-8 border border-white/5 relative overflow-hidden flex-1 flex flex-col">
                                                <div className="mb-6 flex justify-between items-start">
                                                    <div className="text-left">
                                                        <p className="text-[8px] md:text-[10px] font-black text-[#b5f347] uppercase tracking-[0.2em] mb-2">Aggregate Revenue</p>
                                                        <p className="text-2xl md:text-5xl font-black text-white tracking-tighter">$142,564.20 <span className="text-[10px] bg-[#b5f347]/10 text-[#b5f347] px-2 py-1 rounded-full align-middle ml-2">+24%</span></p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/10" />)}
                                                    </div>
                                                </div>

                                                {/* Realistic Chart Bars */}
                                                <div className="flex-1 w-full bg-[#0a0a0a]/50 rounded-2xl border border-white/5 flex items-end p-4 md:p-6 gap-2 md:gap-3">
                                                    {[40, 65, 55, 80, 45, 95, 70, 85, 60, 90, 50, 75, 40, 90].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            whileInView={{ height: `${h}%` }}
                                                            transition={{ delay: 0.5 + (i * 0.05), duration: 0.8, ease: "circOut" }}
                                                            className={cn(
                                                                "flex-1 rounded-t-md relative group/bar",
                                                                i === 5 ? "bg-[#b5f347]" : "bg-[#b5f347]/20 hover:bg-[#b5f347]/40 transition-colors"
                                                            )}
                                                        >
                                                            {i === 5 && (
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#b5f347] text-black text-[8px] font-black px-2 py-1 rounded-full whitespace-nowrap hidden md:block">
                                                                    PEAK SYNC
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Bottom Grid Mockup */}
                                            <div className="grid grid-cols-2 gap-4 md:gap-6 h-32 md:h-40 hidden sm:grid">
                                                <div className="bg-[#151515] rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col justify-center">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Latency</p>
                                                    <p className="text-xl md:text-3xl font-black text-white">0.24<span className="text-sm">ms</span></p>
                                                </div>
                                                <div className="bg-[#151515] rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col justify-center">
                                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Prop Nodes</p>
                                                    <p className="text-xl md:text-3xl font-black text-white">1,204</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Activity Sidebar inside Mockup */}
                                        <div className="col-span-12 lg:col-span-4 bg-[#151515] rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col gap-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-black text-white uppercase tracking-tight">Recent Activity</p>
                                                <div className="h-4 w-4 rounded-full border border-white/20" />
                                            </div>
                                            <div className="space-y-4">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/5" />
                                                        <div className="space-y-2 flex-1">
                                                            <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                                                            <div className="h-1.5 w-1/2 bg-white/5 rounded-full" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-auto h-12 w-full bg-[#b5f347]/10 border border-[#b5f347]/20 rounded-2xl flex items-center justify-center">
                                                <span className="text-[9px] font-bold text-[#b5f347] uppercase">Export Node Report</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working Cursor Interaction - Enhanced with responsive positioning */}
                            <motion.div
                                animate={{
                                    x: cursorSequence.map(pos => pos.x),
                                    y: cursorSequence.map(pos => pos.y)
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.33, 0.66, 1]
                                }}
                                className="absolute top-1/2 left-1/2 z-20 pointer-events-none hidden md:block"
                            >
                                <div className="relative">
                                    <MousePointer2 className="h-6 w-6 text-[#b5f347] fill-[#b5f347] drop-shadow-[0_0_10px_rgba(181,243,71,0.5)]" />
                                    <motion.div
                                        className="absolute left-6 top-1 bg-[#b5f347] text-black text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-2xl whitespace-nowrap border-2 border-black"
                                    >
                                        REVENUE OPTIMIZED
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
