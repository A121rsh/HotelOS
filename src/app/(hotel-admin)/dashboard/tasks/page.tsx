import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CheckCircle2,
    Circle,
    Trash2,
    Clock,
    User,
    LayoutList,
    Plus,
    ShieldCheck,
    ChevronRight,
    AlertCircle,
    Zap,
    Filter,
    Search
} from "lucide-react";
import AddTaskModal from "@/components/AddTaskModal";
import { toggleTaskStatus, deleteTask } from "@/actions/task";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function TasksPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const hotel = await getHotelByUserId(session.user.id as string);
    if (!hotel) return <div className="p-10 text-center font-bold text-slate-400">Hotel not found or Access Denied.</div>;

    const tasks = await db.task.findMany({
        where: { hotelId: hotel.id },
        include: { assignedTo: true },
        orderBy: { createdAt: 'desc' }
    });

    const staffList = await db.user.findMany({
        where: { workingAtId: hotel.id, role: 'MANAGER' },
        select: { id: true, name: true }
    });

    const pendingTasks = tasks.filter((t: any) => t.status === 'PENDING');
    const completedTasks = tasks.filter((t: any) => t.status === 'DONE');
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-10 font-inter">

            {/* 1. EXECUTIVE HEADER */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 font-outfit">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <LayoutList className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Operations Queue</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-widest text-[10px]">{pendingTasks.length} Active Tasks</Badge>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1 flex items-center gap-1 font-inter">
                                    <ShieldCheck className="h-3 w-3" /> System Integrity Live
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Filter tasks..."
                                className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 transition-all text-base font-medium shadow-inner shadow-slate-100 font-inter"
                            />
                        </div>
                        {session.user.role === 'OWNER' && (
                            <AddTaskModal staffList={staffList} />
                        )}
                    </div>
                </div>
            </div>

            {/* 2. DASHBOARD VITALS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Workflow</p>
                            <p className="text-3xl font-black font-outfit text-slate-900">{tasks.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <LayoutList className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -left-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <LayoutList className="h-24 w-24" />
                    </div>
                </Card>

                <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</p>
                            <p className="text-3xl font-black font-outfit text-emerald-600">{completionRate}%</p>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${completionRate}%` }} />
                    </div>
                </Card>

                <Card className="border-none shadow-xl bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Queue Status</p>
                            <p className="text-3xl font-black font-outfit text-blue-400">OPTIMIZED</p>
                        </div>
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                            <Zap className="h-6 w-6 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-4 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Automated Resource Allocation
                    </p>
                </Card>
            </div>

            {/* 3. KANBAN KITCHEN */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                {/* PENDING COLUMN */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-blue-600 rounded-full" />
                            <h2 className="text-2xl font-black font-outfit text-slate-800 tracking-tight">Active Queue</h2>
                            <Badge className="bg-blue-100 text-blue-600 border-none font-black text-[10px] px-2">{pendingTasks.length}</Badge>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {pendingTasks.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold italic">All systems cleared. No pending tasks.</p>
                            </div>
                        ) : (
                            pendingTasks.map((task: any) => (
                                <div key={task.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-blue-200 transition-all duration-500">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                                <h3 className="text-2xl font-black font-outfit text-slate-900 tracking-tight leading-none truncate">{task.title}</h3>
                                            </div>
                                            {task.description && <p className="text-sm text-slate-500 font-medium line-clamp-2">{task.description}</p>}
                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                    <User className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{task.assignedTo.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                    <Clock className="h-3 w-3" /> {new Date(task.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <form className="shrink-0 w-full md:w-auto" action={async () => {
                                            "use server";
                                            await toggleTaskStatus(task.id, task.status);
                                        }}>
                                            <Button className="w-full md:w-auto h-12 px-6 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] group/btn transition-all">
                                                <Circle className="mr-2 h-4 w-4 group-hover/btn:scale-125 transition-transform" />
                                                Authorize Completion
                                            </Button>
                                        </form>
                                    </div>
                                    <div className="absolute bottom-0 left-10 right-10 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* COMPLETED COLUMN */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                            <h2 className="text-2xl font-black font-outfit text-slate-400 tracking-tight">Archived History</h2>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-2">{completedTasks.length}</Badge>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {completedTasks.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold italic">No completed records yet.</p>
                            </div>
                        ) : (
                            completedTasks.map((task: any) => (
                                <div key={task.id} className="group relative bg-white/60 border border-slate-50 rounded-[2rem] p-8 shadow-sm opacity-70 hover:opacity-100 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div className="space-y-2 flex-1 min-w-0">
                                            <h3 className="text-xl font-black font-outfit text-slate-500 line-through decoration-slate-300 decoration-2 truncate tracking-tight">{task.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Finished by {task.assignedTo.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                                            <form action={async () => {
                                                "use server";
                                                await toggleTaskStatus(task.id, task.status);
                                            }}>
                                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg hover:bg-slate-100" title="Restore to Queue">
                                                    <Clock className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </form>

                                            {session.user.role === 'OWNER' && (
                                                <form action={async () => {
                                                    "use server";
                                                    await deleteTask(task.id);
                                                }}>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-lg text-red-200 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}