"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createRoom(formData: FormData) {
  const session = await auth();
  
  // User verify karo
  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string }
  });

  if (!user || !user.hotelId) {
    return { error: "Hotel not found" };
  }

  // ✅ FIX: Yahan sahi naam use kar rahe hain jo Frontend bhej raha hai
  // Form mein <input name="number" /> hai, to yahan bhi "number" hona chahiye
  const number = formData.get("number") as string;
  const type = formData.get("type") as string;
  const price = parseFloat(formData.get("price") as string);

  // Debugging log (Ab ye sahi value dikhayega)
  console.log("🛠️ Received Data Fixed:", { number, type, price });

  if (!number || !type || !price) {
    return { error: "All fields are required" };
  }

  try {
    // Check karo ki room number pehle se to nahi hai
    const existingRoom = await db.room.findFirst({
        where: {
            hotelId: user.hotelId,
            number: number
        }
    });

    if (existingRoom) {
        return { error: `Room ${number} already exists!` };
    }

    // Database me room save karo
    await db.room.create({
      data: {
        number, // Database column: number
        type,   // Database column: type
        price,
        hotelId: user.hotelId,
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

// ... (Update aur Delete wale functions same rahenge) ...
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

export async function deleteRoom(roomId: string) {
  try {
    await db.room.delete({ where: { id: roomId } });
    revalidatePath("/dashboard/rooms");
    return { success: "Room deleted" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}


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