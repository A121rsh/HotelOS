"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Room ko CLEAN (Available) mark karne ke liye
export async function markRoomClean(roomId: string) {
  try {
    await db.room.update({
      where: { id: roomId },
      data: { status: "AVAILABLE" } // Available matlab Clean
    });
    revalidatePath("/dashboard/housekeeping");
    return { success: "Room marked as Clean" };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

// Room ko DIRTY mark karne ke liye (Agar galti se clean mark ho gaya ho)
export async function markRoomDirty(roomId: string) {
  try {
    await db.room.update({
      where: { id: roomId },
      data: { status: "DIRTY" }
    });
    revalidatePath("/dashboard/housekeeping");
    return { success: "Room marked as Dirty" };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

// Maintenance Mode
export async function markRoomMaintenance(roomId: string) {
    try {
      await db.room.update({
        where: { id: roomId },
        data: { status: "MAINTENANCE" }
      });
      revalidatePath("/dashboard/housekeeping");
      return { success: "Room sent to maintenance" };
    } catch (error) {
      return { error: "Failed to update status" };
    }
  }