"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createRoom(formData: FormData) {
  const session = await auth();

  if (!session) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      ownedHotel: true,
      workingAt: true
    }
  });

  // Determine Hotel ID
  const hotel = user?.ownedHotel || user?.workingAt;

  if (!hotel) {
    return { error: "Hotel not found linked to this account." };
  }

  const number = formData.get("number") as string;
  const type = formData.get("type") as string;
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as string; // ✅ Image fetch kiya

  if (!number || !type || !price) {
    return { error: "All fields are required" };
  }

  // ✅ NEW: Plan Limit Check
  const subscription = await db.subscription.findUnique({
    where: { hotelId: hotel.id },
    include: { plan: true }
  });

  if (!subscription || !subscription.plan) {
    return { error: "Subscription plan not found. Please contact support." };
  }

  const currentRoomCount = await db.room.count({
    where: { hotelId: hotel.id }
  });

  if (subscription.plan.maxRooms !== -1 && currentRoomCount >= subscription.plan.maxRooms) {
    return { error: `Plan reached! You can't add more than ${subscription.plan.maxRooms} rooms on the ${subscription.plan.name} plan.` };
  }

  try {
    // Check duplication in THIS specific hotel
    const existingRoom = await db.room.findFirst({
      where: {
        hotelId: hotel.id,
        number: number
      }
    });

    if (existingRoom) {
      return { error: `Room ${number} already exists!` };
    }

    // Create Room
    await db.room.create({
      data: {
        number,
        type,
        price,
        hotelId: hotel.id,
        status: "AVAILABLE",
        image: image || null // ✅ Save kiya (agar image nahi hai to null)
      }
    });

    revalidatePath("/dashboard/rooms");
    return { success: "Room created successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create room." };
  }
}

// UPDATE STATUS
export async function updateRoomStatus(roomId: string, newStatus: string) {
  try {
    await db.room.update({
      where: { id: roomId },
      // @ts-ignore
      data: { status: newStatus },
    });
    revalidatePath("/dashboard/rooms");
    return { success: "Status updated" };
  } catch (error) {
    return { error: "Failed to update" };
  }
}

// DELETE ROOM
export async function deleteRoom(roomId: string) {
  try {
    await db.room.delete({ where: { id: roomId } });
    revalidatePath("/dashboard/rooms");
    return { success: "Room deleted" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}

// UPDATE ROOM DETAILS
export async function updateRoom(formData: FormData) {
  const roomId = formData.get("roomId") as string;
  const number = formData.get("number") as string;
  const type = formData.get("type") as string;
  const price = parseFloat(formData.get("price") as string);

  try {
    await db.room.update({
      where: { id: roomId },
      data: {
        number,
        type,
        price,
      }
    });

    revalidatePath("/dashboard/rooms");
    return { success: "Room updated successfully!" };
  } catch (error) {
    return { error: "Failed to update room." };
  }
}