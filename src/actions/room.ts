"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createRoom(formData: FormData) {
  const session = await auth();
  
  if (!session) return { error: "Unauthorized" };

  // ✅ FIX: Naye Schema ke hisaab se User aur uska Hotel dhoondo
  const user = await db.user.findUnique({
    where: { email: session.user.email as string },
    include: {
        ownedHotel: true, // Agar Owner hai
        workingAt: true   // Agar Staff hai
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

  if (!number || !type || !price) {
    return { error: "All fields are required" };
  }

  try {
    // Check duplication in THIS specific hotel
    const existingRoom = await db.room.findFirst({
        where: {
            hotelId: hotel.id, // ✅ Correct Hotel ID
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
        hotelId: hotel.id, // ✅ Correct Hotel ID
        status: "AVAILABLE"
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
    // Future Note: Security ke liye humein check karna chahiye ki ye room usi hotel ka hai jiska user hai.
    // Abhi ke liye simple rakhte hain.
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