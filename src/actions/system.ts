"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "@/lib/logger";

/**
 * Fetches the global system configuration.
 * Initializes with defaults if not found.
 */
export async function getSystemConfig() {
    if (!(db as any).systemConfig) return null;
    try {
        let config = await (db as any).systemConfig.findUnique({
            where: { id: "singleton" }
        });

        if (!config) {
            config = await (db as any).systemConfig.create({
                data: { id: "singleton" }
            });
        }

        return config;
    } catch (error) {
        console.error("Failed to fetch system config:", error);
        return null;
    }
}

/**
 * Updates global system settings
 */
export async function updateSystemConfig(data: any) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
        return { error: "Access Denied." };
    }

    try {
        const updated = await (db as any).systemConfig.upsert({
            where: { id: "singleton" },
            update: data,
            create: { id: "singleton", ...data }
        });

        await recordAuditLog({
            type: "ADMIN_ACTION",
            message: `System configuration updated by ${session.user.email}`,
            userId: session.user.id,
            metadata: data
        });

        revalidatePath("/", "layout");
        return { success: true, config: updated };
    } catch (error) {
        return { error: "Failed to update authority protocols." };
    }
}

/**
 * Toggles maintenance mode
 */
export async function toggleMaintenanceMode(isMaintenance: boolean, message?: string) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
        return { error: "Unauthorized." };
    }

    try {
        await (db as any).systemConfig.upsert({
            where: { id: "singleton" },
            update: {
                isMaintenanceMode: isMaintenance,
                maintenanceMessage: message || "System is undergoing scheduled synchronization. Please stand by."
            },
            create: {
                id: "singleton",
                isMaintenanceMode: isMaintenance,
                maintenanceMessage: message || "System is undergoing scheduled synchronization."
            }
        });

        await recordAuditLog({
            type: "ADMIN_ACTION",
            severity: "WARNING",
            message: `Global Maintenance Mode ${isMaintenance ? "ACTIVATED" : "DEACTIVATED"} by ${session.user.email}`,
            userId: session.user.id
        });

        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { error: "Failed to synchronize state." };
    }
}
