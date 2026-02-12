"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Toggles the operational status of a hotel node.
 * Used by administrators to restrict access in case of unauthorized activity.
 */
export async function toggleHotelStatus(hotelId: string) {
    const session = await auth();

    // Authorization Check
    if (!session || (session.user as any).role !== "ADMIN") {
        return { error: "Access Denied. Central Authority clearance required." };
    }

    try {
        const hotel = await db.hotel.findUnique({
            where: { id: hotelId },
            select: { isActive: true }
        });

        if (!hotel) return { error: "Target node not located." };

        const newStatus = !hotel.isActive;

        await db.hotel.update({
            where: { id: hotelId },
            data: { isActive: newStatus }
        });

        revalidatePath("/admin/hotels");
        revalidatePath("/dashboard");

        return {
            success: true,
            status: newStatus,
            message: newStatus
                ? "Node operational status restored."
                : "Node authority has been revoked and locked."
        };

    } catch (error) {
        console.error("Toggle Status Error:", error);
        return { error: "Failed to synchronize authority override." };
    }
}
