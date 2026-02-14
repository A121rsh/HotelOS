"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2,
    Trash2,
    Clock,
    User,
    LayoutList,
    Search,
    Command,
    RotateCcw,
    Sparkles,
    Cpu,
    Zap,
    Activity,
    PlusCircle,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AddTaskModal from "@/components/AddTaskModal";
import { toggleTaskStatus, deleteTask } from "@/actions/task";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import { Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

export default function TasksView({
    tasks,
    staffList,
    session
}: {
    tasks: any[],
    staffList: any[],
    session: any
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingTasks = filteredTasks.filter((t: any) => t.status === 'PENDING');
    const completedTasks = filteredTasks.filter((t: any) => t.status === 'DONE');
    const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-inter selection:bg-[#a1f554] selection:text-black">

            {/* Background Narrative Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#a1f554]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#a1f554]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">

                {/* Institutional Header */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#a1f554]/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all duration-1000" />
                    <div className="relative bg-[#0c0c0c]/80 backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                        <div className="flex items-center gap-8">
                            <div className="h-20 w-20 bg-[#a1f554]/10 rounded-2xl flex items-center justify-center border border-[#a1f554]/20 shadow-[0_0_30px_rgba(161,245,84,0.1)] group-hover:scale-105 transition-transform duration-500">
                                <LayoutList className="h-10 w-10 text-[#a1f554]" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-[#a1f554]/10 text-[#a1f554] border-[#a1f554]/20 text-[9px] font-black tracking-widest px-2 py-0.5 uppercase">Operational Stream</Badge>
                                    <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse shadow-[0_0_10px_#a1f554]" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-outfit italic">
                                    Task <span className="text-[#a1f554]">Executive</span>
                                </h1>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                                    <span>{pendingTasks.length} Active Nodes</span>
                                    <span className="h-1 w-1 rounded-full bg-white/10" />
                                    <span>{completionRate}% Efficiency</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-[320px] group/search">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/search:text-[#a1f554] transition-colors" />
                                <Input
                                    placeholder="Filter operational tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-14 pl-14 pr-6 rounded-2xl border-white/5 bg-white/[0.03] placeholder:text-white/10 focus:bg-white/[0.08] focus:border-[#a1f554]/30 focus:ring-1 focus:ring-[#a1f554]/20 transition-all text-white font-medium"
                                />
                            </div>
                            {session.user.role === 'OWNER' && (
                                <AddTaskModal staffList={staffList} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusMetric
                        label="Total Operations"
                        count={tasks.length}
                        color="slate"
                        icon={Command}
                        subtext="Protocol History"
                    />
                    <StatusMetric
                        label="Execution Rate"
                        count={`${completionRate}%`}
                        color="green"
                        icon={Activity}
                        subtext="Linear Progress"
                    />
                    <StatusMetric
                        label="Pending Authorization"
                        count={pendingTasks.length}
                        color="green"
                        icon={Zap}
                        subtext="Active Streams"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* ACTIVE OPERATIONS */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-1 bg-[#a1f554] rounded-full shadow-[0_0_15px_#a1f554]" />
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight font-outfit">Active Operations</h2>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Live data streams requiring resolution</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-white/5 text-[9px] font-black uppercase tracking-widest bg-white/[0.02]">{pendingTasks.length} Units</Badge>
                        </div>

                        <div className="space-y-4">
                            {pendingTasks.length === 0 ? (
                                <div className="group relative overflow-hidden text-center py-24 bg-[#0c0c0c]/40 rounded-[2.5rem] border border-dashed border-white/5 backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-[#a1f554]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <CheckCircle2 className="h-16 w-16 text-white/5 mx-auto mb-6 group-hover:scale-110 group-hover:text-[#a1f554]/20 transition-all duration-700" />
                                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Zero Active Deviations</p>
                                    <p className="text-white/10 text-[9px] uppercase tracking-widest mt-2">All operational nodes are synchronized</p>
                                </div>
                            ) : (
                                pendingTasks.map((task: any) => (
                                    <motion.div
                                        key={task.id}
                                        variants={itemVariants}
                                        className="group relative overflow-hidden bg-[#0c0c0c]/60 border border-white/5 rounded-[2rem] p-8 hover:border-[#a1f554]/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#a1f554]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="relative z-10 flex flex-col gap-8">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="flex-1 min-w-0 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#a1f554] animate-pulse shadow-[0_0_10px_#a1f554]" />
                                                        <h3 className="text-xl font-black text-white truncate font-outfit uppercase tracking-tight">{task.title}</h3>
                                                    </div>
                                                    {task.description && (
                                                        <p className="text-white/30 text-xs leading-relaxed font-medium line-clamp-3">{task.description}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-6 border-t border-white/5">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5">
                                                        <User className="h-3.5 w-3.5 text-[#a1f554]" />
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{task.assignedTo.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/5">
                                                        <Clock className="h-3.5 w-3.5 text-white/20" />
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                </div>

                                                <form action={async () => {
                                                    await toggleTaskStatus(task.id, task.status);
                                                }}>
                                                    <Button className="w-full sm:w-auto h-12 px-8 bg-[#a1f554] hover:bg-[#b4f876] text-black rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_10px_20px_rgba(161,245,84,0.1)] hover:shadow-[0_15px_30px_rgba(161,245,84,0.2)] hover:scale-[1.02] active:scale-[0.98]">
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Execute Resolution
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* RESOLVED LOGS */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-1 bg-white/10 rounded-full" />
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight font-outfit">Archived Logs</h2>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Historical verification data</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-white/5 text-[9px] font-black uppercase tracking-widest bg-white/[0.02]">{completedTasks.length} Entries</Badge>
                        </div>

                        <div className="space-y-4">
                            {completedTasks.length === 0 ? (
                                <div className="text-center py-24 bg-[#0c0c0c]/40 rounded-[2.5rem] border border-dashed border-white/5">
                                    <Clock className="h-16 w-16 text-white/5 mx-auto mb-6" />
                                    <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">Zero Historical Data</p>
                                </div>
                            ) : (
                                completedTasks.map((task: any) => (
                                    <motion.div
                                        key={task.id}
                                        variants={itemVariants}
                                        className="group bg-[#0c0c0c]/30 border border-white/5 rounded-2xl p-6 opacity-60 hover:opacity-100 transition-all duration-500 hover:bg-[#0c0c0c]/50"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <h3 className="text-sm font-bold text-white/40 line-through decoration-[#a1f554]/20 decoration-2 truncate transition-colors group-hover:text-white/60">
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#a1f554]" />
                                                    <span>Verified by <span className="text-[#a1f554]/50">{task.assignedTo.name}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                <form action={async () => {
                                                    await toggleTaskStatus(task.id, task.status);
                                                }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 rounded-xl hover:bg-[#a1f554]/10 text-white/20 hover:text-[#a1f554] transition-all"
                                                        title="Re-open protocol"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                </form>

                                                {session.user.role === 'OWNER' && (
                                                    <form action={async () => {
                                                        await deleteTask(task.id);
                                                    }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-white/10 hover:text-red-500 transition-all"
                                                            title="Purge log entry"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function StatusMetric({ label, count, color, icon: Icon, subtext }: any) {
    const isGreen = color === 'green';

    return (
        <Card className={cn(
            "border bg-[#0c0c0c]/60 rounded-[2rem] p-8 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-xl border-white/5",
            isGreen ? "hover:border-[#a1f554]/20" : "hover:border-white/10"
        )}>
            <div className="flex items-center justify-between relative z-10">
                <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                    isGreen ? "bg-[#a1f554]/10 border border-[#a1f554]/10 shadow-[0_0_20px_rgba(161,245,84,0.05)]" : "bg-white/[0.03] border border-white/5"
                )}>
                    <Icon className={cn("h-7 w-7", isGreen ? "text-[#a1f554]" : "text-white/40")} />
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-white font-outfit tracking-tighter">{count}</div>
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1.5">{subtext}</div>
                </div>
            </div>

            <div className="mt-8 relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] group-hover:text-white/50 transition-colors">{label}</p>
            </div>

            <div className={cn(
                "absolute -right-8 -bottom-8 h-32 w-32 opacity-[0.03] pointer-events-none transition-all duration-700 group-hover:scale-125 group-hover:rotate-12",
                isGreen ? "text-[#a1f554]" : "text-white"
            )}>
                <Icon className="h-full w-full" />
            </div>
        </Card>
    );
}
