import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2, Clock, User } from "lucide-react";
import AddTaskModal from "@/components/AddTaskModal";
import { toggleTaskStatus, deleteTask } from "@/actions/task";

export default async function TasksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const hotel = await getHotelByUserId(session.user.id as string);
  if (!hotel) return <div>Hotel not found</div>;

  // 1. Fetch Tasks
  const tasks = await db.task.findMany({
      where: { hotelId: hotel.id },
      include: { assignedTo: true },
      orderBy: { createdAt: 'desc' }
  });

  // 2. Fetch Staff List (Modal ke liye)
  const staffList = await db.user.findMany({
      where: { workingAtId: hotel.id, role: 'MANAGER' },
      select: { id: true, name: true }
  });

  const pendingTasks = tasks.filter((t: typeof tasks[0]) => t.status === 'PENDING');
  const completedTasks = tasks.filter((t: typeof tasks[0]) => t.status === 'DONE');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
            <p className="text-slate-500">Assign jobs and track completion.</p>
        </div>
        {/* Sirf Owner hi task assign kar sakta hai */}
        {session.user.role === 'OWNER' && (
            <AddTaskModal staffList={staffList} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PENDING TASKS */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500"/> Pending ({pendingTasks.length})
            </h2>
            
            {pendingTasks.length === 0 && (
                <p className="text-slate-400 text-sm italic">No pending tasks.</p>
            )}

            {pendingTasks.map((task: typeof pendingTasks[0]) => (
                <Card key={task.id} className="border-l-4 border-l-orange-400 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900">{task.title}</h3>
                                {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded">
                                    <User className="h-3 w-3"/> Assigned to: <span className="font-bold">{task.assignedTo.name}</span>
                                </div>
                            </div>
                            
                            <form action={async () => {
                                "use server";
                                await toggleTaskStatus(task.id, task.status);
                            }}>
                                <Button variant="outline" size="sm" className="gap-2 hover:bg-green-50 hover:text-green-600 border-slate-200">
                                    <Circle className="h-4 w-4"/> Mark Done
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* COMPLETED TASKS */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600"/> Completed ({completedTasks.length})
            </h2>

            {completedTasks.length === 0 && (
                <p className="text-slate-400 text-sm italic">No completed tasks yet.</p>
            )}

            {completedTasks.map((task: typeof completedTasks[0]) => (
                <Card key={task.id} className="border-l-4 border-l-green-500 bg-slate-50/50 opacity-80 hover:opacity-100 transition-all">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-700 line-through decoration-slate-400">{task.title}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                    <User className="h-3 w-3"/> Done by: {task.assignedTo.name}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <form action={async () => {
                                    "use server";
                                    await toggleTaskStatus(task.id, task.status);
                                }}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo">
                                        <Clock className="h-4 w-4 text-slate-400"/>
                                    </Button>
                                </form>

                                {session.user.role === 'OWNER' && (
                                    <form action={async () => {
                                        "use server";
                                        await deleteTask(task.id);
                                    }}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

      </div>
    </div>
  );
}