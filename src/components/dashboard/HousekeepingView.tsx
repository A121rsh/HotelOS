"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertCircle, CheckCircle, Zap, BedDouble, Filter, Search, Info, ShieldCheck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import HousekeepingCard from "@/components/HousekeepingCard";

interface HousekeepingViewProps {
    rooms: any[];
    dirtyRooms: any[];
    cleanRooms: any[];
    maintenanceRooms: any[];
    occupiedRooms: any[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function HousekeepingView({
    rooms,
    dirtyRooms,
    cleanRooms,
    maintenanceRooms,
    occupiedRooms
}: HousekeepingViewProps) {
    return (
        <div className="max-w-[1800px] mx-auto space-y-16 pb-20 px-6 font-inter text-white bg-[#050505] min-h-screen">
            {/* 1. SEAMLESS COMMAND HEADER */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden mt-8">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#B0FF4D] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="h-20 w-20 bg-gradient-to-br from-black to-[#B0FF4D]/20 rounded-[2rem] flex items-center justify-center border border-[#B0FF4D]/30 shadow-[0_0_30px_rgba(176,255,77,0.1)]">
                            <Activity className="h-10 w-10 text-[#B0FF4D]" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black font-outfit text-white tracking-tighter leading-none uppercase italic">Command Center</h1>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-2 bg-[#B0FF4D]/10 px-3 py-1 rounded-full border border-[#B0FF4D]/20">
                                    <div className="h-2 w-2 rounded-full bg-[#B0FF4D] animate-ping" />
                                    <span className="text-[#B0FF4D] font-black text-[10px] uppercase tracking-[0.2em]">Operational</span>
                                </div>
                                <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5 italic">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Security Level Alpha
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-[400px] group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-[#B0FF4D] transition-colors" />
                            <Input
                                placeholder="NODE_LOOKUP_"
                                className="h-16 pl-16 pr-8 rounded-[2rem] border-white/5 bg-black/40 backdrop-blur-sm placeholder:text-slate-700 focus:border-[#B0FF4D]/50 focus:ring-2 focus:ring-[#B0FF4D]/20 transition-all text-lg font-black uppercase italic tracking-tighter text-[#B0FF4D] font-inter shadow-inner"
                            />
                        </div>
                        <Button className="h-16 w-16 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-sm text-white hover:bg-[#B0FF4D] hover:text-black transition-all hover:-translate-y-1">
                            <Filter className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TELEMETRY METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatusMetric
                    label="Dirty Nodes"
                    count={dirtyRooms.length}
                    total={rooms.length}
                    color="orange"
                    icon={AlertCircle}
                    subtext="Requires Cleanse"
                />
                <StatusMetric
                    label="Pool Ready"
                    count={cleanRooms.length}
                    total={rooms.length}
                    color="emerald"
                    icon={CheckCircle}
                    subtext="Verified Integrity"
                />
                <StatusMetric
                    label="Maintenance"
                    count={maintenanceRooms.length}
                    total={rooms.length}
                    color="slate"
                    icon={Zap}
                    subtext="Offline Status"
                />
                <StatusMetric
                    label="Occupied"
                    count={occupiedRooms.length}
                    total={rooms.length}
                    color="blue"
                    icon={BedDouble}
                    subtext="Node Loaded"
                />
            </div>

            {/* 3. PRIORITY WORKFLOW */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-10 relative"
            >
                {dirtyRooms.length > 0 && (
                    <>
                        <div className="absolute -inset-10 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none opacity-40" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="h-12 w-1.5 bg-gradient-to-b from-orange-500 to-transparent rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
                            <div className="flex flex-col">
                                <h2 className="text-4xl font-black font-outfit text-white tracking-tighter uppercase italic">Priority Queue</h2>
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-1">Surgical turnover required</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
                            {dirtyRooms.map(room => (
                                <motion.div key={room.id} variants={itemVariants} className="hover:-translate-y-2 transition-transform duration-300">
                                    <HousekeepingCard room={room} />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>

            {/* 4. OPERATIONAL MONITORING */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-10 pt-16 border-t border-white/5"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-1.5 bg-gradient-to-b from-[#B0FF4D] to-transparent rounded-full shadow-[0_0_20px_rgba(176,255,77,0.4)]" />
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-black font-outfit text-slate-400 tracking-tighter uppercase italic">General Overview</h2>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Satellite property monitoring</p>
                        </div>
                    </div>
                    <p className="hidden md:block text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em] font-mono italic opacity-50">
                        HOVER_FOR_NODE_MANAGEMENT_ACTION_
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {cleanRooms.map(room => (
                        <motion.div key={room.id} variants={itemVariants} className="hover:-translate-y-2 transition-transform duration-300">
                            <HousekeepingCard room={room} />
                        </motion.div>
                    ))}
                    {maintenanceRooms.map(room => (
                        <motion.div key={room.id} variants={itemVariants} className="hover:-translate-y-2 transition-transform duration-300">
                            <HousekeepingCard room={room} />
                        </motion.div>
                    ))}
                    {occupiedRooms.map(room => (
                        <motion.div key={room.id} variants={itemVariants} className="hover:-translate-y-2 transition-transform duration-300">
                            <HousekeepingCard room={room} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function StatusMetric({ label, count, total, color, icon: Icon, subtext }: any) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    const theme = {
        orange: { glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]", border: "border-orange-500/20", color: "text-orange-500", bg: "bg-orange-500" },
        emerald: { glow: "shadow-[0_0_30px_rgba(176,255,77,0.15)]", border: "border-[#B0FF4D]/20", color: "text-[#B0FF4D]", bg: "bg-[#B0FF4D]" },
        blue: { glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]", border: "border-blue-500/20", color: "text-blue-500", bg: "bg-blue-500" },
        slate: { glow: "shadow-[0_0_30px_rgba(148,163,184,0.15)]", border: "border-slate-500/20", color: "text-slate-400", bg: "bg-slate-500" }
    };

    const currentTheme = theme[color as keyof typeof theme];

    return (
        <Card className={cn(
            "border border-white/5 bg-[#0c0c0c] rounded-[2.5rem] p-9 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2",
            currentTheme.glow, currentTheme.border
        )}>
            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className={cn(
                    "h-16 w-16 rounded-[1.5rem] flex items-center justify-center transform transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110",
                    "bg-black/40 border border-white/5 shadow-inner",
                    currentTheme.color
                )}>
                    <Icon className="h-8 w-8" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-5xl font-black font-outfit text-white tracking-tighter italic">{count}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mt-2">Active Data</span>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">{label}</p>
                    <p className={cn("text-xs font-black font-mono", currentTheme.color)}>{pct}%</p>
                </div>
                <div className="h-4 w-full bg-black/60 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={cn(
                            "h-full rounded-full shadow-[0_0_15px_currentColor]",
                            currentTheme.bg, currentTheme.color
                        )}
                    />
                </div>
                <p className="text-[9px] font-black text-slate-600 mt-5 uppercase tracking-[0.4em] italic opacity-60 group-hover:opacity-100 transition-opacity">{subtext}</p>
            </div>

            <div className={cn(
                "absolute -right-10 -bottom-10 h-40 w-40 opacity-[0.03] pointer-events-none transition-all duration-1000 group-hover:scale-125 group-hover:opacity-[0.08] group-hover:rotate-12",
                currentTheme.color
            )}>
                <Icon className="h-full w-full" />
            </div>
        </Card>
    );
}
        