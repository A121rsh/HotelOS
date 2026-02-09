"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateHotelFeatures(hotelId: string, blockedFeatures: string[]) {
    try {
        await db.hotel.update({
            where: { id: hotelId },
            data: { blockedFeatures }
        });

        revalidatePath("/admin/hotels");
        revalidatePath(`/admin/hotels/${hotelId}/features`);
        return { success: true };
    } catch (error) {
        console.error("Update Features Error:", error);
        return { error: "Failed to update features" };
    }
}
