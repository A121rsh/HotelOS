"use client";

import { useState } from "react";
import {
    Phone,
    Mail,
    Search,
    Users,
    Star,
    TrendingUp,
    Calendar,
    ChevronRight,
    Download,
    Plus,
    Info,
    ShieldCheck,
    LayoutGrid,
    Table as TableIcon,
    UserPlus,
    BarChart3,
    Zap,
    Radio,
    Sparkles,
    ArrowRight,
    Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface Guest {
    id: string;
    name: string;
    mobile: string;
    email: string | null;
    idType: string;
    visits: number;
    totalSpent: number;
    lastVisit: string;
}

interface GuestsViewProps {
    initialGuests: Guest[];
}

export default function GuestsView({ initialGuests }: GuestsViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    const filteredGuests = initialGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.mobile.includes(searchQuery)
    );

    const stats = {
        totalGuests: initialGuests.length,
        repeatGuests: initialGuests.filter(g => g.visits > 1).length,
        totalValue: initialGuests.reduce((acc, g) => acc + g.totalSpent, 0),
        avgValue: initialGuests.length > 0
            ? initialGuests.reduce((acc, g) => acc + g.totalSpent, 0) / initialGuests.length
            : 0
    };

    return (
        <TooltipProvider>
            <div className="min-h-[calc(100vh-100px)] bg-[#0a0a0a] -m-6 md:-m-10 p-6 md:p-10 font-inter antialiased relative overflow-x-hidden
                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-[#b5f347]/30 hover:[&::-webkit-scrollbar-thumb]:bg-[#b5f347]/60 [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* Background FX Elements */}
                <div className="absolute top-0 left-1/4 w-full h-[600px] bg-[radial-gradient(circle_at_center,_#b5f34705_0%,_transparent_70%)] pointer-events-none" />
                <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#b5f347]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-[1700px] mx-auto space-y-8 flex flex-col h-full relative z-10">

                    {/* TOP ACTION BAR - COMMAND CONSOLE */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#111] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#b5f347]/5 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="h-16 w-16 bg-[#b5f347] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(181,243,71,0.2)] shrink-0">
                                <Users className="h-8 w-8 text-black" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-4xl font-black font-outfit text-white tracking-tighter leading-none uppercase italic">Guest <span className="text-[#b5f347]">Relations</span></h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-[#b5f347] animate-pulse" /> Subsystem Online
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-white/10" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol CRM-v4</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto relative z-10">
                            <div className="relative flex-1 md:w-[450px] group/search">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within/search:text-[#b5f347] transition-colors" />
                                <Input
                                    placeholder="LOCATE GUEST PROFILE NODE..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-16 pl-14 pr-6 rounded-2xl border-white/10 bg-[#0a0a0a] focus:bg-[#0c0c0c] focus:border-[#b5f347]/50 focus:ring-0 transition-all text-white text-sm font-black placeholder:text-slate-800 uppercase tracking-[0.1em]"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="h-16 h-16 w-16 md:w-auto md:px-6 rounded-2xl border-white/10 bg-[#0a0a0a] hover:bg-[#151515] text-slate-400 hover:text-[#b5f347] font-black uppercase tracking-widest text-[10px] transition-all group/btn"
                                >
                                    <Download className="h-5 w-5 md:mr-2" /> <span className="hidden md:inline">Export CRM</span>
                                </Button>
                                <Button
                                    className="h-16 px-8 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(181,243,71,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Plus className="h-5 w-5 mr-3" /> Initialize Node
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch flex-1">

                        {/* GUEST LIST CONTAINER */}
                        <div className="flex-1 bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col min-h-[650px] relative overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-[#111]/80 backdrop-blur-xl">
                                <div className="flex items-center gap-5">
                                    <h2 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Guest Directory</h2>
                                    <Badge className="bg-[#b5f347]/10 text-[#b5f347] border border-[#b5f347]/20 font-black text-[10px] px-3.5 py-1 rounded-lg italic">{filteredGuests.length} NODES</Badge>
                                </div>
                                <div className="flex bg-[#0a0a0a] p-1.5 rounded-xl border border-white/5">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn("p-2.5 rounded-lg transition-all", viewMode === "grid" ? "bg-[#b5f347] text-black shadow-lg" : "text-[#E0E0E0]/40 hover:text-[#E0E0E0]/60")}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={cn("p-2.5 rounded-lg transition-all", viewMode === "table" ? "bg-[#b5f347] text-black shadow-lg" : "text-[#E0E0E0]/40 hover:text-[#E0E0E0]/60")}
                                    >
                                        <TableIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                                {filteredGuests.length > 0 ? (
                                    <div className={cn(
                                        "gap-6",
                                        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3" : "flex flex-col"
                                    )}>
                                        {filteredGuests.map((guest, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                key={guest.mobile}
                                                className={cn(
                                                    "group relative border transition-all duration-500",
                                                    viewMode === "grid"
                                                        ? "bg-[#0a0a0a]/80 backdrop-blur-3xl border-[#b5f347]/10 rounded-[2.5rem] p-7 md:p-8 hover:shadow-[0_0_50px_rgba(181,243,71,0.05)] hover:border-[#b5f347]/40"
                                                        : "flex items-center justify-between p-6 border-white/5 hover:bg-white/[0.02] rounded-[1.5rem]"
                                                )}
                                            >
                                                {viewMode === "grid" && (
                                                    <div className="flex flex-col h-full relative z-10">
                                                        {/* HEADER: AVATAR & TACTICAL SAVE */}
                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="h-14 w-14 rounded-full bg-[#151515] border border-white/10 flex items-center justify-center text-[#b5f347] font-black text-xl shadow-[0_0_20px_rgba(181,243,71,0.05)] transition-transform group-hover:rotate-6 duration-500">
                                                                {guest.name.charAt(0)}
                                                            </div>
                                                            <button className="h-9 px-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-[#E0E0E0]/30 uppercase tracking-[0.2em] hover:bg-[#b5f347] hover:text-black transition-all flex items-center gap-2 group/save">
                                                                SAVE <Bookmark className="h-3 w-3 opacity-30 group-hover/save:opacity-100 transition-opacity" />
                                                            </button>
                                                        </div>

                                                        {/* DATA BLOCK: HIERARCHY MAPS TO REFERENCE */}
                                                        <div className="space-y-1.5 mb-6">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[11px] font-black text-[#E0E0E0]/40 uppercase tracking-[0.15em] leading-none">{guest.idType} PROTOCOL</p>
                                                                <span className="text-white/10">•</span>
                                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter leading-none">{new Date(guest.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                                            </div>
                                                            <h3 className="text-[32px] font-black text-white font-outfit uppercase tracking-tighter leading-[0.9] group-hover:text-[#b5f347] transition-colors line-clamp-2">
                                                                {guest.name}
                                                            </h3>
                                                        </div>

                                                        {/* ATTRIBUTES: PILL CONFIGURATION */}
                                                        <div className="flex flex-wrap gap-2 mb-8">
                                                            <div className="bg-[#1a1a1a] text-[#E0E0E0]/60 border border-white/5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                                {guest.visits} STAYS
                                                            </div>
                                                            {guest.visits > 1 && (
                                                                <div className="bg-[#b5f347]/5 text-[#b5f347] border border-[#b5f347]/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 shadow-[0_0_15px_rgba(181,243,71,0.05)]">
                                                                    <div className="h-1 w-1 rounded-full bg-[#b5f347] shadow-[0_0_5px_#b5f347]" />
                                                                    REPEAT_NODE
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* STRUCTURAL SEPARATOR */}
                                                        <div className="mb-6 border-t border-white/[0.04]" />

                                                        {/* PRIMARY ACTIONS & YIELD */}
                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="space-y-1">
                                                                <p className="text-2xl font-black text-white font-outfit tracking-tighter leading-none">
                                                                    ₹{guest.totalSpent.toLocaleString()}
                                                                    <span className="text-[10px] text-white/20 ml-1 font-bold">/LTV</span>
                                                                </p>
                                                                <p className="text-[9px] font-black text-[#E0E0E0]/20 uppercase tracking-widest leading-none">ALLOCATED YIELD</p>
                                                            </div>
                                                            <Button className="h-12 px-6 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all group/btn shadow-[0_0_20px_rgba(181,243,71,0.15)] active:scale-95">
                                                                INITIALIZE <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                {viewMode === "table" && (
                                                    <>
                                                        <div className="flex items-center gap-6 flex-1">
                                                            <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-slate-500 transition-all duration-500 group-hover:bg-[#b5f347] group-hover:text-black group-hover:border-transparent">
                                                                {guest.name.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tighter truncate">{guest.name}</h3>
                                                                <div className="flex items-center gap-4 mt-1 opacity-40">
                                                                    <Phone className="h-3 w-3" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">{guest.mobile}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-12 text-right">
                                                            <div className="hidden lg:block">
                                                                <p className="text-[10px] font-black text-[#E0E0E0]/20 uppercase tracking-widest mb-1.5">Last Sync</p>
                                                                <p className="text-[13px] font-black text-[#E0E0E0]/60 uppercase tracking-tight">{new Date(guest.lastVisit).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                            </div>
                                                            <div className="w-32">
                                                                <p className="text-[10px] font-black text-[#E0E0E0]/20 uppercase tracking-widest mb-1.5">Node Yield</p>
                                                                <p className="text-xl font-black text-[#b5f347] font-outfit">₹{guest.totalSpent.toLocaleString()}</p>
                                                            </div>
                                                            <button className="h-12 w-12 rounded-xl hover:bg-[#b5f347] border border-white/5 hover:border-transparent flex items-center justify-center transition-all text-slate-600 hover:text-black shadow-inner">
                                                                <ChevronRight className="h-6 w-6" />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Card BG Number Deco */}
                                                <span className="absolute -bottom-4 -left-2 text-[80px] font-black text-white/[0.02] select-none pointer-events-none italic tracking-tighter italic">0{index + 1}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    /* EMPTY STATE - COMMAND CENTER BLUEPRINT */
                                    <div className="h-full flex flex-col items-center justify-center text-center py-32 px-6 relative">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(181,243,71,0.04)_0%,_transparent_60%)] pointer-events-none" />
                                        <div className="relative mb-12">
                                            <div className="h-48 w-48 bg-[#0a0a0a] rounded-[4rem] flex items-center justify-center border-4 border-dashed border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] group/icon">
                                                <Zap className="h-20 w-20 text-slate-900 group-hover/icon:text-[#b5f347] group-hover/icon:scale-110 transition-all duration-700" />
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6], rotate: [0, 90, 0] }}
                                                transition={{ repeat: Infinity, duration: 4 }}
                                                className="absolute -top-6 -right-6 h-16 w-16 bg-[#b5f347] rounded-full shadow-[0_0_40px_#b5f347] flex items-center justify-center text-black border-[6px] border-[#0a0a0a]"
                                            >
                                                <Radio className="h-7 w-7" />
                                            </motion.div>
                                        </div>
                                        <h3 className="text-5xl font-black font-outfit text-white mb-6 uppercase tracking-tighter italic">Signal <span className="text-[#b5f347]">Lost</span></h3>
                                        <p className="text-slate-600 font-black max-w-sm mx-auto mb-16 text-xs uppercase tracking-[0.4em] leading-loose">
                                            Synchronization failed. Zero active guest nodes detected in the current terminal topology. Initialize manual entry.
                                        </p>
                                        <Button
                                            className="h-20 px-14 bg-[#b5f347] hover:bg-[#a2db3f] text-black rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[14px] shadow-[0_0_60px_rgba(181,243,71,0.25)] transition-all hover:scale-105 active:scale-95 group/btn"
                                        >
                                            <UserPlus className="h-6 w-6 mr-4 group-hover/btn:translate-x-1 transition-transform" /> Initialize Manual Sync
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* SCANLINE OVERLAY */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(181,243,71,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40 z-20" />
                        </div>

                        {/* ANALYTICS SIDEBAR - DARK PROTOCOL */}
                        <div className="w-full lg:w-[420px] space-y-8 flex flex-col">

                            {/* PERFORMANCE CONSOLE */}
                            <div className="bg-[#111] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col relative flex-1">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#b5f347]/50 to-transparent" />
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-md">
                                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 italic font-outfit">
                                        <BarChart3 className="h-5 w-5 text-[#b5f347]" /> Performance Matrix
                                    </h3>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#b5f347] transition-all">
                                                <Info className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="bg-[#0a0a0a] border-white/10 text-[#b5f347] text-[11px] font-black uppercase tracking-widest p-5 rounded-2xl shadow-3xl max-w-[280px]">
                                            <p className="leading-loose italic">RETENTION_SUBSYSTEM: Analyzing visit vectors and node loyalty aggregates to optimize fiscal yield protocols.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                <div className="p-8 space-y-10">
                                    {/* Repeat Rate Hub - RADIAL VERSION */}
                                    <div className="flex flex-col items-center justify-center py-6 gap-8 bg-[#0a0a0a]/40 rounded-[2rem] border border-white/5">
                                        <div className="relative h-44 w-44">
                                            <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    className="stroke-[#111] stroke-[10] fill-none"
                                                />
                                                <motion.circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    className="stroke-[#b5f347] stroke-[10] fill-none"
                                                    strokeLinecap="round"
                                                    initial={{ strokeDashoffset: 440 }}
                                                    animate={{ strokeDashoffset: 440 - (440 * (stats.repeatGuests / stats.totalGuests || 0)) }}
                                                    transition={{ duration: 2.5, ease: "circOut" }}
                                                    style={{ strokeDasharray: 440, filter: "drop-shadow(0 0 12px rgba(181,243,71,0.6))" }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-black font-outfit text-white tracking-tighter drop-shadow-2xl">
                                                    {stats.totalGuests > 0 ? ((stats.repeatGuests / stats.totalGuests) * 100).toFixed(0) : 0}%
                                                </span>
                                                <span className="text-[10px] font-black text-[#b5f347] uppercase tracking-[0.3em] mt-1">LOCKED</span>
                                            </div>
                                        </div>
                                        <p className="text-[11px] font-black text-[#E0E0E0]/60 uppercase tracking-[0.4em]">Network Repeat Rate</p>
                                    </div>

                                    {/* Dual Intel Panels */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-[#0a0a0a] p-8 min-h-[160px] rounded-[1.8rem] border border-white/5 group relative overflow-hidden transition-all hover:border-[#b5f347]/30 hover:bg-[#0c0c0c] flex flex-col justify-center">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                                                <Users className="h-32 w-32" />
                                            </div>
                                            <div className="flex items-center gap-5 mb-5 relative z-10">
                                                <div className="h-12 w-12 rounded-2xl bg-[#b5f347]/5 border border-[#b5f347]/20 flex items-center justify-center text-[#b5f347]">
                                                    <UserPlus className="h-6 w-6" />
                                                </div>
                                                <p className="text-[11px] font-black text-[#E0E0E0]/50 uppercase tracking-[0.2em]">Repeat Nodes</p>
                                            </div>
                                            <p className="text-5xl font-black font-outfit text-white tracking-tighter relative z-10 leading-none">{stats.repeatGuests}</p>
                                        </div>

                                        <div className="bg-[#0a0a0a] p-8 min-h-[160px] rounded-[1.8rem] border border-white/5 group relative overflow-hidden transition-all hover:border-blue-400/30 hover:bg-[#0c0c0c] flex flex-col justify-center">
                                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                                                <TrendingUp className="h-32 w-32 text-blue-400" />
                                            </div>
                                            <div className="flex items-center gap-5 mb-5 relative z-10">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                                <p className="text-[11px] font-black text-[#E0E0E0]/50 uppercase tracking-[0.2em]">Aggregate Yield</p>
                                            </div>
                                            <p className="text-5xl font-black font-outfit text-white tracking-tighter relative z-10 leading-none">₹{stats.totalValue.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Avg Value Banner */}
                                    <div className="pt-8 border-t border-white/5 flex flex-col items-center">
                                        <p className="text-[10px] font-black text-[#E0E0E0]/30 uppercase tracking-[0.4em] mb-4 italic">AVG NODE ALLOCATION</p>
                                        <div className="w-full bg-[#0a0a0a] p-6 rounded-[1.5rem] border border-white/5 relative group cursor-pointer overflow-hidden">
                                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#b5f347]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                            <p className="text-center font-black text-4xl text-[#b5f347] font-outfit tracking-tight">
                                                ₹{stats.avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-6 bg-[#0a0a0a]/50 border-t border-white/5">
                                    <p className="text-[10px] font-black text-slate-800 text-center uppercase tracking-[0.5em] italic">HotelOS // CRM-OPS // V.4.2.1</p>
                                </div>
                            </div>

                            {/* TIP CARD - NEON COMMAND */}
                            <div className="bg-[#b5f347] rounded-[2.5rem] p-10 text-black shadow-[0_0_60px_rgba(181,243,71,0.15)] relative overflow-hidden group border-2 border-white/10 shrink-0">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.08] rotate-12 group-hover:rotate-45 group-hover:scale-150 transition-all duration-1000">
                                    <Sparkles className="h-40 w-40 fill-current" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-[14px] font-black uppercase tracking-[0.3em] font-outfit">Core Optimization</h4>
                                </div>
                                <p className="text-[18px] font-black leading-tight tracking-tighter uppercase italic">
                                    "IDENTIFIED 60% HIGHER YIELD FROM REPEAT NODES. INITIALIZE LOYALTY PROTOCOLS TO ACCELERATE CAPITAL SYNC."
                                </p>
                                <div className="mt-8 h-2 w-full bg-black/10 rounded-full overflow-hidden">
                                    <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full w-12 bg-black" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
