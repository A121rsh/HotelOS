
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPlan(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const maxRooms = parseInt(formData.get("maxRooms") as string);
    const maxBookings = parseInt(formData.get("maxBookings") as string);
    const featuresString = formData.get("features") as string; // Comma separated

    if (!name || isNaN(price) || isNaN(maxRooms)) {
        return { error: "Invalid data" };
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const features = featuresString.split(',').map(f => f.trim()).filter(f => f);

    try {
        await db.subscriptionPlan.create({
            data: {
                name,
                slug,
                description,
                price,
                maxRooms,
                maxBookings,
                features
            }
        });

        revalidatePath("/admin/plans");
    } catch (error) {
        console.error(error);
        return { error: "Failed to create plan" };
    }

    redirect("/admin/plans");
}

export async function deletePlan(planId: string) {
    try {
        await db.subscriptionPlan.delete({
            where: { id: planId }
        });
        revalidatePath("/admin/plans");
        return { success: true };
    } catch (error) {
        return { error: "Cannot delete plan with active subscriptions" };
    }
}

export async function updatePlan(planId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const maxRooms = parseInt(formData.get("maxRooms") as string);
    const maxBookings = parseInt(formData.get("maxBookings") as string);
    const featuresString = formData.get("features") as string;

    if (!name || isNaN(price) || isNaN(maxRooms)) {
        return { error: "Invalid data" };
    }

    const features = featuresString.split(',').map(f => f.trim()).filter(f => f);

    try {
        await db.subscriptionPlan.update({
            where: { id: planId },
            data: {
                name,
                description,
                price,
                maxRooms,
                maxBookings,
                features
            }
        });
        revalidatePath("/admin/plans");
    } catch (error) {
        return { error: "Failed to update plan" };
    }

    redirect("/admin/plans");
}
