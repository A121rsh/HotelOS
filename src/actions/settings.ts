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
  const gstNumber = formData.get("gstNumber") as string; // ✅ Ab ye kaam karega
  const address = formData.get("address") as string;     // ✅ Ye bhi

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: { hotel: true }
    });

    if (!user?.hotel) return { error: "Hotel not found" };

    await db.hotel.update({
      where: { id: user.hotel.id },
      data: {
        name,
        mobile,
        hotelEmail: email,
        gstNumber, // ✅ Saving to DB
        address,   // ✅ Saving to DB
      }
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: "Settings updated successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update settings." };
  }
}