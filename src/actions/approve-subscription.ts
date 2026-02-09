"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveSubscription(hotelId: string) {
    try {
        await db.subscription.update({
            where: { hotelId },
            data: {
                status: "ACTIVE"
            }
        });

        revalidatePath("/admin/hotels");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/pricing");

        return { success: true };
    } catch (error) {
        console.error("Approve Subscription Error:", error);
        return { error: "Failed to approve subscription" };
    }
}
