"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateHotelSettings(
  formData: FormData
): Promise<void> {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const mobile = formData.get("mobile") as string;
  const email = formData.get("email") as string;
  const gstNumber = formData.get("gstNumber") as string;
  const address = formData.get("address") as string;

  if (!name) {
    throw new Error("Hotel name is required");
  }

  try {
    // ✅ Sirf Owner hi settings update kar sakta hai
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      include: { ownedHotel: true },
    });

    if (!user?.ownedHotel) {
      throw new Error(
        "Permission Denied: Only the Hotel Owner can update settings."
      );
    }

    // Handle Amenities (Checkboxes return multiple values)
    const amenities = formData.getAll("amenities") as string[];

    // Handle Image (Simple URL input for now, MVP)
    const bannerImage = formData.get("bannerImage") as string;
    const images = bannerImage ? [bannerImage] : [];

    await db.hotel.update({
      where: { id: user.ownedHotel.id },
      data: {
        name,
        mobile,
        hotelEmail: email,
        gstNumber,
        address,
        amenities, // ✅ Save Array
        images: images.length > 0 ? images : undefined, // Only update if new image provided
      },
    });

    // ✅ Pages refresh
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update settings.");
  }
}
