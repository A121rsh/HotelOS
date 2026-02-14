import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getHotelByUserId } from "@/lib/hotel-helper";
import { redirect } from "next/navigation";
import TasksView from "@/components/dashboard/TasksView";

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

    return (
        <TasksView
            tasks={tasks}
            staffList={staffList}
            session={session}
        />
    );
}
