"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateHotelSettings(formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const email = formData.get("email") as string;
  const gstNumber = formData.get("gstNumber") as string; 
  const address = formData.get("address") as string; 

  try {
    // ✅ Logic Update: Sirf Owner hi settings change kar sakta hai
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: { ownedHotel: true } // Sirf ownedHotel check karo
    });

    // Agar user ke paas 'ownedHotel' nahi hai (matlab wo Staff hai ya koi aur), to Error do.
    if (!user?.ownedHotel) {
        return { error: "Permission Denied: Only the Hotel Owner can update settings." };
    }

    // Update Hotel
    await db.hotel.update({
      where: { id: user.ownedHotel.id },
      data: {
        name,
        mobile,
        hotelEmail: email,
        gstNumber, 
        address,   
      }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard"); // Header me naam update karne ke liye
    return { success: "Settings updated successfully!" };
    
  } catch (error) {
    console.log(error);
    return { error: "Failed to update settings." };
  }
}