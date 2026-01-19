"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE TASK
export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const assignedToId = formData.get("assignedToId") as string;

  if (!title || !assignedToId) {
    return { error: "Title and Assigned Staff are required" };
  }

  try {
    // Hotel ID dhoondo (Owner ya Manager ka)
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: { ownedHotel: true, workingAt: true }
    });
    
    const hotel = user?.ownedHotel || user?.workingAt;
    if (!hotel) return { error: "Hotel not found" };

    // Task save karo
    await db.task.create({
      data: {
        title,
        description,
        status: "PENDING",
        hotelId: hotel.id,
        assignedToId: assignedToId
      }
    });

    revalidatePath("/dashboard/tasks");
    return { success: "Task assigned successfully!" };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}

// 2. TOGGLE STATUS (Pending <-> Done)
export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PENDING" ? "DONE" : "PENDING";
    await db.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });
    revalidatePath("/dashboard/tasks");
    return { success: "Status updated" };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

// 3. DELETE TASK
export async function deleteTask(taskId: string) {
  try {
    await db.task.delete({ where: { id: taskId } });
    revalidatePath("/dashboard/tasks");
    return { success: "Task deleted" };
  } catch (error) {
    return { error: "Failed to delete task" };
  }
}